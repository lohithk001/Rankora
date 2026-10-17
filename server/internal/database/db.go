package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"rankora/server/internal/config"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Database struct {
	Pool *pgxpool.Pool
}

// NewConnectionPool instantiates and pings the Neon PostgreSQL pgx connection pool.
func NewConnectionPool(ctx context.Context, cfg *config.Config) (*Database, error) {
	if cfg.DatabaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is empty; please supply a valid Neon PostgreSQL connection string")
	}

	poolConfig, err := pgxpool.ParseConfig(cfg.DatabaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse Neon DATABASE_URL: %w", err)
	}

	// Pool limits & connection lifecycle configured for serverless / Neon pooling
	poolConfig.MaxConns = cfg.DBMaxConns
	poolConfig.MinConns = cfg.DBMinConns
	poolConfig.MaxConnLifetime = time.Duration(cfg.DBMaxConnLifetimeMinutes) * time.Minute
	poolConfig.MaxConnIdleTime = time.Duration(cfg.DBMaxConnIdleMinutes) * time.Minute

	// Ping Neon with strict timeout to ensure early failure on invalid network/credentials
	pingCtx, cancel := context.WithTimeout(ctx, time.Duration(cfg.DBHealthTimeoutSeconds)*time.Second)
	defer cancel()

	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		return nil, fmt.Errorf("unable to initialize pgx connection pool for Neon: %w", err)
	}

	if err := pool.Ping(pingCtx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("unable to ping Neon database: %w", err)
	}

	log.Printf("[Database] Successfully connected to Neon PostgreSQL (MaxConns: %d, MinConns: %d)", cfg.DBMaxConns, cfg.DBMinConns)
	return &Database{Pool: pool}, nil
}

// Ping checks pool liveness
func (db *Database) Ping(ctx context.Context) error {
	if db == nil || db.Pool == nil {
		return fmt.Errorf("database connection pool is not initialized")
	}
	return db.Pool.Ping(ctx)
}

// Close gracefully shuts down the pgx pool
func (db *Database) Close() {
	if db != nil && db.Pool != nil {
		log.Println("[Database] Closing Neon pgx connection pool...")
		db.Pool.Close()
	}
}
