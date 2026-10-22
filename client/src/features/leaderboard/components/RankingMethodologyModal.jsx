import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sliders, 
  ShieldCheck, 
  RefreshCw, 
  Layers, 
  Scale, 
  CheckCircle2 
} from 'lucide-react';
import { 
  ALGORITHM_VERSION, 
  COMPONENT_DEFINITIONS 
} from '../constants/leaderboardConstants';
import { calculateOverallScore } from '../utils/rankingEngine';
import { assignLeague } from '../utils/leagueRules';
import { Button } from '../../../components/ui/Button';

export function RankingMethodologyModal({ isOpen, onClose }) {
  // Live Simulator state
  const [simulatorComponents, setSimulatorComponents] = useState({
    problemSolving: 85,
    engineeringQuality: 80,
    technicalSkills: 88,
    collaboration: 75,
    growth: 90
  });

  const [activeTab, setActiveTab] = useState('methodology'); // 'methodology' | 'simulator' | 'antiCheat'

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Simulator calculation
  const simResult = calculateOverallScore(simulatorComponents);
  const simLeague = assignLeague(simResult.score, 0.85);

  const handleSliderChange = (key, value) => {
    setSimulatorComponents(prev => ({
      ...prev,
      [key]: Number(value)
    }));
  };

  const handleResetSimulator = () => {
    setSimulatorComponents({
      problemSolving: 85,
      engineeringQuality: 80,
      technicalSkills: 88,
      collaboration: 75,
      growth: 90
    });
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="methodology-modal-title"
      >
        {/* Backdrop click to dismiss */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E2EAF5] overflow-hidden z-10 flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E2EAF5] bg-[#F5F8FF]/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#EAF3FF] text-[#2563EB] flex items-center justify-center border border-[#D2E4FC]">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 id="methodology-modal-title" className="text-base sm:text-lg font-bold text-[#15264B] leading-tight">
                  Ranking Methodology & Simulator
                </h3>
                <p className="text-xs text-[#687793] font-medium">
                  Transparent, verifiable, and deterministic • Engine {ALGORITHM_VERSION}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              aria-label="Close methodology modal"
              className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-[#687793] hover:text-[#15264B] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex border-b border-[#E2EAF5] px-6 bg-white gap-2 pt-2">
            <button
              onClick={() => setActiveTab('methodology')}
              className={`py-2 px-3 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
                activeTab === 'methodology'
                  ? 'border-[#15264B] text-[#15264B]'
                  : 'border-transparent text-[#687793] hover:text-[#15264B]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Five Core Dimensions
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`py-2 px-3 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
                activeTab === 'simulator'
                  ? 'border-[#15264B] text-[#15264B]'
                  : 'border-transparent text-[#687793] hover:text-[#15264B]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Interactive Simulator
            </button>

            <button
              onClick={() => setActiveTab('antiCheat')}
              className={`py-2 px-3 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
                activeTab === 'antiCheat'
                  ? 'border-[#15264B] text-[#15264B]'
                  : 'border-transparent text-[#687793] hover:text-[#15264B]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Fairness & Anti-Cheat
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto space-y-5">
            {activeTab === 'methodology' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#15264B] mb-1">
                    Multi-Dimensional Engineering Proof
                  </h4>
                  <p className="text-xs text-[#687793] leading-relaxed">
                    Rankora ranks engineers based on auditable evidence: competitive problem solving, test coverage, code architecture, peer reviews, and consistency.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(COMPONENT_DEFINITIONS).map(([key, def]) => (
                    <div key={key} className="p-3.5 rounded-2xl border border-[#E2EAF5] bg-[#F5F8FF]/70">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-[#15264B] text-xs">{def.label}</span>
                        <span className="text-xs font-extrabold text-[#2563EB] bg-[#EAF3FF] px-2 py-0.5 rounded-full border border-[#D2E4FC]">
                          {Math.round(def.weight * 100)}%
                        </span>
                      </div>
                      <p className="text-[11px] text-[#687793] leading-relaxed mb-2">
                        {def.description}
                      </p>
                      <div className="text-[10px] text-[#687793] font-medium">
                        Sources: {def.evidenceSources.join(', ')}
                      </div>
                    </div>
                  ))}

                  {/* Missing Evidence Handling Rule */}
                  <div className="p-3.5 rounded-2xl border border-[#B9EED9] bg-[#E4F8EF]/50">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                      <span className="font-bold text-[#065F46] text-xs">Missing Evidence Normalization</span>
                    </div>
                    <p className="text-[11px] text-[#065F46] leading-relaxed">
                      Unobserved tracks are treated as <em>unobserved</em> rather than scored as zero. Remaining dimensions are normalized to 100%.
                    </p>
                  </div>
                </div>

                {/* Deterministic Tie-Breaking */}
                <div className="p-3.5 rounded-2xl border border-[#E2EAF5] bg-white">
                  <h4 className="text-xs font-bold text-[#15264B] uppercase tracking-wider mb-2">
                    Deterministic 4-Stage Tie-Breaking
                  </h4>
                  <ol className="text-xs text-[#687793] space-y-1 list-decimal pl-4">
                    <li><strong className="text-[#15264B]">Computed Overall Score</strong> (highest score ranked higher)</li>
                    <li><strong className="text-[#15264B]">Evidence Coverage</strong> (higher verified ratio breaks ties)</li>
                    <li><strong className="text-[#15264B]">Identity Verification</strong> (verified engineers precede unverified)</li>
                    <li><strong className="text-[#15264B]">Deterministic User ID Hash</strong> (stable hash guarantees zero randomness)</li>
                  </ol>
                </div>
              </div>
            )}

            {activeTab === 'simulator' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#15264B]">Interactive Score Simulator</h4>
                    <p className="text-xs text-[#687793]">
                      Adjust dimensions to see how score and competitive league update instantly.
                    </p>
                  </div>
                  <button
                    onClick={handleResetSimulator}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#E2EAF5] text-xs font-semibold text-[#687793] hover:text-[#15264B] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset
                  </button>
                </div>

                {/* Live Output Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EAF3FF] via-white to-[#F4EFFF] border border-[#E2EAF5] flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="text-[11px] text-[#687793] uppercase tracking-wider font-bold">Simulated Score</span>
                    <div className="text-3xl font-black text-[#15264B] tracking-tight mt-0.5">
                      {simResult.score.toFixed(1)}
                      <span className="text-xs text-[#687793] font-normal ml-1">/ 100</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-[#687793] uppercase tracking-wider font-bold">League Tier</span>
                    <div className="mt-1">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#FFF8DC] text-[#B45309] border border-[#FFE89A]">
                        {simLeague} League
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-3">
                  {Object.entries(COMPONENT_DEFINITIONS).map(([key, def]) => {
                    const val = simulatorComponents[key];
                    const weightPct = Math.round(def.weight * 100);

                    return (
                      <div key={key} className="p-3 rounded-2xl border border-[#E2EAF5] bg-[#F5F8FF]/50">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold text-[#15264B]">{def.label} ({weightPct}%)</span>
                          <span className="font-mono font-bold text-[#15264B] bg-white px-2 py-0.5 rounded-full border border-[#E2EAF5] text-xs">
                            {val}
                          </span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={val}
                          onChange={(e) => handleSliderChange(key, e.target.value)}
                          className="w-full accent-[#3B82F6] h-1.5 bg-[#E2EAF5] rounded-full cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'antiCheat' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#15264B] mb-1">
                    Integrity, Anti-Gaming & Anomaly Detection
                  </h4>
                  <p className="text-xs text-[#687793] leading-relaxed">
                    Rankora prevents gamification through automated heuristics:
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-2xl border border-[#E2EAF5] bg-white">
                    <div className="font-bold text-[#15264B] text-xs mb-0.5">Commit Velocity Smoothing</div>
                    <p className="text-xs text-[#687793] leading-relaxed">
                      Bots creating automated commits or synthetic PR loops have their weight decayed through diminishing returns algorithms.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-[#E2EAF5] bg-white">
                    <div className="font-bold text-[#15264B] text-xs mb-0.5">Recency & Decay Curve</div>
                    <p className="text-xs text-[#687793] leading-relaxed">
                      Older accomplishments (&gt; 18 months) experience a gentle decay curve unless refreshed by new assessments or merged PRs.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-[#E2EAF5] bg-white">
                    <div className="font-bold text-[#15264B] text-xs mb-0.5">Peer Code Review Verification</div>
                    <p className="text-xs text-[#687793] leading-relaxed">
                      High collaboration scores require verified multi-author repositories or open-source PR reviews from established maintainers.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#E2EAF5] bg-[#F5F8FF]/60 flex items-center justify-between">
            <span className="text-xs text-[#687793]">
              Rankora Algorithm {ALGORITHM_VERSION}
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
