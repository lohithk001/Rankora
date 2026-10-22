package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"rankora/server/internal/auth"
	"rankora/server/internal/config"
	"rankora/server/internal/database"
	"rankora/server/internal/handlers"
	"rankora/server/internal/integrations/codeforces"
	"rankora/server/internal/integrations/github"
	"rankora/server/internal/middleware"
	"rankora/server/internal/repository"

	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("[Rankora] Starting Go + Gin Backend for Neon Serverless PostgreSQL...")

	// 1. Load Configuration
	cfg, cfgErr := config.LoadConfig()
	if cfgErr != nil {
		log.Printf("[Rankora] Config warning: %v", cfgErr)
	}

	// 2. Setup Gin Mode
	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 3. Initialize Database Connection Pool
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	var db *database.Database
	var err error

	if cfg.DatabaseURL != "" && !isPlaceholderURL(cfg.DatabaseURL) {
		db, err = database.NewConnectionPool(ctx, cfg)
		if err != nil {
			log.Printf("[Rankora] Neon Connection Warning: %v", err)
			log.Println("[Rankora] Please check your DATABASE_URL in server/.env or platform secrets.")
		} else {
			defer db.Close()

			// Auto-run migrations if enabled
			migrationsDir := filepath.Join(".", "migrations")
			if _, err := os.Stat(migrationsDir); err == nil {
				log.Println("[Rankora] Checking and applying database migrations...")
				if migErr := database.RunMigrations(context.Background(), db.Pool, migrationsDir); migErr != nil {
					log.Printf("[Rankora] Migration warning: %v", migErr)
				}
			}

			// Ensure sample developer seed data exists
			leaderboardRepo := repository.NewLeaderboardRepository(db.Pool)
			if seedErr := leaderboardRepo.SeedSampleDevelopers(context.Background()); seedErr != nil {
				log.Printf("[Rankora] Seed warning: %v", seedErr)
			}
		}
	} else {
		log.Println("[Rankora] Notice: DATABASE_URL is not set or contains placeholder credentials. Running in mock-ready state.")
	}

	// 4. Initialize Repositories
	var profileRepo *repository.ProfileRepository
	var projectRepo *repository.ProjectRepository
	var skillRepo *repository.SkillRepository
	var leaderboardRepo *repository.LeaderboardRepository
	var syncRepo *repository.SyncRepository
	var assessmentRepo *repository.AssessmentRepository
	var communityRepo *repository.CommunityRepository
	var hiringRepo *repository.HiringRepository
	var notifRepo *repository.NotificationRepository

	if db != nil && db.Pool != nil {
		profileRepo = repository.NewProfileRepository(db.Pool)
		projectRepo = repository.NewProjectRepository(db.Pool)
		skillRepo = repository.NewSkillRepository(db.Pool)
		leaderboardRepo = repository.NewLeaderboardRepository(db.Pool)
		syncRepo = repository.NewSyncRepository(db.Pool)
		assessmentRepo = repository.NewAssessmentRepository(db.Pool)
		communityRepo = repository.NewCommunityRepository(db.Pool)
		hiringRepo = repository.NewHiringRepository(db.Pool)
		notifRepo = repository.NewNotificationRepository(db.Pool)
	}

	// 5. External Integrations
	ghClient := github.NewClient(cfg.GitHubClientID, cfg.GitHubClientSecret, cfg.GitHubCallbackURL)
	cfClient := codeforces.NewClient()

	// 6. API Handler
	apiHandler := handlers.NewAPIHandler(
		db, cfg, profileRepo, projectRepo, skillRepo, leaderboardRepo,
		syncRepo, assessmentRepo, communityRepo, hiringRepo, notifRepo,
		ghClient, cfClient,
	)

	// 7. Router Setup
	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(loggerMiddleware())
	router.Use(corsMiddleware(cfg.AllowedOrigins))

	// Global rate limiter: 300 requests per 15 minutes per IP
	rateLimiter := middleware.NewRateLimiter(15*time.Minute, 300)
	router.Use(rateLimiter.Middleware())

	// Request body size limit: 1MB to prevent payload exhaustion
	router.Use(middleware.RequestSizeLimit(1 << 20))

	// Health check endpoints
	router.GET("/health", apiHandler.HealthCheck)
	router.GET("/health/live", apiHandler.HealthLive)
	router.GET("/health/ready", apiHandler.HealthReady)

	// API v1 Group
	v1 := router.Group("/api/v1")
	{
		// Health & Readiness
		v1.GET("/health", apiHandler.HealthCheck)
		v1.GET("/health/live", apiHandler.HealthLive)
		v1.GET("/health/ready", apiHandler.HealthReady)

		// Public Leaderboard Endpoints
		v1.GET("/leaderboard", apiHandler.GetLeaderboard)
		v1.GET("/leaderboards", apiHandler.GetLeaderboard)
		v1.GET("/leaderboards/global", apiHandler.GetLeaderboard)
		v1.GET("/leaderboards/countries/:countryCode", apiHandler.GetCountryLeaderboard)
		v1.GET("/leaderboards/dimensions/:dimension", apiHandler.GetDimensionLeaderboard)
		v1.GET("/leaderboard/filters", apiHandler.GetLeaderboardFilters)
		v1.GET("/leaderboards/filters", apiHandler.GetLeaderboardFilters)
		v1.GET("/leaderboard/methodology", apiHandler.GetLeaderboardMethodology)
		v1.GET("/methodology", apiHandler.GetMethodology)

		// Public Developer Profile Lookups
		v1.GET("/developers/:username", apiHandler.GetProfileByUsername)
		v1.GET("/profiles/:username", apiHandler.GetProfileByUsername)
		v1.GET("/developers/:username/scores", apiHandler.GetDeveloperScoreBreakdown)
		v1.GET("/developers/:username/score-breakdown", apiHandler.GetDeveloperScoreBreakdown)
		v1.GET("/developers/:username/rank-history", apiHandler.GetDeveloperRankHistory)

		// Assessments Catalog
		v1.GET("/assessments", apiHandler.ListAssessments)
		v1.GET("/assessments/:id", apiHandler.GetAssessment)

		// Community Public Read
		v1.GET("/community/feed", apiHandler.GetFeed)
		v1.GET("/community/topics", apiHandler.GetTopics)
		v1.GET("/community/posts/:id", apiHandler.GetPost)
		v1.GET("/community/posts/:id/comments", apiHandler.GetComments)

		// Hiring Public Discovery
		v1.GET("/hiring/developers", apiHandler.SearchCandidates)
		v1.GET("/hiring/developers/:username", apiHandler.GetCandidateProfile)

		// Username Availability (Used during onboarding registration)
		v1.GET("/onboarding/check-username/:username", apiHandler.CheckUsername)

		// External OAuth Callbacks
		v1.GET("/integrations/github/callback", apiHandler.GitHubCallback)

		// Protected Routes (Require Verified Clerk Bearer Token)
		authRequired := v1.Group("")
		authRequired.Use(auth.RequireClerkAuth(cfg))
		{
			// Developer Profile Operations
			authRequired.GET("/me/profile", apiHandler.GetMyProfile)
			authRequired.PATCH("/me/profile", apiHandler.PatchMyProfile)
			authRequired.GET("/me/preferences", apiHandler.GetMyPreferences)
			authRequired.PATCH("/me/preferences", apiHandler.PatchMyPreferences)
			authRequired.GET("/me/export", apiHandler.ExportMyData)

			// Onboarding Endpoints
			authRequired.GET("/me/onboarding", apiHandler.GetMyOnboarding)
			authRequired.PUT("/me/onboarding", apiHandler.CompleteOnboarding)
			authRequired.POST("/onboarding/complete", apiHandler.CompleteOnboarding)
			authRequired.GET("/onboarding/profile", apiHandler.GetMyOnboarding)

			// Projects
			authRequired.GET("/me/projects", apiHandler.GetMyProjects)
			authRequired.POST("/me/projects", apiHandler.CreateMyProject)
			authRequired.DELETE("/me/projects/:projectId", apiHandler.DeleteMyProject)

			// Skills
			authRequired.GET("/me/skills", apiHandler.GetMySkills)
			authRequired.PUT("/me/skills", apiHandler.PutMySkills)

			// Scores, Evidence, Growth & Appeals
			authRequired.GET("/me/scores", apiHandler.GetMyScores)
			authRequired.GET("/me/growth", apiHandler.GetMyGrowth)
			authRequired.GET("/me/evidence", apiHandler.GetMyEvidence)
			authRequired.GET("/me/rankings", apiHandler.GetMyRankings)
			authRequired.POST("/me/appeals", apiHandler.SubmitScoreAppeal)

			// Account Integrations & Sync
			authRequired.GET("/me/accounts", apiHandler.GetMyAccounts)
			authRequired.POST("/integrations/github/connect", apiHandler.ConnectGitHub)
			authRequired.DELETE("/integrations/:provider", apiHandler.DisconnectProvider)
			authRequired.POST("/integrations/:provider/sync", apiHandler.TriggerSync)
			authRequired.GET("/integrations/:provider/sync-status", apiHandler.GetSyncStatus)

			// Assessments Attempts & Grading
			authRequired.POST("/assessments/:id/attempts", apiHandler.StartAttempt)
			authRequired.POST("/attempts/:id/submit", apiHandler.SubmitAttempt)
			authRequired.GET("/attempts/:id/results", apiHandler.GetAttemptResults)

			// Community Interactive Features
			authRequired.POST("/community/posts", apiHandler.CreatePost)
			authRequired.PATCH("/community/posts/:id", apiHandler.UpdatePost)
			authRequired.DELETE("/community/posts/:id", apiHandler.DeletePost)
			authRequired.POST("/community/posts/:id/votes", apiHandler.VotePost)
			authRequired.POST("/community/posts/:id/bookmark", apiHandler.BookmarkPost)
			authRequired.POST("/community/posts/:id/comments", apiHandler.CreateComment)
			authRequired.POST("/community/users/:username/follow", apiHandler.FollowUser)
			authRequired.POST("/community/posts/:id/report", apiHandler.ReportPost)

			// Hiring Recruiter Actions
			authRequired.POST("/hiring/saved-developers", apiHandler.SaveCandidate)
			authRequired.DELETE("/hiring/saved-developers/:username", apiHandler.UnsaveCandidate)
			authRequired.GET("/hiring/saved-developers", apiHandler.ListSavedCandidates)
			authRequired.POST("/hiring/contact", apiHandler.ContactCandidate)

			// In-App Notifications
			authRequired.GET("/notifications", apiHandler.GetNotifications)
			authRequired.POST("/notifications/:id/read", apiHandler.MarkNotificationRead)
			authRequired.POST("/notifications/read-all", apiHandler.MarkAllNotificationsRead)

			// Account Life Cycle & Data Purge
			authRequired.DELETE("/me", apiHandler.DeleteMyAccount)
			authRequired.DELETE("/me/account", apiHandler.DeleteMyAccount)
			authRequired.DELETE("/users/account", apiHandler.DeleteMyAccount)
		}
	}

	// 8. Start HTTP Server with Graceful Shutdown
	addr := fmt.Sprintf(":%s", cfg.APIPort)
	srv := &http.Server{
		Addr:         addr,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("[Rankora] Server listening on http://localhost:%s", cfg.APIPort)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("[Rankora] Listen error: %s\n", err)
		}
	}()

	// Graceful shutdown on SIGINT or SIGTERM
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("[Rankora] Shutting down server gracefully...")

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("[Rankora] Server forced to shutdown: %v", err)
	}

	log.Println("[Rankora] Server exited cleanly.")
}

func isPlaceholderURL(url string) bool {
	return len(url) == 0 ||
		url == "postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require" ||
		url == "postgres://rankora:rankorapassword@localhost:5432/rankora_db"
}

func loggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		latency := time.Since(start)
		status := c.Writer.Status()
		log.Printf("[%s] %d %s %s (%v)", time.Now().Format("15:04:05"), status, c.Request.Method, c.Request.URL.Path, latency)
	}
}

func corsMiddleware(allowedOrigins []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		c.Header("Access-Control-Allow-Origin", "*")
		if origin != "" {
			c.Header("Access-Control-Allow-Origin", origin)
		}
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
