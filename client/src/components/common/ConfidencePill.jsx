import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

export function ConfidencePill({ confidence = 85, isProvisional = false }) {
  let colorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let label = `${confidence}% Verified`;

  if (isProvisional || confidence < 75) {
    colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    label = isProvisional ? 'Provisional' : `${confidence}% Emerging`;
  }

  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass}`}
      title={isProvisional ? "Provisional: Under 3 verified evidence sources. Requires additional syncs or assessments." : `High confidence evidence based on ${confidence}% observation coverage.`}
    >
      {isProvisional ? (
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
      ) : (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      )}
      <span>{label}</span>
    </div>
  );
}
