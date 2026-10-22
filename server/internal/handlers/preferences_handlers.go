package handlers

import (
	"net/http"

	"rankora/server/internal/models"
	"rankora/server/internal/response"

	"github.com/gin-gonic/gin"
)

// GetMyPreferences returns the developer's privacy and notification preferences
func (h *APIHandler) GetMyPreferences(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	if h.syncRepo == nil {
		response.Internal(c, "Database repository unavailable.")
		return
	}

	prefs, err := h.syncRepo.GetPreferences(c.Request.Context(), profile.ID)
	if err != nil {
		response.Internal(c, "Failed querying preferences: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"profileId":   profile.ID,
		"preferences": prefs,
	})
}

// PatchMyPreferences updates developer preferences
func (h *APIHandler) PatchMyPreferences(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	if h.syncRepo == nil {
		response.Internal(c, "Database repository unavailable.")
		return
	}

	var req models.ProfilePreferences
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid preferences payload: "+err.Error())
		return
	}

	updated, err := h.syncRepo.UpsertPreferences(c.Request.Context(), profile.ID, &req)
	if err != nil {
		response.Internal(c, "Failed updating preferences: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":     "Preferences updated successfully.",
		"preferences": updated,
	})
}

// ExportMyData returns complete data archive for the caller in compliance with GDPR
func (h *APIHandler) ExportMyData(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	ctx := c.Request.Context()

	skills, _ := h.skillRepo.GetByProfileID(ctx, profile.ID)
	projects, _ := h.projectRepo.GetByProfileID(ctx, profile.ID)

	var prefs *models.ProfilePreferences
	var accounts []models.ConnectedAccount
	var metrics *models.DeveloperMetrics
	var attempts []models.AssessmentAttempt
	var notifs []models.Notification

	if h.syncRepo != nil {
		prefs, _ = h.syncRepo.GetPreferences(ctx, profile.ID)
		accounts, _ = h.syncRepo.ListConnectedAccounts(ctx, profile.ID)
		metrics, _ = h.syncRepo.GetDeveloperMetrics(ctx, profile.ID)
	}
	if h.assessmentRepo != nil {
		attempts, _ = h.assessmentRepo.GetUserAttempts(ctx, profile.ID)
	}
	if h.notifRepo != nil {
		notifs, _ = h.notifRepo.ListNotifications(ctx, profile.ID, 50)
	}

	c.JSON(http.StatusOK, gin.H{
		"exportVersion":      "1.0.0",
		"subjectClerkId":     profile.ClerkUserID,
		"profile":            profile,
		"preferences":        prefs,
		"skills":             skills,
		"projects":           projects,
		"connectedAccounts": accounts,
		"metrics":            metrics,
		"assessmentAttempts": attempts,
		"notifications":      notifs,
	})
}
