package handlers

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"
	"strings"
	"time"

	"rankora/server/internal/auth"
	"rankora/server/internal/models"
	"rankora/server/internal/response"
	"rankora/server/internal/scoring"

	"github.com/gin-gonic/gin"
)

// GetMyAccounts lists connected accounts without exposing credentials
func (h *APIHandler) GetMyAccounts(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	if h.syncRepo == nil {
		response.Internal(c, "Database repository unavailable.")
		return
	}

	accounts, err := h.syncRepo.ListConnectedAccounts(c.Request.Context(), profile.ID)
	if err != nil {
		response.Internal(c, "Failed listing connected accounts: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  accounts,
		"count": len(accounts),
	})
}

// ConnectGitHub generates an OAuth state and returns the authorization URL
func (h *APIHandler) ConnectGitHub(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	if h.ghClient == nil || !h.ghClient.IsConfigured() {
		response.BadRequest(c, "GitHub integration is not configured on this server. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.")
		return
	}

	stateBytes := make([]byte, 16)
	if _, err := rand.Read(stateBytes); err != nil {
		response.Internal(c, "Failed generating CSRF state: "+err.Error())
		return
	}
	state := hex.EncodeToString(stateBytes)

	// Persist state with 10-minute expiry
	redirectURI := c.Query("redirect_uri")
	if err := h.syncRepo.SaveOAuthState(c.Request.Context(), state, profile.ClerkUserID, "github", redirectURI, 10*time.Minute); err != nil {
		response.Internal(c, "Failed saving OAuth state: "+err.Error())
		return
	}

	authURL := h.ghClient.GetAuthorizationURL(state)
	c.JSON(http.StatusOK, gin.H{
		"provider": "github",
		"authUrl":  authURL,
		"state":    state,
	})
}

// GitHubCallback handles OAuth code exchange and initial sync
func (h *APIHandler) GitHubCallback(c *gin.Context) {
	code := c.Query("code")
	state := c.Query("state")

	if code == "" || state == "" {
		response.BadRequest(c, "Missing code or state in OAuth callback.")
		return
	}

	if h.ghClient == nil || !h.ghClient.IsConfigured() {
		response.BadRequest(c, "GitHub OAuth is not configured.")
		return
	}

	ctx := c.Request.Context()

	// Verify OAuth state
	clerkUserID, err := h.syncRepo.VerifyAndConsumeOAuthState(ctx, state, "github")
	if err != nil {
		response.BadRequest(c, "Invalid or expired OAuth state parameter.")
		return
	}

	profile, err := h.profileRepo.GetByClerkID(ctx, clerkUserID)
	if err != nil || profile == nil {
		response.NotFound(c, "Developer profile not found.")
		return
	}

	// Exchange code for access token
	tokenResp, err := h.ghClient.ExchangeCode(ctx, code)
	if err != nil {
		response.Internal(c, "Failed exchanging code for GitHub access token: "+err.Error())
		return
	}

	// Fetch user info
	ghUser, err := h.ghClient.GetAuthenticatedUser(ctx, tokenResp.AccessToken)
	if err != nil {
		response.Internal(c, "Failed querying GitHub profile: "+err.Error())
		return
	}

	// Encrypt token before persisting
	encToken, err := auth.EncryptToken(tokenResp.AccessToken, h.cfg.TokenEncryptionKey)
	if err != nil {
		response.Internal(c, "Failed encrypting access token: "+err.Error())
		return
	}

	// Save encrypted token
	if err := h.syncRepo.SaveEncryptedToken(ctx, profile.ID, "github", encToken, "read:user,repo"); err != nil {
		response.Internal(c, "Failed saving connected account token: "+err.Error())
		return
	}

	// Upsert connected account record
	meta := map[string]interface{}{
		"public_repos": ghUser.PublicRepos,
		"followers":    ghUser.Followers,
		"avatar_url":   ghUser.AvatarURL,
	}
	_ = h.syncRepo.UpsertConnectedAccount(ctx, profile.ID, "github", fmt.Sprintf("%d", ghUser.ID), ghUser.Login, meta)

	// Create and run initial sync job
	jobID, err := h.syncRepo.CreateSyncJob(ctx, profile.ID, "github")
	if err == nil {
		repos, repoErr := h.ghClient.GetUserRepositories(ctx, tokenResp.AccessToken)
		if repoErr == nil {
			var totalStars int
			for _, r := range repos {
				totalStars += r.StargazersCount
			}
			m := &models.DeveloperMetrics{
				ProfileID:      profile.ID,
				ReposAnalyzed:  len(repos),
				LastComputedAt: time.Now().UTC(),
			}
			_ = h.syncRepo.UpsertDeveloperMetrics(ctx, m)
			_ = h.syncRepo.CompleteSyncJob(ctx, jobID, len(repos), nil)
		} else {
			errMsg := repoErr.Error()
			_ = h.syncRepo.CompleteSyncJob(ctx, jobID, 0, &errMsg)
		}
	}

	redirectURI := c.Query("redirect_uri")
	if redirectURI != "" {
		c.Redirect(http.StatusTemporaryRedirect, redirectURI)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":          true,
		"message":          "GitHub account connected and synchronized successfully.",
		"externalUsername": ghUser.Login,
	})
}

