/**
 * Rankora Leaderboard & Ranking System Constants
 * Algorithm Version: v1.2.0
 */

export const ALGORITHM_VERSION = 'v1.2.0';
export const ALGORITHM_LAST_UPDATED = '2026-10-15T00:00:00Z';

export const RANKING_SCOPES = [
  { id: 'global', label: 'Global', description: 'Worldwide ranking across all verified domains' },
  { id: 'country', label: 'Country', description: 'Rankings scoped to your verified home country' },
  { id: 'skill', label: 'Skill Track', description: 'Domain-specific evidence rankings' },
  { id: 'league', label: 'Competitive League', description: 'Tiered peer benchmarks based on demonstrated capability' },
];

export const SKILL_CATEGORIES = [
  { id: 'overall', label: 'Overall', icon: '🏆', description: 'Synthesized multidimensional engineering signal' },
  { id: 'frontend', label: 'Frontend', icon: '🎨', description: 'UI Architecture, React/Next.js, web performance, CSS' },
  { id: 'backend', label: 'Backend', icon: '⚙️', description: 'Distributed systems, Go/Rust/Java/Python, API architecture' },
  { id: 'fullstack', label: 'Full Stack', icon: '⚡', description: 'End-to-end web architectures, full product delivery' },
  { id: 'ai_ml', label: 'AI / ML', icon: '🧠', description: 'LLMs, PyTorch, model fine-tuning, inference infrastructure' },
  { id: 'data_eng', label: 'Data Engineering', icon: '📊', description: 'Streaming pipelines, Kafka, Spark, DB internals' },
  { id: 'devops', label: 'DevOps / Cloud', icon: '☁️', description: 'Kubernetes, Terraform, CI/CD, cloud reliability' },
  { id: 'mobile', label: 'Mobile Development', icon: '📱', description: 'React Native, Flutter, Swift/Kotlin native craft' },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: '🛡️', description: 'Application security, penetration testing, crypto' },
  { id: 'problem_solving', label: 'Problem Solving', icon: '🧩', description: 'Data structures, algorithms, competitive programming' },
];

export const SUPPORTED_COUNTRIES = [
  { id: 'all', name: 'Global', flag: '🌍', code: 'ALL' },
  { id: 'India', name: 'India', flag: '🇮🇳', code: 'IN' },
  { id: 'United States', name: 'United States', flag: '🇺🇸', code: 'US' },
  { id: 'United Kingdom', name: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
  { id: 'Germany', name: 'Germany', flag: '🇩🇪', code: 'DE' },
  { id: 'Canada', name: 'Canada', flag: '🇨🇦', code: 'CA' },
  { id: 'Japan', name: 'Japan', flag: '🇯🇵', code: 'JP' },
  { id: 'France', name: 'France', flag: '🇫🇷', code: 'FR' },
  { id: 'Poland', name: 'Poland', flag: '🇵🇱', code: 'PL' },
  { id: 'South Korea', name: 'South Korea', flag: '🇰🇷', code: 'KR' },
  { id: 'Singapore', name: 'Singapore', flag: '🇸🇬', code: 'SG' },
  { id: 'Brazil', name: 'Brazil', flag: '🇧🇷', code: 'BR' },
  { id: 'Australia', name: 'Australia', flag: '🇦🇺', code: 'AU' },
  { id: 'China', name: 'China', flag: '🇨🇳', code: 'CN' },
];

export const LEAGUE_TIERS = {
  Elite: {
    id: 'Elite',
    name: 'Elite League',
    shortName: 'Elite',
    badge: '👑 Elite',
    color: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    minScore: 900,
    maxScore: 1000,
    minCoverage: 80,
    description: 'Top 1% developers demonstrating mastery across problem-solving, architectural scale, and high-impact engineering.',
    requirements: 'Score >= 900 and at least 4 verified dimensions with high confidence.',
    nextTier: null
  },
  Advanced: {
    id: 'Advanced',
    name: 'Advanced League',
    shortName: 'Advanced',
    badge: '💎 Advanced',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    minScore: 750,
    maxScore: 899,
    minCoverage: 60,
    description: 'Senior engineers with consistent track record in high-complexity codebases, system design, and verified challenges.',
    requirements: 'Score >= 750 and at least 3 verified dimensions.',
    nextTier: 'Elite'
  },
  Rising: {
    id: 'Rising',
    name: 'Rising League',
    shortName: 'Rising',
    badge: '⭐ Rising',
    color: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    minScore: 550,
    maxScore: 749,
    minCoverage: 40,
    description: 'Active contributors and engineers rapidly gaining velocity and building demonstrated proof.',
    requirements: 'Score >= 550 and at least 2 verified dimensions.',
    nextTier: 'Advanced'
  },
  Rookie: {
    id: 'Rookie',
    name: 'Rookie League',
    shortName: 'Rookie',
    badge: '🌱 Rookie',
    color: '#64748B',
    bgColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    minScore: 0,
    maxScore: 549,
    minCoverage: 0,
    description: 'Engineers establishing initial verified benchmarks, assessments, and public contributions.',
    requirements: 'Open to all developers connecting their initial evidence.',
    nextTier: 'Rising'
  }
};

export const INITIAL_COMPONENT_WEIGHTS = {
  problemSolving: {
    key: 'problemSolving',
    label: 'Problem-Solving',
    weight: 0.30,
    description: 'Algorithmic efficiency, contest results, verified DSA solutions (LeetCode, Codeforces, HackerRank)',
    icon: '🧩',
    evidenceSources: ['LeetCode / Codeforces assessments', 'Contest percentiles', 'DSA challenge benchmarks']
  },
  engineeringQuality: {
    key: 'engineeringQuality',
    label: 'Engineering Quality',
    weight: 0.25,
    description: 'Test coverage, CI/CD pipelines, clean architecture, documentation, and maintainability',
    icon: '⚙️',
    evidenceSources: ['Automated test suites', 'SonarQube / CodeClimate reports', 'Documentation completeness']
  },
  technicalSkills: {
    key: 'technicalSkills',
    label: 'Technical Skill Depth',
    weight: 0.20,
    description: 'Domain-specific competency (Backend, Frontend, AI/ML, Cloud) demonstrated in production-like projects',
    icon: '💻',
    evidenceSources: ['Production repo commits', 'Full-stack system complexity', 'API & architecture audits']
  },
  collaboration: {
    key: 'collaboration',
    label: 'Collaboration & Impact',
    weight: 0.15,
    description: 'Multi-author repositories, peer code reviews, open-source pull requests, mentorship signals',
    icon: '🤝',
    evidenceSources: ['Peer review activity', 'Merged open-source PRs', 'Team repository contributions']
  },
  growthConsistency: {
    key: 'growthConsistency',
    label: 'Growth Velocity',
    weight: 0.10,
    description: '8-week commit consistency, learning rate, and demonstrated improvement over time',
    icon: '📈',
    evidenceSources: ['8-week commit cadence', 'Skill level upgrades', 'Assessment retake progression']
  }
};

export const COMPONENT_DEFINITIONS = INITIAL_COMPONENT_WEIGHTS;

