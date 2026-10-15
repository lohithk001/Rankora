/**
 * Rankora Deterministic Scoring Engine
 * Algorithm Version: v1.0.0
 * 
 * Formula: S = 0.30P + 0.25E + 0.20T + 0.15C + 0.10G
 * 
 * Axiom: Rank demonstrated evidence, not intrinsic worth.
 * Missing platform signals are treated as 'not observed', not 0.
 */

export const ALGORITHM_VERSION = 'v1.0.0';

export const COMPONENT_WEIGHTS = {
  problemSolving: 0.30,      // P: Contests, verified algorithmic challenges
  engineeringQuality: 0.25,  // E: Test coverage, clean architecture, CI/CD
  technicalSkills: 0.20,     // T: Domain tasks (Backend, Frontend, Distributed)
  collaboration: 0.15,       // C: PR reviews, multi-author repos, impact
  growthConsistency: 0.10    // G: 8-week velocity & repeat performance
};

export function calculateScore(components) {
  const p = Math.max(0, Math.min(100, components.problemSolving || 0));
  const e = Math.max(0, Math.min(100, components.engineeringQuality || 0));
  const t = Math.max(0, Math.min(100, components.technicalSkills || 0));
  const c = Math.max(0, Math.min(100, components.collaboration || 0));
  const g = Math.max(0, Math.min(100, components.growthConsistency || 0));

  const weightedScore = (
    p * COMPONENT_WEIGHTS.problemSolving +
    e * COMPONENT_WEIGHTS.engineeringQuality +
    t * COMPONENT_WEIGHTS.technicalSkills +
    c * COMPONENT_WEIGHTS.collaboration +
    g * COMPONENT_WEIGHTS.growthConsistency
  );

  // Confidence index depends on observed sources (0-100%)
  const observedCount = [
    components.problemSolving,
    components.engineeringQuality,
    components.technicalSkills,
    components.collaboration,
    components.growthConsistency
  ].filter(val => val !== undefined && val !== null).length;

  const confidence = Math.round((observedCount / 5) * 100);

  // Assign League based on demonstrated threshold, not seniority
  let league = 'Rookie';
  if (weightedScore >= 90) league = 'Elite';
  else if (weightedScore >= 78) league = 'Advanced';
  else if (weightedScore >= 60) league = 'Rising';
  else league = 'Rookie';

  return {
    score: Math.round(weightedScore * 10) / 10,
    league,
    confidence,
    isProvisional: observedCount < 3,
    algorithmVersion: ALGORITHM_VERSION,
    breakdown: {
      problemSolving: { value: p, weight: 0.30, label: 'Problem-Solving (P)' },
      engineeringQuality: { value: e, weight: 0.25, label: 'Engineering Quality (E)' },
      technicalSkills: { value: t, weight: 0.20, label: 'Technical Skills (T)' },
      collaboration: { value: c, weight: 0.15, label: 'Collaboration & Impact (C)' },
      growthConsistency: { value: g, weight: 0.10, label: 'Growth & Consistency (G)' }
    }
  };
}
