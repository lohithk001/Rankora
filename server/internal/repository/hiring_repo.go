package repository

import (
	"context"
	"fmt"
	"strings"

	"rankora/server/internal/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type HiringRepository struct {
	pool *pgxpool.Pool
}

func NewHiringRepository(pool *pgxpool.Pool) *HiringRepository {
	return &HiringRepository{pool: pool}
}

// GetOrCreateRecruiterProfile gets or lazily provisions a recruiter identity
func (r *HiringRepository) GetOrCreateRecruiterProfile(ctx context.Context, clerkID, company, role string) (*models.RecruiterProfile, error) {
	query := `
		INSERT INTO recruiter_profiles (clerk_user_id, company_name, role_title)
		VALUES ($1, $2, $3)
		ON CONFLICT (clerk_user_id) DO UPDATE SET
			company_name = CASE WHEN EXCLUDED.company_name != '' THEN EXCLUDED.company_name ELSE recruiter_profiles.company_name END,
			role_title = CASE WHEN EXCLUDED.role_title != '' THEN EXCLUDED.role_title ELSE recruiter_profiles.role_title END
		RETURNING id, clerk_user_id, company_name, company_website, role_title, verification_status, created_at
	`
	var p models.RecruiterProfile
	err := r.pool.QueryRow(ctx, query, clerkID, company, role).Scan(
		&p.ID, &p.ClerkUserID, &p.CompanyName, &p.CompanyWebsite, &p.RoleTitle, &p.VerificationStatus, &p.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

// SearchCandidates queries developers with verified signals respecting visibility rules
func (r *HiringRepository) SearchCandidates(ctx context.Context, country, league, roleQuery string, minScore float64, limit, offset int) ([]LeaderboardRow, int, error) {
	if limit <= 0 || limit > 50 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}

	whereClauses := []string{"visibility = 'public'"}
	args := []interface{}{}
	argIdx := 1

	if country != "" && strings.ToLower(country) != "all" {
		whereClauses = append(whereClauses, fmt.Sprintf("LOWER(country) = LOWER($%d)", argIdx))
		args = append(args, country)
		argIdx++
	}

	if league != "" && strings.ToLower(league) != "all" {
		whereClauses = append(whereClauses, fmt.Sprintf("LOWER(league) = LOWER($%d)", argIdx))
		args = append(args, league)
		argIdx++
	}

	if minScore > 0 {
		whereClauses = append(whereClauses, fmt.Sprintf("score >= $%d", argIdx))
		args = append(args, minScore)
		argIdx++
	}

	if roleQuery != "" {
		term := "%" + strings.ToLower(roleQuery) + "%"
		whereClauses = append(whereClauses, fmt.Sprintf("(LOWER(headline) LIKE $%d OR LOWER(experience_level) LIKE $%d OR EXISTS (SELECT 1 FROM unnest(interests) i WHERE LOWER(i) LIKE $%d))", argIdx, argIdx, argIdx))
		args = append(args, term)
		argIdx++
	}

	whereSQL := strings.Join(whereClauses, " AND ")

	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM developer_profiles WHERE %s", whereSQL)
	var total int
	if err := r.pool.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	dataQuery := fmt.Sprintf(`
		SELECT 
			ROW_NUMBER() OVER (ORDER BY score DESC, confidence DESC) as rank,
			id::text, username, display_name, COALESCE(avatar_url, ''),
			COALESCE(headline, ''), COALESCE(location, country), country,
			league, score, confidence, is_provisional, interests, experience_level
		FROM developer_profiles
		WHERE %s
		ORDER BY score DESC, confidence DESC
		LIMIT $%d OFFSET $%d
	`, whereSQL, argIdx, argIdx+1)

	args = append(args, limit, offset)

	rows, err := r.pool.Query(ctx, dataQuery, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var list []LeaderboardRow
	for rows.Next() {
		var item LeaderboardRow
		if err := rows.Scan(
			&item.Rank, &item.ID, &item.Username, &item.DisplayName, &item.AvatarURL,
			&item.Headline, &item.Location, &item.Country,
			&item.League, &item.Score, &item.Confidence, &item.IsProvisional,
			&item.Skills, &item.ExperienceLevel,
		); err != nil {
			return nil, 0, err
		}
		list = append(list, item)
	}

	return list, total, nil
}

// SaveCandidate bookmarks a candidate for a recruiter
func (r *HiringRepository) SaveCandidate(ctx context.Context, recruiterClerkID string, candidateProfileID uuid.UUID, notes string) error {
	query := `
		INSERT INTO saved_developers (recruiter_clerk_id, candidate_profile_id, notes)
		VALUES ($1, $2, $3)
		ON CONFLICT (recruiter_clerk_id, candidate_profile_id) DO UPDATE SET
			notes = EXCLUDED.notes
	`
	_, err := r.pool.Exec(ctx, query, recruiterClerkID, candidateProfileID, notes)
	return err
}

// RemoveSavedCandidate removes a candidate from recruiter's saved list
func (r *HiringRepository) RemoveSavedCandidate(ctx context.Context, recruiterClerkID string, candidateProfileID uuid.UUID) (bool, error) {
	tag, err := r.pool.Exec(ctx, "DELETE FROM saved_developers WHERE recruiter_clerk_id = $1 AND candidate_profile_id = $2", recruiterClerkID, candidateProfileID)
	if err != nil {
		return false, err
	}
	return tag.RowsAffected() > 0, nil
}

// ListSavedCandidates returns all candidate profiles saved by recruiter
func (r *HiringRepository) ListSavedCandidates(ctx context.Context, recruiterClerkID string) ([]LeaderboardRow, error) {
	query := `
		SELECT 
			ROW_NUMBER() OVER (ORDER BY dp.score DESC) as rank,
			dp.id::text, dp.username, dp.display_name, COALESCE(dp.avatar_url, ''),
			COALESCE(dp.headline, ''), COALESCE(dp.location, dp.country), dp.country,
			dp.league, dp.score, dp.confidence, dp.is_provisional, dp.interests, dp.experience_level
		FROM saved_developers sd
		JOIN developer_profiles dp ON sd.candidate_profile_id = dp.id
		WHERE sd.recruiter_clerk_id = $1
		ORDER BY sd.created_at DESC
	`
	rows, err := r.pool.Query(ctx, query, recruiterClerkID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []LeaderboardRow
	for rows.Next() {
		var item LeaderboardRow
		if err := rows.Scan(
			&item.Rank, &item.ID, &item.Username, &item.DisplayName, &item.AvatarURL,
			&item.Headline, &item.Location, &item.Country,
			&item.League, &item.Score, &item.Confidence, &item.IsProvisional,
			&item.Skills, &item.ExperienceLevel,
		); err != nil {
			return nil, err
		}
		list = append(list, item)
	}
	return list, nil
}

// CreateContactRequest logs recruiter outreach
func (r *HiringRepository) CreateContactRequest(ctx context.Context, recruiterClerkID string, candidateProfileID uuid.UUID, jobTitle, message, compRange string) error {
	query := `
		INSERT INTO candidate_contact_requests (recruiter_clerk_id, candidate_profile_id, job_title, message, compensation_range)
		VALUES ($1, $2, $3, $4, $5)
	`
	_, err := r.pool.Exec(ctx, query, recruiterClerkID, candidateProfileID, jobTitle, message, compRange)
	return err
}
