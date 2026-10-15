# Rankora System Architecture

Rankora is built as an observable, modular monolith designed for transparency, multi-source evidence normalization, and resilient developer intelligence.

```
                          ┌───────────────────────────┐
                          │   React 19 + Vite (SPA)   │
                          │   Tailwind + Lucide UI    │
                          └─────────────┬─────────────┘
                                        │ HTTPS / REST
                                        ▼
                          ┌───────────────────────────┐
                          │    Rankora Core API       │
                          │  Node.js / Express Server │
                          └──────┬──────────────┬─────┘
                                 │              │
                   ┌─────────────┴──┐        ┌──┴────────────┐
                   ▼                ▼        ▼               ▼
           ┌──────────────┐ ┌──────────────┐ ┌────────┐ ┌──────────────┐
           │ Integration  │ │ Evidence &   │ │ Scoring│ │ Recruiter    │
           │ Connectors   │ │ Verification │ │ Engine │ │ Matching     │
           └──────┬───────┘ └──────┬───────┘ └────┬───┘ └──────┬───────┘
                  │                │              │            │
                  ▼                ▼              ▼            ▼
           ┌────────────────────────────────────────────────────────────┐
           │                     PostgreSQL DB                          │
           │  (Users, Profiles, Evidence, Snapshots, Benchmarks, Audit) │
           └────────────────────────────────────────────────────────────┘
```

---

## 1. Directory Structure

```
rankora/
├── client/                         # React frontend (Vite + Modern CSS)
│   ├── public/                     # Static assets, badges, logos
│   ├── src/
│   │   ├── assets/                 # SVGs, icons, illustrations
│   │   ├── components/
│   │   │   ├── common/             # Buttons, badges, modals, loaders, tooltips
│   │   │   ├── layout/             # Navbar, footer, page shells, league banners
│   │   │   ├── charts/             # Radar score breakdowns, velocity curves
│   │   │   ├── developers/         # Profile cards, evidence inspectors, project showcases
│   │   │   └── leaderboards/       # Filter bars, table rows, league tabs
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx     # Value prop, interactive sample leaderboard
│   │   │   ├── LeaderboardPage.jsx # Global & skill rankings with league filters
│   │   │   ├── DeveloperProfile.jsx# Explainable score, evidence tree, compensation range
│   │   │   ├── SkillsPage.jsx      # Skill-by-skill deep dive & percentile distribution
│   │   │   ├── AssessmentsPage.jsx # Sandboxed challenge runner & test integrity
│   │   │   ├── GrowthDashboard.jsx # 8-week velocity, learning trajectory & radar
│   │   │   ├── MarketValuePage.jsx # Benchmarked compensation ranges with geography toggles
│   │   │   ├── RecruiterSearch.jsx # Role-fit candidate matching & comparison matrix
│   │   │   └── SettingsPage.jsx    # OAuth connections, privacy, data export & appeals
│   │   ├── features/               # Domain-specific logic & state slices
│   │   ├── hooks/                  # Custom React hooks (theme, search, filters)
│   │   ├── lib/                    # Formula calculations, formatting utilities
│   │   ├── services/               # API clients & simulated connectors
│   │   ├── context/                # Auth, Theme, and Profile state
│   │   ├── routes/                 # Client-side router configuration
│   │   ├── App.jsx                 # App root & navigation shell
│   │   └── main.jsx                # DOM mounting & global styles
│   └── package.json
│
├── server/                         # Backend service (Node.js/Express or Go)
│   ├── cmd/
│   │   ├── api/main.js             # API entry point & routes
│   │   └── worker/main.js          # Asynchronous sync worker
│   ├── internal/
│   │   ├── config/                 # Env and configuration
│   │   ├── database/               # SQL connections & schemas
│   │   ├── middleware/             # Auth, CORS, rate limits, audit logging
│   │   ├── auth/                   # OAuth2 handlers (GitHub, Codeforces)
│   │   ├── users/                  # User accounts & preferences
│   │   ├── profiles/               # Public developer profiles
│   │   ├── integrations/           # Platform connectors (GitHub, Codeforces, LeetCode)
│   │   ├── evidence/               # Evidence ingestion & provenance tracking
│   │   ├── projects/               # Verified projects & git verification
│   │   ├── assessments/            # Sandboxed skill challenges
│   │   ├── scoring/                # Deterministic scoring formula engine
│   │   ├── rankings/               # League partitioning & leaderboard caching
│   │   ├── growth/                 # Longitudinal tracking & velocity calculus
│   │   ├── marketvalue/            # Compensation benchmarks & geography indices
│   │   ├── hiring/                 # Recruiter search & role-fit scoring
│   │   ├── privacy/                # GDPR data export, account deletion
│   │   └── audit/                  # Tamper-evident score change logs
│   ├── migrations/                 # PostgreSQL relational schema migrations
│   └── package.json
│
├── docs/                           # Blueprint, scoring guide, API specification
├── scripts/                        # Database seeds & benchmarking scripts
├── docker-compose.yml              # Local container stack
└── README.md
```
