export const SAMPLE_DEVELOPERS = [
  {
    id: "usr_101",
    username: "aarav_dev",
    displayName: "Aarav Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    roleTitle: "Backend & Systems Craftsman",
    headline: "CS Graduate '26 • Open Source Contributor & High-Concurrency Enthusiast",
    location: "Bengaluru, India",
    league: "Advanced",
    score: 84.6,
    confidence: 92,
    growthVelocity: "+11.4 pts / 8wks",
    isProvisional: false,
    bio: "Passionate about building resilient distributed pipelines in Go and Node.js. 1940 rating on Codeforces. Proving that depth and clean tests outshine years on a resume.",
    connections: {
      github: { connected: true, username: "aarav-codes", repos: 28, stars: 340, verifiedPrs: 42 },
      codeforces: { connected: true, username: "aarav_cf", rating: 1942, rank: "Candidate Master" },
      leetcode: { connected: true, username: "aarav_lc", solved: 485, contestRating: 2150 }
    },
    components: {
      problemSolving: 91,
      engineeringQuality: 86,
      technicalSkills: 84,
      collaboration: 76,
      growthConsistency: 85
    },
    skills: [
      { name: "Go / Microservices", score: 88, league: "Advanced", verifiedItems: 14 },
      { name: "Algorithms & DS", score: 92, league: "Elite", verifiedItems: 22 },
      { name: "PostgreSQL & Redis", score: 82, league: "Advanced", verifiedItems: 9 },
      { name: "Docker & K8s", score: 74, league: "Rising", verifiedItems: 6 }
    ],
    verifiedProjects: [
      {
        id: "proj_1",
        title: "KinesisGo: Distributed In-Memory Message Bus",
        description: "Zero-dependency append-only commit log engine supporting 120,000 rps with Raft leader election.",
        repoUrl: "https://github.com/aarav-codes/kinesis-go",
        testCoverage: "94.2%",
        architecture: "Modular hexagonal architecture with strict concurrency primitives and property-based test suites.",
        stack: ["Go", "Raft", "gRPC", "Protobuf"]
      },
      {
        id: "proj_2",
        title: "Distributed Rate-Limiter Sidecar",
        description: "Token bucket & sliding log rate limiter with Redis cluster synchronization and sub-millisecond p99 latency.",
        repoUrl: "https://github.com/aarav-codes/ratelimit-sidecar",
        testCoverage: "89.0%",
        architecture: "Clean interfaces, automated GitHub Actions benchmark matrix.",
        stack: ["Node.js", "Redis", "Docker", "Jest"]
      }
    ],
    evidenceTimeline: [
      {
        id: "ev_1",
        source: "github",
        title: "Test Suite Rigor on KinesisGo",
        detail: "Automated analysis confirmed 94.2% test coverage with race detector enabled in CI.",
        timestamp: "2026-10-10",
        confidence: 0.98,
        impactScore: "+6.5 pts Quality"
      },
      {
        id: "ev_2",
        source: "codeforces",
        title: "Div 2 Global Rank 84 in Round #982",
        detail: "Demonstrated strong speed on DP on trees and 2D range segment queries.",
        timestamp: "2026-10-02",
        confidence: 0.99,
        impactScore: "+8.2 pts Problem Solving"
      },
      {
        id: "ev_3",
        source: "rankora_assessment",
        title: "Passed 'Concurrent Cache Eviction' Sandbox",
        detail: "Zero race conditions under 1,000 goroutines. Memory footprint stayed strictly within 12MB limit.",
        timestamp: "2026-09-24",
        confidence: 0.95,
        impactScore: "+5.0 pts Technical"
      }
    ],
    growthData: [
      { period: "Wk 1", score: 73.2, problemSolving: 80, engineering: 70 },
      { period: "Wk 3", score: 75.8, problemSolving: 84, engineering: 72 },
      { period: "Wk 5", score: 79.1, problemSolving: 87, engineering: 78 },
      { period: "Wk 7", score: 82.0, problemSolving: 89, engineering: 83 },
      { period: "Wk 8", score: 84.6, problemSolving: 91, engineering: 86 }
    ],
    marketBenchmark: {
      role: "Backend Engineer",
      currency: "INR",
      location: "India (Bengaluru / Remote)",
      min: "₹18,00,000",
      median: "₹25,00,000",
      max: "₹34,00,000",
      usdMin: "$65,000",
      usdMedian: "$85,000",
      usdMax: "$110,000",
      confidence: "High (Aggregated from 140+ verified peer offers)",
      lastUpdated: "October 2026"
    }
  },
  {
    id: "usr_102",
    username: "priyanair",
    displayName: "Priya Nair",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    roleTitle: "Staff Design Systems & Frontend Architect",
    headline: "Frontend Specialist • WCAG AAA Accessibility Champion • React & WebGL",
    location: "Mumbai, India",
    league: "Elite",
    score: 89.8,
    confidence: 96,
    growthVelocity: "+4.2 pts / 8wks",
    isProvisional: false,
    bio: "Obsessed with buttery-smooth 60fps micro-interactions, robust web standards, and comprehensive component testing.",
    connections: {
      github: { connected: true, username: "priya-ui", repos: 34, stars: 1200, verifiedPrs: 88 },
      codeforces: { connected: false },
      leetcode: { connected: true, username: "priya_algo", solved: 220, contestRating: 1780 }
    },
    components: {
      problemSolving: 78,
      engineeringQuality: 96,
      technicalSkills: 94,
      collaboration: 92,
      growthConsistency: 86
    },
    skills: [
      { name: "React 19 & Next.js", score: 96, league: "Elite", verifiedItems: 32 },
      { name: "Design Systems / CSS", score: 98, league: "Elite", verifiedItems: 40 },
      { name: "TypeScript & Testing", score: 92, league: "Elite", verifiedItems: 24 },
      { name: "Web Performance (Core Vitals)", score: 90, league: "Elite", verifiedItems: 18 }
    ],
    verifiedProjects: [
      {
        id: "proj_3",
        title: "AuraUI: Zero-Runtime Glassmorphic Design System",
        description: "Radix-based accessible component suite downloaded over 45k times.",
        repoUrl: "https://github.com/priya-ui/aura-ui",
        testCoverage: "98.5%",
        architecture: "Strict headless component separation, zero unnecessary re-renders, visual regression via Playwright.",
        stack: ["React", "TypeScript", "Tailwind", "Radix"]
      }
    ],
    evidenceTimeline: [
      {
        id: "ev_4",
        source: "github",
        title: "Cross-browser regression suite (120 test cases)",
        detail: "Passed without flake across Chromium, Firefox, WebKit.",
        timestamp: "2026-10-12",
        confidence: 0.99,
        impactScore: "+7.0 pts Quality"
      }
    ],
    growthData: [
      { period: "Wk 1", score: 86.0, problemSolving: 76, engineering: 92 },
      { period: "Wk 4", score: 87.5, problemSolving: 77, engineering: 94 },
      { period: "Wk 8", score: 89.8, problemSolving: 78, engineering: 96 }
    ],
    marketBenchmark: {
      role: "Lead Frontend Engineer",
      currency: "INR",
      location: "India / US Remote",
      min: "₹32,00,000",
      median: "₹45,00,000",
      max: "₹60,00,000",
      usdMin: "$110,000",
      usdMedian: "$145,000",
      usdMax: "$180,000",
      confidence: "High",
      lastUpdated: "October 2026"
    }
  },
  {
    id: "usr_103",
    username: "mvance_sys",
    displayName: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    roleTitle: "Principal Systems Engineer",
    headline: "Kernel, eBPF & Distributed Storage Engine Architect",
    location: "Austin, TX, USA",
    league: "Elite",
    score: 93.4,
    confidence: 95,
    growthVelocity: "+3.1 pts / 8wks",
    isProvisional: false,
    bio: "Building low-latency database storage backends, WAL replication mechanisms, and telemetry with eBPF.",
    connections: {
      github: { connected: true, username: "marcusv", repos: 45, stars: 2400, verifiedPrs: 110 },
      codeforces: { connected: true, username: "vance_sys", rating: 2210, rank: "Master" },
      leetcode: { connected: false }
    },
    components: {
      problemSolving: 94,
      engineeringQuality: 95,
      technicalSkills: 96,
      collaboration: 88,
      growthConsistency: 90
    },
    skills: [
      { name: "Rust / C++", score: 96, league: "Elite", verifiedItems: 38 },
      { name: "Distributed Storage", score: 94, league: "Elite", verifiedItems: 29 },
      { name: "Linux eBPF", score: 91, league: "Elite", verifiedItems: 17 }
    ],
    verifiedProjects: [
      {
        id: "proj_4",
        title: "ChronosDB: Embedded Time-Series Storage Engine",
        description: "LSM-tree optimized storage with zero-copy SIMD columnar compression.",
        repoUrl: "https://github.com/marcusv/chronosdb",
        testCoverage: "96.4%",
        architecture: "Zero allocation write-path, fuzz-tested with libFuzzer for 500 million operations.",
        stack: ["Rust", "SIMD", "io_uring", "eBPF"]
      }
    ],
    evidenceTimeline: [
      {
        id: "ev_5",
        source: "github",
        title: "Fuzz-testing resilience certification",
        detail: "500 million random crash-recovery tests executed without state corruption.",
        timestamp: "2026-10-08",
        confidence: 0.99,
        impactScore: "+9.0 pts Engineering"
      }
    ],
    growthData: [
      { period: "Wk 1", score: 91.0, problemSolving: 93, engineering: 93 },
      { period: "Wk 4", score: 92.1, problemSolving: 94, engineering: 94 },
      { period: "Wk 8", score: 93.4, problemSolving: 94, engineering: 95 }
    ],
    marketBenchmark: {
      role: "Principal Systems Engineer",
      currency: "USD",
      location: "USA (Austin / SF)",
      min: "$190,000",
      median: "$240,000",
      max: "$310,000",
      usdMin: "$190,000",
      usdMedian: "$240,000",
      usdMax: "$310,000",
      confidence: "Very High",
      lastUpdated: "October 2026"
    }
  },
  {
    id: "usr_104",
    username: "kavyap",
    displayName: "Kavya Patel",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    roleTitle: "Full-Stack Engineer & DevRel",
    headline: "Self-Taught Builder • Jumped from Rookie to Rising League in 60 Days",
    location: "Pune, India",
    league: "Rising",
    score: 68.4,
    confidence: 84,
    growthVelocity: "+16.8 pts / 8wks",
    isProvisional: false,
    bio: "Proving practical capability every single week. Shipped 3 complete fullstack web apps with thorough test suites and clean documentation.",
    connections: {
      github: { connected: true, username: "kavyacodes", repos: 16, stars: 120, verifiedPrs: 19 },
      codeforces: { connected: false },
      leetcode: { connected: true, username: "kavya_p", solved: 180, contestRating: 1620 }
    },
    components: {
      problemSolving: 64,
      engineeringQuality: 72,
      technicalSkills: 70,
      collaboration: 68,
      growthConsistency: 92
    },
    skills: [
      { name: "TypeScript & Node.js", score: 72, league: "Rising", verifiedItems: 12 },
      { name: "React & Tailwind", score: 76, league: "Rising", verifiedItems: 15 },
      { name: "PostgreSQL & Prisma", score: 66, league: "Rising", verifiedItems: 8 }
    ],
    verifiedProjects: [
      {
        id: "proj_5",
        title: "DevSprint: Async Team Standup Bot",
        description: "Slack/Discord integration summarizing daily developer PR activities with Postgres and Redis queues.",
        repoUrl: "https://github.com/kavyacodes/devsprint",
        testCoverage: "82.5%",
        architecture: "Express + BullMQ queue workers with graceful error retries.",
        stack: ["Node.js", "Express", "Prisma", "PostgreSQL"]
      }
    ],
    evidenceTimeline: [
      {
        id: "ev_6",
        source: "github",
        title: "Integration Test Coverage in DevSprint",
        detail: "Passed full test suite with simulated webhook events.",
        timestamp: "2026-10-11",
        confidence: 0.94,
        impactScore: "+5.2 pts Quality"
      }
    ],
    growthData: [
      { period: "Wk 1", score: 51.6, problemSolving: 50, engineering: 55 },
      { period: "Wk 3", score: 56.4, problemSolving: 55, engineering: 60 },
      { period: "Wk 5", score: 61.2, problemSolving: 59, engineering: 66 },
      { period: "Wk 7", score: 65.5, problemSolving: 62, engineering: 70 },
      { period: "Wk 8", score: 68.4, problemSolving: 64, engineering: 72 }
    ],
    marketBenchmark: {
      role: "Junior / Mid Full-Stack Engineer",
      currency: "INR",
      location: "India (Pune / Remote)",
      min: "₹9,00,000",
      median: "₹14,00,000",
      max: "₹18,00,000",
      usdMin: "$35,000",
      usdMedian: "$50,000",
      usdMax: "$65,000",
      confidence: "Moderate (Rapidly climbing)",
      lastUpdated: "October 2026"
    }
  },
  {
    id: "usr_105",
    username: "elena_algo",
    displayName: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    roleTitle: "Algorithmic Research Engineer",
    headline: "Codeforces International Grandmaster (2680) • ICPC World Finalist",
    location: "Berlin, Germany",
    league: "Elite",
    score: 95.2,
    confidence: 98,
    growthVelocity: "+2.0 pts / 8wks",
    isProvisional: false,
    bio: "Extreme algorithmic optimization, combinatorics, graph flows, and low-level competitive programming.",
    connections: {
      github: { connected: true, username: "elena-cp", repos: 12, stars: 950, verifiedPrs: 30 },
      codeforces: { connected: true, username: "elena_gm", rating: 2682, rank: "International Grandmaster" },
      leetcode: { connected: true, username: "elena_r", solved: 820, contestRating: 2840 }
    },
    components: {
      problemSolving: 99,
      engineeringQuality: 92,
      technicalSkills: 94,
      collaboration: 82,
      growthConsistency: 96
    },
    skills: [
      { name: "Algorithms & Competitive Programming", score: 99, league: "Elite", verifiedItems: 50 },
      { name: "C++20 & SIMD", score: 95, league: "Elite", verifiedItems: 28 },
      { name: "Graph Algorithms & Optimization", score: 98, league: "Elite", verifiedItems: 36 }
    ],
    verifiedProjects: [
      {
        id: "proj_6",
        title: "FastFlow: Lock-free Dinic & Push-Relabel Library",
        description: "Benchmark-topping maximum flow implementation processing 10^7 vertices in under 200ms.",
        repoUrl: "https://github.com/elena-cp/fast-flow",
        testCoverage: "97.0%",
        architecture: "Exhaustive stress-tested with randomly generated bipartite & dense DAG graphs.",
        stack: ["C++20", "Google Benchmark", "CMake"]
      }
    ],
    evidenceTimeline: [
      {
        id: "ev_7",
        source: "codeforces",
        title: "1st Place Global in Educational Round 170",
        detail: "Fastest solve on Problem F (Flow with dynamic capacities).",
        timestamp: "2026-10-06",
        confidence: 1.0,
        impactScore: "+10.0 pts Problem Solving"
      }
    ],
    growthData: [
      { period: "Wk 1", score: 93.8, problemSolving: 98, engineering: 91 },
      { period: "Wk 4", score: 94.4, problemSolving: 98, engineering: 91 },
      { period: "Wk 8", score: 95.2, problemSolving: 99, engineering: 92 }
    ],
    marketBenchmark: {
      role: "Quantitative / Algorithmic Engineer",
      currency: "EUR",
      location: "Europe (Berlin / London / Amsterdam)",
      min: "€120,000",
      median: "€160,000",
      max: "€220,000",
      usdMin: "$140,000",
      usdMedian: "$180,000",
      usdMax: "$250,000",
      confidence: "Very High",
      lastUpdated: "October 2026"
    }
  },
  {
    id: "usr_106",
    username: "toby_rookie",
    displayName: "Toby Morales",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    roleTitle: "CS Sophomore & Open Source Apprentice",
    headline: "2nd Year Undergraduate • Building First Verified Fullstack Projects",
    location: "Toronto, Canada",
    league: "Rookie",
    score: 54.2,
    confidence: 68,
    growthVelocity: "+14.0 pts / 8wks",
    isProvisional: true,
    bio: "Undergraduate building practical foundations. Eager to show real working code, CI pipelines, and consistent practice.",
    connections: {
      github: { connected: true, username: "tobymorales", repos: 8, stars: 15, verifiedPrs: 6 },
      codeforces: { connected: true, username: "toby_cp", rating: 1280, rank: "Pupil" },
      leetcode: { connected: false }
    },
    components: {
      problemSolving: 52,
      engineeringQuality: 58,
      technicalSkills: 54,
      collaboration: 48,
      growthConsistency: 78
    },
    skills: [
      { name: "Python & FastAPI", score: 58, league: "Rookie", verifiedItems: 5 },
      { name: "JavaScript / React", score: 52, league: "Rookie", verifiedItems: 4 }
    ],
    verifiedProjects: [
      {
        id: "proj_7",
        title: "CampusEventHub API",
        description: "RESTful event ticketing service with JWT auth, SQLite and pytest integration tests.",
        repoUrl: "https://github.com/tobymorales/campus-hub",
        testCoverage: "78.0%",
        architecture: "Clean MVC layout with GitHub Actions CI badge.",
        stack: ["Python", "FastAPI", "SQLite", "PyTest"]
      }
    ],
    evidenceTimeline: [
      {
        id: "ev_8",
        source: "rankora_assessment",
        title: "Completed 'REST API Foundations' Challenge",
        detail: "Handled error handling, HTTP status codes, and input validation without failure.",
        timestamp: "2026-10-13",
        confidence: 0.90,
        impactScore: "+4.5 pts Technical"
      }
    ],
    growthData: [
      { period: "Wk 1", score: 40.2, problemSolving: 42, engineering: 44 },
      { period: "Wk 4", score: 47.0, problemSolving: 46, engineering: 50 },
      { period: "Wk 8", score: 54.2, problemSolving: 52, engineering: 58 }
    ],
    marketBenchmark: {
      role: "Software Engineering Intern / Junior",
      currency: "USD",
      location: "Canada / US Remote",
      min: "$45,000",
      median: "$60,000",
      max: "$75,000",
      usdMin: "$45,000",
      usdMedian: "$60,000",
      usdMax: "$75,000",
      confidence: "Provisional / Emerging",
      lastUpdated: "October 2026"
    }
  }
];

