<p align="center">
  <img src="client/public/rankora-logo.png" alt="Rankora Logo" width="128" height="128" />
</p>

<h1 align="center">Rankora</h1>

<p align="center">
  <strong>Global Developer Ranking, Skill Intelligence & Hiring Platform</strong>
</p>

<p align="center">
  One profile. Multiple evidence sources. An explainable, evidence-backed signal for developer ability, growth trajectory, and market alignment.
</p>

<p align="center">
  <a href="#-quick-start"><img src="https://img.shields.io/badge/build-passing-brightgreen?style=flat-square" alt="Build Status" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/react-19.2-blue?style=flat-square&logo=react" alt="React 19" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/vite-8.3-646CFF?style=flat-square&logo=vite" alt="Vite 8" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/tailwind-v4.3-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS v4" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" /></a>
</p>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Why Rankora?](#-why-rankora)
- [Core Features](#-core-features)
- [Design System & Aesthetics](#-design-system--aesthetics)
- [Scoring Formula & Methodology](#-scoring-formula--methodology)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Directory Structure](#-directory-structure)
- [Quick Start](#-quick-start)
- [Environment Configuration](#-environment-configuration)
- [API & Service Boundaries](#-api--service-boundaries)
- [Ethical Axioms & Data Governance](#-ethical-axioms--data-governance)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🌟 Overview

**Rankora** is a developer intelligence platform engineered to replace keyword-stuffed resumes and unverified claims with **evidence-backed, multi-dimensional skill profiles**. 

By aggregating verifiable signals across platforms—such as **LeetCode problem evaluations, Codeforces competitive ratings, GitHub commit frequency and pull-request impact, and sandboxed system design challenges**—Rankora synthesizes an explainable, peer-benchmarked composite score.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EVIDENCE NORMALIZATION                          │
│                                                                        │
│   [LeetCode] ───┐                                                      │
│   [GitHub]   ───┼──▶  Rankora Verification Engine  ──▶  Composite      │
│   [Codeforces]──┤     (Weights, Decay & Calibration)    Signal Score   │
│   [Challenges]──┘                                       (0 - 1000)     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 💡 Why Rankora?

| The Traditional Hiring Problem | The Rankora Solution |
| :--- | :--- |
| **Inflated Resumes & Buzzwords**: Candidates list technologies without verifiable depth. | **Cryptographic & Source Evidence**: Profiles link to evaluated repositories, tests, and source handles. |
| **Single-Dimension LeetCode Grinding**: Algorithm quizzes alone miss system architecture and code craft. | **Multi-Axis Composite Scoring**: Evaluates Problem Solving, Engineering, Architecture, Collaboration, and Velocity. |
| **Black-Box Recruiter Spam**: Recruiters blast generic messages based on keyword scraping. | **Precision Signal Search**: Companies search talent by verified percentile thresholds, top skills, and realistic compensation brackets. |
| **Static Snapshots**: A static PDF resume goes stale immediately. | **Dynamic Velocity Tracking**: Live 1M/3M/6M/1Y growth tracking captures ongoing improvements. |

---

## 🚀 Core Features

Rankora delivers a full 9-screen developer and hiring platform:

### 1. 🌐 Global Leaderboard (`/leaderboard`)
- **Podium Showcase**: Distinct visual hierarchy for Ranks 1, 2, and 3 with gold, silver, and peach podium cards and crown medallions.
- **Dynamic Filter Tabs**: Instantly filter ranks across **Global**, **Backend**, **Frontend**, and **AI** domains.
- **Interactive Time Window**: Toggle between *This Week*, *This Month*, and *All Time*.
- **Search & Sortable Table**: Multi-column sorting (Rank, Score, Velocity Change) with a highlighted row for the authenticated user.

### 2. 👤 Developer Profile (`/developers/:username` & `/profile`)
- **Verified Identity**: Online presence indicator, blue verified status checkmark, and social links (GitHub, LinkedIn).
- **Interactive Networking**: Stateful *Connect* toggle with active feedback.
- **High-Level Metrics**: Global Rank card, Total Score (`+12%` velocity), Experience Level, and Skill Depth metrics.
- **Multi-Tab Workspace**: Switch between *Overview*, *Verified Projects*, *Completed Assessments*, and *Recent Activity*.
- **Skill Breakdown**: Color-coded progress indicators across all evaluated core competencies.
- **Achievement Medallions**: Clickable achievement badges with modal criteria explanations.

### 3. ⚡ Skills & Badges (`/skills`)
- **Proficiency Cards**: Deep dives into Python, React, Node.js, Java, SQL, and MongoDB with click-to-inspect evaluation modals.
- **Credential Registry**: Verified certificates from AWS, Meta, and HackerRank with credential verification IDs.
- **Secondary Growth Panel**: Integrated mini area chart showing 6-month historical score progression and percentile rank.

### 4. 🧪 Sandboxed Assessments (`/assessments`)
- **Multi-Domain Challenges**: Evaluated catalog across DSA, Algorithmic Coding, System Design, and Language Internals.
- **Interactive Challenge Simulator**: In-browser test runner modal with code execution simulation that updates user score and milestones.
- **Progress Gauge**: Circular milestone progress indicator (`4/6 Completed`) and next badge milestone unlocks.

### 5. 🔍 Recruiter Discovery (`/hiring`)
- **Evidence-First Search**: Live search by candidate role, demonstrated technologies, or geographical location.
- **Granular Filters**: Role classification, city filtering, and dedicated *Remote* toggle.
- **Candidate Cards**: Displays company pedigree, verified skills, and salary expectations.
- **Candidate Shortlisting**: Save candidates with instant bookmark toggling.
- **Employer Portal**: Embedded *For Recruiters* callout with a functional *Post a Job* creation modal.

### 6. 📈 Growth Dashboard (`/growth`)
- **Interactive Trajectory Chart**: Smooth SVG area chart built with Recharts, dynamically updating across 1M, 3M, 6M, and 1Y intervals.
- **Activity Metrics**: Live counters for Verified Projects, Completed Assessments, Audited Repositories, and Active Day Streaks.

### 7. 💰 Market Value Benchmarking (`/market-value`)
- **Transparent Compensation Brackets**: Aggregated market compensation bands tailored by location (e.g., Bengaluru, San Francisco, Remote) and experience tier.
- **Component Breakdown**: Granular categorization into Base Salary, Annual Bonuses, and Equity Grants (RSUs).
- **Top-Paying Skill Signals**: Highlights skills commanding compensation premiums (System Design, Go, Cloud Architecture).
- **Ethical Safeguards**: Prominent disclaimers reinforcing that developer scores evaluate technical evidence and never human self-worth.

### 8. ⚙️ Settings & Privacy Controls (`/settings`)
- **Platform Connectors**: OAuth connection toggles for GitHub, LeetCode, Codeforces, and HackerRank.
- **Profile Preferences**: Editable display name, role headline, and developer biography with instant validation.
- **Granular Privacy**: Toggle public leaderboard discovery and recruiter contact visibility.
- **Data Portability**: One-click full profile JSON data export archive and account deletion with accessible confirmation dialogs.

---

## 🎨 Design System & Aesthetics

Rankora utilizes a clean design system configured in [`client/src/index.css`](file:///c:/Users/lohit/Downloads/Projects/Rankora/client/src/index.css):

| Token | Hex / Value | Purpose |
| :--- | :--- | :--- |
| **Page Background** | `#F5F8FF` | Bright, airy blue-white tinted background |
| **Primary Navy** | `#15264B` | High-contrast typography and primary actions |
| **Secondary Text** | `#687793` | Metadata, subtitles, and secondary indicators |
| **Mint Accent** | `#4CC9A6` | Positive signals, verified status, velocity increases |
| **Pale Mint** | `#E4F8EF` | Highlighted rows, success chips, and badges |
| **Soft Yellow** | `#FFE89A` | Crown accents, Rank 1 podium, highlights |
| **Pale Blue** | `#EAF3FF` | Active navigation pills, badge backgrounds |
| **Pale Coral** | `#FFE8E5` | Negative movement indicators, danger buttons |
| **Card Border** | `#E2EAF5` | Fine, subtle borders throughout all cards |
| **Border Radius** | `16px — 24px` | Smooth, friendly rounded aesthetics |

---

## 📐 Scoring Formula & Methodology

Rankora’s algorithmic score ($S$) evaluates developer competence on an absolute scale from $0$ to $1000$:

$$S = 0.30P + 0.25E + 0.20T + 0.15C + 0.10G$$

Where:
- **Problem Solving ($P$) — 30%**: Algorithmic correctness, time/space complexity, LeetCode/Codeforces performance.
- **Engineering Quality ($E$) — 25%**: Modularity, test coverage, static analysis scores, documentation clarity.
- **Technical Skills ($T$) — 20%**: Breadth and depth across languages, frameworks, databases, and system architecture.
- **Collaboration & Impact ($C$) — 15%**: Merged pull requests, code reviews, open-source contributions, cross-functional velocity.
- **Growth & Consistency ($G$) — 10%**: Active problem-solving streaks, continuous learning cadence, milestone velocity.

> **Note on Data Inclusivity**: The absence of an external platform connection indicates **"Not Observed"**, never a default score penalty.

---

## 🛠️ Architecture & Tech Stack

### Frontend Architecture
- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/) (Pure JavaScript & JSX)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Routing**: [React Router v7](https://reactrouter.com/) with nested layout wrappers
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visualizations**: [Recharts](https://recharts.org/) (Responsive, SVG area & radar curves)
- **Utilities**: `clsx` and `tailwind-merge` via unified `cn(...)` helper

### Backend Preparation
- Designed with clean separation in `client/src/services/api.js` ready for seamless connection to **Go + Gin** and **PostgreSQL**.

---

## 📂 Directory Structure

```text
Rankora/
├── client/                              # Modern React 19 Frontend
│   ├── public/
│   │   ├── rankora-logo.png             # Official 3D Crown & Ribbon Brand Logo
│   │   ├── hero-developer.jpg           # Landing hero illustration
│   │   ├── recruiter.jpg                # Recruiter showcase graphic
│   │   └── wallet.jpg                   # Market compensation graphic
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                  # RankoraLogo, StatCard, ProgressBar, SkillBadge, etc.
│   │   │   ├── layout/                  # AppLayout, Sidebar, TopBar, MobileNav
│   │   │   └── ui/                      # Button, Badge, Card primitives
│   │   ├── lib/
│   │   │   ├── mockData.js              # Comprehensive local dataset
│   │   │   └── utils.js                 # Tailwind class merging utility
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx          # Public showcase & demo walkthrough
│   │   │   ├── LeaderboardPage.jsx      # Podium & global ranking table
│   │   │   ├── DeveloperProfile.jsx     # Explainable developer profile
│   │   │   ├── SkillsPage.jsx           # Skills & badges matrix
│   │   │   ├── AssessmentsPage.jsx      # Challenge catalog & test simulator
│   │   │   ├── RecruiterSearch.jsx      # Candidate discovery & hiring
│   │   │   ├── GrowthDashboard.jsx      # Velocity curves & stats
│   │   │   ├── MarketValuePage.jsx      # Benchmarked compensation bands
│   │   │   ├── SettingsPage.jsx         # Connected platforms & privacy
│   │   │   └── NotFoundPage.jsx         # 404 handler
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx            # React Router tree
│   │   ├── services/
│   │   │   └── api.js                   # Decoupled backend service adapter
│   │   ├── App.jsx                      # App root
│   │   ├── index.css                    # Design tokens & global stylesheet
│   │   └── main.jsx                     # Vite client entry point
│   ├── index.html                       # HTML5 entry with Plus Jakarta Sans & Inter
│   ├── package.json
│   └── vite.config.js                   # Chunk splitting & build configuration
├── docs/                                # System architecture & scoring specs
├── server/                              # Backend service directory (Go + Gin ready)
└── README.md                            # You are here
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/Rankora.git
   cd Rankora/client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Run the production build**:
   ```bash
   npm run build
   ```

5. **Preview the production bundle**:
   ```bash
   npm run preview
   ```

6. **Run linter**:
   ```bash
   npm run lint
   ```

---

## 🔒 Ethical Axioms & Data Governance

1. **Rank Evidence, Not Humans**: Scores quantify documented technical evidence; they do not define human worth.
2. **Transparent Formulas**: No proprietary black-box calculations—every sub-score explains the source and formula behind it.
3. **Strict Data Privacy**: User profiles can be toggled to private at any time, instantly excluding them from public leaderboards and recruiter searches.
4. **Full Portability**: Users own their data and can export their complete profile history as JSON at any time.

---

## 🗺️ Roadmap

- [x] **Phase 1**: Design tokens, color system, and application shell.
- [x] **Phase 2**: Core UI primitives, layouts, and desktop/mobile responsiveness.
- [x] **Phase 3**: Landing page, global leaderboard, and developer profile screens.
- [x] **Phase 4**: Skills intelligence, assessment challenge runner, recruiter discovery, growth charts, market value, and settings.
- [x] **Phase 5**: Interactive filter bars, sorting algorithms, modals, and test simulation.
- [x] **Phase 6**: Brand logo integration and production build optimization.
- [ ] **Phase 7**: Go + Gin REST API integration and PostgreSQL schema migrations.
- [ ] **Phase 8**: Live OAuth integrations for GitHub API, LeetCode GraphQL, and Codeforces REST.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for developers worldwide by the <strong>Rankora Team</strong>.
</p>
