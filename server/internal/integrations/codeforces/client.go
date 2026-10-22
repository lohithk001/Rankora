package codeforces

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type Client struct {
	httpClient *http.Client
}

type UserInfo struct {
	Handle      string `json:"handle"`
	Rating      int    `json:"rating"`
	MaxRating   int    `json:"maxRating"`
	Rank        string `json:"rank"`
	MaxRank     string `json:"maxRank"`
	Avatar      string `json:"avatar"`
	TitlePhoto  string `json:"titlePhoto"`
	Contribution int   `json:"contribution"`
}

type RatingChange struct {
	ContestID        int    `json:"contestId"`
	ContestName      string `json:"contestName"`
	Handle           string `json:"handle"`
	Rank             int    `json:"rank"`
	RatingUpdateTime int64  `json:"ratingUpdateTimeSeconds"`
	OldRating        int    `json:"oldRating"`
	NewRating        int    `json:"newRating"`
}

type Submission struct {
	ID                  int64  `json:"id"`
	ContestID           int    `json:"contestId"`
	CreationTimeSeconds int64  `json:"creationTimeSeconds"`
	ProgrammingLanguage string `json:"programmingLanguage"`
	Verdict             string `json:"verdict"`
	Problem             struct {
		ContestID int      `json:"contestId"`
		Index     string   `json:"index"`
		Name      string   `json:"name"`
		Rating    int      `json:"rating"`
		Tags      []string `json:"tags"`
	} `json:"problem"`
}

type APIResponse[T any] struct {
	Status  string `json:"status"`
	Comment string `json:"comment,omitempty"`
	Result  T      `json:"result"`
}

func NewClient() *Client {
	return &Client{
		httpClient: &http.Client{Timeout: 10 * time.Second},
	}
}

// GetUserInfo fetches public user profile from Codeforces
func (c *Client) GetUserInfo(ctx context.Context, handle string) (*UserInfo, error) {
	trimmed := strings.TrimSpace(handle)
	if trimmed == "" {
		return nil, fmt.Errorf("codeforces handle cannot be empty")
	}

	endpoint := fmt.Sprintf("https://codeforces.com/api/user.info?handles=%s", url.QueryEscape(trimmed))
	req, err := http.NewRequestWithContext(ctx, "GET", endpoint, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "Rankora-Intelligence-Engine")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("codeforces network error: %w", err)
	}
	defer resp.Body.Close()

	var apiResp APIResponse[[]UserInfo]
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("failed decoding codeforces response: %w", err)
	}

	if apiResp.Status != "OK" || len(apiResp.Result) == 0 {
		return nil, fmt.Errorf("codeforces handle not found: %s", apiResp.Comment)
	}

	return &apiResp.Result[0], nil
}

// GetUserRatingHistory fetches rating changes across rated contests
func (c *Client) GetUserRatingHistory(ctx context.Context, handle string) ([]RatingChange, error) {
	endpoint := fmt.Sprintf("https://codeforces.com/api/user.rating?handle=%s", url.QueryEscape(strings.TrimSpace(handle)))
	req, err := http.NewRequestWithContext(ctx, "GET", endpoint, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "Rankora-Intelligence-Engine")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("codeforces rating history network error: %w", err)
	}
	defer resp.Body.Close()

	var apiResp APIResponse[[]RatingChange]
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("failed decoding codeforces rating history: %w", err)
	}

	if apiResp.Status != "OK" {
		return nil, fmt.Errorf("codeforces rating history error: %s", apiResp.Comment)
	}

	return apiResp.Result, nil
}

// GetUserSubmissions fetches recent submissions to count solved problems
func (c *Client) GetUserSubmissions(ctx context.Context, handle string, count int) ([]Submission, error) {
	if count <= 0 || count > 100 {
		count = 50
	}
	endpoint := fmt.Sprintf("https://codeforces.com/api/user.status?handle=%s&from=1&count=%d", url.QueryEscape(strings.TrimSpace(handle)), count)
	req, err := http.NewRequestWithContext(ctx, "GET", endpoint, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "Rankora-Intelligence-Engine")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("codeforces submissions network error: %w", err)
	}
	defer resp.Body.Close()

	var apiResp APIResponse[[]Submission]
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("failed decoding codeforces submissions: %w", err)
	}

	if apiResp.Status != "OK" {
		return nil, fmt.Errorf("codeforces submissions error: %s", apiResp.Comment)
	}

	return apiResp.Result, nil
}
