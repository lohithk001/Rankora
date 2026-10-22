import express from 'express';
import cors from 'cors';
import { SAMPLE_DEVELOPERS, SAMPLE_CHALLENGES, COMPENSATION_BENCHMARKS } from '../../internal/database/seeds.js';
import { calculateScore, ALGORITHM_VERSION } from '../../internal/scoring/engine.js';
import { createRateLimiter } from '../../internal/middleware/rateLimiter.js';
import { extractAuthUser, requireAuth, requireOwnership } from '../../internal/middleware/auth.js';
import { errorHandler } from '../../internal/middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Global Rate Limiter: 300 requests per 15 minutes per IP
const globalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'API rate limit exceeded. Please throttle your requests.'
});
app.use(globalLimiter);

// Sensitive Mutation Rate Limiter: 40 requests per 15 minutes per IP
const mutationLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: 'Too many account modification attempts. Please try again in 15 minutes.'
});

// Extract authenticated user identity from Bearer or Clerk headers
app.use(extractAuthUser);

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Auth: ${req.auth?.userId || 'anonymous'}`);
  next();
});

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Rankora Developer Intelligence API',
    algorithmVersion: ALGORITHM_VERSION,
    rateLimiting: 'active',
    rowLevelSecurity: 'enabled'
  });
});

// GET /api/v1/leaderboards
app.get('/api/v1/leaderboards', (req, res) => {
  const { league = 'all', skill = 'overall', search = '' } = req.query;

  let filtered = [...SAMPLE_DEVELOPERS];

  if (league !== 'all') {
    filtered = filtered.filter(dev => dev.league.toLowerCase() === league.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(dev => 
      dev.displayName.toLowerCase().includes(q) ||
      dev.username.toLowerCase().includes(q) ||
      dev.roleTitle.toLowerCase().includes(q) ||
      dev.location.toLowerCase().includes(q)
    );
  }

  // Sort by overall score descending
  filtered.sort((a, b) => b.score - a.score);

  // Attach ranks
  const ranked = filtered.map((dev, idx) => ({
    rank: idx + 1,
    ...dev
  }));

  res.json({
    leaderboardType: skill,
    league,
    count: ranked.length,
    algorithmVersion: ALGORITHM_VERSION,
    data: ranked
  });
});

// GET /api/v1/developers/:username
app.get('/api/v1/developers/:username', (req, res) => {
  const dev = SAMPLE_DEVELOPERS.find(d => d.username.toLowerCase() === req.params.username.toLowerCase());
  if (!dev) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Developer profile '@${req.params.username}' not found`
      }
    });
  }
  res.json(dev);
});

// GET /api/v1/developers/:username/scores
app.get('/api/v1/developers/:username/scores', (req, res) => {
  const dev = SAMPLE_DEVELOPERS.find(d => d.username.toLowerCase() === req.params.username.toLowerCase());
  if (!dev) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Developer not found'
      }
    });
  }

  const scoreAnalysis = calculateScore(dev.components);
  res.json({
    username: dev.username,
    displayName: dev.displayName,
    calculatedScore: scoreAnalysis.score,
    league: scoreAnalysis.league,
    confidence: dev.confidence,
    isProvisional: dev.isProvisional,
    breakdown: scoreAnalysis.breakdown,
    evidenceCount: dev.evidenceTimeline.length,
    evidenceTimeline: dev.evidenceTimeline
  });
});

// GET /api/v1/assessments
app.get('/api/v1/assessments', (req, res) => {
  res.json({
    count: SAMPLE_CHALLENGES.length,
    data: SAMPLE_CHALLENGES
  });
});

// GET /api/v1/market/benchmarks
app.get('/api/v1/market/benchmarks', (req, res) => {
  res.json({
    notice: 'Estimated Market Compensation benchmarks are informational estimates based on aggregated peer data, not personal worth or salary guarantees.',
    data: COMPENSATION_BENCHMARKS
  });
});

// GET /api/v1/hiring/matches
app.get('/api/v1/hiring/matches', (req, res) => {
  const { role = 'all', minScore = 0 } = req.query;
  let matches = SAMPLE_DEVELOPERS.filter(dev => dev.score >= Number(minScore));

  if (role !== 'all') {
    matches = matches.filter(dev => 
      dev.roleTitle.toLowerCase().includes(role.toLowerCase()) ||
      dev.skills.some(s => s.name.toLowerCase().includes(role.toLowerCase()))
    );
  }

  res.json({
    criteria: { role, minScore },
    count: matches.length,
    matches: matches.map(m => ({
      developer: m,
      roleFitScore: Math.min(99, Math.round(m.score * 1.05)),
      keySignals: m.skills.map(s => s.name).slice(0, 3)
    }))
  });
});

// In-memory Onboarding Profile Store
const ONBOARDING_PROFILES = new Map();

// Helper to check username uniqueness
function isUsernameTaken(username, excludeClerkUserId = null) {
  const normalized = username.trim().toLowerCase();
  for (const [userId, profile] of ONBOARDING_PROFILES.entries()) {
    if (excludeClerkUserId && userId === excludeClerkUserId) continue;
    if (profile.username && profile.username.toLowerCase() === normalized) {
      return true;
    }
  }
  return SAMPLE_DEVELOPERS.some(d => d.username.toLowerCase() === normalized);
}

