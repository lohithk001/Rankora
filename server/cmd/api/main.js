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
