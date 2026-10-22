package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"rankora/server/internal/models"
	"rankora/server/internal/response"

	"github.com/gin-gonic/gin"
)

// SearchCandidates searches developers who are open to work and visible
func (h *APIHandler) SearchCandidates(c *gin.Context) {
	if h.hiringRepo == nil {
		response.Internal(c, "Hiring repository unavailable.")
		return
	}

	roleQuery := c.Query("skills")
	if roleQuery == "" {
		roleQuery = c.Query("query")
	}

	league := c.Query("league")
	country := c.Query("country")
	minScore, _ := strconv.ParseFloat(c.Query("minScore"), 64)
	limit, _ := strconv.Atoi(c.Query("limit"))
	offset, _ := strconv.Atoi(c.Query("offset"))

	if limit <= 0 || limit > 100 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}

	candidates, total, err := h.hiringRepo.SearchCandidates(c.Request.Context(), country, league, roleQuery, minScore, limit, offset)
	if err != nil {
		response.Internal(c, "Failed searching candidates: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":   candidates,
		"total":  total,
		"limit":  limit,
		"offset": offset,
	})
}

// GetCandidateProfile returns developer hiring profile if visible
func (h *APIHandler) GetCandidateProfile(c *gin.Context) {
	username := c.Param("username")
	candidate, err := h.profileRepo.GetByUsername(c.Request.Context(), username)
	if err != nil || candidate == nil {
		response.NotFound(c, "Candidate not found or profile is private.")
		return
	}

	skills, _ := h.skillRepo.GetByProfileID(c.Request.Context(), candidate.ID)
	projects, _ := h.projectRepo.GetByProfileID(c.Request.Context(), candidate.ID)

	c.JSON(http.StatusOK, gin.H{
		"candidate": candidate,
		"skills":    skills,
		"projects":  projects,
	})
}

// SaveCandidate bookmarks a candidate for a recruiter
func (h *APIHandler) SaveCandidate(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	var req struct {
		CandidateUsername string `json:"candidateUsername" binding:"required"`
		Notes             string `json:"notes"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Candidate username is required.")
		return
	}

	candidate, err := h.profileRepo.GetByUsername(c.Request.Context(), req.CandidateUsername)
	if err != nil || candidate == nil {
		response.NotFound(c, "Target candidate not found.")
		return
	}

	if err := h.hiringRepo.SaveCandidate(c.Request.Context(), profile.ClerkUserID, candidate.ID, req.Notes); err != nil {
		response.Internal(c, "Failed saving candidate: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":           "Candidate saved to your hiring pipeline.",
		"candidateUsername": req.CandidateUsername,
	})
}

// UnsaveCandidate removes candidate from saved list
func (h *APIHandler) UnsaveCandidate(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	username := c.Param("username")
	candidate, err := h.profileRepo.GetByUsername(c.Request.Context(), username)
	if err != nil || candidate == nil {
		response.NotFound(c, "Target candidate not found.")
		return
	}

	removed, err := h.hiringRepo.RemoveSavedCandidate(c.Request.Context(), profile.ClerkUserID, candidate.ID)
	if err != nil {
		response.Internal(c, "Failed unsaving candidate: "+err.Error())
		return
	}
	if !removed {
		response.NotFound(c, "Candidate was not in your saved list.")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":           "Candidate removed from saved list.",
		"candidateUsername": username,
	})
}

// ListSavedCandidates returns all saved candidates for caller
func (h *APIHandler) ListSavedCandidates(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	saved, err := h.hiringRepo.ListSavedCandidates(c.Request.Context(), profile.ClerkUserID)
	if err != nil {
		response.Internal(c, "Failed querying saved candidates: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  saved,
		"count": len(saved),
	})
}

// ContactCandidate submits outreach request to candidate
func (h *APIHandler) ContactCandidate(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	var req models.ContactCandidateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid contact request payload: "+err.Error())
		return
	}

	candidate, err := h.profileRepo.GetByUsername(c.Request.Context(), req.CandidateUsername)
	if err != nil || candidate == nil {
		response.NotFound(c, "Candidate not found.")
		return
	}

	if strings.TrimSpace(req.Message) == "" || strings.TrimSpace(req.JobTitle) == "" {
		response.BadRequest(c, "Message and Job Title are required.")
		return
	}

	if err := h.hiringRepo.CreateContactRequest(
		c.Request.Context(),
		profile.ClerkUserID,
		candidate.ID,
		req.JobTitle,
		req.Message,
		req.CompensationRange,
	); err != nil {
		response.Internal(c, "Failed creating contact request: "+err.Error())
		return
	}

	// Create in-app notification for candidate
	if h.notifRepo != nil {
		_ = h.notifRepo.CreateNotification(
			c.Request.Context(),
			candidate.ID,
			"New Opportunity Inquiry",
			profile.DisplayName+" reached out regarding the role: "+req.JobTitle,
			"recruiter_outreach",
			"/hiring",
		)
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Opportunity message sent to candidate successfully.",
	})
}
