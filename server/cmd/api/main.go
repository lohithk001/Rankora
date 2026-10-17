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
	"rankora/server/internal/repository"

	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("[Rankora] Starting Go + Gin Backend for Neon Serverless PostgreSQL...")

	// 1. Load Configuration
	cfg := config.LoadConfig()

	// 2. Setup Gin Mode
	if cfg.Environment == "production" {
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

	// 4. Repositories
	var profileRepo *repository.ProfileRepository
	var projectRepo *repository.ProjectRepository
	var skillRepo *repository.SkillRepository
	var leaderboardRepo *repository.LeaderboardRepository

	if db != nil && db.Pool != nil {
		profileRepo = repository.NewProfileRepository(db.Pool)
		projectRepo = repository.NewProjectRepository(db.Pool)
		skillRepo = repository.NewSkillRepository(db.Pool)
		leaderboardRepo = repository.NewLeaderboardRepository(db.Pool)
	}

	// 5. Handlers
	apiHandler := handlers.NewAPIHandler(db, profileRepo, projectRepo, skillRepo, leaderboardRepo)

	// 6. Router Setup
	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(loggerMiddleware())
	router.Use(corsMiddleware(cfg.AllowedOrigins))

	// Global Health check (both root and api/v1 paths)
	router.GET("/health", apiHandler.HealthCheck)
	router.GET("/api/v1/health", apiHandler.HealthCheck)

	// API v1 Group
	v1 := router.Group("/api/v1")
	{
		// Public Leaderboard Endpoints
		v1.GET("/leaderboard", apiHandler.GetLeaderboard)
		v1.GET("/leaderboards", apiHandler.GetLeaderboard) // legacy plural compatibility
		v1.GET("/leaderboard/filters", apiHandler.GetLeaderboardFilters)
		v1.GET("/leaderboard/methodology", apiHandler.GetLeaderboardMethodology)

		// Public Developer Profile Lookups
		v1.GET("/developers/:username", apiHandler.GetProfileByUsername)
		v1.GET("/developers/:username/scores", apiHandler.GetDeveloperScoreBreakdown)
		v1.GET("/developers/:username/score-breakdown", apiHandler.GetDeveloperScoreBreakdown)
		v1.GET("/developers/:username/rank-history", apiHandler.GetDeveloperRankHistory)

		// Username Availability (Used during onboarding registration)
		v1.GET("/onboarding/check-username/:username", apiHandler.CheckUsername)

		// Protected Routes (Require Verified Clerk Bearer Token)
		authRequired := v1.Group("")
		authRequired.Use(auth.RequireClerkAuth(cfg))
		{
			// Developer Profile Operations
			authRequired.GET("/me/profile", apiHandler.GetMyProfile)
			authRequired.PATCH("/me/profile", apiHandler.PatchMyProfile)

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

			// Authenticated User Ranking
			authRequired.GET("/me/rankings", apiHandler.GetMyRankings)
		}
	}

	// 7. Start HTTP Server with Graceful Shutdown
	addr := fmt.Sprintf(":%s", cfg.Port)
	srv := &http.Server{
		Addr:         addr,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("[Rankora] Server listening on http://localhost:%s", cfg.Port)
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
