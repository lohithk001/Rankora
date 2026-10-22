package auth_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"rankora/server/internal/auth"
	"rankora/server/internal/config"
	"rankora/server/internal/response"

	"github.com/gin-gonic/gin"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestRequireClerkAuth_MissingAuthorizationHeader(t *testing.T) {
	cfg := &config.Config{
		AppEnv: "production",
	}

	router := gin.New()
	router.Use(auth.RequireClerkAuth(cfg))
	router.GET("/protected", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected status 401 Unauthorized, got %d", w.Code)
	}

	var errResp response.ErrorEnvelope
	if err := json.Unmarshal(w.Body.Bytes(), &errResp); err != nil {
		t.Fatalf("failed unmarshaling error envelope: %v", err)
	}

	if errResp.Error.Code != "UNAUTHORIZED" {
		t.Fatalf("expected error code UNAUTHORIZED, got %s", errResp.Error.Code)
	}
}

func TestRequireClerkAuth_MalformedBearerHeader(t *testing.T) {
	cfg := &config.Config{
		AppEnv: "production",
	}

	router := gin.New()
	router.Use(auth.RequireClerkAuth(cfg))
	router.GET("/protected", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "NotBearer token123")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected status 401 Unauthorized, got %d", w.Code)
	}
}
