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

type ProfilePreferences struct {
	ProfileID          uuid.UUID `json:"profileId"`
	EmailNotifications bool      `json:"emailNotifications"`
	RecruiterOutreach  bool      `json:"recruiterOutreach"`
	ShowCompensation   bool      `json:"showCompensation"`
	Theme              string    `json:"theme"`
	CreatedAt          time.Time `json:"createdAt"`
	UpdatedAt          time.Time `json:"updatedAt"`
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
	ID                  uuid.UUID `json:"id"`
	ProfileID           uuid.UUID `json:"profileId"`
	Title               string    `json:"title"`
	Description         *string   `json:"description,omitempty"`
	RepositoryURL       *string   `json:"repositoryUrl,omitempty"`
	LiveURL             *string   `json:"liveUrl,omitempty"`
	TechStack           []string  `json:"techStack"`
	TestCoveragePercent *float64  `json:"testCoveragePercent,omitempty"`
	ArchitectureNotes   *string   `json:"architectureNotes,omitempty"`
	VerificationStatus  string    `json:"verificationStatus"`
	CreatedAt           time.Time `json:"createdAt"`
	UpdatedAt           time.Time `json:"updatedAt"`
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
	ID           uuid.UUID              `json:"id"`
	ProfileID    uuid.UUID              `json:"profileId"`
	Source       string                 `json:"source"`
	EvidenceType string                 `json:"evidenceType"`
	Title        string                 `json:"title"`
	Description  *string                `json:"description,omitempty"`
	Payload      map[string]interface{} `json:"payload,omitempty"`
	Confidence   float64                `json:"confidence"`
	ImpactScore  *string                `json:"impactScore,omitempty"`
	OccurredAt   time.Time              `json:"occurredAt"`
	CreatedAt    time.Time              `json:"createdAt"`
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

type SyncJob struct {
	ID          uuid.UUID  `json:"id"`
	ProfileID   uuid.UUID  `json:"profileId"`
	Provider    string     `json:"provider"`
	Status      string     `json:"status"`
	ItemsSynced int        `json:"itemsSynced"`
	ErrorMessage *string   `json:"errorMessage,omitempty"`
	StartedAt   *time.Time `json:"startedAt,omitempty"`
	CompletedAt *time.Time `json:"completedAt,omitempty"`
	CreatedAt   time.Time  `json:"createdAt"`
}

type DeveloperMetrics struct {
	ProfileID               uuid.UUID `json:"profileId"`
	ReposAnalyzed           int       `json:"reposAnalyzed"`
	ProblemsSolved          int       `json:"problemsSolved"`
	ContestsRated           int       `json:"contestsRated"`
	PRsReviewed             int       `json:"prsReviewed"`
	TestCoverageAvg         float64   `json:"testCoverageAvg"`
	CommitStreakDays        int       `json:"commitStreakDays"`
	ProblemSolvingScore     float64   `json:"problemSolvingScore"`
	EngineeringQualityScore float64   `json:"engineeringQualityScore"`
	TechnicalSkillsScore    float64   `json:"technicalSkillsScore"`
	CollaborationScore      float64   `json:"collaborationScore"`
	GrowthConsistencyScore  float64   `json:"growthConsistencyScore"`
	LastComputedAt          time.Time `json:"lastComputedAt"`
}

type ScoreAppeal struct {
	ID              uuid.UUID  `json:"id"`
	ProfileID       uuid.UUID  `json:"profileId"`
	Dimension       string     `json:"dimension"`
	Reason          string     `json:"reason"`
	EvidenceURLs    []string   `json:"evidenceUrls"`
	Status          string     `json:"status"`
	ResolutionNotes *string    `json:"resolutionNotes,omitempty"`
	CreatedAt       time.Time  `json:"createdAt"`
	ResolvedAt      *time.Time `json:"resolvedAt,omitempty"`
}

type Assessment struct {
	ID               uuid.UUID `json:"id"`
	Slug             string    `json:"slug"`
	Name             string    `json:"name"`
	Category         string    `json:"category"`
	Difficulty       string    `json:"difficulty"`
	Description      string    `json:"description"`
	BadgeTitle       string    `json:"badgeTitle"`
	TimeLimitMinutes int       `json:"timeLimitMinutes"`
	RubricVersion    string    `json:"rubricVersion"`
	ProblemStatement string    `json:"problemStatement"`
	StarterCode      *string   `json:"starterCode,omitempty"`
	IsActive         bool      `json:"isActive"`
	CreatedAt        time.Time `json:"createdAt"`
}

type AssessmentAttempt struct {
	ID               uuid.UUID  `json:"id"`
	ProfileID        uuid.UUID  `json:"profileId"`
	AssessmentID     uuid.UUID  `json:"assessmentId"`
	Status           string     `json:"status"`
	Score            float64    `json:"score"`
	TestCasesPassed  int        `json:"testCasesPassed"`
	TotalTestCases   int        `json:"totalTestCases"`
	SubmittedCode    *string    `json:"submittedCode,omitempty"`
	ExecutionTimeMs  int        `json:"executionTimeMs"`
	MemoryUsedKB     int        `json:"memoryUsedKb"`
	Feedback         *string    `json:"feedback,omitempty"`
	StartedAt        time.Time  `json:"startedAt"`
	CompletedAt      *time.Time `json:"completedAt,omitempty"`
}

type CommunityTopic struct {
	ID          uuid.UUID `json:"id"`
	Slug        string    `json:"slug"`
	Name        string    `json:"name"`
	Description *string   `json:"description,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
}

type CommunityPost struct {
	ID               uuid.UUID `json:"id"`
	AuthorProfileID  uuid.UUID `json:"authorProfileId"`
	AuthorName       string    `json:"authorName,omitempty"`
	AuthorUsername   string    `json:"authorUsername,omitempty"`
	AuthorAvatar     string    `json:"authorAvatar,omitempty"`
	TopicID          *uuid.UUID `json:"topicId,omitempty"`
	TopicName        string    `json:"topicName,omitempty"`
	Title            string    `json:"title"`
	Content          string    `json:"content"`
	Tags             []string  `json:"tags"`
	VotesCount       int       `json:"votesCount"`
	CommentsCount    int       `json:"commentsCount"`
	UserVoted        int       `json:"userVoted,omitempty"`
	UserBookmarked   bool      `json:"userBookmarked,omitempty"`
	IsPinned         bool      `json:"isPinned"`
	IsLocked         bool      `json:"isLocked"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
}

type CommunityComment struct {
	ID              uuid.UUID  `json:"id"`
	PostID          uuid.UUID  `json:"postId"`
	AuthorProfileID uuid.UUID  `json:"authorProfileId"`
	AuthorName      string     `json:"authorName,omitempty"`
	AuthorUsername  string     `json:"authorUsername,omitempty"`
	AuthorAvatar    string     `json:"authorAvatar,omitempty"`
	ParentCommentID *uuid.UUID `json:"parentCommentId,omitempty"`
	Content         string     `json:"content"`
	VotesCount      int        `json:"votesCount"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
}

type RecruiterProfile struct {
	ID                 uuid.UUID `json:"id"`
	ClerkUserID        string    `json:"clerkUserId"`
	CompanyName        string    `json:"companyName"`
	CompanyWebsite     *string   `json:"companyWebsite,omitempty"`
	RoleTitle          string    `json:"roleTitle"`
	VerificationStatus string    `json:"verificationStatus"`
	CreatedAt          time.Time `json:"createdAt"`
}

type CandidateContactRequest struct {
	ID                 uuid.UUID `json:"id"`
	RecruiterClerkID   string    `json:"recruiterClerkId"`
	CandidateProfileID uuid.UUID `json:"candidateProfileId"`
	JobTitle           string    `json:"jobTitle"`
	Message            string    `json:"message"`
	CompensationRange  *string   `json:"compensationRange,omitempty"`
	Status             string    `json:"status"`
	CreatedAt          time.Time `json:"createdAt"`
}

type Notification struct {
	ID        uuid.UUID `json:"id"`
	ProfileID uuid.UUID `json:"profileId"`
	Title     string    `json:"title"`
	Body      string    `json:"body"`
	Category  string    `json:"category"`
	Link      *string   `json:"link,omitempty"`
	IsRead    bool      `json:"isRead"`
	CreatedAt time.Time `json:"createdAt"`
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

type UpdatePreferencesRequest struct {
	EmailNotifications *bool   `json:"emailNotifications"`
	RecruiterOutreach  *bool   `json:"recruiterOutreach"`
	ShowCompensation   *bool   `json:"showCompensation"`
	Theme              *string `json:"theme"`
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

type CreatePostRequest struct {
	Title   string   `json:"title" binding:"required"`
	Content string   `json:"content" binding:"required"`
	TopicSlug string `json:"topicSlug"`
	Tags    []string `json:"tags"`
}

type CreateCommentRequest struct {
	Content         string     `json:"content" binding:"required"`
	ParentCommentID *uuid.UUID `json:"parentCommentId"`
}

type VoteRequest struct {
	Value int `json:"value" binding:"required"` // 1 or -1
}

type SubmitAssessmentRequest struct {
	Code string `json:"code" binding:"required"`
}

type SaveCandidateRequest struct {
	CandidateUsername string `json:"candidateUsername" binding:"required"`
	Notes             string `json:"notes"`
}

type ContactCandidateRequest struct {
	CandidateUsername string `json:"candidateUsername" binding:"required"`
	JobTitle          string `json:"jobTitle" binding:"required"`
	Message           string `json:"message" binding:"required"`
	CompensationRange string `json:"compensationRange"`
}

type AppealScoreRequest struct {
	Dimension    string   `json:"dimension" binding:"required"`
	Reason       string   `json:"reason" binding:"required"`
	EvidenceURLs []string `json:"evidenceUrls"`
}
