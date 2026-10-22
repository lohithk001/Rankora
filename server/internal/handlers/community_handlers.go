package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"rankora/server/internal/auth"
	"rankora/server/internal/models"
	"rankora/server/internal/response"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetFeed lists community posts
func (h *APIHandler) GetFeed(c *gin.Context) {
	if h.communityRepo == nil {
		response.Internal(c, "Community repository unavailable.")
		return
	}

	var viewerProfileID *uuid.UUID
	if clerkID := auth.GetClerkUserID(c); clerkID != "" && h.profileRepo != nil {
		if p, err := h.profileRepo.GetByClerkID(c.Request.Context(), clerkID); err == nil && p != nil {
			viewerProfileID = &p.ID
		}
	}

	topic := c.Query("topic")
	sort := c.Query("sort")
	limitStr := c.Query("limit")
	offsetStr := c.Query("offset")

	limit := 20
	offset := 0
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}
	if o, err := strconv.Atoi(offsetStr); err == nil && o >= 0 {
		offset = o
	}

	posts, total, err := h.communityRepo.ListFeed(c.Request.Context(), viewerProfileID, topic, sort, limit, offset)
	if err != nil {
		response.Internal(c, "Failed querying feed: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":   posts,
		"total":  total,
		"limit":  limit,
		"offset": offset,
		"topic":  topic,
	})
}

// CreatePost creates a new community post
func (h *APIHandler) CreatePost(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	if h.communityRepo == nil {
		response.Internal(c, "Community repository unavailable.")
		return
	}

	var req models.CreatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid post payload: "+err.Error())
		return
	}

	if strings.TrimSpace(req.Title) == "" || strings.TrimSpace(req.Content) == "" {
		response.BadRequest(c, "Post title and content are required.")
		return
	}

	post, err := h.communityRepo.CreatePost(c.Request.Context(), profile.ID, &req)
	if err != nil {
		response.Internal(c, "Failed creating community post: "+err.Error())
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Post published successfully.",
		"post":    post,
	})
}

// GetPost retrieves a post by ID
func (h *APIHandler) GetPost(c *gin.Context) {
	if h.communityRepo == nil {
		response.Internal(c, "Community repository unavailable.")
		return
	}

	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "Invalid post UUID format.")
		return
	}

	post, err := h.communityRepo.GetPostByID(c.Request.Context(), id)
	if err != nil || post == nil {
		response.NotFound(c, "Post not found.")
		return
	}

	c.JSON(http.StatusOK, gin.H{"post": post})
}

// UpdatePost edits an existing post with author check
func (h *APIHandler) UpdatePost(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "Invalid post UUID format.")
		return
	}

	var req struct {
		Title   string `json:"title" binding:"required"`
		Content string `json:"content" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid payload: title and content are required.")
		return
	}

	updated, err := h.communityRepo.UpdatePost(c.Request.Context(), id, profile.ID, req.Title, req.Content)
	if err != nil {
		response.Forbidden(c, "Failed updating post (must be original author): "+err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Post updated successfully.",
		"post":    updated,
	})
}

// DeletePost removes a post with author check
func (h *APIHandler) DeletePost(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "Invalid post UUID format.")
		return
	}

	deleted, err := h.communityRepo.DeletePost(c.Request.Context(), id, profile.ID)
	if err != nil {
		response.Internal(c, "Failed deleting post: "+err.Error())
		return
	}
	if !deleted {
		response.Forbidden(c, "Post not found or caller is not author.")
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully."})
}

// VotePost records an upvote/downvote
func (h *APIHandler) VotePost(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "Invalid post UUID format.")
		return
	}

	var req models.VoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid vote payload.")
		return
	}

	if req.Value != 1 && req.Value != -1 {
		response.BadRequest(c, "Value must be 1 (upvote) or -1 (downvote).")
		return
	}

	if err := h.communityRepo.VotePost(c.Request.Context(), profile.ID, id, req.Value); err != nil {
		response.Internal(c, "Failed recording vote: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Vote recorded successfully.",
		"value":   req.Value,
	})
}

// BookmarkPost toggles saved bookmark for post
func (h *APIHandler) BookmarkPost(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "Invalid post UUID format.")
		return
	}

	isBookmarked, err := h.communityRepo.BookmarkPost(c.Request.Context(), profile.ID, id)
	if err != nil {
		response.Internal(c, "Failed toggling bookmark: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"bookmarked": isBookmarked,
		"message":    map[bool]string{true: "Post saved to bookmarks.", false: "Post removed from bookmarks."}[isBookmarked],
	})
}

// GetComments lists all comments on a post
func (h *APIHandler) GetComments(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "Invalid post UUID format.")
		return
	}

	comments, err := h.communityRepo.ListComments(c.Request.Context(), id)
	if err != nil {
		response.Internal(c, "Failed querying comments: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  comments,
		"count": len(comments),
	})
}

// CreateComment adds a comment
func (h *APIHandler) CreateComment(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "Invalid post UUID format.")
		return
	}

	var req models.CreateCommentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid comment payload: "+err.Error())
		return
	}

	if strings.TrimSpace(req.Content) == "" {
		response.BadRequest(c, "Comment content cannot be empty.")
		return
	}

	comment, err := h.communityRepo.CreateComment(c.Request.Context(), id, profile.ID, req.Content, req.ParentCommentID)
	if err != nil {
		response.Internal(c, "Failed adding comment: "+err.Error())
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Comment posted successfully.",
		"comment": comment,
	})
}

// FollowUser toggles follow relationship
func (h *APIHandler) FollowUser(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	targetUsername := c.Param("username")
	targetProfile, err := h.profileRepo.GetByUsername(c.Request.Context(), targetUsername)
	if err != nil || targetProfile == nil {
		response.NotFound(c, "Target user not found.")
		return
	}

	if targetProfile.ID == profile.ID {
		response.BadRequest(c, "You cannot follow yourself.")
		return
	}

	isFollowing, err := h.communityRepo.FollowUser(c.Request.Context(), profile.ID, targetProfile.ID)
	if err != nil {
		response.Internal(c, "Failed toggling follow: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"following": isFollowing,
		"username":  targetUsername,
		"message":   map[bool]string{true: "Now following developer.", false: "Unfollowed developer."}[isFollowing],
	})
}

// ReportPost submits moderation report
func (h *APIHandler) ReportPost(c *gin.Context) {
	profile, ok := h.getAuthenticatedProfile(c)
	if !ok {
		return
	}

	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "Invalid post UUID format.")
		return
	}

	var req struct {
		Reason  string `json:"reason" binding:"required"`
		Details string `json:"details"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Report reason is required.")
		return
	}

	if err := h.communityRepo.CreateReport(c.Request.Context(), profile.ID, id, "post", req.Reason, req.Details); err != nil {
		response.Internal(c, "Failed submitting report: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Report submitted. Thank you for keeping the Rankora community constructive.",
	})
}

// GetTopics lists all community topics
func (h *APIHandler) GetTopics(c *gin.Context) {
	if h.communityRepo == nil {
		response.Internal(c, "Community repository unavailable.")
		return
	}

	topics, err := h.communityRepo.ListTopics(c.Request.Context())
	if err != nil {
		response.Internal(c, "Failed querying topics: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  topics,
		"count": len(topics),
	})
}
