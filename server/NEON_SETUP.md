# Rankora Backend — Neon Serverless PostgreSQL & Clerk Integration

This guide documents the architecture, database schema, connection pool configuration, migration tooling, and runtime instructions for the Go + Gin backend connected to **Neon Serverless PostgreSQL**.

---

## Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │    React + Vite Client (:5173)         │
                      │  (Clerk Auth + Bearer Token Header)    │
                      └──────────────────┬─────────────────────┘
                                         │ HTTP REST (JSON)
                                         ▼
                      ┌────────────────────────────────────────┐
                      │       Rankora Go Backend (:8080)       │
                      │          (Gin Web Framework)           │
                      └────┬─────────────┬─────────────────┬───┘
                           │             │                 │
              ┌────────────┴──┐   ┌──────┴────────┐  ┌─────┴────────┐
              │  Clerk JWKS   │   │  Deterministic│  │  pgx/v5 Pool │
              │ Middleware    │   │ Scoring Engine│  │ Connection   │
              └───────────────┘   └───────────────┘  └──────┬───────┘
                                                            │ TLS (sslmode=require)
                                                            ▼
                                              ┌───────────────────────────┐
                                              │ Neon Serverless PostgreSQL│
                                              │   (Pooled or Direct URL)  │
                                              └───────────────────────────┘
```

---

## 1. Neon Database Setup

### 1.1 Obtain your Connection String
1. Log in to the [Neon Console](https://console.neon.tech).
2. Select your project and branch (e.g., `main`).
3. Under **Connection Details**, copy the **Pooled connection** string for application traffic:
   ```text
   postgresql://USER:PASSWORD@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Copy the **Direct connection** string if using standalone external migration runners:
   ```text
   postgresql://USER:PASSWORD@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### 1.2 Environment File Setup
Create `server/.env` (which is already Git-ignored):
```bash
cp server/.env.example server/.env
```
Populate `server/.env`:
```env
PORT=8080
GIN_MODE=debug
ENVIRONMENT=development

# Paste your real Neon connection string here:
DATABASE_URL=postgresql://USER:PASSWORD@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
MIGRATION_DATABASE_URL=postgresql://USER:PASSWORD@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require

# Pool limits optimized for Neon serverless
DB_MAX_CONNS=15
DB_MIN_CONNS=2
DB_MAX_CONN_LIFETIME_MINUTES=30
DB_MAX_CONN_IDLE_MINUTES=5
DB_HEALTH_TIMEOUT_SECONDS=5

# Clerk Auth
CLERK_JWKS_URL=https://api.clerk.com/v1/jwks
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

> [!CAUTION]
> **Security Notice**: `DATABASE_URL` is loaded strictly on the server in Go. It is never prefixed with `VITE_` and is never bundled into client assets or browser requests.

---

## 2. Running Schema Migrations

The migration suite is located in `server/migrations/001_neon_schema.sql` and covers all 12 core tables:
1. `ranking_algorithm_versions`
2. `league_rules`
3. `developer_profiles` (Indexed by `clerk_user_id` and unique `username`)
4. `profile_skills`
5. `projects`
6. `experience_entries`
7. `education_entries`
8. `connected_accounts`
9. `evidence_items`
10. `score_snapshots`
11. `score_components`
12. `audit_logs`

### Option A: Standalone Migration CLI (Recommended)
Run the dedicated Go migration runner:
```powershell
cd server
go run cmd/migrate/main.go -dir migrations
```

### Option B: Automatic Startup Migration
When `server/cmd/api/main.go` boots and finds a valid `DATABASE_URL`, it automatically checks the `schema_migrations` table and applies pending migrations inside atomic transactions.

---

## 3. Starting the Go Backend Server

Run the server from `server/`:
```powershell
cd server
go run cmd/api/main.go
```
The server will bind to `http://localhost:8080`.

To verify connectivity, test the health check endpoint:
```powershell
curl http://localhost:8080/health
```
Response:
```json
{
  "algorithmVersion": "v1.0.0",
  "database": "connected",
  "databaseLatency": 34,
  "service": "Rankora Core Backend (Go + Gin + Neon PostgreSQL)",
  "status": "healthy",
  "timestamp": "2026-10-17T15:15:00Z"
}
```

---

## 4. REST API Endpoint Summary (`/api/v1`)

### Health
- `GET /health` & `GET /api/v1/health` — Database connectivity & latency check.

### Public Leaderboard & Profiles
- `GET /api/v1/leaderboard?league=Elite&search=alex` — Paginated SQL window-ranked leaderboard.
- `GET /api/v1/leaderboard/filters` — Available leagues and track filters.
- `GET /api/v1/leaderboard/methodology` — Deterministic scoring formula ($S = 0.30P + 0.25E + 0.20T + 0.15C + 0.10G$).
- `GET /api/v1/developers/:username` — Public profile details with verified skills and projects.
- `GET /api/v1/developers/:username/score-breakdown` — Component-level audit breakdown.
- `GET /api/v1/developers/:username/rank-history` — 8-week performance trend.
- `GET /api/v1/onboarding/check-username/:username` — Username format & collision verification.

### Protected Endpoints (Require `Authorization: Bearer <clerk_token>`)
- `GET /api/v1/me/profile` — Authenticated developer's profile.
- `PATCH /api/v1/me/profile` — Update developer bio, handles, visibility, or headline.
- `GET /api/v1/me/onboarding` — Check whether current Clerk user has completed onboarding.
- `PUT /api/v1/me/onboarding` — Complete/upsert developer onboarding idempotently.
- `GET /api/v1/me/projects` — Fetch caller's project portfolio.
- `POST /api/v1/me/projects` — Submit project with repository and test coverage.
- `DELETE /api/v1/me/projects/:projectId` — Delete project owned by caller.
- `GET /api/v1/me/skills` — Fetch caller's skills.
- `PUT /api/v1/me/skills` — Replace caller's skills.
- `GET /api/v1/me/rankings` — Fetch caller's authenticated rank and standing.

---

## 5. Verification & Testing

1. **Go Unit Tests**:
   ```powershell
   cd server
   go test ./... -v
   ```
2. **Go Code Quality Verification**:
   ```powershell
   cd server
   go vet ./...
   ```
3. **Frontend Production Build**:
   ```powershell
   cd client
   npm run build
   ```
