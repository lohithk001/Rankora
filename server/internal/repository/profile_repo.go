package repository

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"rankora/server/internal/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ProfileRepository struct {
	pool *pgxpool.Pool
}

func NewProfileRepository(pool *pgxpool.Pool) *ProfileRepository {
	return &ProfileRepository{pool: pool}
}

// GetByClerkID fetches profile by verified Clerk subject
func (r *ProfileRepository) GetByClerkID(ctx context.Context, clerkID string) (*models.DeveloperProfile, error) {
	query := `
		SELECT 
			id, clerk_user_id, username, display_name, email, avatar_url,
			headline, bio, country, location, experience_level, interests,
			league, score, confidence, is_provisional, visibility, consent_accepted,
			github_handle, leetcode_handle, codeforces_handle, linkedin_url,
			portfolio_url, onboarding_completed, created_at, updated_at
		FROM developer_profiles
		WHERE clerk_user_id = $1
	`
	row := r.pool.QueryRow(ctx, query, clerkID)
	return scanProfile(row)
}

// GetByUsername fetches profile by unique case-insensitive username
func (r *ProfileRepository) GetByUsername(ctx context.Context, username string) (*models.DeveloperProfile, error) {
	query := `
		SELECT 
			id, clerk_user_id, username, display_name, email, avatar_url,
			headline, bio, country, location, experience_level, interests,
			league, score, confidence, is_provisional, visibility, consent_accepted,
			github_handle, leetcode_handle, codeforces_handle, linkedin_url,
			portfolio_url, onboarding_completed, created_at, updated_at
		FROM developer_profiles
		WHERE LOWER(username) = LOWER($1)
	`
	row := r.pool.QueryRow(ctx, query, strings.TrimSpace(username))
	return scanProfile(row)
}

// IsUsernameTaken checks if username exists, optionally excluding a specific clerk ID
func (r *ProfileRepository) IsUsernameTaken(ctx context.Context, username string, excludeClerkID string) (bool, error) {
	query := `
		SELECT EXISTS(
			SELECT 1 FROM developer_profiles 
			WHERE LOWER(username) = LOWER($1) AND ($2 = '' OR clerk_user_id != $2)
		)
	`
	var exists bool
	err := r.pool.QueryRow(ctx, query, strings.TrimSpace(username), excludeClerkID).Scan(&exists)
	return exists, err
}

// UpsertOnboardingProfile creates or updates profile during onboarding within a transaction
func (r *ProfileRepository) UpsertOnboardingProfile(ctx context.Context, clerkID string, req *models.OnboardingRequest) (*models.DeveloperProfile, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	// Clean fields
	cleanUsername := strings.ToLower(strings.TrimSpace(req.Username))
	cleanDisplayName := strings.TrimSpace(req.DisplayName)
	cleanCountry := strings.TrimSpace(req.Country)

	var avatarURL string
	if cleanUsername != "" {
		avatarURL = fmt.Sprintf("https://api.dicebear.com/7.x/identicon/svg?seed=%s", cleanUsername)
	}

	query := `
		INSERT INTO developer_profiles (
			clerk_user_id, username, display_name, country, location, headline,
			bio, experience_level, interests, visibility, consent_accepted,
			github_handle, leetcode_handle, codeforces_handle, linkedin_url,
			portfolio_url, avatar_url, onboarding_completed, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6,
			$7, $8, $9, $10, $11,
			$12, $13, $14, $15,
			$16, $17, true, (NOW() AT TIME ZONE 'UTC')
		)
		ON CONFLICT (clerk_user_id) DO UPDATE SET
			username = EXCLUDED.username,
			display_name = EXCLUDED.display_name,
			country = EXCLUDED.country,
			location = EXCLUDED.location,
			headline = EXCLUDED.headline,
			bio = EXCLUDED.bio,
			experience_level = EXCLUDED.experience_level,
			interests = EXCLUDED.interests,
			visibility = EXCLUDED.visibility,
			consent_accepted = EXCLUDED.consent_accepted,
			github_handle = EXCLUDED.github_handle,
			leetcode_handle = EXCLUDED.leetcode_handle,
			codeforces_handle = EXCLUDED.codeforces_handle,
			linkedin_url = EXCLUDED.linkedin_url,
			portfolio_url = EXCLUDED.portfolio_url,
			avatar_url = EXCLUDED.avatar_url,
			onboarding_completed = true,
			updated_at = (NOW() AT TIME ZONE 'UTC')
		RETURNING 
			id, clerk_user_id, username, display_name, email, avatar_url,
			headline, bio, country, location, experience_level, interests,
			league, score, confidence, is_provisional, visibility, consent_accepted,
			github_handle, leetcode_handle, codeforces_handle, linkedin_url,
			portfolio_url, onboarding_completed, created_at, updated_at
	`

	vis := req.Visibility
	if vis == "" {
		vis = "public"
	}

	row := tx.QueryRow(ctx, query,
		clerkID,
		cleanUsername,
		cleanDisplayName,
		cleanCountry,
		req.Location,
		req.Headline,
		req.Bio,
		req.ExperienceLevel,
		req.Interests,
		vis,
		req.ConsentAccepted,
		req.GithubHandle,
		req.LeetcodeHandle,
		req.CodeforcesHandle,
		req.LinkedinURL,
		req.PortfolioURL,
		avatarURL,
	)

	profile, err := scanProfile(row)
	if err != nil {
		return nil, fmt.Errorf("failed to upsert profile: %w", err)
	}

	// Upsert user skills
	if len(req.Skills) > 0 {
		for _, skill := range req.Skills {
			trimmedSkill := strings.TrimSpace(skill)
			if trimmedSkill == "" {
				continue
			}
			skillQuery := `
				INSERT INTO profile_skills (profile_id, name, level, score, verified)
				VALUES ($1, $2, 'User-Reported', 0.00, false)
				ON CONFLICT (profile_id, name) DO NOTHING
			`
			if _, err := tx.Exec(ctx, skillQuery, profile.ID, trimmedSkill); err != nil {
				return nil, fmt.Errorf("failed saving skill %s: %w", trimmedSkill, err)
			}
		}
	}

	// Log audit trail
	auditQuery := `
		INSERT INTO audit_logs (profile_id, actor_clerk_id, event_type, payload)
		VALUES ($1, $2, 'onboarding_complete', $3)
	`
	_, _ = tx.Exec(ctx, auditQuery, profile.ID, clerkID, fmt.Sprintf(`{"username":"%s"}`, cleanUsername))

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit profile transaction: %w", err)
	}

	return profile, nil
}

