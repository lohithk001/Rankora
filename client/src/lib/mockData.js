export const CURRENT_USER = {
  id: "usr_lohith",
  username: "lohith001",
  displayName: "Lohith K",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  roleTitle: "Full Stack Developer",
  location: "Bengaluru, India",
  headline: "Building cool things, one commit at a time. Always learning, always improving 🚀",
  globalRank: "#6,421",
  percentileBadge: "Top 1%",
  totalScore: 876,
  scoreChange: "+12%",
  experience: "Fresher",
  techStack: ["Python", "React", "Node.js", "MySQL", "+3"],
  skillsBreakdown: [
    { name: "Problem Solving", score: 92, weight: "30%", color: "mint" },
    { name: "Engineering", score: 78, weight: "25%", color: "mint" },
    { name: "Technical Skills", score: 85, weight: "20%", color: "blue" },
    { name: "Collaboration", score: 76, weight: "15%", color: "coral" },
    { name: "Growth", score: 70, weight: "10%", color: "yellow" },
  ],
  badges: [
    { id: "b1", title: "Top 1% Global", icon: "🏆", colorScheme: "amber", desc: "Ranked among top 1% developers globally across verified evaluations.", criteria: "Maintain composite signal score > 850 for 3 consecutive months.", date: "Earned Sep 2026" },
    { id: "b2", title: "Consistent Learner", icon: "🛡️", colorScheme: "teal", desc: "Maintained continuous daily problem solving and repository activity.", criteria: "Submit verified code commits or challenge solutions for 14+ straight days.", date: "Earned Aug 2026" },
    { id: "b3", title: "Project Builder", icon: "⭐", colorScheme: "orange", desc: "Authored and shipped verified real-world fullstack projects.", criteria: "Complete 3 end-to-end applications with tests and clean architecture.", date: "Earned Aug 2026" },
    { id: "b4", title: "Contributor", icon: "💜", colorScheme: "purple", desc: "Merged substantive contributions to collaborative repositories.", criteria: "At least 5 approved pull requests in verified projects.", date: "Earned Jul 2026" },
    { id: "b5", title: "Open Source", icon: "🌿", colorScheme: "emerald", desc: "Active participant in the open-source software ecosystem.", criteria: "Contributed code, documentation, or reviews to recognized open source libraries.", date: "Earned Jul 2026" },
    { id: "b6", title: "Rising Star", icon: "✨", colorScheme: "yellow", desc: "Accelerated skill trajectory with over 15% monthly score progression.", criteria: "Achieve top quartile performance velocity within first 90 days.", date: "Earned Jun 2026" },
  ],
  verifiedSkills: [
    { name: "Python", level: "Expert", iconColor: "text-blue-500", bg: "bg-blue-50" },
    { name: "React", level: "Advanced", iconColor: "text-cyan-500", bg: "bg-cyan-50" },
    { name: "Node.js", level: "Advanced", iconColor: "text-emerald-500", bg: "bg-emerald-50" },
    { name: "Java", level: "Intermediate", iconColor: "text-red-500", bg: "bg-red-50" },
    { name: "SQL", level: "Advanced", iconColor: "text-indigo-500", bg: "bg-indigo-50" },
    { name: "MongoDB", level: "Intermediate", iconColor: "text-green-500", bg: "bg-green-50" },
  ],
  stats: {
    projects: 5,
    projectsNew: "+2 new",
    assessments: 4,
    assessmentsCompleted: "+1 completed",
    repositories: 12,
    repositoriesNew: "+3 new",
    streakDays: 18,
    streakMessage: "Keep going! 🔥"
  },
  salaryRange: {
    location: "Bengaluru, India",
    role: "Software Engineer",
    experience: "0 - 2 years",
    min: "₹12L",
    max: "₹18L",
    base: "₹8L - ₹13L",
    bonuses: "₹1L - ₹2L",
    equity: "₹1L - ₹2L",
    topSkills: ["System Design", "React", "Node.js", "Python", "Go"]
  },
  connectedAccounts: [
    { id: "github", name: "GitHub", handle: "lohith001", connected: true },
    { id: "leetcode", name: "LeetCode", handle: "lohith001", connected: true },
    { id: "codeforces", name: "Codeforces", handle: "", connected: false },
    { id: "hackerrank", name: "HackerRank", handle: "", connected: false }
  ]
};

