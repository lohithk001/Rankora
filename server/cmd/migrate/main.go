package main

import (
	"context"
	"flag"
	"log"
	"os"
	"path/filepath"
	"time"

	"rankora/server/internal/config"
	"rankora/server/internal/database"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	var dir string
	flag.StringVar(&dir, "dir", "migrations", "Path to SQL migrations folder")
	flag.Parse()

	log.Println("[Migrate CLI] Starting Rankora Neon database migration runner...")

	cfg, err := config.LoadConfig()
	if err != nil {
		log.Printf("[Migrate CLI] Warning loading config: %v", err)
	}
	connStr := cfg.MigrationDatabaseURL
	if connStr == "" {
		connStr = cfg.DatabaseURL
	}

	if connStr == "" {
		log.Fatal("[Migrate CLI] Error: DATABASE_URL or MIGRATION_DATABASE_URL is not set.")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	poolConfig, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		log.Fatalf("[Migrate CLI] Failed to parse connection string: %v", err)
	}

	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		log.Fatalf("[Migrate CLI] Failed to connect: %v", err)
	}
	defer pool.Close()

	if err := pool.Ping(ctx); err != nil {
		log.Fatalf("[Migrate CLI] Failed to ping database: %v", err)
	}

	absDir, err := filepath.Abs(dir)
	if err != nil {
		absDir = dir
	}
	log.Printf("[Migrate CLI] Applying migrations from directory: %s", absDir)

	if err := database.RunMigrations(ctx, pool, absDir); err != nil {
		log.Fatalf("[Migrate CLI] Migration failed: %v", err)
	}

	log.Println("[Migrate CLI] All migrations completed successfully!")
	os.Exit(0)
}
