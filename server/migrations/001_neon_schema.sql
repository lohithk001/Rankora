-- Rankora Relational Schema (PostgreSQL / Neon Serverless)
-- Version: 001_neon_schema.sql
-- Enables UUID generation

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Ranking Algorithm Versions
CREATE TABLE IF NOT EXISTS ranking_algorithm_versions (
    version VARCHAR(32) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    weights JSONB NOT NULL,
    formula TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- 2. League Rules
CREATE TABLE IF NOT EXISTS league_rules (
    league VARCHAR(32) PRIMARY KEY, -- 'Rookie', 'Rising', 'Advanced', 'Elite'
    min_score NUMERIC(5,2) NOT NULL,
    max_score NUMERIC(5,2) NOT NULL,
    color_token VARCHAR(32) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- 3. Developer Profiles (Linked with Clerk External Subject)
CREATE TABLE IF NOT EXISTS developer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_user_id VARCHAR(128) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    avatar_url TEXT,
    headline VARCHAR(255),
    bio TEXT,
    country VARCHAR(100) NOT NULL,
    location VARCHAR(150),
    experience_level VARCHAR(64) DEFAULT 'Fresher / Student (0-1 yrs)',
    interests TEXT[] DEFAULT '{}',
    league VARCHAR(32) DEFAULT 'Rookie' REFERENCES league_rules(league) ON UPDATE CASCADE,
    score NUMERIC(5,2) DEFAULT 0.00 CHECK (score >= 0.00 AND score <= 100.00),
    confidence NUMERIC(5,2) DEFAULT 0.00 CHECK (confidence >= 0.00 AND confidence <= 100.00),
    is_provisional BOOLEAN DEFAULT true,
    visibility VARCHAR(32) DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'private')),
    consent_accepted BOOLEAN DEFAULT true,
    github_handle VARCHAR(100),
    leetcode_handle VARCHAR(100),
    codeforces_handle VARCHAR(100),
    linkedin_url TEXT,
    portfolio_url TEXT,
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE INDEX IF NOT EXISTS idx_dev_profiles_clerk ON developer_profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_dev_profiles_username_lower ON developer_profiles(LOWER(username));
CREATE INDEX IF NOT EXISTS idx_dev_profiles_score ON developer_profiles(score DESC);
CREATE INDEX IF NOT EXISTS idx_dev_profiles_league ON developer_profiles(league);

-- 4. Profile Skills (User-reported & Verified)
CREATE TABLE IF NOT EXISTS profile_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(50) DEFAULT 'User-Reported', -- 'User-Reported', 'Assessed', 'Verified'
    score NUMERIC(5,2) DEFAULT 0.00,
    league VARCHAR(32) DEFAULT 'Rookie',
    verified BOOLEAN DEFAULT false,
    evidence_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    UNIQUE(profile_id, name)
);

CREATE INDEX IF NOT EXISTS idx_profile_skills_profile ON profile_skills(profile_id);

