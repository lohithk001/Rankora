import test from 'node:test';
import assert from 'node:assert/strict';

import { 
  calculateOverallScore, 
  deterministicComparator, 
  calculateScopeRanks 
} from '../utils/rankingEngine.js';
import { assignLeague, getLeagueProgress } from '../utils/leagueRules.js';
import { filterAndRankDevelopers, SEED_DEVELOPERS } from '../services/leaderboardApi.js';

test('calculateOverallScore: full observation produces correct weighted score', () => {
  const components = {
    problemSolving: 100,
    engineeringQuality: 100,
    technicalSkills: 100,
    collaboration: 100,
    growth: 100
  };

  const result = calculateOverallScore(components);
  assert.equal(result.score, 100);
  assert.equal(result.insufficientEvidence, false);
  assert.equal(result.isProvisional, false);
  assert.equal(result.observedCount, 5);
});

test('calculateOverallScore: respects weights (30/25/20/15/10)', () => {
  // Only problemSolving = 100 (weight 0.30)
  // Rest = 0
  const components = {
    problemSolving: 100,
    engineeringQuality: 0,
    technicalSkills: 0,
    collaboration: 0,
    growth: 0
  };

  const result = calculateOverallScore(components);
  assert.equal(result.score, 30);
});

test('calculateOverallScore: normalizes over observed dimensions when evidence is missing', () => {
  // Missing collaboration and growth (only problemSolving: 80, engineeringQuality: 80, technicalSkills: 80)
  // Base weights: 0.30 + 0.25 + 0.20 = 0.75
  // Since all 3 observed are 80, normalized average must equal 80 (not penalized with 0 for missing dimensions!)
  const components = {
    problemSolving: 80,
    engineeringQuality: 80,
    technicalSkills: 80,
    collaboration: null,
    growth: null
  };

  const result = calculateOverallScore(components);
  assert.equal(result.score, 80);
  assert.equal(result.observedCount, 3);
  assert.equal(result.isProvisional, false);
});

test('calculateOverallScore: flags provisional rating when observedCount < 3', () => {
  const components = {
    problemSolving: 90,
    engineeringQuality: 90,
    technicalSkills: null,
    collaboration: null,
    growth: null
  };

  const result = calculateOverallScore(components);
  assert.equal(result.score, 90);
  assert.equal(result.isProvisional, true);
  assert.equal(result.insufficientEvidence, false);
});

test('calculateOverallScore: flags insufficient evidence when observedCount < 2', () => {
  const components = {
    problemSolving: 95,
    engineeringQuality: null,
    technicalSkills: null,
    collaboration: null,
    growth: null
  };

  const result = calculateOverallScore(components);
  assert.equal(result.insufficientEvidence, true);
});

test('calculateOverallScore: clamps out-of-range component scores (0 to 100)', () => {
  const components = {
    problemSolving: 150, // should clamp to 100
    engineeringQuality: -20, // should clamp to 0
    technicalSkills: 100,
    collaboration: 100,
    growth: 100
  };

  const result = calculateOverallScore(components);
  // 100*0.30 + 0*0.25 + 100*0.20 + 100*0.15 + 100*0.10 = 30 + 0 + 20 + 15 + 10 = 75
  assert.equal(result.score, 75);
});

test('assignLeague: assigns correct tiers based on score and coverage', () => {
  // Elite: score >= 92, coverage >= 0.85
  assert.equal(assignLeague(95, 0.90), 'Elite');
  assert.equal(assignLeague(95, 0.70), 'Advanced'); // High score but lower coverage caps at Advanced

  // Advanced: score >= 82, coverage >= 0.70
  assert.equal(assignLeague(85, 0.75), 'Advanced');
  assert.equal(assignLeague(85, 0.50), 'Rising');

  // Rising: score >= 55, coverage >= 0.40
  assert.equal(assignLeague(70, 0.50), 'Rising');

  // Rookie: default (below Rising threshold of 550 / 40%)
  assert.equal(assignLeague(50, 0.30), 'Rookie');
});

test('getLeagueProgress: computes roadmap to next tier', () => {
  const progress = getLeagueProgress(85, 0.80);
  assert.equal(progress.currentLeague, 'Advanced');
  assert.equal(progress.nextLeague, 'Elite');
  assert.ok(progress.pointsNeeded > 0);
  assert.ok(progress.coverageNeededPct >= 0);
});

test('deterministicComparator: breaks ties through 4-stage hierarchy', () => {
  // Stage 1: Score
  const devA = { id: 'a', calculatedScore: 90, evidenceCoverage: 0.8, verified: true };
  const devB = { id: 'b', calculatedScore: 85, evidenceCoverage: 0.9, verified: true };
  assert.ok(deterministicComparator(devA, devB) < 0); // devA ranks first

  // Stage 2: Evidence coverage when scores equal
  const devC1 = { id: 'c1', calculatedScore: 88, evidenceCoverage: 0.95, verified: true };
  const devC2 = { id: 'c2', calculatedScore: 88, evidenceCoverage: 0.80, verified: true };
  assert.ok(deterministicComparator(devC1, devC2) < 0); // devC1 ranks first

  // Stage 3: Verification status when score and coverage equal
  const devD1 = { id: 'd1', calculatedScore: 85, evidenceCoverage: 0.80, verified: true };
  const devD2 = { id: 'd2', calculatedScore: 85, evidenceCoverage: 0.80, verified: false };
  assert.ok(deterministicComparator(devD1, devD2) < 0); // devD1 ranks first

  // Stage 4: Stable ID hash
  const devE1 = { id: 'alpha', calculatedScore: 85, evidenceCoverage: 0.80, verified: true };
  const devE2 = { id: 'beta', calculatedScore: 85, evidenceCoverage: 0.80, verified: true };
  assert.ok(deterministicComparator(devE1, devE2) < 0); // 'alpha' < 'beta'
});

test('calculateScopeRanks: computes Global and distinct Country ranks', () => {
  const testDevs = [
    { id: '1', calculatedScore: 95, country: 'India', evidenceCoverage: 0.9, verified: true },
    { id: '2', calculatedScore: 94, country: 'United States', evidenceCoverage: 0.9, verified: true },
    { id: '3', calculatedScore: 90, country: 'India', evidenceCoverage: 0.9, verified: true }
  ];

  const ranked = calculateScopeRanks(testDevs, { scope: 'GLOBAL' });
  assert.equal(ranked[0].globalRank, 1);
  assert.equal(ranked[0].countryRank, 1); // 1st in India
  assert.equal(ranked[1].globalRank, 2);
  assert.equal(ranked[1].countryRank, 1); // 1st in US
  assert.equal(ranked[2].globalRank, 3);
  assert.equal(ranked[2].countryRank, 2); // 2nd in India
});

test('filterAndRankDevelopers: filters by country and search query', () => {
  const indiaDevs = filterAndRankDevelopers(SEED_DEVELOPERS, {
    country: 'India'
  });
  assert.ok(indiaDevs.length > 0);
  assert.ok(indiaDevs.every(d => d.country === 'India'));

  const searchDevs = filterAndRankDevelopers(SEED_DEVELOPERS, {
    searchQuery: 'Alex'
  });
  assert.ok(searchDevs.length >= 1);
  assert.equal(searchDevs[0].username, 'alexm');
});