export const DEVELOPERS_DATABASE = {
  "lohith001": CURRENT_USER,
  "arjun": {
    id: "usr_arjun",
    username: "arjun",
    displayName: "Arjun Sharma",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    roleTitle: "Staff Systems Engineer",
    location: "Bengaluru, India",
    headline: "Distributed systems, high-concurrency Go engines, and database internals.",
    globalRank: "#1",
    percentileBadge: "Top 0.1%",
    totalScore: 982,
    scoreChange: "+4%",
    experience: "7+ years",
    techStack: ["Go", "Kubernetes", "Rust", "PostgreSQL", "+5"],
    skillsBreakdown: [
      { name: "Problem Solving", score: 99, weight: "30%", color: "mint" },
      { name: "Engineering", score: 98, weight: "25%", color: "mint" },
      { name: "Technical Skills", score: 97, weight: "20%", color: "blue" },
      { name: "Collaboration", score: 94, weight: "15%", color: "coral" },
      { name: "Growth", score: 92, weight: "10%", color: "yellow" },
    ],
    badges: CURRENT_USER.badges,
    verifiedSkills: [
      { name: "Go", level: "Expert", iconColor: "text-cyan-500", bg: "bg-cyan-50" },
      { name: "Kubernetes", level: "Expert", iconColor: "text-blue-500", bg: "bg-blue-50" },
      { name: "PostgreSQL", level: "Expert", iconColor: "text-indigo-500", bg: "bg-indigo-50" },
    ]
  },
  "sarah": {
    id: "usr_sarah",
    username: "sarah",
    displayName: "Sarah Kim",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    roleTitle: "Senior AI & ML Architect",
    location: "Seoul, S. Korea",
    headline: "LLM fine-tuning, retrieval systems, and scalable inference infrastructure.",
    globalRank: "#2",
    percentileBadge: "Top 0.2%",
    totalScore: 961,
    scoreChange: "+6%",
    experience: "5+ years",
    techStack: ["Python", "PyTorch", "CUDA", "FastAPI", "+4"],
    skillsBreakdown: [
      { name: "Problem Solving", score: 97, weight: "30%", color: "mint" },
      { name: "Engineering", score: 95, weight: "25%", color: "mint" },
      { name: "Technical Skills", score: 98, weight: "20%", color: "blue" },
      { name: "Collaboration", score: 88, weight: "15%", color: "coral" },
      { name: "Growth", score: 91, weight: "10%", color: "yellow" },
    ],
    badges: CURRENT_USER.badges,
    verifiedSkills: [
      { name: "Python", level: "Expert", iconColor: "text-blue-500", bg: "bg-blue-50" },
      { name: "PyTorch", level: "Expert", iconColor: "text-red-500", bg: "bg-red-50" },
      { name: "FastAPI", level: "Advanced", iconColor: "text-teal-500", bg: "bg-teal-50" },
    ]
  },
  "daniel": {
    id: "usr_daniel",
    username: "daniel",
    displayName: "Daniel Lee",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    roleTitle: "Lead Fullstack Architect",
    location: "San Francisco, USA",
    headline: "Design systems, reactive web performance, and developer experience tooling.",
    globalRank: "#3",
    percentileBadge: "Top 0.5%",
    totalScore: 943,
    scoreChange: "+2%",
    experience: "6+ years",
    techStack: ["TypeScript", "React", "Next.js", "Node.js", "+6"],
    skillsBreakdown: [
      { name: "Problem Solving", score: 94, weight: "30%", color: "mint" },
      { name: "Engineering", score: 95, weight: "25%", color: "mint" },
      { name: "Technical Skills", score: 96, weight: "20%", color: "blue" },
      { name: "Collaboration", score: 92, weight: "15%", color: "coral" },
      { name: "Growth", score: 89, weight: "10%", color: "yellow" },
    ],
    badges: CURRENT_USER.badges,
    verifiedSkills: [
      { name: "React", level: "Expert", iconColor: "text-cyan-500", bg: "bg-cyan-50" },
      { name: "TypeScript", level: "Expert", iconColor: "text-blue-500", bg: "bg-blue-50" },
      { name: "Next.js", level: "Expert", iconColor: "text-black", bg: "bg-slate-50" },
    ]
  }
};

