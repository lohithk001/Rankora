-- Rankora Relational Schema (PostgreSQL)
-- Based on Rankora Blueprint Section 11

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    avatar_url TEXT,
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Developer Profiles
CREATE TABLE IF NOT EXISTS developer_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    location_preference VARCHAR(100),
    preferred_roles TEXT[],
    league VARCHAR(30) DEFAULT 'Rookie', -- Rookie, Rising, Advanced, Elite
    is_public BOOLEAN DEFAULT true,
    show_compensation BOOLEAN DEFAULT false,
    github_handle VARCHAR(100),
    codeforces_handle VARCHAR(100),
    leetcode_handle VARCHAR(100),
    confidence_score NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Platform Accounts (Connected OAuth & APIs)
CREATE TABLE IF NOT EXISTS platform_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'github', 'codeforces', 'leetcode'
    external_id VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    verification_status VARCHAR(30) DEFAULT 'verified',
    raw_metadata JSONB,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, platform)
);

-- 4. Evidence Items (Normalized signals with provenance)
CREATE TABLE IF NOT EXISTS evidence_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source VARCHAR(50) NOT NULL, -- github, codeforces, rankora_assessment
    evidence_type VARCHAR(100) NOT NULL, -- commit_quality, contest_percentile, test_coverage
    title VARCHAR(255) NOT NULL,
    description TEXT,
    payload JSONB NOT NULL,
    confidence NUMERIC(4,2) DEFAULT 0.85, -- 0.00 to 1.00
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_evidence_user ON evidence_items(user_id);

-- 5. Verified Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    repository_url TEXT,
    live_url TEXT,
    tech_stack TEXT[],
    verification_status VARCHAR(30) DEFAULT 'verified',
    test_coverage_percent NUMERIC(5,2),
    architecture_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Assessments
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    skill VARCHAR(50) NOT NULL,
    difficulty VARCHAR(30) NOT NULL, -- 'Easy', 'Medium', 'Hard'
    version VARCHAR(20) DEFAULT 'v1.0.0',
    time_limit_minutes INT DEFAULT 45,
    integrity_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Assessment Attempts
CREATE TABLE IF NOT EXISTS assessment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES assessments(id),
    score NUMERIC(5,2) NOT NULL,
    passed BOOLEAN NOT NULL,
    telemetry JSONB,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Score Snapshots
CREATE TABLE IF NOT EXISTS score_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score_type VARCHAR(50) DEFAULT 'overall', -- 'overall', 'backend', 'frontend', 'competitive'
    score NUMERIC(5,2) NOT NULL,
    confidence NUMERIC(5,2) NOT NULL,
    algorithm_version VARCHAR(30) NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_score_snapshots_user ON score_snapshots(user_id, score_type);

-- 9. Score Components (Explaining S = 0.30P + 0.25E + 0.20T + 0.15C + 0.10G)
CREATE TABLE IF NOT EXISTS score_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    snapshot_id UUID NOT NULL REFERENCES score_snapshots(id) ON DELETE CASCADE,
    component VARCHAR(50) NOT NULL, -- problem_solving, engineering_quality, technical_skills, collaboration, growth
    value NUMERIC(5,2) NOT NULL,
    weight NUMERIC(4,2) NOT NULL,
    evidence_references UUID[]
);

-- 10. Leaderboard Rankings
CREATE TABLE IF NOT EXISTS ranking_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leaderboard_type VARCHAR(50) NOT NULL, -- global, backend, frontend, rookie_league
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    position INT NOT NULL,
    snapshot_id UUID REFERENCES score_snapshots(id),
    period VARCHAR(20) DEFAULT 'current',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(leaderboard_type, user_id, period)
);

-- 11. Compensation Benchmarks
CREATE TABLE IF NOT EXISTS compensation_benchmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    seniority_band VARCHAR(50) NOT NULL, -- 'Junior / Entry', 'Mid-Level', 'Senior', 'Staff'
    currency VARCHAR(10) NOT NULL,
    range_min NUMERIC(12,2) NOT NULL,
    range_median NUMERIC(12,2) NOT NULL,
    range_max NUMERIC(12,2) NOT NULL,
    source VARCHAR(100) DEFAULT 'Aggregated Market & Outcome Reports',
    confidence_level VARCHAR(30) DEFAULT 'High',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Reports & Tamper-Evident Audit Logs
CREATE TABLE IF NOT EXISTS reports_and_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL, -- 'score_recalculation', 'appeal_submitted', 'privacy_export', 'moderation_action'
    payload JSONB NOT NULL,
    moderation_decision TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