// DisconnectProvider disconnects an integrated provider
func (h *APIHandler) DisconnectProvider(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	provider := strings.ToLower(c.Param("provider"))
	if provider == "" {
		response.BadRequest(c, "Provider parameter is required.")
		return
	}

	if err := h.syncRepo.DisconnectAccount(c.Request.Context(), profile.ID, provider); err != nil {
		response.Internal(c, "Failed disconnecting provider: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  fmt.Sprintf("Provider '%s' disconnected and tokens purged.", provider),
		"provider": provider,
	})
}

// TriggerSync initiates real data refresh for a connected provider
func (h *APIHandler) TriggerSync(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	provider := strings.ToLower(c.Param("provider"))
	ctx := c.Request.Context()

	switch provider {
	case "github":
		encToken, err := h.syncRepo.GetEncryptedToken(ctx, profile.ID, "github")
		if err != nil || encToken == "" {
			response.BadRequest(c, "GitHub is not connected. Please connect your GitHub account first.")
			return
		}

		decToken, err := auth.DecryptToken(encToken, h.cfg.TokenEncryptionKey)
		if err != nil {
			response.Internal(c, "Failed decrypting stored token.")
			return
		}

		jobID, err := h.syncRepo.CreateSyncJob(ctx, profile.ID, "github")
		if err != nil {
			response.Internal(c, "Failed scheduling sync job: "+err.Error())
			return
		}

		go func(jID, token string) {
			bgCtx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
			defer cancel()

			repos, err := h.ghClient.GetUserRepositories(bgCtx, token)
			if err != nil {
				errMsg := err.Error()
				_ = h.syncRepo.CompleteSyncJob(bgCtx, jobID, 0, &errMsg)
				return
			}

			m := &models.DeveloperMetrics{
				ProfileID:      profile.ID,
				ReposAnalyzed:  len(repos),
				LastComputedAt: time.Now().UTC(),
			}
			_ = h.syncRepo.UpsertDeveloperMetrics(bgCtx, m)
			_ = h.syncRepo.CompleteSyncJob(bgCtx, jobID, len(repos), nil)
		}(jobID.String(), decToken)

		c.JSON(http.StatusAccepted, gin.H{
			"message": "GitHub synchronization job scheduled.",
			"jobId":   jobID,
		})

	case "codeforces":
		handle := c.Query("handle")
		if handle == "" && profile.CodeforcesHandle != nil {
			handle = *profile.CodeforcesHandle
		}
		if handle == "" {
			response.BadRequest(c, "Codeforces handle is required via ?handle= or profile setting.")
			return
		}

		if h.cfClient == nil {
			response.Internal(c, "Codeforces client not initialized.")
			return
		}

		jobID, err := h.syncRepo.CreateSyncJob(ctx, profile.ID, "codeforces")
		if err != nil {
			response.Internal(c, "Failed scheduling sync job: "+err.Error())
			return
		}

		cfUser, err := h.cfClient.GetUserInfo(ctx, handle)
		if err != nil {
			errMsg := err.Error()
			_ = h.syncRepo.CompleteSyncJob(ctx, jobID, 0, &errMsg)
			response.BadRequest(c, "Failed querying Codeforces API for handle: "+handle)
			return
		}

		subs, _ := h.cfClient.GetUserSubmissions(ctx, handle, 100)
		solvedCount := 0
		for _, s := range subs {
			if s.Verdict == "OK" {
				solvedCount++
			}
		}

		m := &models.DeveloperMetrics{
			ProfileID:           profile.ID,
			ProblemsSolved:      solvedCount,
			ContestsRated:       cfUser.Rating,
			ProblemSolvingScore: float64(cfUser.Rating) / 30.0,
			LastComputedAt:      time.Now().UTC(),
		}
		_ = h.syncRepo.UpsertDeveloperMetrics(ctx, m)
		_ = h.syncRepo.CompleteSyncJob(ctx, jobID, solvedCount, nil)

		// Recalculate deterministic score using real CF rating
		cfProblemSolving := float64(cfUser.Rating) / 30.0
		if cfProblemSolving > 100 {
			cfProblemSolving = 100
		}
		calculated := scoring.CalculateDeterministicScore(scoring.ComponentValues{
			ProblemSolving:     cfProblemSolving,
			EngineeringQuality: profile.Score,
			TechnicalSkills:    profile.Score,
			Collaboration:      profile.Score * 0.9,
			GrowthConsistency:  profile.Score * 0.95,
		}, 4)

		_ = h.profileRepo.UpdateScore(ctx, profile.ID, calculated.Score, calculated.League, calculated.Confidence, calculated.IsProvisional)

		c.JSON(http.StatusOK, gin.H{
			"message":        "Codeforces synchronization completed successfully.",
			"codeforcesUser": cfUser,
			"updatedScore":   calculated.Score,
			"league":         calculated.League,
		})

	default:
		response.BadRequest(c, fmt.Sprintf("Unsupported integration provider '%s'.", provider))
	}
}

// GetSyncStatus retrieves the most recent sync job status
func (h *APIHandler) GetSyncStatus(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	provider := strings.ToLower(c.Param("provider"))
	if provider == "" {
		response.BadRequest(c, "Provider parameter is required.")
		return
	}

	job, err := h.syncRepo.GetLatestSyncJob(c.Request.Context(), profile.ID, provider)
	if err != nil {
		response.Internal(c, "Failed querying sync status: "+err.Error())
		return
	}

	if job == nil {
		c.JSON(http.StatusOK, gin.H{
			"provider": provider,
			"status":   "never_synced",
			"job":      nil,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"provider": provider,
		"status":   job.Status,
		"job":      job,
	})
}
