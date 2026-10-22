import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, HelpCircle, AlertCircle, Info, Activity } from 'lucide-react';
import { COMPONENT_DEFINITIONS, ALGORITHM_VERSION } from '../constants/leaderboardConstants';
import { DeveloperAvatar } from '../../../components/common/DeveloperAvatar';
import { Button } from '../../../components/ui/Button';

export function ScoreExplanationModal({ isOpen, onClose, developer, breakdownData }) {
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

  if (!isOpen || !developer) return null;

  const scoreDetails = breakdownData || developer.scoreDetails || {};
  const { 
    score = developer.calculatedScore || 0, 
    breakdown = {}, 
    isProvisional = false, 
    insufficientEvidence = false,
    normalizedCount = 5 
  } = scoreDetails;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="explanation-modal-title"
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
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 id="explanation-modal-title" className="text-base sm:text-lg font-bold text-[#15264B] leading-tight">
                  Score Calculation Breakdown
                </h3>
                <p className="text-xs text-[#687793] font-medium">
                  Verified metrics • Engine {ALGORITHM_VERSION}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              aria-label="Close score breakdown modal"
              className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-[#687793] hover:text-[#15264B] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-5">
            {/* Developer Banner */}
            <div className="flex items-center justify-between p-4 bg-[#F5F8FF] border border-[#E2EAF5] rounded-2xl">
              <div className="flex items-center gap-3">
                <DeveloperAvatar
                  src={developer.avatar}
                  name={developer.displayName || developer.name}
                  size="md"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#15264B] text-sm sm:text-base">
                      {developer.displayName || developer.name}
                    </span>
                    <span className="text-xs text-[#687793] font-mono">@{developer.username}</span>
                    {developer.verified && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#E4F8EF] text-[#059669] text-[10px] font-bold border border-[#B9EED9]">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#687793] mt-0.5">{developer.title}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] font-bold text-[#687793] uppercase tracking-wider">Score</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#15264B] tracking-tight">
                  {score.toFixed ? score.toFixed(1) : score}
                  <span className="text-xs text-[#687793] font-normal ml-1">/ 100</span>
                </div>
              </div>
            </div>

            {/* Evidence Coverage & Provisional Warnings */}
            {insufficientEvidence ? (
              <div className="flex items-start gap-3 p-3.5 bg-[#FFF0ED] border border-[#FFD3CE] rounded-2xl text-[#D93829] text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Insufficient Evidence:</strong> Fewer than 2 dimensions have verified observations. This developer receives a provisional ranking penalty until more evidence is submitted.
                </div>
              </div>
            ) : isProvisional ? (
              <div className="flex items-start gap-3 p-3.5 bg-[#EAF3FF] border border-[#D2E4FC] rounded-2xl text-[#1E40AF] text-xs">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Provisional Rating:</strong> Ranked using {normalizedCount} of 5 observed dimensions. Weights are normalized to 100% across observed dimensions without penalizing unobserved tracks with zero scores.
                </div>
              </div>
            ) : null}

            {/* 5-Dimension Component Breakdown */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs sm:text-sm font-bold text-[#15264B]">Dimension Scores & Weights</h4>
                <span className="text-xs text-[#687793]">
                  Evidence Coverage: <strong className="text-[#15264B]">{Math.round((developer.evidenceCoverage || 0.8) * 100)}%</strong>
                </span>
              </div>

              <div className="space-y-3">
                {Object.entries(COMPONENT_DEFINITIONS).map(([key, def]) => {
                  const item = breakdown[key] || {
                    score: developer.components?.[key] ?? null,
                    baseWeight: def.weight,
                    effectiveWeight: def.weight,
                    weightedContribution: (developer.components?.[key] ?? 0) * def.weight
                  };

                  const isObserved = item.score !== null && item.score !== undefined;
                  const itemScore = isObserved ? item.score : 0;
                  const weightPct = Math.round(item.effectiveWeight * 100);

                  return (
                    <div key={key} className="p-3.5 rounded-2xl border border-[#E2EAF5] bg-white">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#15264B]">{def.label}</span>
                          <span className="text-[#687793] font-mono text-[11px]">({weightPct}% weight)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isObserved ? (
                            <>
                              <span className="font-bold text-[#15264B]">{itemScore}</span>
                              <span className="text-[#687793]">/ 100</span>
                              <span className="text-[11px] text-[#059669] font-bold bg-[#E4F8EF] px-1.5 py-0.5 rounded-full border border-[#B9EED9]">
                                +{(item.weightedContribution || (itemScore * def.weight)).toFixed(1)} pts
                              </span>
                            </>
                          ) : (
                            <span className="text-[11px] font-medium text-[#687793] bg-[#F5F8FF] px-2 py-0.5 rounded-full border border-[#E2EAF5]">
                              Not observed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-[#E2EAF5] rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            isObserved
                              ? itemScore >= 90 ? "bg-[#10B981]" : itemScore >= 75 ? "bg-[#3B82F6]" : "bg-[#F59E0B]"
                              : "bg-slate-200"
                          )}
                          style={{ width: isObserved ? `${itemScore}%` : '0%' }}
                        />
                      </div>
                      <p className="text-[11px] text-[#687793] mt-1">{def.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Deterministic Note */}
            <div className="p-3.5 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] flex items-center justify-between text-xs text-[#687793]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span>Deterministic tie-breaking uses confidence coverage, verified credentials, and user hash.</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#E2EAF5] bg-[#F5F8FF]/60 flex items-center justify-between">
            <span className="text-xs text-[#687793]">
              Deterministic audit calculation
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
