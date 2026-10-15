import React from 'react';
import { ShieldCheck, Scale, Terminal, Heart, ArrowUpRight } from 'lucide-react';

export function Footer({ onOpenFormula, setCurrentTab }) {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#06080E] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center font-display font-black text-white text-base">
              R
            </div>
            <span className="font-display font-extrabold text-xl text-white">Rankora</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            One profile. Multiple evidence sources. A clearer, fairer picture of developer ability, learning trajectory, and hiring-market fit without relying on resume pedigree.
          </p>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Core Axiom:</strong> Rank demonstrated evidence, not a person's intrinsic worth. Market compensation ranges are informational benchmarks, never guaranteed forecasts.
            </span>
          </div>
        </div>

        {/* Product Navigation */}
        <div className="space-y-3 text-xs">
          <div className="font-semibold text-white uppercase tracking-wider text-[11px]">Platform</div>
          <ul className="space-y-2">
            <li>
              <button onClick={() => setCurrentTab('leaderboards')} className="hover:text-cyan-400 transition">
                Global & Skill Leaderboards
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('profile')} className="hover:text-cyan-400 transition">
                Explainable Developer Profiles
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('assessments')} className="hover:text-cyan-400 transition">
                Verified Skill Challenges
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('market')} className="hover:text-cyan-400 transition">
                Market Compensation Benchmarks
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('recruiter')} className="hover:text-cyan-400 transition">
                Recruiter Role-Fit Matching
              </button>
            </li>
          </ul>
        </div>

        {/* Governance & Integrity */}
        <div className="space-y-3 text-xs">
          <div className="font-semibold text-white uppercase tracking-wider text-[11px]">Governance & Trust</div>
          <ul className="space-y-2">
            <li>
              <button onClick={onOpenFormula} className="hover:text-cyan-400 transition flex items-center gap-1">
                Scoring Formula (v1.0.0) <ArrowUpRight className="w-3 h-3" />
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('settings')} className="hover:text-cyan-400 transition">
                Appeals & Data Corrections
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('settings')} className="hover:text-cyan-400 transition">
                Privacy Controls & GDPR Export
              </button>
            </li>
            <li>
              <span className="text-slate-500">Fresher Fairness Protocol Active</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>© 2026 Rankora Developer Intelligence Platform. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <span>Engine: Go/Node.js</span>
          <span>UI: React 19 + Vite</span>
          <span>Architecture: Modular Monolith</span>
        </div>
      </div>
    </footer>
  );
}
