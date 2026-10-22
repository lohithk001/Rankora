package repository

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"rankora/server/internal/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type SyncRepository struct {
	pool *pgxpool.Pool
}

func NewSyncRepository(pool *pgxpool.Pool) *SyncRepository {
	return &SyncRepository{pool: pool}
}

// SaveOAuthState stores a temporary CSRF state bound to a Clerk user
func (r *SyncRepository) SaveOAuthState(ctx context.Context, state, clerkUserID, provider, redirectURI string, expiry time.Duration) error {
	query := `
		INSERT INTO oauth_states (state, clerk_user_id, provider, redirect_uri, expires_at)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (state) DO UPDATE SET
			clerk_user_id = EXCLUDED.clerk_user_id,
			expires_at = EXCLUDED.expires_at
	`
	expiresAt := time.Now().UTC().Add(expiry)
	_, err := r.pool.Exec(ctx, query, state, clerkUserID, provider, redirectURI, expiresAt)
	return err
}

// VerifyAndConsumeOAuthState checks that the OAuth state is valid, not expired, and belongs to expected provider
func (r *SyncRepository) VerifyAndConsumeOAuthState(ctx context.Context, state, provider string) (string, error) {
	query := `
		SELECT clerk_user_id, expires_at 
		FROM oauth_states 
		WHERE state = $1 AND provider = $2
	`
	var clerkUserID string
	var expiresAt time.Time
	err := r.pool.QueryRow(ctx, query, state, provider).Scan(&clerkUserID, &expiresAt)
	if err != nil {
		return "", fmt.Errorf("invalid or unrecognized oauth state: %w", err)
	}

	// Delete state so it cannot be replayed
	_, _ = r.pool.Exec(ctx, "DELETE FROM oauth_states WHERE state = $1", state)

	if time.Now().UTC().After(expiresAt) {
		return "", fmt.Errorf("oauth state has expired; please restart the connect process")
	}

	return clerkUserID, nil
}

// SaveEncryptedToken stores an encrypted access token
func (r *SyncRepository) SaveEncryptedToken(ctx context.Context, profileID uuid.UUID, provider, encryptedToken, scope string) error {
	query := `
		INSERT INTO connected_account_tokens (profile_id, provider, encrypted_token, token_scope, updated_at)
		VALUES ($1, $2, $3, $4, (NOW() AT TIME ZONE 'UTC'))
		ON CONFLICT (profile_id, provider) DO UPDATE SET
			encrypted_token = EXCLUDED.encrypted_token,
			token_scope = EXCLUDED.token_scope,
			updated_at = (NOW() AT TIME ZONE 'UTC')
	`
	_, err := r.pool.Exec(ctx, query, profileID, provider, encryptedToken, scope)
	return err
}

// GetEncryptedToken retrieves the encrypted token for a provider
func (r *SyncRepository) GetEncryptedToken(ctx context.Context, profileID uuid.UUID, provider string) (string, error) {
	query := `
		SELECT encrypted_token FROM connected_account_tokens
		WHERE profile_id = $1 AND provider = $2
	`
	var token string
	err := r.pool.QueryRow(ctx, query, profileID, provider).Scan(&token)
	return token, err
}

// UpsertConnectedAccount records public connection status and metadata
func (r *SyncRepository) UpsertConnectedAccount(ctx context.Context, profileID uuid.UUID, provider, externalID, username string, metadata map[string]interface{}) error {
	metaJSON, err := json.Marshal(metadata)
	if err != nil {
		metaJSON = []byte("{}")
	}

	query := `
		INSERT INTO connected_accounts (profile_id, platform, external_id, username, verification_status, metadata, last_synced_at)
		VALUES ($1, $2, $3, $4, 'connected', $5, (NOW() AT TIME ZONE 'UTC'))
		ON CONFLICT (profile_id, platform) DO UPDATE SET
			external_id = EXCLUDED.external_id,
			username = EXCLUDED.username,
			verification_status = 'connected',
			metadata = EXCLUDED.metadata,
			last_synced_at = (NOW() AT TIME ZONE 'UTC')
	`
	_, err = r.pool.Exec(ctx, query, profileID, provider, externalID, username, metaJSON)
	return err
}

// DisconnectAccount safely deletes tokens, connected account record, and sync jobs
func (r *SyncRepository) DisconnectAccount(ctx context.Context, profileID uuid.UUID, provider string) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	_, _ = tx.Exec(ctx, "DELETE FROM connected_account_tokens WHERE profile_id = $1 AND provider = $2", profileID, provider)
	_, _ = tx.Exec(ctx, "DELETE FROM connected_accounts WHERE profile_id = $1 AND platform = $2", profileID, provider)

	return tx.Commit(ctx)
}

