import React from 'react';
import { cn } from '../../lib/utils';

export function LoadingSkeleton({
  className,
  count = 1,
  type = 'rect', // 'rect', 'circle', 'card', 'table', 'profile', 'stat'
}) {
  const items = Array.from({ length: count });

  if (type === 'table') {
    return (
      <div className="w-full bg-white rounded-2xl border border-[#E2EAF5] overflow-hidden">
        <div className="p-4 border-b border-[#E2EAF5] bg-[#F8FAFC]">
          <div className="h-4 bg-slate-200 rounded-md w-1/4 animate-pulse" />
        </div>
        <div className="divide-y divide-[#E2EAF5]">
          {items.map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-6 h-4 bg-slate-200 rounded" />
                <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-1.5 flex-1 max-w-xs">
                  <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                  <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="hidden sm:block w-20 h-4 bg-slate-200 rounded" />
              <div className="w-16 h-6 bg-slate-200 rounded-full" />
              <div className="w-12 h-5 bg-slate-200 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'stat') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
        {items.map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] space-y-3 animate-pulse">
            <div className="h-3 bg-slate-200 rounded w-1/2" />
            <div className="h-7 bg-slate-300 rounded w-2/3" />
            <div className="h-4 bg-slate-200 rounded-full w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="space-y-6 max-w-5xl mx-auto w-full animate-pulse">
        {/* Profile Card Header Skeleton */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2EAF5] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-slate-200 shrink-0" />
              <div className="space-y-2">
                <div className="h-5 bg-slate-300 rounded w-48" />
                <div className="h-3.5 bg-slate-200 rounded w-32" />
                <div className="h-3 bg-slate-100 rounded w-56" />
              </div>
            </div>
            <div className="w-28 h-9 bg-slate-200 rounded-xl" />
          </div>

          {/* 4 Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[1, 2, 3, 4].map(k => (
              <div key={k} className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] space-y-2">
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-6 bg-slate-300 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>

        {/* Content Tabs Skeleton */}
        <div className="h-10 bg-slate-200 rounded-xl w-72" />
        <div className="p-6 rounded-3xl bg-white border border-[#E2EAF5] space-y-4">
          <div className="h-4 bg-slate-300 rounded w-40" />
          <div className="h-24 bg-[#F5F8FF] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {items.map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-[#E2EAF5] space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-300 rounded w-2/3" />
                <div className="h-3 bg-slate-200 rounded w-1/3" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded" />
              <div className="h-3 bg-slate-100 rounded w-4/5" />
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