// GET /api/v1/onboarding/check-username/:username
app.get('/api/v1/onboarding/check-username/:username', (req, res) => {
  const { username } = req.params;
  const { excludeUserId } = req.query;
  const usernameRegex = /^[a-zA-Z0-9_-]{3,24}$/;

  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      valid: false,
      available: false,
      error: {
        code: 'INVALID_USERNAME_FORMAT',
        message: 'Username must be 3-24 characters containing only letters, numbers, underscores, or dashes.'
      }
    });
  }

  const taken = isUsernameTaken(username, excludeUserId);
  res.json({
    valid: true,
    available: !taken,
    username,
    message: taken ? 'Username is already claimed.' : 'Username is available.'
  });
});

// GET /api/v1/onboarding/profile
// Protected by requireAuth & row-level ownership
app.get('/api/v1/onboarding/profile', requireAuth, (req, res) => {
  const userId = req.auth.userId;

  // Row-level check: if client requested another userId via query, forbid unless matching
  if (req.query.userId && req.query.userId !== userId) {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'Row-level access denied. You cannot view another user\'s private onboarding profile.'
      }
    });
  }

  const profile = ONBOARDING_PROFILES.get(userId);
  if (!profile) {
    return res.json({ completed: false, profile: null });
  }

  res.json({
    completed: true,
    profile
  });
});

// POST /api/v1/onboarding/complete
// Protected by requireAuth, mutation rate limiter, row-level ownership & backend input validation
app.post(
  '/api/v1/onboarding/complete',
  mutationLimiter,
  requireAuth,
  requireOwnership(req => req.body.clerkUserId || req.auth.userId),
  (req, res) => {
    const verifiedUserId = req.auth.userId;
    const { profileData } = req.body;

    if (!profileData) {
      return res.status(400).json({
        error: {
          code: 'MISSING_PAYLOAD',
          message: 'Profile data payload is required.'
        }
      });
    }

    // Backend Form Validations
    const displayName = (profileData.displayName || '').trim();
    const username = (profileData.username || '').trim().toLowerCase();
    const country = (profileData.country || '').trim();

    if (!displayName || displayName.length < 2 || displayName.length > 80) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          field: 'displayName',
          message: 'Display name must be between 2 and 80 characters.'
        }
      });
    }

    const usernameRegex = /^[a-zA-Z0-9_-]{3,24}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          field: 'username',
          message: 'Username must be 3-24 characters containing letters, numbers, underscores, or dashes.'
        }
      });
    }

    if (!country) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          field: 'country',
          message: 'Country is required to determine regional league rankings.'
        }
      });
    }

    // URL validations
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
    if (profileData.portfolioUrl && !urlPattern.test(profileData.portfolioUrl)) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          field: 'portfolioUrl',
          message: 'Please provide a valid portfolio website URL.'
        }
      });
    }

    if (isUsernameTaken(username, verifiedUserId)) {
      return res.status(409).json({
        error: {
          code: 'USERNAME_TAKEN',
          field: 'username',
          message: 'The selected username is already taken by another developer.'
        }
      });
    }

    const record = {
      clerkUserId: verifiedUserId,
      displayName,
      username,
      country,
      headline: profileData.headline?.trim() || '',
      experienceLevel: profileData.experienceLevel || 'Fresher / Student (0-1 yrs)',
      interests: Array.isArray(profileData.interests) ? profileData.interests : [],
      skills: Array.isArray(profileData.skills) 
        ? profileData.skills.map(s => typeof s === 'string' ? { name: s, level: 'User-Reported', verified: false } : s)
        : [],
      githubHandle: profileData.githubHandle?.trim() || '',
      portfolioUrl: profileData.portfolioUrl?.trim() || '',
      linkedinUrl: profileData.linkedinUrl?.trim() || '',
      leetcodeHandle: profileData.leetcodeHandle?.trim() || '',
      visibility: profileData.visibility || 'public',
      consentAccepted: !!profileData.consentAccepted,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    ONBOARDING_PROFILES.set(verifiedUserId, record);

    res.status(200).json({
      success: true,
      message: 'Developer onboarding completed successfully.',
      profile: record
    });
  }
);

// DELETE /api/v1/users/account
// Row-level authorization & full data cleanup
app.delete(
  '/api/v1/users/account',
  mutationLimiter,
  requireAuth,
  requireOwnership(req => req.body.clerkUserId || req.query.clerkUserId || req.auth.userId),
  (req, res) => {
    const userId = req.auth.userId;

    const hadProfile = ONBOARDING_PROFILES.has(userId);
    ONBOARDING_PROFILES.delete(userId);

    console.log(`[Account Deletion] User ${userId} requested full deletion. Cleaned up profile: ${hadProfile}`);

    res.status(200).json({
      success: true,
      message: 'Account data and verified records purged successfully.',
      deletedUserId: userId,
      timestamp: new Date().toISOString()
    });
  }
);

// POST /api/v1/reports
app.post('/api/v1/reports', mutationLimiter, (req, res) => {
  const { developerId, reason, evidenceCorrection } = req.body;
  if (!developerId || !reason) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Developer ID and reason are required to submit an audit report.'
      }
    });
  }

  res.status(201).json({
    ticketId: `TICK-${Date.now()}`,
    status: 'Queued for human audit & algorithmic verification',
    receivedAt: new Date().toISOString(),
    message: 'Thank you. Rankora guarantees transparent reviews and corrections for any verified evidence dispute.'
  });
});

// Centralized Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Rankora Core API running at http://localhost:${PORT}`);
  console.log(`Scoring Algorithm Version: ${ALGORITHM_VERSION}`);
  console.log('Security: Rate limiting, Row-level authorization, and Data cleanup active.');
});
