package config

import (
	"errors"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv                   string
	APIHost                  string
	APIPort                  string
	AllowedOrigins           []string
	DatabaseURL              string
	MigrationDatabaseURL     string
	DBMaxConns               int32
	DBMinConns               int32
	DBMaxConnLifetimeMinutes int
	DBMaxConnIdleMinutes     int
	DBHealthTimeoutSeconds   int
	ClerkSecretKey           string
	ClerkJWKSURL             string
	ClerkIssuer              string
	ClerkPEMPublicKey        string
	GitHubClientID           string
	GitHubClientSecret       string
	GitHubCallbackURL        string
	GitHubAppURL             string
	RateLimitDuration        time.Duration
	RateLimitMaxRequests     int
	RequestTimeout           time.Duration
	LogLevel                 string
	TokenEncryptionKey       string
}

func LoadConfig() (*Config, error) {
	// Attempt to load .env if present; silent if missing in containerized environments
	if err := godotenv.Load(); err != nil {
		log.Println("[Config] Notice: .env file not loaded or absent, reading OS environment variables.")
	}

	appEnv := getEnv("APP_ENV", getEnv("ENVIRONMENT", "development"))
	apiHost := getEnv("API_HOST", "0.0.0.0")
	apiPort := getEnv("API_PORT", getEnv("PORT", "8080"))

	dbURL := os.Getenv("DATABASE_URL")
	migrationDBURL := getEnv("MIGRATION_DATABASE_URL", dbURL)

	dbMaxConns := int32(getEnvAsInt("DB_MAX_CONNS", 15))
	dbMinConns := int32(getEnvAsInt("DB_MIN_CONNS", 2))
	dbMaxConnLifetime := getEnvAsInt("DB_MAX_CONN_LIFETIME_MINUTES", 30)
	dbMaxConnIdle := getEnvAsInt("DB_MAX_CONN_IDLE_MINUTES", 5)
	dbHealthTimeout := getEnvAsInt("DB_HEALTH_TIMEOUT_SECONDS", 5)

	clerkSecretKey := os.Getenv("CLERK_SECRET_KEY")
	clerkJWKSURL := getEnv("CLERK_JWKS_URL", "https://api.clerk.com/v1/jwks")
	clerkIssuer := os.Getenv("CLERK_ISSUER")
	clerkPEM := os.Getenv("CLERK_PEM_PUBLIC_KEY")

	githubClientID := os.Getenv("GITHUB_CLIENT_ID")
	githubClientSecret := os.Getenv("GITHUB_CLIENT_SECRET")
	githubCallbackURL := getEnv("GITHUB_CALLBACK_URL", "http://localhost:8080/api/v1/integrations/github/callback")
	githubAppURL := getEnv("GITHUB_APP_URL", "http://localhost:5173")

	rawOrigins := getEnv("FRONTEND_ORIGINS", getEnv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"))
	var origins []string
	for _, o := range strings.Split(rawOrigins, ",") {
		trimmed := strings.TrimSpace(o)
		if trimmed != "" {
			origins = append(origins, trimmed)
		}
	}

	rateLimitMins := getEnvAsInt("RATE_LIMIT_WINDOW_MINUTES", 15)
	rateLimitMax := getEnvAsInt("RATE_LIMIT_MAX_REQUESTS", 300)
	requestTimeoutSecs := getEnvAsInt("REQUEST_TIMEOUT_SECONDS", 15)
	logLevel := getEnv("LOG_LEVEL", "info")

	// Token encryption key (32 bytes hex or string for AES-256)
	tokenEncryptionKey := getEnv("TOKEN_ENCRYPTION_KEY", "rankora_deterministic_secret_32b!")

	cfg := &Config{
		AppEnv:                   appEnv,
		APIHost:                  apiHost,
		APIPort:                  apiPort,
		AllowedOrigins:           origins,
		DatabaseURL:              dbURL,
		MigrationDatabaseURL:     migrationDBURL,
		DBMaxConns:               dbMaxConns,
		DBMinConns:               dbMinConns,
		DBMaxConnLifetimeMinutes: dbMaxConnLifetime,
		DBMaxConnIdleMinutes:     dbMaxConnIdle,
		DBHealthTimeoutSeconds:   dbHealthTimeout,
		ClerkSecretKey:           clerkSecretKey,
		ClerkJWKSURL:             clerkJWKSURL,
		ClerkIssuer:              clerkIssuer,
		ClerkPEMPublicKey:        clerkPEM,
		GitHubClientID:           githubClientID,
		GitHubClientSecret:       githubClientSecret,
		GitHubCallbackURL:        githubCallbackURL,
		GitHubAppURL:             githubAppURL,
		RateLimitDuration:        time.Duration(rateLimitMins) * time.Minute,
		RateLimitMaxRequests:     rateLimitMax,
		RequestTimeout:           time.Duration(requestTimeoutSecs) * time.Second,
		LogLevel:                 logLevel,
		TokenEncryptionKey:       tokenEncryptionKey,
	}

	// In production, validate critical settings to prevent silent misconfiguration
	if cfg.AppEnv == "production" {
		if cfg.DatabaseURL == "" || isPlaceholderURL(cfg.DatabaseURL) {
			return nil, errors.New("DATABASE_URL must be a valid connection string in production")
		}
		if len(cfg.AllowedOrigins) == 0 || cfg.AllowedOrigins[0] == "*" {
			return nil, errors.New("explicit FRONTEND_ORIGINS must be configured in production (wildcards disallowed)")
		}
		if cfg.ClerkSecretKey == "" {
			log.Println("[Config] WARNING: CLERK_SECRET_KEY is empty in production; server-side Clerk verification depends solely on JWKS")
		}
	}

	return cfg, nil
}

func isPlaceholderURL(url string) bool {
	return len(url) == 0 ||
		url == "postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require" ||
		url == "postgres://rankora:rankorapassword@localhost:5432/rankora_db"
}

func getEnv(key, defaultVal string) string {
	if val, ok := os.LookupEnv(key); ok && strings.TrimSpace(val) != "" {
		return strings.TrimSpace(val)
	}
	return defaultVal
}

func getEnvAsInt(key string, defaultVal int) int {
	if val, ok := os.LookupEnv(key); ok {
		if parsed, err := strconv.Atoi(strings.TrimSpace(val)); err == nil {
			return parsed
		}
	}
	return defaultVal
}
