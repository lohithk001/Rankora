-- Rankora Comprehensive Features Schema (Neon PostgreSQL)
-- Migration: 003_comprehensive_features.sql
-- Covers: Preferences, OAuth Tokens, Sync Jobs, Metrics, Assessments, Community, Hiring, Notifications

-- 1. Profile Preferences
CREATE TABLE IF NOT EXISTS profile_preferences (
    profile_id UUID PRIMARY KEY REFERENCES developer_profiles(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    recruiter_outreach BOOLEAN DEFAULT true,
    show_compensation BOOLEAN DEFAULT false,
    theme VARCHAR(32) DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- 2. OAuth States (for CSRF-safe, bound GitHub OAuth flows)
CREATE TABLE IF NOT EXISTS oauth_states (
    state VARCHAR(128) PRIMARY KEY,
    clerk_user_id VARCHAR(128) NOT NULL,
    provider VARCHAR(32) NOT NULL,
    redirect_uri TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);
CREATE INDEX IF NOT EXISTS idx_oauth_states_user ON oauth_states(clerk_user_id);

-- 3. Connected Account Tokens (Encrypted provider access tokens kept out of public profile tables)
CREATE TABLE IF NOT EXISTS connected_account_tokens (
    profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    provider VARCHAR(32) NOT NULL,
    encrypted_token TEXT NOT NULL,
    token_scope TEXT,
    token_type VARCHAR(32) DEFAULT 'bearer',
    expires_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    PRIMARY KEY (profile_id, provider)
);

-- 4. Sync Jobs & History
CREATE TABLE IF NOT EXISTS sync_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    provider VARCHAR(32) NOT NULL,
    status VARCHAR(32) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    items_synced INT DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);
CREATE INDEX IF NOT EXISTS idx_sync_jobs_profile ON sync_jobs(profile_id, provider, status);

-- 5. Developer Metrics (Aggregated derived signal dimensions)
CREATE TABLE IF NOT EXISTS developer_metrics (
    profile_id UUID PRIMARY KEY REFERENCES developer_profiles(id) ON DELETE CASCADE,
    repos_analyzed INT DEFAULT 0,
    problems_solved INT DEFAULT 0,
    contests_rated INT DEFAULT 0,
    prs_reviewed INT DEFAULT 0,
    test_coverage_avg NUMERIC(5,2) DEFAULT 0.00,
    commit_streak_days INT DEFAULT 0,
    problem_solving_score NUMERIC(5,2) DEFAULT 0.00,
    engineering_quality_score NUMERIC(5,2) DEFAULT 0.00,
    technical_skills_score NUMERIC(5,2) DEFAULT 0.00,
    collaboration_score NUMERIC(5,2) DEFAULT 0.00,
    growth_consistency_score NUMERIC(5,2) DEFAULT 0.00,
    last_computed_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- 6. Score Appeals & Corrections
CREATE TABLE IF NOT EXISTS score_appeals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    dimension VARCHAR(64) NOT NULL,
    reason TEXT NOT NULL,
    evidence_urls TEXT[] DEFAULT '{}',
    status VARCHAR(32) DEFAULT 'under_review' CHECK (status IN ('under_review', 'approved', 'rejected')),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 7. Assessments Catalog & Attempts
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(64) NOT NULL, -- Coding, DSA, System Design, Languages
    difficulty VARCHAR(32) NOT NULL, -- Beginner, Intermediate, Advanced
    description TEXT NOT NULL,
    badge_title VARCHAR(100) NOT NULL,
    time_limit_minutes INT DEFAULT 45,
    rubric_version VARCHAR(32) DEFAULT 'v1.0.0',
    starter_code TEXT,
    problem_statement TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE TABLE IF NOT EXISTS assessment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    status VARCHAR(32) DEFAULT 'started' CHECK (status IN ('started', 'submitted', 'passed', 'failed', 'timeout')),
    score NUMERIC(5,2) DEFAULT 0.00,
    test_cases_passed INT DEFAULT 0,
    total_test_cases INT DEFAULT 0,
    submitted_code TEXT,
    execution_time_ms INT DEFAULT 0,
    memory_used_kb INT DEFAULT 0,
    feedback TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    completed_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_profile ON assessment_attempts(profile_id);

-- 8. Community Topics, Posts, Comments, Votes, Bookmarks, and Follows
CREATE TABLE IF NOT EXISTS community_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES community_topics(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    votes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);
CREATE INDEX IF NOT EXISTS idx_posts_author ON community_posts(author_profile_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_votes ON community_posts(votes_count DESC);

CREATE TABLE IF NOT EXISTS community_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    author_profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    votes_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);
CREATE INDEX IF NOT EXISTS idx_comments_post ON community_comments(post_id);

CREATE TABLE IF NOT EXISTS community_votes (
    profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    target_type VARCHAR(16) NOT NULL CHECK (target_type IN ('post', 'comment')),
    target_id UUID NOT NULL,
    value INT NOT NULL CHECK (value IN (1, -1)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    PRIMARY KEY (profile_id, target_type, target_id)
);

CREATE TABLE IF NOT EXISTS community_bookmarks (
    profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    PRIMARY KEY (profile_id, post_id)
);

CREATE TABLE IF NOT EXISTS user_follows (
    follower_profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    target_profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    PRIMARY KEY (follower_profile_id, target_profile_id),
    CHECK (follower_profile_id != target_profile_id)
);

CREATE TABLE IF NOT EXISTS moderation_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    target_type VARCHAR(16) NOT NULL CHECK (target_type IN ('post', 'comment', 'profile')),
    target_id UUID NOT NULL,
    reason VARCHAR(100) NOT NULL,
    details TEXT,
    status VARCHAR(32) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- 9. Recruiter / Hiring Tables
CREATE TABLE IF NOT EXISTS recruiter_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_user_id VARCHAR(128) UNIQUE NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    company_website TEXT,
    role_title VARCHAR(100) NOT NULL,
    verification_status VARCHAR(32) DEFAULT 'verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE TABLE IF NOT EXISTS saved_developers (
    recruiter_clerk_id VARCHAR(128) NOT NULL,
    candidate_profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    PRIMARY KEY (recruiter_clerk_id, candidate_profile_id)
);

CREATE TABLE IF NOT EXISTS candidate_contact_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_clerk_id VARCHAR(128) NOT NULL,
    candidate_profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    job_title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    compensation_range VARCHAR(100),
    status VARCHAR(32) DEFAULT 'sent' CHECK (status IN ('sent', 'accepted', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- 10. In-App Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'system', -- score, badge, community, recruiter, system
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);
CREATE INDEX IF NOT EXISTS idx_notifications_profile ON notifications(profile_id, is_read);

-- 11. Idempotency Records
CREATE TABLE IF NOT EXISTS idempotency_records (
    idempotency_key VARCHAR(128) PRIMARY KEY,
    clerk_user_id VARCHAR(128) NOT NULL,
    route VARCHAR(150) NOT NULL,
    status_code INT NOT NULL,
    response_body JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);
CREATE INDEX IF NOT EXISTS idx_idempotency_expiry ON idempotency_records(expires_at);

-- Seed Default Topics
INSERT INTO community_topics (slug, name, description)
VALUES 
    ('general', 'General Discussion', 'Engineering talk, tech breakthroughs, and questions.'),
    ('system-design', 'System Design & Architecture', 'Distributed systems, scaling patterns, and database design.'),
    ('algorithms', 'Algorithms & Problem Solving', 'DSA, competitive programming, and optimization challenges.'),
    ('showcase', 'Project Showcases', 'Ship your verified builds, demos, and open-source packages.'),
    ('career', 'Career & Growth', 'Leveling up, interviews, compensation benchmarks, and engineering leadership.')
ON CONFLICT (slug) DO NOTHING;

-- Seed Standard Assessments
INSERT INTO assessments (slug, name, category, difficulty, description, badge_title, time_limit_minutes, problem_statement, starter_code)
VALUES
    ('two-sum-dsa', 'Algorithms & Data Structures Challenge', 'DSA', 'Intermediate', 'Solve array two sum in optimal O(N) time with zero memory leaks.', 'Algorithms Master', 45, 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', 'def two_sum(nums: list[int], target: int) -> list[int]:\n    # Implement optimal solution\n    pass'),
    ('system-design-cache', 'Distributed Systems & Caching', 'System Design', 'Advanced', 'Design a fault-tolerant multi-tier caching tier with stampede prevention.', 'System Design Expert', 60, 'Design an in-memory distributed cache with TTL, LRU eviction, and protection against cache stampedes.', '// Design the Cache cluster topology\n'),
    ('go-concurrency', 'Go Concurrent Worker Pipeline', 'Languages', 'Advanced', 'Implement a bounded worker pool handling rate-limited HTTP ingestion.', 'Go Specialist', 45, 'Implement a bounded worker pool in Go with graceful context cancellation.', 'package main\n\nfunc RunWorkerPool(ctx context.Context, jobs <-chan Job) {\n}\n')
ON CONFLICT (slug) DO NOTHING;