// UpdateProfile updates mutable fields
func (r *ProfileRepository) UpdateProfile(ctx context.Context, clerkID string, req *models.UpdateProfileRequest) (*models.DeveloperProfile, error) {
	existing, err := r.GetByClerkID(ctx, clerkID)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, errors.New("profile not found")
	}

	query := `
		UPDATE developer_profiles SET
			display_name = COALESCE($1, display_name),
			headline = COALESCE($2, headline),
			bio = COALESCE($3, bio),
			country = COALESCE($4, country),
			location = COALESCE($5, location),
			experience_level = COALESCE($6, experience_level),
			interests = COALESCE($7, interests),
			visibility = COALESCE($8, visibility),
			github_handle = COALESCE($9, github_handle),
			leetcode_handle = COALESCE($10, leetcode_handle),
			codeforces_handle = COALESCE($11, codeforces_handle),
			linkedin_url = COALESCE($12, linkedin_url),
			portfolio_url = COALESCE($13, portfolio_url),
			updated_at = (NOW() AT TIME ZONE 'UTC')
		WHERE clerk_user_id = $14
		RETURNING 
			id, clerk_user_id, username, display_name, email, avatar_url,
			headline, bio, country, location, experience_level, interests,
			league, score, confidence, is_provisional, visibility, consent_accepted,
			github_handle, leetcode_handle, codeforces_handle, linkedin_url,
			portfolio_url, onboarding_completed, created_at, updated_at
	`
	row := r.pool.QueryRow(ctx, query,
		req.DisplayName,
		req.Headline,
		req.Bio,
		req.Country,
		req.Location,
		req.ExperienceLevel,
		req.Interests,
		req.Visibility,
		req.GithubHandle,
		req.LeetcodeHandle,
		req.CodeforcesHandle,
		req.LinkedinURL,
		req.PortfolioURL,
		clerkID,
	)

	return scanProfile(row)
}

// DeleteProfile permanently deletes developer profile, cascading to linked skills, projects, and accounts
func (r *ProfileRepository) DeleteProfile(ctx context.Context, clerkID string) error {
	query := `DELETE FROM developer_profiles WHERE clerk_user_id = $1`
	cmdTag, err := r.pool.Exec(ctx, query, clerkID)
	if err != nil {
		return fmt.Errorf("failed deleting profile: %w", err)
	}
	if cmdTag.RowsAffected() == 0 {
		return errors.New("profile not found or already deleted")
	}
	return nil
}

// UpdateScore updates calculated score, league and confidence for a profile
func (r *ProfileRepository) UpdateScore(ctx context.Context, profileID uuid.UUID, score float64, league string, confidence float64, isProvisional bool) error {
	query := `
		UPDATE developer_profiles SET
			score = $1,
			league = $2,
			confidence = $3,
			is_provisional = $4,
			updated_at = (NOW() AT TIME ZONE 'UTC')
		WHERE id = $5
	`
	_, err := r.pool.Exec(ctx, query, score, league, confidence, isProvisional, profileID)
	return err
}

func scanProfile(row pgx.Row) (*models.DeveloperProfile, error) {
	var p models.DeveloperProfile
	err := row.Scan(
		&p.ID,
		&p.ClerkUserID,
		&p.Username,
		&p.DisplayName,
		&p.Email,
		&p.AvatarURL,
		&p.Headline,
		&p.Bio,
		&p.Country,
		&p.Location,
		&p.ExperienceLevel,
		&p.Interests,
		&p.League,
		&p.Score,
		&p.Confidence,
		&p.IsProvisional,
		&p.Visibility,
		&p.ConsentAccepted,
		&p.GithubHandle,
		&p.LeetcodeHandle,
		&p.CodeforcesHandle,
		&p.LinkedinURL,
		&p.PortfolioURL,
		&p.OnboardingCompleted,
		&p.CreatedAt,
		&p.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}
