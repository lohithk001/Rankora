import express from 'express';
import cors from 'cors';
import { SAMPLE_DEVELOPERS, SAMPLE_CHALLENGES, COMPENSATION_BENCHMARKS } from '../../internal/database/seeds.js';
import { calculateScore, ALGORITHM_VERSION } from '../../internal/scoring/engine.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Rankora Developer Intelligence API',
    algorithmVersion: ALGORITHM_VERSION
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
    return res.status(404).json({ error: 'Developer profile not found' });
  }
  res.json(dev);
});

// GET /api/v1/developers/:username/scores
app.get('/api/v1/developers/:username/scores', (req, res) => {
  const dev = SAMPLE_DEVELOPERS.find(d => d.username.toLowerCase() === req.params.username.toLowerCase());
  if (!dev) {
    return res.status(404).json({ error: 'Developer not found' });
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
      message: 'Username must be 3-24 characters containing only letters, numbers, underscores, or dashes.'
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
app.get('/api/v1/onboarding/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  const userId = req.query.userId || (authHeader ? authHeader.replace(/^Bearer\s+/, '') : null);

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required. Missing user identity.' });
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
app.post('/api/v1/onboarding/complete', (req, res) => {
  const authHeader = req.headers.authorization;
  const { clerkUserId, profileData } = req.body;
  const verifiedUserId = clerkUserId || (authHeader ? authHeader.replace(/^Bearer\s+/, '') : null);

  if (!verifiedUserId) {
    return res.status(401).json({ error: 'Authorization failed: Missing verified authenticated user ID.' });
  }

  if (!profileData || !profileData.displayName || !profileData.username || !profileData.country) {
    return res.status(400).json({ error: 'Missing required onboarding fields (displayName, username, country).' });
  }

  if (isUsernameTaken(profileData.username, verifiedUserId)) {
    return res.status(409).json({ error: 'The selected username is already taken by another developer.' });
  }

  const record = {
    clerkUserId: verifiedUserId,
    displayName: profileData.displayName.trim(),
    username: profileData.username.trim().toLowerCase(),
    country: profileData.country.trim(),
    headline: profileData.headline?.trim() || '',
    experienceLevel: profileData.experienceLevel || 'Fresher / Student (0-1 yrs)',
    interests: Array.isArray(profileData.interests) ? profileData.interests : [],
    skills: Array.isArray(profileData.skills) ? profileData.skills.map(s => typeof s === 'string' ? { name: s, level: 'User-Reported', verified: false } : s) : [],
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
});

// POST /api/v1/reports
app.post('/api/v1/reports', (req, res) => {
  const { developerId, reason, evidenceCorrection } = req.body;
  res.status(201).json({
    ticketId: `TICK-${Date.now()}`,
    status: 'Queued for human audit & algorithmic verification',
    receivedAt: new Date().toISOString(),
    message: 'Thank you. Rankora guarantees transparent reviews and corrections for any verified evidence dispute.'
  });
});

app.listen(PORT, () => {
  console.log(`Rankora Core API running at http://localhost:${PORT}`);
  console.log(`Scoring Algorithm Version: ${ALGORITHM_VERSION}`);
});