// InsertEvidenceItem records a verified external signal with provenance
func (r *SyncRepository) InsertEvidenceItem(ctx context.Context, item *models.EvidenceItem) error {
	payloadJSON, _ := json.Marshal(item.Payload)
	query := `
		INSERT INTO evidence_items (profile_id, source, evidence_type, title, description, payload, confidence, impact_score, occurred_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`
	_, err := r.pool.Exec(ctx, query,
		item.ProfileID, item.Source, item.EvidenceType, item.Title,
		item.Description, payloadJSON, item.Confidence, item.ImpactScore, item.OccurredAt,
	)
	return err
}

// CreateSyncJob creates a pending sync job
func (r *SyncRepository) CreateSyncJob(ctx context.Context, profileID uuid.UUID, provider string) (uuid.UUID, error) {
	var jobID uuid.UUID
	query := `
		INSERT INTO sync_jobs (profile_id, provider, status, started_at)
		VALUES ($1, $2, 'running', (NOW() AT TIME ZONE 'UTC'))
		RETURNING id
	`
	err := r.pool.QueryRow(ctx, query, profileID, provider).Scan(&jobID)
	return jobID, err
}

// CompleteSyncJob marks a sync job as completed or failed
func (r *SyncRepository) CompleteSyncJob(ctx context.Context, jobID uuid.UUID, itemsSynced int, errMessage *string) error {
	status := "completed"
	if errMessage != nil && *errMessage != "" {
		status = "failed"
	}
	query := `
		UPDATE sync_jobs SET
			status = $1,
			items_synced = $2,
			error_message = $3,
			completed_at = (NOW() AT TIME ZONE 'UTC')
		WHERE id = $4
	`
	_, err := r.pool.Exec(ctx, query, status, itemsSynced, errMessage, jobID)
	return err
}

