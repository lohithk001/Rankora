import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function ProgressBar({
  value = 0,
  max = 100,
  label,
  score,
  weight,
  color = 'mint', // 'mint', 'blue', 'lavender', 'coral', 'yellow', 'teal', 'purple'
  className,
  showLabel = true
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorStyles = {
    mint: "bg-[#4CC9A6]",
    blue: "bg-[#3B82F6]",
    teal: "bg-[#14B8A6]",
    lavender: "bg-[#A78BFA]",
    purple: "bg-[#8B5CF6]",
    coral: "bg-[#F87171]",
    yellow: "bg-[#FBBF24]",
    amber: "bg-[#F59E0B]",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#15264B]">{label}</span>
            {weight && <span className="text-[#687793] text-[11px]">({weight})</span>}
          </div>
          <span className="font-bold text-[#15264B]">{score ?? value}</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-[#EEF2F6] rounded-full overflow-hidden p-0.5">
        <motion.div
          className={cn("h-full rounded-full", colorStyles[color] || colorStyles.mint)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
