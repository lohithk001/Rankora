package repository

import (
	"context"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
)

type LeaderboardRepository struct {
	pool *pgxpool.Pool
}

func NewLeaderboardRepository(pool *pgxpool.Pool) *LeaderboardRepository {
	return &LeaderboardRepository{pool: pool}
}

type LeaderboardRow struct {
	Rank            int      `json:"rank"`
	ID              string   `json:"id"`
	Username        string   `json:"username"`
	DisplayName     string   `json:"displayName"`
	AvatarURL       string   `json:"avatarUrl"`
	Headline        string   `json:"headline"`
	Location        string   `json:"location"`
	Country         string   `json:"country"`
	League          string   `json:"league"`
	Score           float64  `json:"score"`
	Confidence      float64  `json:"confidence"`
	IsProvisional   bool     `json:"isProvisional"`
	Skills          []string `json:"skills"`
	ExperienceLevel string   `json:"experienceLevel"`
}

func (r *LeaderboardRepository) GetLeaderboard(ctx context.Context, league, search string, limit, offset int) ([]LeaderboardRow, int, error) {
	if limit <= 0 || limit > 100 {
		limit = 50
	}
	if offset < 0 {
		offset = 0
	}

	whereClauses := []string{"visibility = 'public'"}
	args := []interface{}{}
	argIndex := 1

	if league != "" && strings.ToLower(league) != "all" {
		whereClauses = append(whereClauses, fmt.Sprintf("LOWER(league) = LOWER($%d)", argIndex))
		args = append(args, league)
		argIndex++
	}

	if search != "" {
		searchTerm := "%" + strings.ToLower(search) + "%"
		whereClauses = append(whereClauses, fmt.Sprintf("(LOWER(display_name) LIKE $%d OR LOWER(username) LIKE $%d OR LOWER(headline) LIKE $%d OR LOWER(country) LIKE $%d)", argIndex, argIndex, argIndex, argIndex))
		args = append(args, searchTerm)
		argIndex++
	}

	whereSQL := strings.Join(whereClauses, " AND ")

	// Total count
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM developer_profiles WHERE %s", whereSQL)
	var total int
	if err := r.pool.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	// Data query with ROW_NUMBER() rank
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
	`, whereSQL, argIndex, argIndex+1)

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

func (r *LeaderboardRepository) GetMemberRank(ctx context.Context, clerkID string) (*LeaderboardRow, error) {
	query := `
		WITH Ranked AS (
			SELECT 
				ROW_NUMBER() OVER (ORDER BY score DESC, confidence DESC) as rank,
				id::text, clerk_user_id, username, display_name, COALESCE(avatar_url, '') as avatar_url,
				COALESCE(headline, '') as headline, COALESCE(location, country) as location, country,
				league, score, confidence, is_provisional, interests, experience_level
			FROM developer_profiles
			WHERE visibility = 'public'
		)
		SELECT 
			rank, id, username, display_name, avatar_url, headline, location, country,
			league, score, confidence, is_provisional, interests, experience_level
		FROM Ranked
		WHERE clerk_user_id = $1
	`
	var item LeaderboardRow
	err := r.pool.QueryRow(ctx, query, clerkID).Scan(
		&item.Rank, &item.ID, &item.Username, &item.DisplayName, &item.AvatarURL,
		&item.Headline, &item.Location, &item.Country,
		&item.League, &item.Score, &item.Confidence, &item.IsProvisional,
		&item.Skills, &item.ExperienceLevel,
	)
	if err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *LeaderboardRepository) SeedSampleDevelopers(ctx context.Context) error {
	var count int
	if err := r.pool.QueryRow(ctx, "SELECT COUNT(*) FROM developer_profiles").Scan(&count); err != nil {
		return err
	}
	if count > 0 {
		return nil // Already populated
	}

	// Insert default seed developers from section blueprint
	seeds := []struct {
		clerkID     string
		username    string
		displayName string
		score       float64
		confidence  float64
		league      string
		country     string
		headline    string
		interests   []string
	}{
		{"clerk_seed_1", "aarav_dev", "Aarav Sharma", 84.6, 92.0, "Advanced", "India", "Backend & Systems Craftsman • CS Graduate '26", []string{"Go", "PostgreSQL", "Raft", "Docker"}},
		{"clerk_seed_2", "priyanair", "Priya Nair", 89.8, 96.0, "Elite", "India", "Frontend Specialist • WCAG AAA • React & Next.js", []string{"React", "TypeScript", "Tailwind", "Radix"}},
		{"clerk_seed_3", "mvance_sys", "Marcus Vance", 93.4, 95.0, "Elite", "USA", "Kernel, eBPF & Distributed Storage Engine Architect", []string{"Rust", "C++", "eBPF", "SIMD"}},
		{"clerk_seed_4", "kavyap", "Kavya Patel", 68.4, 84.0, "Rising", "India", "Full-Stack Engineer • Jumped from Rookie to Rising in 60 Days", []string{"TypeScript", "Node.js", "React", "PostgreSQL"}},
		{"clerk_seed_5", "elena_algo", "Elena Rostova", 95.2, 98.0, "Elite", "Germany", "International Grandmaster (2680) • ICPC World Finalist", []string{"C++20", "Algorithms", "Graph Theory"}},
		{"clerk_seed_6", "toby_rookie", "Toby Morales", 54.2, 68.0, "Rookie", "Canada", "CS Sophomore & Open Source Apprentice", []string{"Python", "FastAPI", "React"}},
	}

	for _, s := range seeds {
		q := `
			INSERT INTO developer_profiles (
				clerk_user_id, username, display_name, score, confidence, league,
				country, location, headline, interests, is_provisional, onboarding_completed, visibility, consent_accepted
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $8, $9, false, true, 'public', true)
			ON CONFLICT (clerk_user_id) DO NOTHING
		`
		if _, err := r.pool.Exec(ctx, q, s.clerkID, s.username, s.displayName, s.score, s.confidence, s.league, s.country, s.headline, s.interests); err != nil {
			return err
		}
	}

	return nil
}
