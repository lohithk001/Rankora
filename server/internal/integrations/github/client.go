package github

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"time"
)

type Client struct {
	clientID     string
	clientSecret string
	callbackURL  string
	httpClient   *http.Client
}

type UserProfile struct {
	ID        int64  `json:"id"`
	Login     string `json:"login"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	AvatarURL string `json:"avatar_url"`
	Bio       string `json:"bio"`
	PublicRepos int  `json:"public_repos"`
	Followers   int  `json:"followers"`
	CreatedAt   string `json:"created_at"`
}

type Repository struct {
	ID          int64     `json:"id"`
	Name        string    `json:"name"`
	FullName    string    `json:"full_name"`
	Private     bool      `json:"private"`
	HTMLURL     string    `json:"html_url"`
	Description string    `json:"description"`
	Language    string    `json:"language"`
	StargazersCount int   `json:"stargazers_count"`
	ForksCount      int   `json:"forks_count"`
	DefaultBranch   string `json:"default_branch"`
	UpdatedAt       time.Time `json:"updated_at"`
	PushedAt        time.Time `json:"pushed_at"`
}

type TokenResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	Scope       string `json:"scope"`
	Error       string `json:"error"`
	ErrorDesc   string `json:"error_description"`
}

func NewClient(clientID, clientSecret, callbackURL string) *Client {
	return &Client{
		clientID:     clientID,
		clientSecret: clientSecret,
		callbackURL:  callbackURL,
		httpClient:   &http.Client{Timeout: 15 * time.Second},
	}
}

func (c *Client) IsConfigured() bool {
	return c.clientID != "" && c.clientSecret != ""
}

// GetAuthorizationURL builds GitHub OAuth consent URL with state
func (c *Client) GetAuthorizationURL(state string) string {
	u, _ := url.Parse("https://github.com/login/oauth/authorize")
	q := u.Query()
	q.Set("client_id", c.clientID)
	q.Set("redirect_uri", c.callbackURL)
	q.Set("scope", "read:user,repo")
	q.Set("state", state)
	u.RawQuery = q.Encode()
	return u.String()
}

// ExchangeCode exchanges temporary OAuth code for access token
func (c *Client) ExchangeCode(ctx context.Context, code string) (*TokenResponse, error) {
	if !c.IsConfigured() {
		return nil, errors.New("GitHub integration credentials (GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET) are not configured")
	}

	payload := map[string]string{
		"client_id":     c.clientID,
		"client_secret": c.clientSecret,
		"code":          code,
		"redirect_uri":  c.callbackURL,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", "https://github.com/login/oauth/access_token", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("GitHub token exchange network request failed: %w", err)
	}
	defer resp.Body.Close()

	var tokenResp TokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return nil, fmt.Errorf("failed decoding GitHub token response: %w", err)
	}

	if tokenResp.Error != "" {
		return nil, fmt.Errorf("GitHub OAuth error (%s): %s", tokenResp.Error, tokenResp.ErrorDesc)
	}

	return &tokenResp, nil
}

// GetAuthenticatedUser fetches GitHub user profile for access token
func (c *Client) GetAuthenticatedUser(ctx context.Context, token string) (*UserProfile, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", "https://api.github.com/user", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Accept", "application/vnd.github.v3+json")
	req.Header.Set("User-Agent", "Rankora-Intelligence-Engine")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("GitHub user profile request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("GitHub user API returned non-200 status: %d", resp.StatusCode)
	}

	var user UserProfile
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, fmt.Errorf("failed decoding GitHub user profile: %w", err)
	}

	return &user, nil
}

// GetUserRepositories fetches user's repositories (public + authorized private)
func (c *Client) GetUserRepositories(ctx context.Context, token string) ([]Repository, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", "https://api.github.com/user/repos?per_page=50&sort=updated", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Accept", "application/vnd.github.v3+json")
	req.Header.Set("User-Agent", "Rankora-Intelligence-Engine")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("GitHub repos request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("GitHub repos API returned status %d", resp.StatusCode)
	}

	var repos []Repository
	if err := json.NewDecoder(resp.Body).Decode(&repos); err != nil {
		return nil, fmt.Errorf("failed decoding GitHub repositories: %w", err)
	}

	return repos, nil
}
