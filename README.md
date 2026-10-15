# Rankora

> **One profile. Multiple evidence sources. A clearer picture of developer skills, growth, and hiring-market fit.**

Rankora is an explainable developer intelligence and discovery platform that aggregates verified evidence across coding platforms (GitHub, Codeforces, LeetCode, verified challenges) into transparent, multi-dimensional profiles.

---

## 🏗️ Monorepo Structure

```
rankora/
├── client/          # Modern React 19 + Vite + Lucide UI + Recharts
├── server/          # Modular backend service & evidence normalization engine
├── docs/            # Blueprint, scoring methodology, API spec, and data governance
├── scripts/         # Verification helpers & database seed scripts
└── docker-compose.yml
```

## 🚀 Quick Start

### 1. Run the Frontend (Client)
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Run the Backend API (Server)
```bash
cd server
npm install
npm run dev
```
API runs on [http://localhost:5000](http://localhost:5000).

---

## 📐 Scoring Formula

Developer overall index:
$$S = 0.30P + 0.25E + 0.20T + 0.15C + 0.10G$$

- **Problem Solving (P)**: 30%
- **Engineering Quality (E)**: 25%
- **Technical Skills (T)**: 20%
- **Collaboration & Impact (C)**: 15%
- **Growth & Consistency (G)**: 10%

## 🛡️ Core Axioms
- Rank demonstrated evidence, not a person's intrinsic worth.
- Estimated market ranges are strictly informational benchmarks; never guaranteed salary forecasts.
- Absence of a platform connection means "Not Observed", never an automatic zero.