export const SAMPLE_CHALLENGES = [
  {
    id: "chall_1",
    title: "High-Concurrency Token Bucket Rate Limiter",
    category: "Backend & Systems",
    difficulty: "Medium",
    duration: "45 mins",
    xpReward: "+12.5 pts Engineering",
    skills: ["Go", "Node.js", "Redis", "Concurrency"],
    description: "Design an in-memory rate limiter that withstands 50,000 requests/sec with thread-safety and zero deadlock.",
    testCasesCount: 14,
    attemptsCount: 1240,
    passRate: "38%",
    starterCode: `// Implement TokenBucketRateLimiter
class TokenBucketLimiter {
  constructor(capacity, refillRatePerSec) {
    this.capacity = capacity;
    this.refillRate = refillRatePerSec;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  allowRequest(tokensRequired = 1) {
    // TODO: Thread-safe refill and consumption
  }
}`
  },
  {
    id: "chall_2",
    title: "Zero-Layout Shift Virtualized Table with Keyboard Nav",
    category: "Frontend Architecture",
    difficulty: "Medium",
    duration: "40 mins",
    xpReward: "+10.0 pts Technical",
    skills: ["React", "DOM Performance", "WCAG 2.1"],
    description: "Render 100,000 rows without DOM degradation. Support full ARIA grid navigation and dynamic row heights.",
    testCasesCount: 18,
    attemptsCount: 890,
    passRate: "42%",
    starterCode: `// VirtualizedTable implementation
export function VirtualizedTable({ rows, rowHeight, containerHeight }) {
  // TODO: Calculate visible slice, buffer window, and ARIA indices
}`
  },
  {
    id: "chall_3",
    title: "Distributed Raft Log Compaction & Snapshotting",
    category: "Systems & Distributed",
    difficulty: "Hard",
    duration: "60 mins",
    xpReward: "+18.0 pts Problem Solving",
    skills: ["Distributed Systems", "Consensus", "Storage"],
    description: "Implement log truncation and atomic state snapshot installation without interrupting leader-follower heartbeats.",
    testCasesCount: 22,
    attemptsCount: 420,
    passRate: "19%",
    starterCode: `// Raft snapshot installation handler
func (r *RaftNode) InstallSnapshot(req *SnapshotArgs, reply *SnapshotReply) {
  // TODO: Safely truncate uncommitted logs and apply state machine delta
}`
  }
];

