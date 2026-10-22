package repository

import (
	"context"

	"rankora/server/internal/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type NotificationRepository struct {
	pool *pgxpool.Pool
}

func NewNotificationRepository(pool *pgxpool.Pool) *NotificationRepository {
	return &NotificationRepository{pool: pool}
}

// ListNotifications returns user's notifications
func (r *NotificationRepository) ListNotifications(ctx context.Context, profileID uuid.UUID, limit int) ([]models.Notification, error) {
	if limit <= 0 || limit > 50 {
		limit = 20
	}
	query := `
		SELECT id, profile_id, title, body, category, link, is_read, created_at
		FROM notifications
		WHERE profile_id = $1
		ORDER BY created_at DESC
		LIMIT $2
	`
	rows, err := r.pool.Query(ctx, query, profileID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Notification
	for rows.Next() {
		var n models.Notification
		if err := rows.Scan(&n.ID, &n.ProfileID, &n.Title, &n.Body, &n.Category, &n.Link, &n.IsRead, &n.CreatedAt); err != nil {
			return nil, err
		}
		list = append(list, n)
	}
	return list, nil
}

// GetUnreadCount returns the count of unread notifications for a profile
func (r *NotificationRepository) GetUnreadCount(ctx context.Context, profileID uuid.UUID) (int, error) {
	var count int
	err := r.pool.QueryRow(ctx, "SELECT COUNT(*) FROM notifications WHERE profile_id = $1 AND is_read = false", profileID).Scan(&count)
	return count, err
}

// MarkAsRead marks a single notification as read
func (r *NotificationRepository) MarkAsRead(ctx context.Context, profileID, notificationID uuid.UUID) (bool, error) {
	tag, err := r.pool.Exec(ctx, "UPDATE notifications SET is_read = true WHERE id = $1 AND profile_id = $2", notificationID, profileID)
	if err != nil {
		return false, err
	}
	return tag.RowsAffected() > 0, nil
}

// MarkAllAsRead marks all unread notifications as read
func (r *NotificationRepository) MarkAllAsRead(ctx context.Context, profileID uuid.UUID) error {
	_, err := r.pool.Exec(ctx, "UPDATE notifications SET is_read = true WHERE profile_id = $1 AND is_read = false", profileID)
	return err
}

// CreateNotification creates a notification
func (r *NotificationRepository) CreateNotification(ctx context.Context, profileID uuid.UUID, title, body, category, link string) error {
	query := `
		INSERT INTO notifications (profile_id, title, body, category, link)
		VALUES ($1, $2, $3, $4, $5)
	`
	var linkPtr *string
	if link != "" {
		linkPtr = &link
	}
	_, err := r.pool.Exec(ctx, query, profileID, title, body, category, linkPtr)
	return err
}

// GetPreferences fetches or initializes profile preferences
func (r *NotificationRepository) GetPreferences(ctx context.Context, profileID uuid.UUID) (*models.ProfilePreferences, error) {
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
		// Initialize default preferences
		initQuery := `
			INSERT INTO profile_preferences (profile_id, email_notifications, recruiter_outreach, show_compensation, theme)
			VALUES ($1, true, true, false, 'system')
			ON CONFLICT (profile_id) DO UPDATE SET updated_at = (NOW() AT TIME ZONE 'UTC')
			RETURNING profile_id, email_notifications, recruiter_outreach, show_compensation, theme, created_at, updated_at
		`
		err = r.pool.QueryRow(ctx, initQuery, profileID).Scan(
			&p.ProfileID, &p.EmailNotifications, &p.RecruiterOutreach, &p.ShowCompensation, &p.Theme, &p.CreatedAt, &p.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
	}
	return &p, nil
}

// UpdatePreferences updates user preferences
func (r *NotificationRepository) UpdatePreferences(ctx context.Context, profileID uuid.UUID, req *models.UpdatePreferencesRequest) (*models.ProfilePreferences, error) {
	current, err := r.GetPreferences(ctx, profileID)
	if err != nil {
		return nil, err
	}

	emailNotifs := current.EmailNotifications
	if req.EmailNotifications != nil {
		emailNotifs = *req.EmailNotifications
	}
	recruiter := current.RecruiterOutreach
	if req.RecruiterOutreach != nil {
		recruiter = *req.RecruiterOutreach
	}
	showComp := current.ShowCompensation
	if req.ShowCompensation != nil {
		showComp = *req.ShowCompensation
	}
	theme := current.Theme
	if req.Theme != nil && *req.Theme != "" {
		theme = *req.Theme
	}

	query := `
		UPDATE profile_preferences SET
			email_notifications = $1,
			recruiter_outreach = $2,
			show_compensation = $3,
			theme = $4,
			updated_at = (NOW() AT TIME ZONE 'UTC')
		WHERE profile_id = $5
		RETURNING profile_id, email_notifications, recruiter_outreach, show_compensation, theme, created_at, updated_at
	`
	var p models.ProfilePreferences
	err = r.pool.QueryRow(ctx, query, emailNotifs, recruiter, showComp, theme, profileID).Scan(
		&p.ProfileID, &p.EmailNotifications, &p.RecruiterOutreach, &p.ShowCompensation, &p.Theme, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &p, nil
}
