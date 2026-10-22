import React from 'react';
import { cn } from '../../lib/utils';

export function FilterBar({
  options = [],
  activeOption,
  onSelect,
  className,
  variant = 'pills' // 'pills' or 'underline'
}) {
  return (
    <div 
      className={cn("flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 no-scrollbar", className)}
      role="tablist"
      aria-label="Filter navigation"
    >
      {options.map((opt) => {
        const id = typeof opt === 'string' ? opt : opt.id;
        const label = typeof opt === 'string' ? opt : opt.label;
        const count = typeof opt === 'object' ? opt.count : undefined;
        const isActive = activeOption === id;

        if (variant === 'underline') {
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(id)}
              className={cn(
                "pb-2.5 px-3 text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer rounded-lg focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none",
                isActive ? "text-[#15264B]" : "text-[#687793] hover:text-[#15264B]"
              )}
            >
              <span>{label}</span>
              {count !== undefined && (
                <span className="ml-1.5 text-xs text-[#687793] font-normal">({count})</span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#15264B] rounded-full" />
              )}
            </button>
          );
        }

        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(id)}
            className={cn(
              "pill-tab whitespace-nowrap cursor-pointer text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none",
              isActive ? "pill-tab-active" : "pill-tab-inactive"
            )}
          >
            <span>{label}</span>
            {count !== undefined && (
              <span className={cn("ml-1.5 text-xs", isActive ? "text-white/80" : "text-[#687793]")}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
