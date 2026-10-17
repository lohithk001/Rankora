/**
 * Rankora Leaderboard API & Data Service
 * 
 * Provides production-ready API client integration with an offline-resilient
 * deterministic fallback engine for the developer leaderboard.
 */

import { 
  ALGORITHM_VERSION, 
  INITIAL_COMPONENT_WEIGHTS,
  RANKING_SCOPES,
  SKILL_CATEGORIES
} from '../constants/leaderboardConstants.js';
import { assignLeague, getLeagueProgress } from '../utils/leagueRules.js';
import { calculateOverallScore, calculateScopeRanks, deterministicComparator } from '../utils/rankingEngine.js';

/**
 * Rich fictional demo dataset explicitly badged as demo data.
 * All developers have complete 5-dimension breakdowns, skill category scores,
 * evidence metrics, and verified credentials.
 */
export const SEED_DEVELOPERS = [
  {
    id: 'dev-1',
    username: 'alexm',
    displayName: 'Alex Mercer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    country: 'United States',
    countryCode: 'US',
    countryFlag: '🇺🇸',
    title: 'Distributed Systems & Cloud Architect',
    verified: true,
    evidenceCoverage: 0.94,
    components: {
      problemSolving: 98,
      engineeringQuality: 96,
      technicalSkills: 95,
      collaboration: 92,
      growth: 90
    },
    skillScores: {
      overall: 95.3,
      frontend: 84,
      backend: 98,
      fullstack: 94,
      aiml: 88,
      dataEngineering: 96,
      devops: 97,
      mobile: null,
      cybersecurity: 91,
      problemSolving: 98
    },
    previousGlobalRank: 1,
    recentGrowthPct: 4.8,
    verifiedBadges: ['Distributed Systems', 'Go / Kubernetes', 'PostgreSQL Internals'],
    isCurrentUser: false,
    isDemoData: true
  },
  {
    id: 'dev-2',
    username: 'priyas',
    displayName: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    country: 'India',
    countryCode: 'IN',
    countryFlag: '🇮🇳',
    title: 'Principal AI / LLM Systems Engineer',
    verified: true,
    evidenceCoverage: 0.96,
    components: {
      problemSolving: 96,
      engineeringQuality: 94,
      technicalSkills: 97,
      collaboration: 90,
      growth: 95
    },
    skillScores: {
      overall: 94.8,
      frontend: 81,
      backend: 95,
      fullstack: 90,
      aiml: 99,
      dataEngineering: 97,
      devops: 92,
      mobile: null,
      cybersecurity: 89,
      problemSolving: 96
    },
    previousGlobalRank: 3,
    recentGrowthPct: 7.2,
    verifiedBadges: ['Deep Learning', 'PyTorch / CUDA', 'Model Optimization'],
    isCurrentUser: false,
    isDemoData: true
  },
  {
    id: 'dev-3',
    username: 'kenjit',
    displayName: 'Kenji Takahashi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    country: 'Japan',
    countryCode: 'JP',
    countryFlag: '🇯🇵',
    title: 'Compilers & High-Performance Rust Engineer',
    verified: true,
    evidenceCoverage: 0.91,
    components: {
      problemSolving: 97,
      engineeringQuality: 95,
      technicalSkills: 94,
      collaboration: 88,
      growth: 91
    },
    skillScores: {
      overall: 94.1,
      frontend: 72,
      backend: 96,
      fullstack: 82,
      aiml: 85,
      dataEngineering: 89,
      devops: 91,
      mobile: null,
      cybersecurity: 95,
      problemSolving: 97
    },
    previousGlobalRank: 2,
    recentGrowthPct: 2.1,
    verifiedBadges: ['Rust Core Contributor', 'WASM Runtimes', 'Algorithms Master'],
    isCurrentUser: false,
    isDemoData: true
  },
  {
    id: 'dev-4',
    username: 'elenar',
    displayName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    country: 'Germany',
    countryCode: 'DE',
    countryFlag: '🇩🇪',
    title: 'Frontend Platform & Web Performance Lead',
    verified: true,
    evidenceCoverage: 0.89,
    components: {
      problemSolving: 89,
      engineeringQuality: 96,
      technicalSkills: 94,
      collaboration: 93,
      growth: 88
    },
    skillScores: {
      overall: 92.2,
      frontend: 99,
      backend: 86,
      fullstack: 94,
      aiml: 75,
      dataEngineering: 78,
      devops: 88,
      mobile: 90,
      cybersecurity: 82,
      problemSolving: 89
    },
    previousGlobalRank: 5,
    recentGrowthPct: 5.4,
    verifiedBadges: ['Web Standards', 'TypeScript Maestro', 'Micro-frontends'],
    isCurrentUser: false,
    isDemoData: true
  },
  {
    id: 'dev-5',
    username: 'marcusb',
    displayName: 'Marcus Brody',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    country: 'United Kingdom',
    countryCode: 'GB',
    countryFlag: '🇬🇧',
    title: 'Cloud Security & Infrastructure Engineer',
    verified: true,
    evidenceCoverage: 0.88,
    components: {
      problemSolving: 91,
      engineeringQuality: 92,
      technicalSkills: 91,
      collaboration: 89,
      growth: 86
    },
    skillScores: {
      overall: 90.6,
      frontend: 70,
      backend: 92,
      fullstack: 80,
      aiml: 74,
      dataEngineering: 85,
      devops: 96,
      mobile: null,
      cybersecurity: 98,
      problemSolving: 91
    },
    previousGlobalRank: 4,
    recentGrowthPct: -1.2,
    verifiedBadges: ['Zero-Trust SecOps', 'Terraform Specialist', 'AWS Solutions Architect'],
    isCurrentUser: false,
    isDemoData: true
  },
  {
    id: 'dev-6',
    username: 'sophiac',
    displayName: 'Sophia Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    country: 'Canada',
    countryCode: 'CA',
    countryFlag: '🇨🇦',
    title: 'Full Stack Engineering Lead',
    verified: true,
    evidenceCoverage: 0.85,
    components: {
      problemSolving: 88,
      engineeringQuality: 90,
      technicalSkills: 92,
      collaboration: 91,
      growth: 89
    },
    skillScores: {
      overall: 89.8,
      frontend: 94,
      backend: 92,
      fullstack: 97,
      aiml: 80,
      dataEngineering: 84,
      devops: 87,
      mobile: 86,
      cybersecurity: 84,
      problemSolving: 88
    },
    previousGlobalRank: 7,
    recentGrowthPct: 4.1,
    verifiedBadges: ['Next.js Architecture', 'GraphQL Federation', 'Node.js Core'],
    isCurrentUser: false,
    isDemoData: true
  },
  {
    id: 'dev-7',
    username: 'lohitk',
    displayName: 'Lohit K. (You)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    country: 'India',
    countryCode: 'IN',
    countryFlag: '🇮🇳',
    title: 'Full Stack & Applied AI Developer',
    verified: true,
    evidenceCoverage: 0.82,
    components: {
      problemSolving: 86,
      engineeringQuality: 88,
      technicalSkills: 89,
      collaboration: 84,
      growth: 92
    },
    skillScores: {
      overall: 87.2,
      frontend: 91,
      backend: 89,
      fullstack: 92,
      aiml: 85,
      dataEngineering: 82,
      devops: 84,
      mobile: 78,
      cybersecurity: 80,
      problemSolving: 86
    },
    previousGlobalRank: 9,
    recentGrowthPct: 8.6,
    verifiedBadges: ['React & Tailwind', 'FastAPI & Go', 'Vector Search'],
    isCurrentUser: true,
    isDemoData: true
  },
  {
    id: 'dev-8',
    username: 'mateo_s',
    displayName: 'Mateo Silva',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    country: 'Brazil',
    countryCode: 'BR',
    countryFlag: '🇧🇷',
    title: 'Mobile Architecture & React Native Lead',
    verified: true,
    evidenceCoverage: 0.80,
    components: {
      problemSolving: 84,
      engineeringQuality: 86,
      technicalSkills: 88,
      collaboration: 85,
      growth: 87
    },
    skillScores: {
      overall: 85.8,
      frontend: 88,
      backend: 82,
      fullstack: 84,
      aiml: 71,
      dataEngineering: 74,
      devops: 81,
      mobile: 98,
      cybersecurity: 79,
      problemSolving: 84
    },
    previousGlobalRank: 8,
    recentGrowthPct: 1.5,
    verifiedBadges: ['iOS Swift', 'React Native TurboModules', 'Kotlin Android'],
    isCurrentUser: false,
    isDemoData: true
  },
  {
    id: 'dev-9',
    username: 'charlotte_w',
    displayName: 'Charlotte Weber',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    country: 'Germany',
    countryCode: 'DE',
    countryFlag: '🇩🇪',
    title: 'Data Platform Engineer',
    verified: false,
    evidenceCoverage: 0.76,
    components: {
      problemSolving: 83,
      engineeringQuality: 84,
      technicalSkills: 86,
      collaboration: 80,
      growth: 82
    },
    skillScores: {
      overall: 83.5,
      frontend: 68,
      backend: 85,
      fullstack: 77,
      aiml: 83,
      dataEngineering: 94,
      devops: 86,
      mobile: null,
      cybersecurity: 78,
      problemSolving: 83
    },
    previousGlobalRank: 10,
    recentGrowthPct: 3.2,
    verifiedBadges: ['Apache Spark', 'Kafka Streaming', 'Snowflake'],
    isCurrentUser: false,
    isDemoData: true
  },
  {
    id: 'dev-10',
    username: 'aravindn',
    displayName: 'Aravind Nair',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    country: 'India',
    countryCode: 'IN',
    countryFlag: '🇮🇳',
    title: 'Backend Systems & API Specialist',
    verified: true,
    evidenceCoverage: 0.74,
    components: {
      problemSolving: 82,
      engineeringQuality: 82,
      technicalSkills: 84,
      collaboration: 81,
      growth: 85
    },
    skillScores: {
      overall: 82.5,
      frontend: 76,
      backend: 90,
      fullstack: 84,
      aiml: 76,
      dataEngineering: 81,
      devops: 83,
      mobile: 70,
      cybersecurity: 82,
      problemSolving: 82
    },
    previousGlobalRank: 11,
    recentGrowthPct: 6.0,
    verifiedBadges: ['Go Gin Microservices', 'Redis Caching', 'PostgreSQL'],
    isCurrentUser: false,
    isDemoData: true
  },
  {
    id: 'dev-11',
    username: 'claire_d',
    displayName: 'Claire Dubois',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    country: 'France',
    countryCode: 'FR',
    countryFlag: '🇫🇷',
    title: 'Cybersecurity Threat Researcher',
    verified: true,
    evidenceCoverage: 0.72,
    components: {
      problemSolving: 85,
      engineeringQuality: 80,
      technicalSkills: 83,
      collaboration: 76,
      growth: 80
    },
    skillScores: {
      overall: 81.6,
      frontend: 62,
      backend: 82,
      fullstack: 72,
      aiml: 79,
      dataEngineering: 75,
      devops: 84,
      mobile: null,
      cybersecurity: 96,
      problemSolving: 85
    },
    previousGlobalRank: 12,
    recentGrowthPct: 0.8,
    verifiedBadges: ['Reverse Engineering', 'AppSec Auditing', 'Crypto Protocols'],
    isCurrentUser: false,
    isDemoData: true
  },
  {
    id: 'dev-12',
    username: 'liam_o',
    displayName: 'Liam O\'Connor',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    country: 'Australia',
    countryCode: 'AU',
    countryFlag: '🇦🇺',
    title: 'DevOps & Site Reliability Engineer',
    verified: false,
    evidenceCoverage: 0.68,
    components: {
      problemSolving: 79,
      engineeringQuality: 81,
      technicalSkills: 80,
      collaboration: 82,
      growth: 84
    },
    skillScores: {
      overall: 80.6,
      frontend: 65,
      backend: 80,
      fullstack: 74,
      aiml: 70,
      dataEngineering: 78,
      devops: 94,
      mobile: null,
      cybersecurity: 83,
      problemSolving: 79
    },
    previousGlobalRank: 13,
    recentGrowthPct: 3.4,
    verifiedBadges: ['Kubernetes SRE', 'Helm & ArgoCD', 'Prometheus'],
    isCurrentUser: false,
    isDemoData: true
  },
  {
    id: 'dev-13',
    username: 'yuki_s',
    displayName: 'Yuki Sato',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    country: 'Japan',
    countryCode: 'JP',
    countryFlag: '🇯🇵',
    title: 'Frontend Engineer & UI Systems Designer',
    verified: true,
    evidenceCoverage: 0.65,
    components: {
      problemSolving: 78,
      engineeringQuality: 82,
      technicalSkills: 81,
      collaboration: 83,
      growth: 79
    },
    skillScores: {
      overall: 80.2,
      frontend: 92,
      backend: 71,
      fullstack: 80,
      aiml: 65,
      dataEngineering: 69,
      devops: 75,
      mobile: 82,
      cybersecurity: 70,
      problemSolving: 78
    },
    previousGlobalRank: 15,
    recentGrowthPct: 5.1,
    verifiedBadges: ['Design Systems', 'Figma to Code', 'CSS Architecture'],
    isCurrentUser: false,
    isDemoData: true
  },
  {
    id: 'dev-14',
    username: 'anika_p',
    displayName: 'Anika Patel',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    country: 'India',
    countryCode: 'IN',
    countryFlag: '🇮🇳',
    title: 'Junior Full Stack Developer',
    verified: true,
    evidenceCoverage: 0.58,
    components: {
      problemSolving: 74,
      engineeringQuality: 75,
      technicalSkills: 76,
      collaboration: 78,
      growth: 88
    },
    skillScores: {
      overall: 76.9,
      frontend: 80,
      backend: 75,
      fullstack: 78,
      aiml: 65,
      dataEngineering: 68,
      devops: 70,
      mobile: 72,
      cybersecurity: 66,
      problemSolving: 74
    },
    previousGlobalRank: 16,
    recentGrowthPct: 12.4,
    verifiedBadges: ['React Fundamentals', 'Express.js', 'Git Workflow'],
    isCurrentUser: false,
    isDemoData: true
  },
  {
    id: 'dev-15',
    username: 'carlos_m',
    displayName: 'Carlos Mendoza',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    country: 'Brazil',
    countryCode: 'BR',
    countryFlag: '🇧🇷',
    title: 'Software Engineering Apprentice',
    verified: false,
    evidenceCoverage: 0.45,
    components: {
      problemSolving: 66,
      engineeringQuality: 68,
      technicalSkills: 70,
      collaboration: 72,
      growth: 81
    },
    skillScores: {
      overall: 70.0,
      frontend: 72,
      backend: 68,
      fullstack: 70,
      aiml: null,
      dataEngineering: null,
      devops: 62,
      mobile: 65,
      cybersecurity: 60,
      problemSolving: 66
    },
    previousGlobalRank: 17,
    recentGrowthPct: 15.0,
    verifiedBadges: ['JavaScript Basics', 'Python Scripts'],
    isCurrentUser: false,
    isDemoData: true
  },
  {
    id: 'dev-16',
    username: 'noah_k',
    displayName: 'Noah Kim',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    country: 'South Korea',
    countryCode: 'KR',
    countryFlag: '🇰🇷',
    title: 'Algorithms Competitor & Student',
    verified: false,
    evidenceCoverage: 0.35,
    components: {
      problemSolving: 85,
      engineeringQuality: 55,
      technicalSkills: 60,
      collaboration: 50,
      growth: 75
    },
    skillScores: {
      overall: 67.8,
      frontend: null,
      backend: null,
      fullstack: null,
      aiml: null,
      dataEngineering: null,
      devops: null,
      mobile: null,
      cybersecurity: null,
      problemSolving: 85
    },
    previousGlobalRank: null,
    recentGrowthPct: 0.0,
    verifiedBadges: ['Codeforces Specialist'],
    isCurrentUser: false,
    isDemoData: true
  }
];

