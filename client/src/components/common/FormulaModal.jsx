import React, { useState } from 'react';
import { X, Sliders, Calculator, ShieldCheck, Info } from 'lucide-react';

export function FormulaModal({ isOpen, onClose }) {
  const [p, setP] = useState(90);
  const [e, setE] = useState(85);
  const [t, setT] = useState(80);
  const [c, setC] = useState(75);
  const [g, setG] = useState(85);

  if (!isOpen) return null;

  const score = Math.round((0.30 * p + 0.25 * e + 0.20 * t + 0.15 * c + 0.10 * g) * 10) / 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel-glow w-full max-w-2xl p-6 sm:p-8 bg-[#0F172A] border border-slate-700/60 shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4" /> Explainable Scoring Blueprint
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
              Rankora Overall Score Formula
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 font-mono uppercase tracking-widest mb-1">Deterministic Formula</div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-gradient-primary">
            S = 0.30P + 0.25E + 0.20T + 0.15C + 0.10G
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto">
            All sub-scores are normalized to [0, 100]. Absence of an integration indicates 'Not Observed', never an automatic zero.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-300">
            <span className="flex items-center gap-1.5"><Sliders className="w-4 h-4 text-cyan-400" /> Interactive Simulation Sandbox</span>
            <span className="font-mono text-indigo-400 text-base">Simulated Score: <strong className="text-white text-lg">{score}</strong>/100</span>
          </div>

          <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Problem-Solving (P: 30%) - Contests & Verified Challenges</span>
                <span className="font-mono text-cyan-400 font-bold">{p}</span>
              </div>
              <input type="range" min="0" max="100" value={p} onChange={e => setP(+e.target.value)} className="w-full accent-cyan-400" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Engineering Quality (E: 25%) - Architecture, Tests, CI/CD</span>
                <span className="font-mono text-indigo-400 font-bold">{e}</span>
              </div>
              <input type="range" min="0" max="100" value={e} onChange={e => setE(+e.target.value)} className="w-full accent-indigo-400" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Technical Skills (T: 20%) - Domain & Language Sandboxes</span>
                <span className="font-mono text-purple-400 font-bold">{t}</span>
              </div>
              <input type="range" min="0" max="100" value={t} onChange={e => setT(+e.target.value)} className="w-full accent-purple-400" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Collaboration & Impact (C: 15%) - PR Reviews & Team Code</span>
                <span className="font-mono text-emerald-400 font-bold">{c}</span>
              </div>
              <input type="range" min="0" max="100" value={c} onChange={e => setC(+e.target.value)} className="w-full accent-emerald-400" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Growth & Consistency (G: 10%) - 8-Week Velocity</span>
                <span className="font-mono text-amber-400 font-bold">{g}</span>
              </div>
              <input type="range" min="0" max="100" value={g} onChange={e => setG(+e.target.value)} className="w-full accent-amber-400" />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 flex items-start gap-3 text-xs text-indigo-200">
          <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong>Fairness Guarantee:</strong> This model measures demonstrated evidence, not years of experience or degree prestige. A rookie or student with verified high test coverage and solid algorithmic performance advances rapidly to Rising or Advanced league.
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="btn-primary"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
