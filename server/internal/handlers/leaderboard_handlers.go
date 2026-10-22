package handlers

import (
	"net/http"
	"strconv"

	"rankora/server/internal/scoring"

	"github.com/gin-gonic/gin"
)

// GetCountryLeaderboard returns leaderboard rankings filtered by country
func (h *APIHandler) GetCountryLeaderboard(c *gin.Context) {
	countryCode := c.Param("countryCode")
	league := c.Query("league")
	search := c.Query("search")
	limitStr := c.Query("limit")
	offsetStr := c.Query("offset")

	limit := 50
	offset := 0
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}
	if o, err := strconv.Atoi(offsetStr); err == nil && o >= 0 {
		offset = o
	}

	rows, total, err := h.leaderboardRepo.GetLeaderboardExtended(c.Request.Context(), league, search, countryCode, "", limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed querying country leaderboard", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"country":          countryCode,
		"data":             rows,
		"total":            total,
		"limit":            limit,
		"offset":           offset,
		"algorithmVersion": scoring.DefaultAlgorithmVersion,
	})
}

// GetDimensionLeaderboard returns leaderboard rankings sorted/filtered by dimension
func (h *APIHandler) GetDimensionLeaderboard(c *gin.Context) {
	dimension := c.Param("dimension")
	league := c.Query("league")
	search := c.Query("search")
	limitStr := c.Query("limit")
	offsetStr := c.Query("offset")

	limit := 50
	offset := 0
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}
	if o, err := strconv.Atoi(offsetStr); err == nil && o >= 0 {
		offset = o
	}

	rows, total, err := h.leaderboardRepo.GetLeaderboardExtended(c.Request.Context(), league, search, "", dimension, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed querying dimension leaderboard", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"dimension":        dimension,
		"data":             rows,
		"total":            total,
		"limit":            limit,
		"offset":           offset,
		"algorithmVersion": scoring.DefaultAlgorithmVersion,
	})
}
