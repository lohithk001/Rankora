import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { SearchX } from 'lucide-react';

export function EmptyState({
  title = "No results found",
  description = "Try adjusting your search or filters to find what you're looking for.",
  icon: Icon = SearchX,
  actionLabel,
  onAction,
  className
}) {
  return (
    <div className={cn("text-center py-12 px-4 flex flex-col items-center justify-center bg-white/60 rounded-2xl border border-dashed border-[#E2EAF5]", className)}>
      <div className="w-14 h-14 rounded-2xl bg-[#EAF3FF] text-[#3B82F6] flex items-center justify-center mb-3">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-[#15264B] mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-[#687793] max-w-sm mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
