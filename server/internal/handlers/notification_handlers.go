package handlers

import (
	"net/http"
	"strconv"

	"rankora/server/internal/response"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetNotifications returns notifications for authenticated user
func (h *APIHandler) GetNotifications(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	if h.notifRepo == nil {
		response.Internal(c, "Notification repository unavailable.")
		return
	}

	limit, _ := strconv.Atoi(c.Query("limit"))
	if limit <= 0 || limit > 50 {
		limit = 20
	}

	ctx := c.Request.Context()
	notifs, err := h.notifRepo.ListNotifications(ctx, profile.ID, limit)
	if err != nil {
		response.Internal(c, "Failed querying notifications: "+err.Error())
		return
	}

	unreadCount, _ := h.notifRepo.GetUnreadCount(ctx, profile.ID)

	c.JSON(http.StatusOK, gin.H{
		"data":        notifs,
		"unreadCount": unreadCount,
		"limit":       limit,
	})
}

// MarkNotificationRead marks a single notification as read
func (h *APIHandler) MarkNotificationRead(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	if h.notifRepo == nil {
		response.Internal(c, "Notification repository unavailable.")
		return
	}

	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "Invalid notification UUID.")
		return
	}

	updated, err := h.notifRepo.MarkAsRead(c.Request.Context(), profile.ID, id)
	if err != nil {
		response.Internal(c, "Failed marking notification as read: "+err.Error())
		return
	}
	if !updated {
		response.NotFound(c, "Notification not found.")
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Notification marked as read."})
}

// MarkAllNotificationsRead marks all notifications as read for current user
func (h *APIHandler) MarkAllNotificationsRead(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	if h.notifRepo == nil {
		response.Internal(c, "Notification repository unavailable.")
		return
	}

	if err := h.notifRepo.MarkAllAsRead(c.Request.Context(), profile.ID); err != nil {
		response.Internal(c, "Failed marking all notifications as read: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "All notifications marked as read."})
}
