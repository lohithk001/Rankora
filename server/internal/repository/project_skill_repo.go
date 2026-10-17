package repository

import (
	"context"
	"fmt"
	"strings"

	"rankora/server/internal/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ProjectRepository struct {
	pool *pgxpool.Pool
}

func NewProjectRepository(pool *pgxpool.Pool) *ProjectRepository {
	return &ProjectRepository{pool: pool}
}

func (r *ProjectRepository) GetByProfileID(ctx context.Context, profileID uuid.UUID) ([]models.Project, error) {
	query := `
		SELECT id, profile_id, title, description, repository_url, live_url, tech_stack, test_coverage_percent, architecture_notes, verification_status, created_at, updated_at
		FROM projects
		WHERE profile_id = $1
		ORDER BY created_at DESC
	`
	rows, err := r.pool.Query(ctx, query, profileID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Project
	for rows.Next() {
		var p models.Project
		if err := rows.Scan(
			&p.ID, &p.ProfileID, &p.Title, &p.Description, &p.RepositoryURL,
			&p.LiveURL, &p.TechStack, &p.TestCoveragePercent, &p.ArchitectureNotes,
			&p.VerificationStatus, &p.CreatedAt, &p.UpdatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, p)
	}
	return list, nil
}

func (r *ProjectRepository) Create(ctx context.Context, profileID uuid.UUID, req *models.CreateProjectRequest) (*models.Project, error) {
	query := `
		INSERT INTO projects (profile_id, title, description, repository_url, live_url, tech_stack, test_coverage_percent, architecture_notes, verification_status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'provisional')
		RETURNING id, profile_id, title, description, repository_url, live_url, tech_stack, test_coverage_percent, architecture_notes, verification_status, created_at, updated_at
	`
	var p models.Project
	err := r.pool.QueryRow(ctx, query,
		profileID,
		strings.TrimSpace(req.Title),
		req.Description,
		req.RepositoryURL,
		req.LiveURL,
		req.TechStack,
		req.TestCoveragePercent,
		req.ArchitectureNotes,
	).Scan(
		&p.ID, &p.ProfileID, &p.Title, &p.Description, &p.RepositoryURL,
		&p.LiveURL, &p.TechStack, &p.TestCoveragePercent, &p.ArchitectureNotes,
		&p.VerificationStatus, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *ProjectRepository) Delete(ctx context.Context, profileID uuid.UUID, projectID uuid.UUID) (bool, error) {
	tag, err := r.pool.Exec(ctx, "DELETE FROM projects WHERE id = $1 AND profile_id = $2", projectID, profileID)
	if err != nil {
		return false, err
	}
	return tag.RowsAffected() > 0, nil
}

type SkillRepository struct {
	pool *pgxpool.Pool
}

func NewSkillRepository(pool *pgxpool.Pool) *SkillRepository {
	return &SkillRepository{pool: pool}
}

func (r *SkillRepository) GetByProfileID(ctx context.Context, profileID uuid.UUID) ([]models.ProfileSkill, error) {
	query := `
		SELECT id, profile_id, name, level, score, league, verified, evidence_count, created_at
		FROM profile_skills
		WHERE profile_id = $1
		ORDER BY score DESC, created_at ASC
	`
	rows, err := r.pool.Query(ctx, query, profileID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.ProfileSkill
	for rows.Next() {
		var s models.ProfileSkill
		if err := rows.Scan(
			&s.ID, &s.ProfileID, &s.Name, &s.Level, &s.Score,
			&s.League, &s.Verified, &s.EvidenceCount, &s.CreatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, s)
	}
	return list, nil
}

func (r *SkillRepository) ReplaceSkills(ctx context.Context, profileID uuid.UUID, skills []string) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	// Delete unverified self-reported skills
	if _, err := tx.Exec(ctx, "DELETE FROM profile_skills WHERE profile_id = $1 AND verified = false", profileID); err != nil {
		return err
	}

	for _, s := range skills {
		trimmed := strings.TrimSpace(s)
		if trimmed == "" {
			continue
		}
		insertQuery := `
			INSERT INTO profile_skills (profile_id, name, level, score, verified)
			VALUES ($1, $2, 'User-Reported', 0.00, false)
			ON CONFLICT (profile_id, name) DO NOTHING
		`
		if _, err := tx.Exec(ctx, insertQuery, profileID, trimmed); err != nil {
			return fmt.Errorf("failed to insert skill: %w", err)
		}
	}

	return tx.Commit(ctx)
}
