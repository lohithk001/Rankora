import { ALGORITHM_VERSION, INITIAL_COMPONENT_WEIGHTS } from '../constants/leaderboardConstants.js';
import { assignLeague } from './leagueRules.js';

/**
 * Normalizes component keys to support both 'growth' and 'growthConsistency'
 */
function normalizeComponents(components = {}) {
  const safe = { ...components };
  if (safe.growth !== undefined && safe.growthConsistency === undefined) {
    safe.growthConsistency = safe.growth;
  } else if (safe.growthConsistency !== undefined && safe.growth === undefined) {
    safe.growth = safe.growthConsistency;
  }
  return safe;
}

/**
 * Calculates a verified, explainable developer score
 * @param {object} components - 5 core dimensions: problemSolving, engineeringQuality, technicalSkills, collaboration, growthConsistency (0-100 each)
 * @param {object} customWeights - optional overrides for weights
 * @returns {object} calculation results, confidence, league, and dimensional breakdown
 */
export function calculateOverallScore(components = {}, customWeights = null) {
  const safeComponents = normalizeComponents(components);
  const weightsConfig = customWeights || INITIAL_COMPONENT_WEIGHTS;

  // Identify observed dimensions (null or undefined = unobserved, NOT zero)
  const observedKeys = Object.keys(INITIAL_COMPONENT_WEIGHTS).filter(key => {
    const val = safeComponents[key];
    return val !== null && val !== undefined && !Number.isNaN(Number(val));
  });

  const observedCount = observedKeys.length;
  const hasInsufficientEvidence = observedCount < 2;
  const isProvisional = observedCount < 3;

  // If completely unobserved or insufficient evidence
  if (hasInsufficientEvidence) {
    return {
      score: 0,
      scaledScore: 0,
      confidence: Math.round((observedCount / 5) * 100),
      isProvisional: true,
      hasInsufficientEvidence: true,
      insufficientEvidence: true,
      league: 'Rookie',
      observedCount,
      normalizedCount: observedCount,
      algorithmVersion: ALGORITHM_VERSION,
      breakdown: {},
      summary: 'Insufficient evidence to compute an objective score. Connect at least two verified sources.'
    };
  }

  // Normalize weights among observed dimensions only (avoids penalizing private/unconnected platforms)
  const totalObservedWeight = observedKeys.reduce((sum, key) => sum + (weightsConfig[key]?.weight || 0.2), 0);
  
  let rawScore = 0;
  const breakdown = {};

  observedKeys.forEach(key => {
    const rawVal = Math.max(0, Math.min(100, Number(safeComponents[key]) || 0));
    const nominalWeight = weightsConfig[key]?.weight || 0.2;
    const effectiveWeight = nominalWeight / totalObservedWeight;

    rawScore += rawVal * effectiveWeight;

    breakdown[key] = {
      label: weightsConfig[key]?.label || key,
      value: rawVal,
      nominalWeight,
      effectiveWeight: Math.round(effectiveWeight * 100) / 100,
      weightedValue: Math.round(rawVal * effectiveWeight * 10) / 10,
      isObserved: true
    };
  });

  // Mark unobserved dimensions explicitly
  Object.keys(INITIAL_COMPONENT_WEIGHTS).forEach(key => {
    if (!breakdown[key]) {
      breakdown[key] = {
        label: weightsConfig[key]?.label || key,
        value: null,
        nominalWeight: weightsConfig[key]?.weight || 0.2,
        effectiveWeight: 0,
        weightedValue: 0,
        isObserved: false
      };
    }
  });

  // Scale score to 0-1000 standard platform scale
  const scaledScore = Math.round(rawScore * 10);
  const confidence = Math.round((observedCount / 5) * 100);
  const league = assignLeague(scaledScore, confidence);

  return {
    score: Math.round(rawScore * 10) / 10,
    scaledScore,
    confidence,
    isProvisional,
    hasInsufficientEvidence: false,
    insufficientEvidence: false,
    league,
    observedCount,
    normalizedCount: observedCount,
    algorithmVersion: ALGORITHM_VERSION,
    breakdown
  };
}

/**
 * Deterministic comparator for stable, reproducible ranking:
 * 1. Primary score (descending)
 * 2. Evidence confidence / verified coverage (descending)
 * 3. Identity verification status (verified first)
 * 4. Stable deterministic user hash (reproducible tie-breaker, never random)
 */
export function deterministicComparator(a, b, scoreKey = 'calculatedScore') {
  const aScore = a[scoreKey] ?? a.calculatedScore ?? a.score ?? 0;
  const bScore = b[scoreKey] ?? b.calculatedScore ?? b.score ?? 0;

  // 1. Primary score descending
  if (bScore !== aScore) {
    return bScore - aScore;
  }

  // 2. Evidence coverage / confidence descending
  const aCoverage = a.evidenceCoverage ?? a.confidence ?? 0;
  const bCoverage = b.evidenceCoverage ?? b.confidence ?? 0;
  if (bCoverage !== aCoverage) {
    return bCoverage - aCoverage;
  }

  // 3. Verification status (verified before unverified)
  const aVerified = a.verified ? 1 : 0;
  const bVerified = b.verified ? 1 : 0;
  if (bVerified !== aVerified) {
    return bVerified - aVerified;
  }

  // 4. Stable deterministic string comparison on ID / username
  const aId = String(a.id || a.username || '');
  const bId = String(b.id || b.username || '');
  return aId.localeCompare(bId);
}

/**
 * Calculates multi-scope ranks (Global, Country, Skill Track, and League)
 * for an array of developers without mutating the inputs.
 */
export function calculateScopeRanks(developers, activeScopeContext = {}) {
  const {
    scope = 'GLOBAL',
    country = null,
    _skillCategory = 'overall',
    league = null
  } = activeScopeContext;

  // Sort globally first using deterministic tie-breaking
  const globalSorted = [...developers].sort((a, b) => deterministicComparator(a, b));

  // Compute distinct Global ranks
  const withGlobalRanks = globalSorted.map((dev, idx) => ({
    ...dev,
    globalRank: idx + 1
  }));

  // Compute Country-specific ranks per country
  const countryGroups = {};
  withGlobalRanks.forEach(dev => {
    const c = dev.country || 'Unknown';
    if (!countryGroups[c]) countryGroups[c] = [];
    countryGroups[c].push(dev);
  });

  Object.values(countryGroups).forEach(group => {
    group.sort((a, b) => deterministicComparator(a, b));
    group.forEach((dev, idx) => {
      dev.countryRank = idx + 1;
    });
  });

  // Compute League-specific ranks per league
  const leagueGroups = {};
  withGlobalRanks.forEach(dev => {
    const l = dev.league || assignLeague(dev.calculatedScore, dev.evidenceCoverage);
    if (!leagueGroups[l]) leagueGroups[l] = [];
    leagueGroups[l].push(dev);
  });

  Object.values(leagueGroups).forEach(group => {
    group.sort((a, b) => deterministicComparator(a, b));
    group.forEach((dev, idx) => {
      dev.leagueRank = idx + 1;
    });
  });

  // Assign activeRank based on the selected scope
  return withGlobalRanks.map(dev => {
    let activeRank = dev.globalRank;
    if (scope === 'COUNTRY' || (country && country !== 'Global')) {
      activeRank = dev.countryRank || dev.globalRank;
    } else if (scope === 'LEAGUE' || (league && league !== 'All')) {
      activeRank = dev.leagueRank || dev.globalRank;
    }

    return {
      ...dev,
      activeRank
    };
  });
}