-- 5. Verified Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    repository_url TEXT,
    live_url TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    test_coverage_percent NUMERIC(5,2) CHECK (test_coverage_percent >= 0.00 AND test_coverage_percent <= 100.00),
    architecture_notes TEXT,
    verification_status VARCHAR(32) DEFAULT 'provisional' CHECK (verification_status IN ('provisional', 'verified', 'flagged')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE INDEX IF NOT EXISTS idx_projects_profile ON projects(profile_id);

-- 6. Experience Entries
CREATE TABLE IF NOT EXISTS experience_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    company VARCHAR(150) NOT NULL,
    role VARCHAR(150) NOT NULL,
    employment_type VARCHAR(50) DEFAULT 'Full-time',
    location VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE INDEX IF NOT EXISTS idx_experience_profile ON experience_entries(profile_id);

-- 7. Education Entries
CREATE TABLE IF NOT EXISTS education_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    institution VARCHAR(200) NOT NULL,
    degree VARCHAR(150),
    field_of_study VARCHAR(150),
    start_year INT,
    end_year INT,
    grade VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE INDEX IF NOT EXISTS idx_education_profile ON education_entries(profile_id);

-- 8. Connected Accounts
CREATE TABLE IF NOT EXISTS connected_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'github', 'codeforces', 'leetcode'
    external_id VARCHAR(100),
    username VARCHAR(100) NOT NULL,
    verification_status VARCHAR(32) DEFAULT 'connected',
    metadata JSONB DEFAULT '{}',
    last_synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    UNIQUE(profile_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_connected_accounts_profile ON connected_accounts(profile_id);

-- 9. Evidence Items (Signals with algorithmic weight)
CREATE TABLE IF NOT EXISTS evidence_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    source VARCHAR(50) NOT NULL, -- 'github', 'codeforces', 'leetcode', 'rankora_assessment'
    evidence_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    payload JSONB DEFAULT '{}',
    confidence NUMERIC(4,2) DEFAULT 0.85 CHECK (confidence >= 0.00 AND confidence <= 1.00),
    impact_score VARCHAR(50),
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE INDEX IF NOT EXISTS idx_evidence_items_profile ON evidence_items(profile_id);

-- 10. Score Snapshots
CREATE TABLE IF NOT EXISTS score_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    score_type VARCHAR(50) DEFAULT 'overall', -- 'overall', 'backend', 'frontend', 'competitive'
    score NUMERIC(5,2) NOT NULL CHECK (score >= 0.00 AND score <= 100.00),
    confidence NUMERIC(5,2) NOT NULL CHECK (confidence >= 0.00 AND confidence <= 100.00),
    league VARCHAR(32) NOT NULL,
    algorithm_version VARCHAR(32) NOT NULL REFERENCES ranking_algorithm_versions(version),
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE INDEX IF NOT EXISTS idx_score_snapshots_profile ON score_snapshots(profile_id, score_type);
CREATE INDEX IF NOT EXISTS idx_score_snapshots_calc ON score_snapshots(calculated_at DESC);

-- 11. Score Components (S = 0.30P + 0.25E + 0.20T + 0.15C + 0.10G)
CREATE TABLE IF NOT EXISTS score_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    snapshot_id UUID NOT NULL REFERENCES score_snapshots(id) ON DELETE CASCADE,
    component VARCHAR(50) NOT NULL, -- 'problem_solving', 'engineering_quality', 'technical_skills', 'collaboration', 'growth'
    value NUMERIC(5,2) NOT NULL CHECK (value >= 0.00 AND value <= 100.00),
    weight NUMERIC(4,2) NOT NULL CHECK (weight >= 0.00 AND weight <= 1.00),
    evidence_references UUID[] DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_score_components_snapshot ON score_components(snapshot_id);

-- 12. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES developer_profiles(id) ON DELETE SET NULL,
    actor_clerk_id VARCHAR(128) NOT NULL,
    event_type VARCHAR(64) NOT NULL, -- 'onboarding_complete', 'profile_update', 'project_create', 'score_recalculation'
    payload JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_profile ON audit_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON audit_logs(event_type);

-- Seed Initial Ranking Algorithm Version & League Rules
INSERT INTO ranking_algorithm_versions (version, name, description, weights, formula, is_active)
VALUES (
    'v1.0.0',
    'Rankora Multi-Signal Deterministic Engine',
    'Demonstrated signals weighted: Problem Solving (30%), Engineering Quality (25%), Technical Skills (20%), Collaboration (15%), Growth (10%)',
    '{"problemSolving": 0.30, "engineeringQuality": 0.25, "technicalSkills": 0.20, "collaboration": 0.15, "growthConsistency": 0.10}'::jsonb,
    'S = 0.30P + 0.25E + 0.20T + 0.15C + 0.10G',
    true
) ON CONFLICT (version) DO NOTHING;

INSERT INTO league_rules (league, min_score, max_score, color_token, description)
VALUES 
    ('Rookie', 0.00, 59.99, '#94a3b8', 'Emerging talent establishing core foundations and verified project repositories.'),
    ('Rising', 60.00, 77.99, '#38bdf8', 'Consistent builders shipping verified fullstack applications and steady growth.'),
    ('Advanced', 78.00, 89.99, '#a855f7', 'Experienced engineers demonstrating high test coverage, clean architecture, and competitive ratings.'),
    ('Elite', 90.00, 100.00, '#eab308', 'Top-tier contributors with world-class algorithmic performance and architectural mastery.')
ON CONFLICT (league) DO NOTHING;
