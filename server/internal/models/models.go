package models

import (
	"time"

	"github.com/google/uuid"
)

type DeveloperProfile struct {
	ID                  uuid.UUID `json:"id"`
	ClerkUserID         string    `json:"clerkUserId"`
	Username            string    `json:"username"`
	DisplayName         string    `json:"displayName"`
	Email               *string   `json:"email,omitempty"`
	AvatarURL           *string   `json:"avatarUrl,omitempty"`
	Headline            *string   `json:"headline,omitempty"`
	Bio                 *string   `json:"bio,omitempty"`
	Country             string    `json:"country"`
	Location            *string   `json:"location,omitempty"`
	ExperienceLevel     string    `json:"experienceLevel"`
	Interests           []string  `json:"interests"`
	League              string    `json:"league"`
	Score               float64   `json:"score"`
	Confidence          float64   `json:"confidence"`
	IsProvisional       bool      `json:"isProvisional"`
	Visibility          string    `json:"visibility"`
	ConsentAccepted     bool      `json:"consentAccepted"`
	GithubHandle        *string   `json:"githubHandle,omitempty"`
	LeetcodeHandle      *string   `json:"leetcodeHandle,omitempty"`
	CodeforcesHandle    *string   `json:"codeforcesHandle,omitempty"`
	LinkedinURL         *string   `json:"linkedinUrl,omitempty"`
	PortfolioURL        *string   `json:"portfolioUrl,omitempty"`
	OnboardingCompleted bool      `json:"onboardingCompleted"`
	CreatedAt           time.Time `json:"createdAt"`
	UpdatedAt           time.Time `json:"updatedAt"`
}

type ProfileSkill struct {
	ID            uuid.UUID `json:"id"`
	ProfileID     uuid.UUID `json:"profileId"`
	Name          string    `json:"name"`
	Level         string    `json:"level"`
	Score         float64   `json:"score"`
	League        string    `json:"league"`
	Verified      bool      `json:"verified"`
	EvidenceCount int       `json:"evidenceCount"`
	CreatedAt     time.Time `json:"createdAt"`
}

type Project struct {
	ID                   uuid.UUID `json:"id"`
	ProfileID            uuid.UUID `json:"profileId"`
	Title                string    `json:"title"`
	Description          *string   `json:"description,omitempty"`
	RepositoryURL        *string   `json:"repositoryUrl,omitempty"`
	LiveURL              *string   `json:"liveUrl,omitempty"`
	TechStack            []string  `json:"techStack"`
	TestCoveragePercent  *float64  `json:"testCoveragePercent,omitempty"`
	ArchitectureNotes    *string   `json:"architectureNotes,omitempty"`
	VerificationStatus   string    `json:"verificationStatus"`
	CreatedAt            time.Time `json:"createdAt"`
	UpdatedAt            time.Time `json:"updatedAt"`
}

type ExperienceEntry struct {
	ID             uuid.UUID  `json:"id"`
	ProfileID      uuid.UUID  `json:"profileId"`
	Company        string     `json:"company"`
	Role           string     `json:"role"`
	EmploymentType string     `json:"employmentType"`
	Location       *string    `json:"location,omitempty"`
	StartDate      time.Time  `json:"startDate"`
	EndDate        *time.Time `json:"endDate,omitempty"`
	IsCurrent      bool       `json:"isCurrent"`
	Description    *string    `json:"description,omitempty"`
	CreatedAt      time.Time  `json:"createdAt"`
}

type EducationEntry struct {
	ID           uuid.UUID `json:"id"`
	ProfileID    uuid.UUID `json:"profileId"`
	Institution  string    `json:"institution"`
	Degree       *string   `json:"degree,omitempty"`
	FieldOfStudy *string   `json:"fieldOfStudy,omitempty"`
	StartYear    *int      `json:"startYear,omitempty"`
	EndYear      *int      `json:"endYear,omitempty"`
	Grade        *string   `json:"grade,omitempty"`
	CreatedAt    time.Time `json:"createdAt"`
}

type ConnectedAccount struct {
	ID                 uuid.UUID              `json:"id"`
	ProfileID          uuid.UUID              `json:"profileId"`
	Platform           string                 `json:"platform"`
	ExternalID         *string                `json:"externalId,omitempty"`
	Username           string                 `json:"username"`
	VerificationStatus string                 `json:"verificationStatus"`
	Metadata           map[string]interface{} `json:"metadata,omitempty"`
	LastSyncedAt       *time.Time             `json:"lastSyncedAt,omitempty"`
	CreatedAt          time.Time              `json:"createdAt"`
}