export const COMPENSATION_BENCHMARKS = [
  {
    role: "Junior Backend Engineer",
    level: "Entry / Fresher",
    india: { min: "₹8L", median: "₹14L", max: "₹20L" },
    us: { min: "$75k", median: "$95k", max: "$120k" },
    europe: { min: "€45k", median: "€60k", max: "€75k" },
    sampleSize: 840,
    confidence: "High"
  },
  {
    role: "Mid Backend Engineer (Go/Node)",
    level: "Mid-Level",
    india: { min: "₹18L", median: "₹26L", max: "₹38L" },
    us: { min: "$125k", median: "$155k", max: "$185k" },
    europe: { min: "€70k", median: "€90k", max: "€115k" },
    sampleSize: 1250,
    confidence: "Very High"
  },
  {
    role: "Staff / Principal Systems Engineer",
    level: "Staff",
    india: { min: "₹45L", median: "₹65L", max: "₹95L" },
    us: { min: "$210k", median: "$270k", max: "$360k" },
    europe: { min: "€115k", median: "€150k", max: "€210k" },
    sampleSize: 420,
    confidence: "High"
  },
  {
    role: "Frontend Architect / Design Systems",
    level: "Senior",
    india: { min: "₹28L", median: "₹42L", max: "₹58L" },
    us: { min: "$150k", median: "$185k", max: "$230k" },
    europe: { min: "€85k", median: "€110k", max: "€140k" },
    sampleSize: 760,
    confidence: "High"
  }
];