/**
 * Pre-processes seeded developers with computed scores, leagues, and promotion metrics.
 */
function enrichDevelopers(devs) {
  return devs.map(dev => {
    // Recompute score dynamically using the engine
    const scoreCalc = calculateOverallScore(dev.components);
    const overallScore = scoreCalc.score;
    const league = assignLeague(overallScore, dev.evidenceCoverage);
    const leagueProgress = getLeagueProgress(overallScore, dev.evidenceCoverage);

    return {
      ...dev,
      calculatedScore: overallScore,
      scoreDetails: scoreCalc,
      league,
      leagueProgress
    };
  });
}

/**
 * Filter and sort developers based on parameters.
 */
export function filterAndRankDevelopers(developers, filters = {}) {
  const {
    scope = RANKING_SCOPES.GLOBAL,
    country = null,
    skillCategory = SKILL_CATEGORIES.OVERALL,
    league = null,
    searchQuery = '',
    verifiedOnly = false,
    sortField = 'rank',
    sortOrder = 'asc'
  } = filters;

  const enriched = enrichDevelopers(developers);

  // Compute scope-specific ranks
  const ranked = calculateScopeRanks(enriched, {
    scope,
    country,
    skillCategory,
    league
  });

  // Apply filters
  let filtered = ranked.filter(dev => {
    // Country filter
    if (country && country !== 'Global' && dev.country !== country) {
      return false;
    }

    // League filter
    if (league && league !== 'All' && dev.league !== league) {
      return false;
    }

    // Verified only filter
    if (verifiedOnly && !dev.verified) {
      return false;
    }

    // Skill Category specific score presence
    if (skillCategory && skillCategory !== SKILL_CATEGORIES.OVERALL) {
      const categoryScore = dev.skillScores?.[skillCategory];
      if (categoryScore === null || categoryScore === undefined) {
        return false;
      }
    }

    // Search query
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = dev.displayName?.toLowerCase().includes(q);
      const matchUser = dev.username?.toLowerCase().includes(q);
      const matchTitle = dev.title?.toLowerCase().includes(q);
      const matchCountry = dev.country?.toLowerCase().includes(q);
      const matchBadge = dev.verifiedBadges?.some(b => b.toLowerCase().includes(q));

      if (!matchName && !matchUser && !matchTitle && !matchCountry && !matchBadge) {
        return false;
      }
    }

    return true;
  });

  // Dual-direction sorting
  filtered.sort((a, b) => {
    let comparison = 0;

    if (sortField === 'rank') {
      comparison = (a.activeRank || 9999) - (b.activeRank || 9999);
    } else if (sortField === 'score') {
      const aScore = skillCategory && skillCategory !== SKILL_CATEGORIES.OVERALL 
        ? (a.skillScores?.[skillCategory] || 0) 
        : a.calculatedScore;
      const bScore = skillCategory && skillCategory !== SKILL_CATEGORIES.OVERALL 
        ? (b.skillScores?.[skillCategory] || 0) 
        : b.calculatedScore;
      comparison = bScore - aScore;
    } else if (sortField === 'growth' || sortField === 'change') {
      const aGrowth = a.recentGrowthPct || 0;
      const bGrowth = b.recentGrowthPct || 0;
      comparison = bGrowth - aGrowth;
    } else if (sortField === 'coverage') {
      comparison = (b.evidenceCoverage || 0) - (a.evidenceCoverage || 0);
    } else if (sortField === 'name') {
      comparison = a.displayName.localeCompare(b.displayName);
    } else {
      // Deterministic fallback
      comparison = deterministicComparator(a, b);
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return filtered;
}

/**
 * Service API for fetching leaderboard data with server fallback.
 */
export const leaderboardApi = {
  /**
   * Fetches leaderboard data with graceful fallback to local engine
   */
  async getLeaderboard(params = {}) {
    try {
      // Attempt real backend call if available
      const queryParams = new URLSearchParams();
      if (params.scope) queryParams.set('scope', params.scope);
      if (params.country) queryParams.set('country', params.country);
      if (params.skillCategory) queryParams.set('skillCategory', params.skillCategory);
      if (params.league) queryParams.set('league', params.league);
      if (params.q) queryParams.set('q', params.q);

      const response = await fetch(`/api/v1/leaderboards?${queryParams.toString()}`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2000) // Fast 2s timeout
      });

      if (response.ok) {
        const json = await response.json();
        return {
          data: json.developers || json.data,
          total: json.total || json.developers?.length || 0,
          isLiveServer: true,
          algorithmVersion: json.algorithmVersion || ALGORITHM_VERSION,
          lastUpdated: json.lastUpdated || new Date().toISOString()
        };
      }
    } catch {
      // Fallback silently to deterministic client engine
    }

    // Build dataset, injecting authenticated user profile if provided
    let dataset = [...SEED_DEVELOPERS];
    if (params.currentUserProfile) {
      const p = params.currentUserProfile;
      const userDev = {
        id: `user-${p.clerkUserId || p.id || 'me'}`,
        username: p.username || 'developer',
        displayName: p.displayName || p.name || 'You',
        avatar: p.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        country: p.country || (p.location ? p.location.split(',').pop()?.trim() : 'India'),
        countryCode: p.country === 'United States' ? 'US' : p.country === 'Germany' ? 'DE' : 'IN',
        countryFlag: p.country === 'United States' ? '🇺🇸' : p.country === 'Germany' ? '🇩🇪' : '🇮🇳',
        title: p.roleTitle || p.headline || 'Full Stack Engineer',
        verified: Boolean(p.onboardingCompleted || p.username),
        evidenceCoverage: p.onboardingCompleted ? 0.92 : 0.80,
        components: p.components || {
          problemSolving: 88,
          engineeringQuality: 85,
          technicalSkills: 86,
          collaboration: 82,
          growth: 90
        },
        skillScores: {
          overall: p.totalScore ? +(p.totalScore / 10).toFixed(1) : 86.4,
          frontend: 88,
          backend: 86,
          fullstack: 90,
          aiml: 76,
          problemSolving: 88
        },
        previousGlobalRank: 9,
        recentGrowthPct: 12.0,
        verifiedBadges: (p.verifiedSkills && p.verifiedSkills.map(s => s.name || s)) || ['Verified Member'],
        isCurrentUser: true,
        isDemoData: false
      };
      dataset = [userDev, ...dataset.filter(d => d.username.toLowerCase() !== userDev.username.toLowerCase())];
    }

    // Local deterministic engine execution
    const results = filterAndRankDevelopers(dataset, {
      scope: params.scope,
      country: params.country,
      skillCategory: params.skillCategory,
      league: params.league,
      searchQuery: params.q || params.searchQuery,
      verifiedOnly: params.verifiedOnly,
      sortField: params.sortField || 'rank',
      sortOrder: params.sortOrder || 'asc'
    });

    return {
      data: results,
      total: results.length,
      isLiveServer: false,
      algorithmVersion: ALGORITHM_VERSION,
      lastUpdated: new Date().toISOString(),
      isDemoData: true
    };
  },

  /**
   * Gets a specific developer's detailed score calculation and breakdown
   */
  async getDeveloperScoreBreakdown(username) {
    const dev = SEED_DEVELOPERS.find(d => d.username.toLowerCase() === username.toLowerCase());
    if (!dev) return null;

    const breakdown = calculateOverallScore(dev.components);
    const leagueProgress = getLeagueProgress(breakdown.score, dev.evidenceCoverage);

    return {
      developer: dev,
      breakdown,
      leagueProgress,
      algorithmVersion: ALGORITHM_VERSION,
      calculatedAt: new Date().toISOString(),
      weights: INITIAL_COMPONENT_WEIGHTS
    };
  }
};
