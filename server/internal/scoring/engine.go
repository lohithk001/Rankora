package scoring

type ComponentWeights struct {
	ProblemSolving     float64 `json:"problemSolving"`
	EngineeringQuality float64 `json:"engineeringQuality"`
	TechnicalSkills    float64 `json:"technicalSkills"`
	Collaboration      float64 `json:"collaboration"`
	GrowthConsistency  float64 `json:"growthConsistency"`
}

type ComponentValues struct {
	ProblemSolving     float64 `json:"problemSolving"`
	EngineeringQuality float64 `json:"engineeringQuality"`
	TechnicalSkills    float64 `json:"technicalSkills"`
	Collaboration      float64 `json:"collaboration"`
	GrowthConsistency  float64 `json:"growthConsistency"`
}

type ScoreBreakdownItem struct {
	Value  float64 `json:"value"`
	Weight float64 `json:"weight"`
	Label  string  `json:"label"`
}

type ScoreAnalysis struct {
	Score            float64                       `json:"score"`
	League           string                        `json:"league"`
	Confidence       float64                       `json:"confidence"`
	IsProvisional    bool                          `json:"isProvisional"`
	AlgorithmVersion string                        `json:"algorithmVersion"`
	Breakdown        map[string]ScoreBreakdownItem `json:"breakdown"`
}

const DefaultAlgorithmVersion = "v1.0.0"

var DefaultWeights = ComponentWeights{
	ProblemSolving:     0.30,
	EngineeringQuality: 0.25,
	TechnicalSkills:    0.20,
	Collaboration:      0.15,
	GrowthConsistency:  0.10,
}

func clamp(val, min, max float64) float64 {
	if val < min {
		return min
	}
	if val > max {
		return max
	}
	return val
}

// CalculateDeterministicScore computes Rankora's verified score S = 0.30P + 0.25E + 0.20T + 0.15C + 0.10G
func CalculateDeterministicScore(comp ComponentValues, observedCount int) ScoreAnalysis {
	p := clamp(comp.ProblemSolving, 0, 100)
	e := clamp(comp.EngineeringQuality, 0, 100)
	t := clamp(comp.TechnicalSkills, 0, 100)
	c := clamp(comp.Collaboration, 0, 100)
	g := clamp(comp.GrowthConsistency, 0, 100)

	weighted := (p * DefaultWeights.ProblemSolving) +
		(e * DefaultWeights.EngineeringQuality) +
		(t * DefaultWeights.TechnicalSkills) +
		(c * DefaultWeights.Collaboration) +
		(g * DefaultWeights.GrowthConsistency)

	// Round to 1 decimal place
	finalScore := float64(int(weighted*10+0.5)) / 10.0

	// Confidence index
	if observedCount < 0 {
		observedCount = 0
	}
	if observedCount > 5 {
		observedCount = 5
	}
	confidence := float64(observedCount) * 20.0

	// Determine league
	league := "Rookie"
	if finalScore >= 90.0 {
		league = "Elite"
	} else if finalScore >= 78.0 {
		league = "Advanced"
	} else if finalScore >= 60.0 {
		league = "Rising"
	}

	return ScoreAnalysis{
		Score:            finalScore,
		League:           league,
		Confidence:       confidence,
		IsProvisional:    observedCount < 3,
		AlgorithmVersion: DefaultAlgorithmVersion,
		Breakdown: map[string]ScoreBreakdownItem{
			"problemSolving": {
				Value:  p,
				Weight: DefaultWeights.ProblemSolving,
				Label:  "Problem-Solving (P)",
			},
			"engineeringQuality": {
				Value:  e,
				Weight: DefaultWeights.EngineeringQuality,
				Label:  "Engineering Quality (E)",
			},
			"technicalSkills": {
				Value:  t,
				Weight: DefaultWeights.TechnicalSkills,
				Label:  "Technical Skills (T)",
			},
			"collaboration": {
				Value:  c,
				Weight: DefaultWeights.Collaboration,
				Label:  "Collaboration & Impact (C)",
			},
			"growthConsistency": {
				Value:  g,
				Weight: DefaultWeights.GrowthConsistency,
				Label:  "Growth & Consistency (G)",
			},
		},
	}
}
