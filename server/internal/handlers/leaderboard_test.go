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

func TestGetLeaderboardMethodology(t *testing.T) {
	apiHandler := handlers.NewAPIHandler(
		nil, &config.Config{AppEnv: "test"}, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil,
	)

	router := gin.New()
	router.GET("/api/v1/methodology", apiHandler.GetMethodology)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/methodology", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var res map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed unmarshaling methodology response: %v", err)
	}

	formula, ok := res["formula"].(string)
	if !ok || formula != "S = 0.30P + 0.25E + 0.20T + 0.15C + 0.10G" {
		t.Fatalf("expected Rankora core formula 'S = 0.30P + 0.25E + 0.20T + 0.15C + 0.10G', got %v", formula)
	}

	components, ok := res["components"].([]interface{})
	if !ok || len(components) != 5 {
		t.Fatalf("expected 5 scoring components, got %d", len(components))
	}
}

func TestGetLeaderboardFilters(t *testing.T) {
	apiHandler := handlers.NewAPIHandler(
		nil, &config.Config{AppEnv: "test"}, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil,
	)

	router := gin.New()
	router.GET("/api/v1/leaderboard/filters", apiHandler.GetLeaderboardFilters)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/leaderboard/filters", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var res map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed unmarshaling filters response: %v", err)
	}

	leagues, ok := res["leagues"].([]interface{})
	if !ok || len(leagues) == 0 {
		t.Fatalf("expected non-empty leagues filter options")
	}
}
