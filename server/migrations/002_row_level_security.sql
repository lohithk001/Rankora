-- Rankora Row-Level Security (RLS) & Authorization Policies
-- Migration: 002_row_level_security.sql

-- Enable RLS on user-scoped tables
ALTER TABLE IF EXISTS developer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS experience_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS education_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. DEVELOPER PROFILES POLICIES
-- Anyone can view public profiles; owners can view their own profile regardless of visibility
DROP POLICY IF EXISTS dev_profiles_select_policy ON developer_profiles;
CREATE POLICY dev_profiles_select_policy ON developer_profiles
    FOR SELECT
    USING (
        visibility = 'public' 
        OR clerk_user_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')
    );

-- Only authenticated profile owners can insert their own record
DROP POLICY IF EXISTS dev_profiles_insert_policy ON developer_profiles;
CREATE POLICY dev_profiles_insert_policy ON developer_profiles
    FOR INSERT
    WITH CHECK (
        clerk_user_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')
    );

-- Only authenticated profile owners can update their own profile
DROP POLICY IF EXISTS dev_profiles_update_policy ON developer_profiles;
CREATE POLICY dev_profiles_update_policy ON developer_profiles
    FOR UPDATE
    USING (
        clerk_user_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')
    )
    WITH CHECK (
        clerk_user_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')
    );

-- Only authenticated profile owners can delete their profile
DROP POLICY IF EXISTS dev_profiles_delete_policy ON developer_profiles;
CREATE POLICY dev_profiles_delete_policy ON developer_profiles
    FOR DELETE
    USING (
        clerk_user_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')
    );

-- 2. PROFILE SKILLS POLICIES
DROP POLICY IF EXISTS profile_skills_all_policy ON profile_skills;
CREATE POLICY profile_skills_all_policy ON profile_skills
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM developer_profiles dp
            WHERE dp.id = profile_skills.profile_id
              AND (
                  dp.visibility = 'public'
                  OR dp.clerk_user_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')
              )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM developer_profiles dp
            WHERE dp.id = profile_skills.profile_id
              AND dp.clerk_user_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')
        )
    );

-- 3. PROJECTS POLICIES
DROP POLICY IF EXISTS projects_all_policy ON projects;
CREATE POLICY projects_all_policy ON projects
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM developer_profiles dp
            WHERE dp.id = projects.profile_id
              AND (
                  dp.visibility = 'public'
                  OR dp.clerk_user_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')
              )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM developer_profiles dp
            WHERE dp.id = projects.profile_id
              AND dp.clerk_user_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')
        )
    );

-- 4. CONNECTED ACCOUNTS POLICIES
DROP POLICY IF EXISTS connected_accounts_policy ON connected_accounts;
CREATE POLICY connected_accounts_policy ON connected_accounts
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM developer_profiles dp
            WHERE dp.id = connected_accounts.profile_id
              AND dp.clerk_user_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM developer_profiles dp
            WHERE dp.id = connected_accounts.profile_id
              AND dp.clerk_user_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')
        )
    );

-- 5. AUDIT LOGS POLICIES
DROP POLICY IF EXISTS audit_logs_insert_policy ON audit_logs;
CREATE POLICY audit_logs_insert_policy ON audit_logs
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS audit_logs_select_policy ON audit_logs;
CREATE POLICY audit_logs_select_policy ON audit_logs
    FOR SELECT
    USING (
        actor_clerk_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')
    );
