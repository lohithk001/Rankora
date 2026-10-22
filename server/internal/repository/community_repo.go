package repository

import (
	"context"
	"fmt"
	"strings"

	"rankora/server/internal/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CommunityRepository struct {
	pool *pgxpool.Pool
}

func NewCommunityRepository(pool *pgxpool.Pool) *CommunityRepository {
	return &CommunityRepository{pool: pool}
}

// ListTopics returns all active discussion topics
func (r *CommunityRepository) ListTopics(ctx context.Context) ([]models.CommunityTopic, error) {
	query := `SELECT id, slug, name, description, created_at FROM community_topics ORDER BY name ASC`
	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.CommunityTopic
	for rows.Next() {
		var t models.CommunityTopic
		if err := rows.Scan(&t.ID, &t.Slug, &t.Name, &t.Description, &t.CreatedAt); err != nil {
			return nil, err
		}
		list = append(list, t)
	}
	return list, nil
}

// ListFeed returns posts with author details and interaction states
func (r *CommunityRepository) ListFeed(ctx context.Context, viewerProfileID *uuid.UUID, topicSlug, mode string, limit, offset int) ([]models.CommunityPost, int, error) {
	if limit <= 0 || limit > 50 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}

	whereClauses := []string{"1=1"}
	args := []interface{}{}
	argIdx := 1

	if topicSlug != "" && strings.ToLower(topicSlug) != "all" {
		whereClauses = append(whereClauses, fmt.Sprintf("t.slug = $%d", argIdx))
		args = append(args, topicSlug)
		argIdx++
	}

	orderBy := "p.is_pinned DESC, p.created_at DESC"
	if mode == "trending" {
		orderBy = "p.is_pinned DESC, (p.votes_count * 2 + p.comments_count) DESC, p.created_at DESC"
	}

	whereSQL := strings.Join(whereClauses, " AND ")

	// Count
	countQuery := fmt.Sprintf(`
		SELECT COUNT(*)
		FROM community_posts p
		LEFT JOIN community_topics t ON p.topic_id = t.id
		WHERE %s
	`, whereSQL)
	var total int
	if err := r.pool.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	viewerIDParam := uuid.Nil
	if viewerProfileID != nil {
		viewerIDParam = *viewerProfileID
	}

	dataQuery := fmt.Sprintf(`
		SELECT 
			p.id, p.author_profile_id, dp.display_name, dp.username, COALESCE(dp.avatar_url, ''),
			p.topic_id, COALESCE(t.name, ''), p.title, p.content, p.tags, p.votes_count, p.comments_count,
			COALESCE(v.value, 0) as user_voted,
			(b.post_id IS NOT NULL) as user_bookmarked,
			p.is_pinned, p.is_locked, p.created_at, p.updated_at
		FROM community_posts p
		JOIN developer_profiles dp ON p.author_profile_id = dp.id
		LEFT JOIN community_topics t ON p.topic_id = t.id
		LEFT JOIN community_votes v ON v.target_type = 'post' AND v.target_id = p.id AND v.profile_id = $%d
		LEFT JOIN community_bookmarks b ON b.post_id = p.id AND b.profile_id = $%d
		WHERE %s
		ORDER BY %s
		LIMIT $%d OFFSET $%d
	`, argIdx, argIdx, whereSQL, orderBy, argIdx+1, argIdx+2)

	args = append(args, viewerIDParam, limit, offset)

	rows, err := r.pool.Query(ctx, dataQuery, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var posts []models.CommunityPost
	for rows.Next() {
		var p models.CommunityPost
		if err := rows.Scan(
			&p.ID, &p.AuthorProfileID, &p.AuthorName, &p.AuthorUsername, &p.AuthorAvatar,
			&p.TopicID, &p.TopicName, &p.Title, &p.Content, &p.Tags, &p.VotesCount, &p.CommentsCount,
			&p.UserVoted, &p.UserBookmarked, &p.IsPinned, &p.IsLocked, &p.CreatedAt, &p.UpdatedAt,
		); err != nil {
			return nil, 0, err
		}
		posts = append(posts, p)
	}
	return posts, total, nil
}

