package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
)

func TestRateLimiter(t *testing.T) {
	gin.SetMode(gin.TestMode)

	limiter := NewRateLimiter(time.Minute, 3)
	router := gin.New()
	router.Use(limiter.Middleware())
	router.GET("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// First 3 requests should succeed
	for i := 0; i < 3; i++ {
		req := httptest.NewRequest(http.MethodGet, "/test", nil)
		req.RemoteAddr = "10.0.0.1:1234"
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("expected request %d to succeed with 200, got %d", i+1, w.Code)
		}
	}

	// 4th request must be rejected with 429 Too Many Requests
	req := httptest.NewRequest(http.MethodGet, "/test", nil)
	req.RemoteAddr = "10.0.0.1:1234"
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	if w.Code != http.StatusTooManyRequests {
		t.Fatalf("expected 4th request to return 429, got %d", w.Code)
	}

	// A different IP should still succeed
	reqOther := httptest.NewRequest(http.MethodGet, "/test", nil)
	reqOther.RemoteAddr = "10.0.0.2:1234"
	wOther := httptest.NewRecorder()
	router.ServeHTTP(wOther, reqOther)
	if wOther.Code != http.StatusOK {
		t.Fatalf("expected request from different IP to succeed with 200, got %d", wOther.Code)
	}
}
