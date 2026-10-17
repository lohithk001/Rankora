package config

import (
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port                     string
	Environment              string
	DatabaseURL              string
	MigrationDatabaseURL     string
	DBMaxConns               int32
	DBMinConns               int32
	DBMaxConnLifetimeMinutes int
	DBMaxConnIdleMinutes     int
	DBHealthTimeoutSeconds   int
	ClerkJWKSURL             string
	ClerkIssuer              string
	ClerkPEMPublicKey        string
	AllowedOrigins           []string
}

func LoadConfig() *Config {
	// Attempt to load .env if present; silent if missing
	if err := godotenv.Load(); err != nil {
		log.Println("[Config] No .env file found or failed to parse, relying on OS environment variables.")
	}

	port := getEnv("PORT", "8080")
	env := getEnv("ENVIRONMENT", "development")
	dbURL := os.Getenv("DATABASE_URL")
	migrationDBURL := os.Getenv("MIGRATION_DATABASE_URL")
	if migrationDBURL == "" {
		migrationDBURL = dbURL
	}

	maxConns := int32(getEnvAsInt("DB_MAX_CONNS", 15))
	minConns := int32(getEnvAsInt("DB_MIN_CONNS", 2))
	maxLifetime := getEnvAsInt("DB_MAX_CONN_LIFETIME_MINUTES", 30)
	maxIdle := getEnvAsInt("DB_MAX_CONN_IDLE_MINUTES", 5)
	healthTimeout := getEnvAsInt("DB_HEALTH_TIMEOUT_SECONDS", 5)

	clerkJWKS := getEnv("CLERK_JWKS_URL", "https://api.clerk.com/v1/jwks")
	clerkIssuer := os.Getenv("CLERK_ISSUER")
	clerkPEM := os.Getenv("CLERK_PEM_PUBLIC_KEY")

	rawOrigins := getEnv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173")
	var origins []string
	for _, o := range strings.Split(rawOrigins, ",") {
		trimmed := strings.TrimSpace(o)
		if trimmed != "" {
			origins = append(origins, trimmed)
		}
	}

	return &Config{
		Port:                     port,
		Environment:              env,
		DatabaseURL:              dbURL,
		MigrationDatabaseURL:     migrationDBURL,
		DBMaxConns:               maxConns,
		DBMinConns:               minConns,
		DBMaxConnLifetimeMinutes: maxLifetime,
		DBMaxConnIdleMinutes:     maxIdle,
		DBHealthTimeoutSeconds:   healthTimeout,
		ClerkJWKSURL:             clerkJWKS,
		ClerkIssuer:              clerkIssuer,
		ClerkPEMPublicKey:        clerkPEM,
		AllowedOrigins:           origins,
	}
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
