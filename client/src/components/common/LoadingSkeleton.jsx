import React from 'react';
import { cn } from '../../lib/utils';

export function LoadingSkeleton({
  className,
  count = 1,
  type = 'rect', // 'rect', 'circle', 'card'
}) {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((_, i) => (
          <div key={i} className="rankora-card p-5 space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-200" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-200 rounded w-1/3" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded" />
              <div className="h-3 bg-slate-200 rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      {items.map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse bg-slate-200",
            type === 'circle' ? "rounded-full" : "rounded-xl",
            className || "h-4 w-full"
          )}
        />
      ))}
    </div>
  );
}
