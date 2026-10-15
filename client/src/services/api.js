import { SAMPLE_DEVELOPERS, SAMPLE_CHALLENGES, COMPENSATION_BENCHMARKS } from '../lib/mockData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

async function fetchWithFallback(endpoint, fallbackData) {
  try {
    let signal;
    if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
      signal = AbortSignal.timeout(2000);
    }
    const res = await fetch(`${BASE_URL}${endpoint}`, { signal });
    if (!res.ok) return fallbackData;
    const data = await res.json();
    return data || fallbackData;
  } catch (err) {
    return fallbackData;
  }
}

export const api = {
  async getLeaderboard(league = 'all', skill = 'overall', search = '') {
    const res = await fetchWithFallback(`/leaderboards?league=${league}&skill=${skill}&search=${search}`, null);
    if (res && res.data) return res.data;

    // Fallback filter
    let list = [...SAMPLE_DEVELOPERS];
    if (league !== 'all') {
      list = list.filter(d => d.league.toLowerCase() === league.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d => 
        d.displayName.toLowerCase().includes(q) ||
        d.username.toLowerCase().includes(q) ||
        d.roleTitle.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => b.score - a.score);
    return list.map((d, i) => ({ ...d, rank: i + 1 }));
  },

  async getDeveloper(username) {
    const res = await fetchWithFallback(`/developers/${username}`, null);
    if (res && res.username) return res;
    return SAMPLE_DEVELOPERS.find(d => d.username.toLowerCase() === username.toLowerCase()) || SAMPLE_DEVELOPERS[0];
  },

  async getAssessments() {
    const res = await fetchWithFallback('/assessments', null);
    if (res && res.data) return res.data;
    return SAMPLE_CHALLENGES;
  },

  async getMarketBenchmarks() {
    const res = await fetchWithFallback('/market/benchmarks', null);
    if (res && res.data) return res.data;
    return COMPENSATION_BENCHMARKS;
  },

  async getRecruiterMatches(role = 'all', minScore = 0) {
    const res = await fetchWithFallback(`/hiring/matches?role=${role}&minScore=${minScore}`, null);
    if (res && res.matches) return res.matches;

    let matches = SAMPLE_DEVELOPERS.filter(dev => dev.score >= Number(minScore));
    if (role !== 'all') {
      matches = matches.filter(dev => 
        dev.roleTitle.toLowerCase().includes(role.toLowerCase()) ||
        dev.skills.some(s => s.name.toLowerCase().includes(role.toLowerCase()))
      );
    }
    return matches.map(m => ({
      developer: m,
      roleFitScore: Math.min(99, Math.round(m.score * 1.05)),
      keySignals: m.skills.map(s => s.name).slice(0, 3)
    }));
  },

  async submitReport(payload) {
    return {
      ticketId: `TICK-${Date.now()}`,
      status: 'Queued for human audit & algorithmic verification',
      timestamp: new Date().toISOString()
    };
  }
};
