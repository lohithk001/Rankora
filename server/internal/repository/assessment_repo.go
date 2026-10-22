package repository

import (
	"context"
	"fmt"
	"strings"
	"time"

	"rankora/server/internal/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AssessmentRepository struct {
	pool *pgxpool.Pool
}

func NewAssessmentRepository(pool *pgxpool.Pool) *AssessmentRepository {
	return &AssessmentRepository{pool: pool}
}

// ListAssessments returns all available assessments, optionally filtered by category
func (r *AssessmentRepository) ListAssessments(ctx context.Context, category string) ([]models.Assessment, error) {
	query := `
		SELECT id, slug, name, category, difficulty, description, badge_title,
		       time_limit_minutes, rubric_version, problem_statement, starter_code, is_active, created_at
		FROM assessments
		WHERE is_active = true
	`
	args := []interface{}{}
	if category != "" && strings.ToLower(category) != "all" {
		query += " AND LOWER(category) = LOWER($1)"
		args = append(args, category)
	}
	query += " ORDER BY created_at ASC"

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Assessment
	for rows.Next() {
		var a models.Assessment
		if err := rows.Scan(
			&a.ID, &a.Slug, &a.Name, &a.Category, &a.Difficulty, &a.Description,
			&a.BadgeTitle, &a.TimeLimitMinutes, &a.RubricVersion, &a.ProblemStatement,
			&a.StarterCode, &a.IsActive, &a.CreatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, a)
	}
	return list, nil
}

// GetAssessmentByIDOrSlug fetches an assessment by UUID or slug
func (r *AssessmentRepository) GetAssessmentByIDOrSlug(ctx context.Context, identifier string) (*models.Assessment, error) {
	query := `
		SELECT id, slug, name, category, difficulty, description, badge_title,
		       time_limit_minutes, rubric_version, problem_statement, starter_code, is_active, created_at
		FROM assessments
		WHERE id::text = $1 OR slug = $1
		LIMIT 1
	`
	var a models.Assessment
	err := r.pool.QueryRow(ctx, query, identifier).Scan(
		&a.ID, &a.Slug, &a.Name, &a.Category, &a.Difficulty, &a.Description,
		&a.BadgeTitle, &a.TimeLimitMinutes, &a.RubricVersion, &a.ProblemStatement,
		&a.StarterCode, &a.IsActive, &a.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &a, nil
}

// StartAttempt begins an assessment attempt
func (r *AssessmentRepository) StartAttempt(ctx context.Context, profileID, assessmentID uuid.UUID) (*models.AssessmentAttempt, error) {
	query := `
		INSERT INTO assessment_attempts (profile_id, assessment_id, status, started_at)
		VALUES ($1, $2, 'started', (NOW() AT TIME ZONE 'UTC'))
		RETURNING id, profile_id, assessment_id, status, score, test_cases_passed, total_test_cases, submitted_code, execution_time_ms, memory_used_kb, feedback, started_at, completed_at
	`
	var att models.AssessmentAttempt
	err := r.pool.QueryRow(ctx, query, profileID, assessmentID).Scan(
		&att.ID, &att.ProfileID, &att.AssessmentID, &att.Status, &att.Score,
		&att.TestCasesPassed, &att.TotalTestCases, &att.SubmittedCode,
		&att.ExecutionTimeMs, &att.MemoryUsedKB, &att.Feedback, &att.StartedAt, &att.CompletedAt,
	)
	if err != nil {
		return nil, err
	}
	return &att, nil
}

// GetAttemptByID fetches an attempt by ID
func (r *AssessmentRepository) GetAttemptByID(ctx context.Context, attemptID uuid.UUID) (*models.AssessmentAttempt, error) {
	query := `
		SELECT id, profile_id, assessment_id, status, score, test_cases_passed, total_test_cases,
		       submitted_code, execution_time_ms, memory_used_kb, feedback, started_at, completed_at
		FROM assessment_attempts
		WHERE id = $1
	`
	var att models.AssessmentAttempt
	err := r.pool.QueryRow(ctx, query, attemptID).Scan(
		&att.ID, &att.ProfileID, &att.AssessmentID, &att.Status, &att.Score,
		&att.TestCasesPassed, &att.TotalTestCases, &att.SubmittedCode,
		&att.ExecutionTimeMs, &att.MemoryUsedKB, &att.Feedback, &att.StartedAt, &att.CompletedAt,
	)
	if err != nil {
		return nil, err
	}
	return &att, nil
}

// CompleteAttempt records grading results
func (r *AssessmentRepository) CompleteAttempt(ctx context.Context, attemptID uuid.UUID, code string, passedCases, totalCases int, score float64, execTimeMs, memKB int, feedback string) (*models.AssessmentAttempt, error) {
	status := "passed"
	if passedCases < totalCases {
		status = "failed"
	}
	now := time.Now().UTC()

	query := `
		UPDATE assessment_attempts SET
			status = $1,
			score = $2,
			test_cases_passed = $3,
			total_test_cases = $4,
			submitted_code = $5,
			execution_time_ms = $6,
			memory_used_kb = $7,
			feedback = $8,
			completed_at = $9
		WHERE id = $10
		RETURNING id, profile_id, assessment_id, status, score, test_cases_passed, total_test_cases,
		          submitted_code, execution_time_ms, memory_used_kb, feedback, started_at, completed_at
	`
	var att models.AssessmentAttempt
	err := r.pool.QueryRow(ctx, query,
		status, score, passedCases, totalCases, code, execTimeMs, memKB, feedback, now, attemptID,
	).Scan(
		&att.ID, &att.ProfileID, &att.AssessmentID, &att.Status, &att.Score,
		&att.TestCasesPassed, &att.TotalTestCases, &att.SubmittedCode,
		&att.ExecutionTimeMs, &att.MemoryUsedKB, &att.Feedback, &att.StartedAt, &att.CompletedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed completing assessment attempt: %w", err)
	}
	return &att, nil
}

// GetUserAttempts returns all attempts by a profile
func (r *AssessmentRepository) GetUserAttempts(ctx context.Context, profileID uuid.UUID) ([]models.AssessmentAttempt, error) {
	query := `
		SELECT id, profile_id, assessment_id, status, score, test_cases_passed, total_test_cases,
		       submitted_code, execution_time_ms, memory_used_kb, feedback, started_at, completed_at
		FROM assessment_attempts
		WHERE profile_id = $1
		ORDER BY started_at DESC
	`
	rows, err := r.pool.Query(ctx, query, profileID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.AssessmentAttempt
	for rows.Next() {
		var att models.AssessmentAttempt
		if err := rows.Scan(
			&att.ID, &att.ProfileID, &att.AssessmentID, &att.Status, &att.Score,
			&att.TestCasesPassed, &att.TotalTestCases, &att.SubmittedCode,
			&att.ExecutionTimeMs, &att.MemoryUsedKB, &att.Feedback, &att.StartedAt, &att.CompletedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, att)
	}
	return list, nil
}