export const LEADERBOARD_DATA = {
  podium: [
    {
      rank: 2,
      username: "sarah",
      name: "Sarah Kim",
      country: "S. Korea",
      flag: "🇰🇷",
      score: 961,
      badge: "Top 1%",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      theme: "podium-blue",
      category: "AI"
    },
    {
      rank: 1,
      username: "arjun",
      name: "Arjun Sharma",
      country: "India",
      flag: "🇮🇳",
      score: 982,
      badge: "Top 1%",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      theme: "podium-gold",
      category: "Backend"
    },
    {
      rank: 3,
      username: "daniel",
      name: "Daniel Lee",
      country: "USA",
      flag: "🇺🇸",
      score: 943,
      badge: "Top 1%",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      theme: "podium-peach",
      category: "Frontend"
    }
  ],
  rows: [
    { rank: 4, username: "priya", name: "Priya Nair", title: "Staff Systems Engineer", country: "India", flag: "🇮🇳", score: 912, change: "+2", isPositive: true, category: "Backend", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" },
    { rank: 5, username: "alex", name: "Alex Chen", title: "Principal Web Architect", country: "USA", flag: "🇺🇸", score: 894, change: "-1", isPositive: false, category: "Frontend", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
    { rank: 6, username: "elena", name: "Elena Rostova", title: "Senior AI & Vision Lead", country: "Germany", flag: "🇩🇪", score: 888, change: "+5", isPositive: true, category: "AI", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80" },
    { rank: 7, username: "kenji", name: "Kenji Sato", title: "High-Throughput Core Dev", country: "Japan", flag: "🇯🇵", score: 881, change: "+3", isPositive: true, category: "Backend", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80" },
    { rank: 8, username: "lohith001", name: "You (Lohith K)", title: "Full-Stack & Systems", country: "India", flag: "🇮🇳", score: 876, change: "+12", isPositive: true, isUser: true, category: "Global", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" },
    { rank: 9, username: "omar", name: "Omar Hassan", title: "Cloud Systems Architect", country: "UAE", flag: "🇦🇪", score: 861, change: "+3", isPositive: true, category: "Backend", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" },
    { rank: 10, username: "isabella", name: "Isabella Rossi", title: "Deep Learning Engineer", country: "Italy", flag: "🇮🇹", score: 848, change: "+1", isPositive: true, category: "AI", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" },
    { rank: 11, username: "marcus", name: "Marcus Vance", title: "React Platform Contributor", country: "United Kingdom", flag: "🇬🇧", score: 840, change: "+4", isPositive: true, category: "Frontend", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80" },
    { rank: 12, username: "chloe", name: "Chloe Dubois", title: "ML Inference Specialist", country: "France", flag: "🇫🇷", score: 832, change: "-2", isPositive: false, category: "AI", avatar: "https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=150&auto=format&fit=crop&q=80" },
    { rank: 13, username: "mateusz", name: "Mateusz Kowalski", title: "Distributed DB Engineer", country: "Poland", flag: "🇵🇱", score: 825, change: "+6", isPositive: true, category: "Backend", avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80" },
    { rank: 14, username: "sofia", name: "Sofia Morales", title: "Design Systems Lead", country: "Spain", flag: "🇪🇸", score: 818, change: "+2", isPositive: true, category: "Frontend", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" },
    { rank: 15, username: "liam", name: "Liam O'Connor", title: "Real-time Trading Dev", country: "Ireland", flag: "🇮🇪", score: 812, change: "-3", isPositive: false, category: "Backend", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80" },
    { rank: 16, username: "ananya", name: "Ananya Roy", title: "NLP & LLM Architect", country: "India", flag: "🇮🇳", score: 804, change: "+8", isPositive: true, category: "AI", avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80" },
    { rank: 17, username: "lucas", name: "Lucas Silva", title: "Web Performance Engineer", country: "Brazil", flag: "🇧🇷", score: 795, change: "+1", isPositive: true, category: "Frontend", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80" },
    { rank: 18, username: "nadia", name: "Nadia Yilmaz", title: "Storage Engine Developer", country: "Turkey", flag: "🇹🇷", score: 788, change: "+4", isPositive: true, category: "Backend", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80" },
    { rank: 19, username: "kevin_z", name: "Kevin Zhao", title: "Generative Model Researcher", country: "Canada", flag: "🇨🇦", score: 779, change: "-1", isPositive: false, category: "AI", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
    { rank: 20, username: "hanna", name: "Hanna Lindqvist", title: "Frontend Infrastructure", country: "Sweden", flag: "🇸🇪", score: 765, change: "+5", isPositive: true, category: "Frontend", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" }
  ]
};

export function getLeaderboardDeveloperProfile(username) {
  const allPodium = [...LEADERBOARD_DATA.podium, ...CODEFORCES_LEADERBOARD.podium];
  const podiumMatch = allPodium.find(p => p.username === username);
  const rowMatch = LEADERBOARD_DATA.rows.find(r => r.username === username);
  const item = podiumMatch || rowMatch;
  if (!item) return null;

  return {
    id: `usr_${item.username}`,
    username: item.username,
    displayName: item.name,
    avatar: item.avatar,
    roleTitle: item.title || `${item.category || "Full-Stack"} Specialist`,
    location: `${item.country}`,
    headline: `Demonstrated technical excellence in ${item.category || "Software Engineering"} with verified real-world proof.`,
    globalRank: `#${item.rank}`,
    percentileBadge: item.rank <= 3 ? "Top 0.5%" : item.rank <= 10 ? "Top 1%" : "Top 5%",
    totalScore: item.score,
    scoreChange: item.change || "+4%",
    experience: "4+ years",
    techStack: [item.category || "TypeScript", "System Design", "Cloud Native", "+4"],
    skillsBreakdown: [
      { name: "Problem Solving", score: Math.min(99, Math.floor(item.score / 10)), weight: "30%", color: "mint" },
      { name: "Engineering", score: Math.min(98, Math.floor(item.score / 10.2)), weight: "25%", color: "mint" },
      { name: "Technical Skills", score: Math.min(97, Math.floor(item.score / 10.1)), weight: "20%", color: "blue" },
      { name: "Collaboration", score: 88, weight: "15%", color: "coral" },
      { name: "Growth", score: 91, weight: "10%", color: "yellow" },
    ],
    badges: CURRENT_USER.badges,
    verifiedSkills: [
      { name: item.category || "Software Craft", level: "Expert", iconColor: "text-blue-500", bg: "bg-blue-50" },
      { name: "Algorithms", level: "Advanced", iconColor: "text-amber-500", bg: "bg-amber-50" },
      { name: "Clean Architecture", level: "Expert", iconColor: "text-emerald-500", bg: "bg-emerald-50" },
    ]
  };
}

import { CODEFORCES_TOP_100, mapCodeforcesToLeaderboardRow, getCodeforcesDeveloperProfile } from './codeforcesData.js';

export { CODEFORCES_TOP_100, mapCodeforcesToLeaderboardRow, getCodeforcesDeveloperProfile };

export const CODEFORCES_LEADERBOARD = {
  podium: [
    {
      rank: 2,
      username: "Kevin114514",
      name: "Qiwen Xu (Kevin114514)",
      country: "China",
      flag: "🇨🇳",
      score: 996,
      badge: "LGM • 3657",
      avatar: "https://userpic.codeforces.org/888350/avatar/f7dbc370bcacda2.jpg",
      theme: "podium-blue",
      category: "Algorithms"
    },
    {
      rank: 1,
      username: "jiangly",
      name: "Lingyu Jiang (jiangly)",
      country: "China",
      flag: "🇨🇳",
      score: 998,
      badge: "World #1 • 3670",
      avatar: "https://userpic.codeforces.org/887306/avatar/c9d0a77b2f3307a5.jpg",
      theme: "podium-gold",
      category: "Algorithms"
    },
    {
      rank: 3,
      username: "maroonrk",
      name: "Riku Kawasaki (maroonrk)",
      country: "Japan",
      flag: "🇯🇵",
      score: 970,
      badge: "LGM • 3355",
      avatar: "https://userpic.codeforces.org/319962/avatar/e55b2c97d0cc2561.jpg",
      theme: "podium-peach",
      category: "Algorithms"
    }
  ],
  rows: CODEFORCES_TOP_100.slice(3).map(mapCodeforcesToLeaderboardRow)
};

export const ASSESSMENTS_CATALOG = [
  {
    id: "lc",
    name: "LeetCode",
    description: "300+ problems solved",
    badge: "Top 10%",
    status: "Verified",
    icon: "https://assets.leetcode.com/static_assets/public/icons/favicon-192x192.png",
    fallbackIcon: "⚡",
    category: "DSA",
    color: "text-amber-600 bg-amber-50"
  },
  {
    id: "cf",
    name: "Codeforces",
    description: "Rating 1930",
    badge: "Expert",
    status: "Verified",
    icon: "https://codeforces.org/s/0/favicon-96x96.png",
    fallbackIcon: "📊",
    category: "Coding",
    color: "text-blue-600 bg-blue-50"
  },
  {
    id: "hr",
    name: "HackerRank",
    description: "4 skill certifications",
    badge: "Advanced",
    status: "Verified",
    icon: "https://hrcdn.net/community-frontend/assets/favicon-ddc8527ec2.png",
    fallbackIcon: "🟢",
    category: "Languages",
    color: "text-emerald-600 bg-emerald-50"
  },
  {
    id: "sd",
    name: "System Design",
    description: "Design scalable systems",
    badge: "Intermediate",
    status: "In Progress",
    fallbackIcon: "🏛️",
    category: "System Design",
    color: "text-purple-600 bg-purple-50"
  }
];

export const RECRUITER_CANDIDATES = [
  {
    id: "c1",
    role: "SDE - Backend",
    company: "Amazon",
    location: "Bengaluru, India",
    salary: "12-16 LPA",
    skills: ["React", "Node.js", "PostgreSQL"],
    score: 912,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    name: "Priya Nair",
    username: "priya"
  },
  {
    id: "c2",
    role: "Software Engineer",
    company: "Google",
    location: "Remote",
    salary: "18-25 LPA",
    skills: ["Python", "Go", "System Design"],
    score: 961,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    name: "Sarah Kim",
    username: "sarah"
  },
  {
    id: "c3",
    role: "Frontend Developer",
    company: "Microsoft",
    location: "Bengaluru, India",
    salary: "10-14 LPA",
    skills: ["React", "TypeScript", "Tailwind"],
    score: 876,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    name: "Lohith K",
    username: "lohith001"
  }
];

export const RECRUITER_JOBS = RECRUITER_CANDIDATES;

export const GROWTH_HISTORY = [
  { month: "Apr", score: 680, date: "Apr 2026" },
  { month: "May", score: 710, date: "May 2026" },
  { month: "Jun", score: 740, date: "Jun 2026" },
  { month: "Jul", score: 790, date: "Jul 2026" },
  { month: "Aug", score: 840, date: "Aug 2026" },
  { month: "Sep", score: 876, date: "Sep 2026" }
];
