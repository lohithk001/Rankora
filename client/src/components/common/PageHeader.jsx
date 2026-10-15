import React from 'react';
import { cn } from '../../lib/utils';

export function PageHeader({
  title,
  subtitle,
  actions,
  className
}) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", className)}>
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#15264B] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#687793] mt-1 font-medium">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
}
