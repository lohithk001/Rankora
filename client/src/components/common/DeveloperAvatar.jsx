import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export function DeveloperAvatar({
  src,
  name = 'Developer',
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  status = 'none', // 'online', 'offline', 'none'
  rankBadge, // e.g. 1, 2, 3
  className
}) {
  const [imageError, setImageError] = useState(false);

  const sizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-xl",
  };

  const initials = name
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={cn("relative inline-block shrink-0", className)}>
      <div className={cn(
        "rounded-full overflow-hidden border-2 border-white ring-1 ring-[#E2EAF5] bg-[#EAF3FF] flex items-center justify-center font-bold text-[#15264B]",
        sizeMap[size]
      )}>
        {src && !imageError ? (
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Online Status Dot */}
      {status === 'online' && (
        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] absolute bottom-0 right-0 ring-2 ring-white" />
      )}

      {/* Rank Indicator for Podium/Table */}
      {rankBadge !== undefined && (
        <span className={cn(
          "w-5 h-5 rounded-full text-[11px] font-extrabold flex items-center justify-center absolute -top-1 -right-1 ring-2 ring-white shadow-xs text-white",
          rankBadge === 1 && "bg-[#F59E0B]",
          rankBadge === 2 && "bg-[#3B82F6]",
          rankBadge === 3 && "bg-[#F97316]",
          rankBadge > 3 && "bg-[#64748B]"
        )}>
          {rankBadge}
        </span>
      )}
    </div>
  );
}