// GetLatestSyncJob returns the most recent sync job for a provider
func (r *SyncRepository) GetLatestSyncJob(ctx context.Context, profileID uuid.UUID, provider string) (*models.SyncJob, error) {
	query := `
		SELECT id, profile_id, provider, status, items_synced, error_message, started_at, completed_at, created_at
		FROM sync_jobs
		WHERE profile_id = $1 AND provider = $2
		ORDER BY created_at DESC
		LIMIT 1
	`
	var job models.SyncJob
	err := r.pool.QueryRow(ctx, query, profileID, provider).Scan(
		&job.ID, &job.ProfileID, &job.Provider, &job.Status, &job.ItemsSynced,
		&job.ErrorMessage, &job.StartedAt, &job.CompletedAt, &job.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &job, nil
}

// GetDeveloperMetrics retrieves or creates default metrics for a profile
func (r *SyncRepository) GetDeveloperMetrics(ctx context.Context, profileID uuid.UUID) (*models.DeveloperMetrics, error) {
	query := `
		SELECT profile_id, repos_analyzed, problems_solved, contests_rated, prs_reviewed,
		       test_coverage_avg, commit_streak_days, problem_solving_score, engineering_quality_score,
		       technical_skills_score, collaboration_score, growth_consistency_score, last_computed_at
		FROM developer_metrics
		WHERE profile_id = $1
	`
	var m models.DeveloperMetrics
	err := r.pool.QueryRow(ctx, query, profileID).Scan(
		&m.ProfileID, &m.ReposAnalyzed, &m.ProblemsSolved, &m.ContestsRated, &m.PRsReviewed,
		&m.TestCoverageAvg, &m.CommitStreakDays, &m.ProblemSolvingScore, &m.EngineeringQualityScore,
		&m.TechnicalSkillsScore, &m.CollaborationScore, &m.GrowthConsistencyScore, &m.LastComputedAt,
	)
	if err != nil {
		return &models.DeveloperMetrics{ProfileID: profileID, LastComputedAt: time.Now().UTC()}, nil
	}
	return &m, nil
}

// UpsertDeveloperMetrics updates computed metrics
func (r *SyncRepository) UpsertDeveloperMetrics(ctx context.Context, m *models.DeveloperMetrics) error {
	query := `
		INSERT INTO developer_metrics (
			profile_id, repos_analyzed, problems_solved, contests_rated, prs_reviewed,
			test_coverage_avg, commit_streak_days, problem_solving_score, engineering_quality_score,
			technical_skills_score, collaboration_score, growth_consistency_score, last_computed_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, (NOW() AT TIME ZONE 'UTC')
		)
		ON CONFLICT (profile_id) DO UPDATE SET
			repos_analyzed = EXCLUDED.repos_analyzed,
			problems_solved = EXCLUDED.problems_solved,
			contests_rated = EXCLUDED.contests_rated,
			prs_reviewed = EXCLUDED.prs_reviewed,
			test_coverage_avg = EXCLUDED.test_coverage_avg,
			commit_streak_days = EXCLUDED.commit_streak_days,
			problem_solving_score = EXCLUDED.problem_solving_score,
			engineering_quality_score = EXCLUDED.engineering_quality_score,
			technical_skills_score = EXCLUDED.technical_skills_score,
			collaboration_score = EXCLUDED.collaboration_score,
			growth_consistency_score = EXCLUDED.growth_consistency_score,
			last_computed_at = (NOW() AT TIME ZONE 'UTC')
	`
	_, err := r.pool.Exec(ctx, query,
		m.ProfileID, m.ReposAnalyzed, m.ProblemsSolved, m.ContestsRated, m.PRsReviewed,
		m.TestCoverageAvg, m.CommitStreakDays, m.ProblemSolvingScore, m.EngineeringQualityScore,
		m.TechnicalSkillsScore, m.CollaborationScore, m.GrowthConsistencyScore,
	)
	return err
}

// CreateScoreAppeal logs a score appeal request
func (r *SyncRepository) CreateScoreAppeal(ctx context.Context, profileID uuid.UUID, req *models.AppealScoreRequest) (*models.ScoreAppeal, error) {
	query := `
		INSERT INTO score_appeals (profile_id, dimension, reason, evidence_urls, status)
		VALUES ($1, $2, $3, $4, 'under_review')
		RETURNING id, profile_id, dimension, reason, evidence_urls, status, resolution_notes, created_at, resolved_at
	`
	var a models.ScoreAppeal
	err := r.pool.QueryRow(ctx, query, profileID, req.Dimension, req.Reason, req.EvidenceURLs).Scan(
		&a.ID, &a.ProfileID, &a.Dimension, &a.Reason, &a.EvidenceURLs, &a.Status, &a.ResolutionNotes, &a.CreatedAt, &a.ResolvedAt,
	)
	if err != nil {
		return nil, err
	}
	return &a, nil
}

// GetPreferences retrieves user preferences or returns default settings
func (r *SyncRepository) GetPreferences(ctx context.Context, profileID uuid.UUID) (*models.ProfilePreferences, error) {
	query := `
		SELECT profile_id, email_notifications, recruiter_outreach, show_compensation, theme, created_at, updated_at
		FROM profile_preferences
		WHERE profile_id = $1
	`
	var p models.ProfilePreferences
	err := r.pool.QueryRow(ctx, query, profileID).Scan(
		&p.ProfileID, &p.EmailNotifications, &p.RecruiterOutreach, &p.ShowCompensation, &p.Theme, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		// Return default preferences if not yet explicitly stored
		return &models.ProfilePreferences{
			ProfileID:          profileID,
			EmailNotifications: true,
			RecruiterOutreach:  true,
			ShowCompensation:   false,
			Theme:              "system",
			CreatedAt:          time.Now().UTC(),
			UpdatedAt:          time.Now().UTC(),
		}, nil
	}
	return &p, nil
}

// UpsertPreferences updates or creates profile preferences
func (r *SyncRepository) UpsertPreferences(ctx context.Context, profileID uuid.UUID, p *models.ProfilePreferences) (*models.ProfilePreferences, error) {
	query := `
		INSERT INTO profile_preferences (profile_id, email_notifications, recruiter_outreach, show_compensation, theme, updated_at)
		VALUES ($1, $2, $3, $4, $5, (NOW() AT TIME ZONE 'UTC'))
		ON CONFLICT (profile_id) DO UPDATE SET
			email_notifications = EXCLUDED.email_notifications,
			recruiter_outreach = EXCLUDED.recruiter_outreach,
			show_compensation = EXCLUDED.show_compensation,
			theme = EXCLUDED.theme,
			updated_at = (NOW() AT TIME ZONE 'UTC')
		RETURNING profile_id, email_notifications, recruiter_outreach, show_compensation, theme, created_at, updated_at
	`
	var saved models.ProfilePreferences
	err := r.pool.QueryRow(ctx, query, profileID, p.EmailNotifications, p.RecruiterOutreach, p.ShowCompensation, p.Theme).Scan(
		&saved.ProfileID, &saved.EmailNotifications, &saved.RecruiterOutreach, &saved.ShowCompensation, &saved.Theme, &saved.CreatedAt, &saved.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &saved, nil
}

// ListConnectedAccounts returns all connected external accounts
func (r *SyncRepository) ListConnectedAccounts(ctx context.Context, profileID uuid.UUID) ([]models.ConnectedAccount, error) {
	query := `
		SELECT id, profile_id, platform, external_id, username, verification_status, last_synced_at, created_at
		FROM connected_accounts
		WHERE profile_id = $1
		ORDER BY created_at DESC
	`
	rows, err := r.pool.Query(ctx, query, profileID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.ConnectedAccount
	for rows.Next() {
		var a models.ConnectedAccount
		if err := rows.Scan(
			&a.ID, &a.ProfileID, &a.Platform, &a.ExternalID, &a.Username, &a.VerificationStatus, &a.LastSyncedAt, &a.CreatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, a)
	}
	return list, nil
}
