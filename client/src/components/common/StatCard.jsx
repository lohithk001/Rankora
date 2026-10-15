import React from 'react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';
import { ChevronRight } from 'lucide-react';

export function StatCard({
  label,
  value,
  subvalue,
  badgeText,
  badgeVariant = 'mint',
  icon: Icon,
  hasArrow = false,
  onClick,
  className
}) {
  return (
    <Card 
      variant={onClick ? "interactive" : "default"} 
      onClick={onClick}
      className={cn("p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden", className)}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-[#687793] uppercase tracking-wider">
          {label}
        </span>
        {hasArrow && (
          <ChevronRight className="w-4 h-4 text-[#687793]" />
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-xl sm:text-2xl font-extrabold text-[#15264B] tracking-tight">
          {value}
        </span>
        {subvalue && (
          <span className="text-xs text-[#687793] font-medium">
            {subvalue}
          </span>
        )}
      </div>

      {badgeText && (
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className={cn(
            "text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1",
            badgeVariant === 'mint' && "bg-[#E4F8EF] text-[#059669]",
            badgeVariant === 'yellow' && "bg-[#FFF9E6] text-[#B45309]",
            badgeVariant === 'blue' && "bg-[#EAF3FF] text-[#1D4ED8]",
            badgeVariant === 'coral' && "bg-[#FFE8E5] text-[#DC2626]"
          )}>
            {badgeText}
          </span>
        </div>
      )}

      {Icon && (
        <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none">
          <Icon className="w-12 h-12 text-[#15264B]" />
        </div>
      )}
    </Card>
  );
}
