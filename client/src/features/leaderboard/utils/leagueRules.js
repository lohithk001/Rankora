import { LEAGUE_TIERS } from '../constants/leaderboardConstants.js';

/**
 * Normalizes input score to 0-1000 platform scale
 */
function normalizeScore(score) {
  const num = Number(score) || 0;
  // If score is passed on a 0-100 scale (e.g. 85.5), scale up to 0-1000 (855)
  return num <= 100 ? num * 10 : num;
}

/**
 * Normalizes input coverage to 0-100 percentage scale
 */
function normalizeCoverage(coverage) {
  const num = Number(coverage) || 0;
  // If coverage is passed as 0-1 fraction (e.g. 0.85), scale to 85%
  return num <= 1 ? num * 100 : num;
}

/**
 * Assigns a competitive league tier based on demonstrated score and evidence coverage
 * Accepts both 0-100 and 0-1000 score scales, and both 0-1 and 0-100 coverage scales.
 * @param {number} score - Overall score
 * @param {number} coverage - Evidence coverage
 * @returns {string} League tier name ('Rookie' | 'Rising' | 'Advanced' | 'Elite')
 */
export function assignLeague(score, coverage = 100) {
  const safeScore = normalizeScore(score);
  const safeCoverage = normalizeCoverage(coverage);

  if (safeScore >= LEAGUE_TIERS.Elite.minScore && safeCoverage >= LEAGUE_TIERS.Elite.minCoverage) {
    return 'Elite';
  }
  if (safeScore >= LEAGUE_TIERS.Advanced.minScore && safeCoverage >= LEAGUE_TIERS.Advanced.minCoverage) {
    return 'Advanced';
  }
  if (safeScore >= LEAGUE_TIERS.Rising.minScore && safeCoverage >= LEAGUE_TIERS.Rising.minCoverage) {
    return 'Rising';
  }
  return 'Rookie';
}

/**
 * Computes progress toward the next league tier
 * @param {number} score 
 * @param {number} coverage 
 * @returns {object} Progress breakdown and requirements
 */
export function getLeagueProgress(score, coverage = 100) {
  const normScore = normalizeScore(score);
  const normCoverage = normalizeCoverage(coverage);

  const currentTier = assignLeague(normScore, normCoverage);
  const tierConfig = LEAGUE_TIERS[currentTier];

  if (!tierConfig.nextTier) {
    return {
      currentLeague: currentTier,
      currentTier,
      nextLeague: null,
      nextTier: null,
      progressPercent: 100,
      progressPct: 100,
      pointsNeeded: 0,
      coverageNeeded: 0,
      coverageNeededPct: 0,
      message: 'Highest competitive tier reached! Maintain verified evidence to retain Elite status.'
    };
  }

  const nextTierConfig = LEAGUE_TIERS[tierConfig.nextTier];
  const pointsRange = nextTierConfig.minScore - tierConfig.minScore;
  const pointsEarned = Math.max(0, normScore - tierConfig.minScore);
  const progressPercent = Math.min(100, Math.round((pointsEarned / pointsRange) * 100));
  
  // Points needed on 0-100 scale (or 0-1000 if input was > 100)
  const isHundredScale = Number(score) <= 100;
  const rawPointsNeeded = Math.max(0, nextTierConfig.minScore - normScore);
  const pointsNeeded = isHundredScale ? Math.round((rawPointsNeeded / 10) * 10) / 10 : rawPointsNeeded;
  const coverageNeeded = Math.max(0, nextTierConfig.minCoverage - normCoverage);

  return {
    currentLeague: currentTier,
    currentTier,
    nextLeague: tierConfig.nextTier,
    nextTier: tierConfig.nextTier,
    progressPercent,
    progressPct: progressPercent,
    pointsNeeded,
    coverageNeeded,
    coverageNeededPct: coverageNeeded,
    message: pointsNeeded > 0
      ? `+${pointsNeeded} pts and ${coverageNeeded > 0 ? `${coverageNeeded}% more evidence ` : ''}to promote to ${tierConfig.nextTier}`
      : `Ready for promotion review to ${tierConfig.nextTier}`
  };
}