type EvidenceItem struct {
	ID          uuid.UUID              `json:"id"`
	ProfileID   uuid.UUID              `json:"profileId"`
	Source      string                 `json:"source"`
	EvidenceType string                `json:"evidenceType"`
	Title       string                 `json:"title"`
	Description *string                `json:"description,omitempty"`
	Payload     map[string]interface{} `json:"payload,omitempty"`
	Confidence  float64                `json:"confidence"`
	ImpactScore *string                `json:"impactScore,omitempty"`
	OccurredAt  time.Time              `json:"occurredAt"`
	CreatedAt   time.Time              `json:"createdAt"`
}

type ScoreSnapshot struct {
	ID               uuid.UUID `json:"id"`
	ProfileID        uuid.UUID `json:"profileId"`
	ScoreType        string    `json:"scoreType"`
	Score            float64   `json:"score"`
	Confidence       float64   `json:"confidence"`
	League           string    `json:"league"`
	AlgorithmVersion string    `json:"algorithmVersion"`
	CalculatedAt     time.Time `json:"calculatedAt"`
}

type ScoreComponent struct {
	ID                 uuid.UUID   `json:"id"`
	SnapshotID         uuid.UUID   `json:"snapshotId"`
	Component          string      `json:"component"`
	Value              float64     `json:"value"`
	Weight             float64     `json:"weight"`
	EvidenceReferences []uuid.UUID `json:"evidenceReferences,omitempty"`
}

type RankingAlgorithmVersion struct {
	Version     string                 `json:"version"`
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Weights     map[string]interface{} `json:"weights"`
	Formula     string                 `json:"formula"`
	IsActive    bool                   `json:"isActive"`
	CreatedAt   time.Time              `json:"createdAt"`
}

type LeagueRule struct {
	League      string    `json:"league"`
	MinScore    float64   `json:"minScore"`
	MaxScore    float64   `json:"maxScore"`
	ColorToken  string    `json:"colorToken"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
}

type AuditLog struct {
	ID           uuid.UUID              `json:"id"`
	ProfileID    *uuid.UUID             `json:"profileId,omitempty"`
	ActorClerkID string                 `json:"actorClerkId"`
	EventType    string                 `json:"eventType"`
	Payload      map[string]interface{} `json:"payload"`
	IPAddress    *string                `json:"ipAddress,omitempty"`
	UserAgent    *string                `json:"userAgent,omitempty"`
	CreatedAt    time.Time              `json:"createdAt"`
}

// Request and Response DTOs

type OnboardingRequest struct {
	DisplayName     string   `json:"displayName" binding:"required"`
	Username        string   `json:"username" binding:"required"`
	Country         string   `json:"country" binding:"required"`
	Location        string   `json:"location"`
	Headline        string   `json:"headline"`
	Bio             string   `json:"bio"`
	ExperienceLevel string   `json:"experienceLevel"`
	Interests       []string `json:"interests"`
	Skills          []string `json:"skills"`
	GithubHandle    string   `json:"githubHandle"`
	LeetcodeHandle  string   `json:"leetcodeHandle"`
	CodeforcesHandle string  `json:"codeforcesHandle"`
	LinkedinURL     string   `json:"linkedinUrl"`
	PortfolioURL    string   `json:"portfolioUrl"`
	Visibility      string   `json:"visibility"`
	ConsentAccepted bool     `json:"consentAccepted"`
}

type UpdateProfileRequest struct {
	DisplayName     *string   `json:"displayName"`
	Headline        *string   `json:"headline"`
	Bio             *string   `json:"bio"`
	Country         *string   `json:"country"`
	Location        *string   `json:"location"`
	ExperienceLevel *string   `json:"experienceLevel"`
	Interests       *[]string `json:"interests"`
	Visibility      *string   `json:"visibility"`
	GithubHandle    *string   `json:"githubHandle"`
	LeetcodeHandle  *string   `json:"leetcodeHandle"`
	CodeforcesHandle *string  `json:"codeforcesHandle"`
	LinkedinURL     *string   `json:"linkedinUrl"`
	PortfolioURL    *string   `json:"portfolioUrl"`
}

type CreateProjectRequest struct {
	Title               string   `json:"title" binding:"required"`
	Description         string   `json:"description"`
	RepositoryURL       string   `json:"repositoryUrl"`
	LiveURL             string   `json:"liveUrl"`
	TechStack           []string `json:"techStack"`
	TestCoveragePercent *float64 `json:"testCoveragePercent"`
	ArchitectureNotes   string   `json:"architectureNotes"`
}

type UpdateSkillsRequest struct {
	Skills []string `json:"skills" binding:"required"`
}
