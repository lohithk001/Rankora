package handlers_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"rankora/server/internal/config"
	"rankora/server/internal/handlers"

	"github.com/gin-gonic/gin"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestHealthLive(t *testing.T) {
	apiHandler := handlers.NewAPIHandler(
		nil, &config.Config{AppEnv: "test"}, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil,
	)

	router := gin.New()
	router.GET("/health/live", apiHandler.HealthLive)

	req := httptest.NewRequest(http.MethodGet, "/health/live", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var res map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed unmarshaling json: %v", err)
	}

	if res["status"] != "live" {
		t.Fatalf("expected status 'live', got %v", res["status"])
	}
}

func TestHealthReady_DatabaseUnavailable(t *testing.T) {
	// Database is intentionally nil to test graceful readiness failure
	apiHandler := handlers.NewAPIHandler(
		nil, &config.Config{AppEnv: "test"}, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil,
	)

	router := gin.New()
	router.GET("/health/ready", apiHandler.HealthReady)

	req := httptest.NewRequest(http.MethodGet, "/health/ready", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusServiceUnavailable {
		t.Fatalf("expected status 503 Service Unavailable, got %d", w.Code)
	}

	var res map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed unmarshaling json: %v", err)
	}

	if res["database"] != "disconnected" {
		t.Fatalf("expected database 'disconnected', got %v", res["database"])
	}
}
