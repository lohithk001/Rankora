import { test, describe } from 'node:test';
import assert from 'node:assert';
import { calculateScore, ALGORITHM_VERSION, COMPONENT_WEIGHTS } from '../internal/scoring/engine.js';

describe('Rankora Scoring Engine Tests', () => {
  test('Version check', () => {
    assert.strictEqual(ALGORITHM_VERSION, 'v1.0.0');
  });

  test('Calculates S = 0.30P + 0.25E + 0.20T + 0.15C + 0.10G accurately', () => {
    const components = {
      problemSolving: 90,     // 0.30 * 90 = 27
      engineeringQuality: 80, // 0.25 * 80 = 20
      technicalSkills: 85,    // 0.20 * 85 = 17
      collaboration: 70,      // 0.15 * 70 = 10.5
      growthConsistency: 90   // 0.10 * 90 = 9
    };
    // Expected: 27 + 20 + 17 + 10.5 + 9 = 83.5
    const result = calculateScore(components);
    assert.strictEqual(result.score, 83.5);
    assert.strictEqual(result.league, 'Advanced');
    assert.strictEqual(result.isProvisional, false);
    assert.strictEqual(result.confidence, 100);
  });

  test('Fresher fairness: rookie with high demonstrated ability reaches Advanced/Elite', () => {
    const student = {
      problemSolving: 95,
      engineeringQuality: 92,
      technicalSkills: 90,
      collaboration: 80,
      growthConsistency: 90
    };
    const result = calculateScore(student);
    assert.ok(result.score >= 90);
    assert.strictEqual(result.league, 'Elite');
  });

  test('Flags provisional status when observed sources are under 3', () => {
    const provisionalCandidate = {
      problemSolving: 75,
      engineeringQuality: 70
    };
    const result = calculateScore(provisionalCandidate);
    assert.strictEqual(result.isProvisional, true);
    assert.ok(result.confidence < 60);
  });
});
