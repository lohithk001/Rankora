package scoring_test

import (
	"testing"

	"rankora/server/internal/scoring"
)

func TestCalculateDeterministicScore(t *testing.T) {
	tests := []struct {
		name          string
		components    scoring.ComponentValues
		observedCount int
		expectedScore float64
		expectedTier  string
		isProvisional bool
	}{
		{
			name: "Elite high score engineer",
			components: scoring.ComponentValues{
				ProblemSolving:     95.0,
				EngineeringQuality: 92.0,
				TechnicalSkills:    90.0,
				Collaboration:      88.0,
				GrowthConsistency:  94.0,
			},
			observedCount: 5,
			expectedScore: 92.1,
			expectedTier:  "Elite",
			isProvisional: false,
		},
		{
			name: "Advanced league developer",
			components: scoring.ComponentValues{
				ProblemSolving:     85.0,
				EngineeringQuality: 82.0,
				TechnicalSkills:    80.0,
				Collaboration:      78.0,
				GrowthConsistency:  84.0,
			},
			observedCount: 4,
			expectedScore: 82.1,
			expectedTier:  "Advanced",
			isProvisional: false,
		},
		{
			name: "Rising league developer",
			components: scoring.ComponentValues{
				ProblemSolving:     65.0,
				EngineeringQuality: 70.0,
				TechnicalSkills:    68.0,
				Collaboration:      60.0,
				GrowthConsistency:  72.0,
			},
			observedCount: 3,
			expectedScore: 66.8,
			expectedTier:  "Rising",
			isProvisional: false,
		},
		{
			name: "Rookie provisional developer with few signals",
			components: scoring.ComponentValues{
				ProblemSolving:     40.0,
				EngineeringQuality: 45.0,
				TechnicalSkills:    50.0,
				Collaboration:      0.0,
				GrowthConsistency:  50.0,
			},
			observedCount: 2,
			expectedScore: 38.3,
			expectedTier:  "Rookie",
			isProvisional: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			analysis := scoring.CalculateDeterministicScore(tt.components, tt.observedCount)
			if analysis.League != tt.expectedTier {
				t.Errorf("expected league %s, got %s", tt.expectedTier, analysis.League)
			}
			if analysis.IsProvisional != tt.isProvisional {
				t.Errorf("expected isProvisional %v, got %v", tt.isProvisional, analysis.IsProvisional)
			}
			if diff := analysis.Score - tt.expectedScore; diff < -0.2 || diff > 0.2 {
				t.Errorf("expected score ~%f, got %f", tt.expectedScore, analysis.Score)
			}
		})
	}
}
