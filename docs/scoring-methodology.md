# Rankora Scoring Methodology & Fairness Framework

> **Core Axiom**: Rank demonstrated evidence, not a person's intrinsic worth. Keep developer ability evaluation separate from market compensation benchmarks.

---

## 1. Multi-Dimensional Score Formulation

Developer ability cannot be collapsed accurately into a single scalar without losing crucial context. Rankora employs a primary multi-factor engineering index alongside granular, skill-specific indices.

### Primary Engineering Score ($S$)

$$S = 0.30P + 0.25E + 0.20T + 0.15C + 0.10G$$

Where all sub-scores are normalized on a $[0, 100]$ scale:

| Component | Weight | Key Evidence Sources | Metrics & Signals |
|---|---|---|---|
| **Problem-Solving ($P$)** | 30% | Verified coding challenges, Codeforces contest history, LeetCode verified submissions | Problem difficulty ratings, percentile within contest distributions, time-to-solve, optimality |
| **Engineering Quality ($E$)** | 25% | GitHub repositories, pull requests, automated test suites, static analysis | Test coverage (>70%), CI/CD pipeline presence, modular architecture, lint cleanliness, documentation |
| **Technical Skills ($T$)** | 20% | Skill-specific assessments (Backend, Frontend, Distributed Systems, ML) | Domain test cases, edge-case resilience, idiomatic language patterns, memory/complexity awareness |
| **Collaboration & Impact ($C$)** | 15% | Multi-contributor repositories, PR reviews, issue triage, open source adoption | Meaningful review comments, PR merge rate, stargazer/fork organic impact, team delivery cadence |
| **Growth & Consistency ($G$)** | 10% | Longitudinal performance across comparable tasks | 8-week velocity, consecutive active sprints, score deltas on recurring benchmark challenges |

---

## 2. Evidence Pipeline

Rankora processes evidence through an explainable, 6-stage pipeline:

```
[Connect & Authorize] ──> [Ingest Raw Signals] ──> [Verify Provenance]
                                                           │
                                                           ▼
[Explain & Expose]   <── [Compute Leaderboards] <── [Normalize & Weight]
```

1. **Collect**: Authorized OAuth connections (GitHub, Codeforces API, LeetCode exports).
2. **Verify**: Cryptographic proof of commit signatures, account verification tokens, anti-cheat assessment telemetry.
3. **Normalize**: Source distributions are normalized against platform percentiles (e.g., Codeforces 1600 != LeetCode 1600).
4. **Score**: Deterministic calculation using versioned algorithms (e.g., `v1.2.0-alpha`).
5. **Rank**: Dynamic snapshots computed across leagues, skills, and regions.
6. **Explain**: Every score card displays evidence coverage, confidence level, and exact formula inputs.

---

## 3. Leagues & Fresher Fairness

Leagues are **performance tiers based on verified capability**, not job titles or years of experience.

| League | Purpose | Qualification Standard |
|---|---|---|
| 🟢 **Rookie** | Students & newcomers | Foundational verified projects, consistent challenge effort, baseline problem solving |
| 🔵 **Rising** | Practical engineering capability | Working full-stack or backend projects with tests, improved contest performance, documentation |
| 🟣 **Advanced** | Strong engineering craftsmanship | Complex architectures, high test integrity, concurrent/distributed projects, advanced assessments |
| 🟡 **Elite** | Exceptional verified performance | Top-percentile problem solving, high-impact open source or production-grade systems design |

### Fairness Guarantees:
- **Zero Seniority Bias**: A freshman demonstrating clean code, tests, and algorithmic depth can qualify directly for *Advanced* or *Elite*.
- **Absence is Not Failure**: Missing integrations mean "Not Observed", never a penalty or 0 score.
- **Provisional Status**: Developers with < 3 verified evidence sources receive a "Provisional" badge with an explicit confidence interval.
- **Private Project Verification**: Developers can run local Rankora verification agents or consent-based scanning without exposing proprietary source code.

---

## 4. Potential Metrics vs. Predictive Claims

Rankora strictly distinguishes between **demonstrated potential signals** and predictive salary/hiring claims.

- **Growth Velocity**: Rate of score improvement over comparable 60-day windows.
- **Learning Agility**: Speed of adapting to new language stacks or unfamiliar API domains during timed sandboxed challenges.
- **Engineering Judgment**: Code review quality, identifying security risks, edge case handling.

---

## 5. Market Compensation Benchmarks

- **Labeling**: Always labeled as **"Estimated Market Range"** or **"Developer Market Range"**.
- **Nature**: Strictly informational and hypothetical based on anonymized market data for location, role, and verified skill band.
- **Privacy**: Hidden by default; visible only to the developer unless explicitly published.
- **Formula Independence**: Never compute salary as a direct multiplier of the Rankora score ($Score \times \text{INR}$ is prohibited).