// CreatePost creates a new post
func (r *CommunityRepository) CreatePost(ctx context.Context, authorProfileID uuid.UUID, req *models.CreatePostRequest) (*models.CommunityPost, error) {
	var topicID *uuid.UUID
	if req.TopicSlug != "" {
		var tid uuid.UUID
		err := r.pool.QueryRow(ctx, "SELECT id FROM community_topics WHERE slug = $1", req.TopicSlug).Scan(&tid)
		if err == nil {
			topicID = &tid
		}
	}

	query := `
		INSERT INTO community_posts (author_profile_id, topic_id, title, content, tags)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, author_profile_id, topic_id, title, content, tags, votes_count, comments_count, is_pinned, is_locked, created_at, updated_at
	`
	var p models.CommunityPost
	err := r.pool.QueryRow(ctx, query,
		authorProfileID, topicID, strings.TrimSpace(req.Title), strings.TrimSpace(req.Content), req.Tags,
	).Scan(
		&p.ID, &p.AuthorProfileID, &p.TopicID, &p.Title, &p.Content, &p.Tags,
		&p.VotesCount, &p.CommentsCount, &p.IsPinned, &p.IsLocked, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

// GetPostByID fetches single post
func (r *CommunityRepository) GetPostByID(ctx context.Context, postID uuid.UUID) (*models.CommunityPost, error) {
	query := `
		SELECT 
			p.id, p.author_profile_id, dp.display_name, dp.username, COALESCE(dp.avatar_url, ''),
			p.topic_id, COALESCE(t.name, ''), p.title, p.content, p.tags, p.votes_count, p.comments_count,
			p.is_pinned, p.is_locked, p.created_at, p.updated_at
		FROM community_posts p
		JOIN developer_profiles dp ON p.author_profile_id = dp.id
		LEFT JOIN community_topics t ON p.topic_id = t.id
		WHERE p.id = $1
	`
	var p models.CommunityPost
	err := r.pool.QueryRow(ctx, query, postID).Scan(
		&p.ID, &p.AuthorProfileID, &p.AuthorName, &p.AuthorUsername, &p.AuthorAvatar,
		&p.TopicID, &p.TopicName, &p.Title, &p.Content, &p.Tags, &p.VotesCount, &p.CommentsCount,
		&p.IsPinned, &p.IsLocked, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

// UpdatePost updates a post title and content if caller is the author
func (r *CommunityRepository) UpdatePost(ctx context.Context, postID, authorProfileID uuid.UUID, title, content string) (*models.CommunityPost, error) {
	query := `
		UPDATE community_posts
		SET title = $1, content = $2, updated_at = (NOW() AT TIME ZONE 'UTC')
		WHERE id = $3 AND author_profile_id = $4
	`
	cmd, err := r.pool.Exec(ctx, query, title, content, postID, authorProfileID)
	if err != nil {
		return nil, err
	}
	if cmd.RowsAffected() == 0 {
		return nil, fmt.Errorf("post not found or unauthorized")
	}
	return r.GetPostByID(ctx, postID)
}

// DeletePost removes a post if the caller is the author
func (r *CommunityRepository) DeletePost(ctx context.Context, postID, authorProfileID uuid.UUID) (bool, error) {
	tag, err := r.pool.Exec(ctx, "DELETE FROM community_posts WHERE id = $1 AND author_profile_id = $2", postID, authorProfileID)
	if err != nil {
		return false, err
	}
	return tag.RowsAffected() > 0, nil
}

// VotePost records +1 or -1 vote idempotently
func (r *CommunityRepository) VotePost(ctx context.Context, profileID, postID uuid.UUID, val int) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	// Check existing vote
	var existingVal int
	err = tx.QueryRow(ctx, "SELECT value FROM community_votes WHERE profile_id = $1 AND target_type = 'post' AND target_id = $2", profileID, postID).Scan(&existingVal)

	diff := val
	if err == nil {
		if existingVal == val {
			// Toggle off vote
			_, _ = tx.Exec(ctx, "DELETE FROM community_votes WHERE profile_id = $1 AND target_type = 'post' AND target_id = $2", profileID, postID)
			diff = -val
		} else {
			// Change from up to down or vice versa
			_, _ = tx.Exec(ctx, "UPDATE community_votes SET value = $1 WHERE profile_id = $2 AND target_type = 'post' AND target_id = $3", val, profileID, postID)
			diff = val - existingVal
		}
	} else {
		// New vote
		_, err = tx.Exec(ctx, "INSERT INTO community_votes (profile_id, target_type, target_id, value) VALUES ($1, 'post', $2, $3)", profileID, postID, val)
		if err != nil {
			return err
		}
	}

	_, err = tx.Exec(ctx, "UPDATE community_posts SET votes_count = votes_count + $1 WHERE id = $2", diff, postID)
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

// BookmarkPost toggles post bookmark
func (r *CommunityRepository) BookmarkPost(ctx context.Context, profileID, postID uuid.UUID) (bool, error) {
	var exists bool
	err := r.pool.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM community_bookmarks WHERE profile_id = $1 AND post_id = $2)", profileID, postID).Scan(&exists)
	if err != nil {
		return false, err
	}

	if exists {
		_, err := r.pool.Exec(ctx, "DELETE FROM community_bookmarks WHERE profile_id = $1 AND post_id = $2", profileID, postID)
		return false, err
	}

	_, err = r.pool.Exec(ctx, "INSERT INTO community_bookmarks (profile_id, post_id) VALUES ($1, $2)", profileID, postID)
	return true, err
}

// ListComments retrieves comments on a post
func (r *CommunityRepository) ListComments(ctx context.Context, postID uuid.UUID) ([]models.CommunityComment, error) {
	query := `
		SELECT 
			c.id, c.post_id, c.author_profile_id, dp.display_name, dp.username, COALESCE(dp.avatar_url, ''),
			c.parent_comment_id, c.content, c.votes_count, c.created_at, c.updated_at
		FROM community_comments c
		JOIN developer_profiles dp ON c.author_profile_id = dp.id
		WHERE c.post_id = $1
		ORDER BY c.created_at ASC
	`
	rows, err := r.pool.Query(ctx, query, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.CommunityComment
	for rows.Next() {
		var c models.CommunityComment
		if err := rows.Scan(
			&c.ID, &c.PostID, &c.AuthorProfileID, &c.AuthorName, &c.AuthorUsername, &c.AuthorAvatar,
			&c.ParentCommentID, &c.Content, &c.VotesCount, &c.CreatedAt, &c.UpdatedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, c)
	}
	return list, nil
}

// CreateComment adds a comment to a post
func (r *CommunityRepository) CreateComment(ctx context.Context, postID, authorProfileID uuid.UUID, content string, parentCommentID *uuid.UUID) (*models.CommunityComment, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	query := `
		INSERT INTO community_comments (post_id, author_profile_id, parent_comment_id, content)
		VALUES ($1, $2, $3, $4)
		RETURNING id, post_id, author_profile_id, parent_comment_id, content, votes_count, created_at, updated_at
	`
	var c models.CommunityComment
	err = tx.QueryRow(ctx, query, postID, authorProfileID, parentCommentID, strings.TrimSpace(content)).Scan(
		&c.ID, &c.PostID, &c.AuthorProfileID, &c.ParentCommentID, &c.Content, &c.VotesCount, &c.CreatedAt, &c.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	_, _ = tx.Exec(ctx, "UPDATE community_posts SET comments_count = comments_count + 1 WHERE id = $1", postID)

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return &c, nil
}

// FollowUser toggles follow/unfollow between profiles
func (r *CommunityRepository) FollowUser(ctx context.Context, followerProfileID, targetProfileID uuid.UUID) (bool, error) {
	if followerProfileID == targetProfileID {
		return false, fmt.Errorf("cannot follow your own profile")
	}

	var exists bool
	err := r.pool.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM user_follows WHERE follower_profile_id = $1 AND target_profile_id = $2)", followerProfileID, targetProfileID).Scan(&exists)
	if err != nil {
		return false, err
	}

	if exists {
		_, err := r.pool.Exec(ctx, "DELETE FROM user_follows WHERE follower_profile_id = $1 AND target_profile_id = $2", followerProfileID, targetProfileID)
		return false, err
	}

	_, err = r.pool.Exec(ctx, "INSERT INTO user_follows (follower_profile_id, target_profile_id) VALUES ($1, $2)", followerProfileID, targetProfileID)
	return true, err
}

// CreateReport records a moderation report
func (r *CommunityRepository) CreateReport(ctx context.Context, reporterProfileID, targetID uuid.UUID, targetType, reason, details string) error {
	query := `
		INSERT INTO moderation_reports (reporter_profile_id, target_type, target_id, reason, details)
		VALUES ($1, $2, $3, $4, $5)
	`
	_, err := r.pool.Exec(ctx, query, reporterProfileID, targetType, targetID, reason, details)
	return err
}
