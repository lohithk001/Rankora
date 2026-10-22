import React from 'react';
import { cn } from '../../lib/utils';
import { Code2 } from 'lucide-react';

export function SkillBadge({
  name,
  level,
  icon,
  iconColor,
  variant = 'pill', // 'pill' or 'card'
  onClick,
  className
}) {
  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  if (variant === 'card') {
    return (
      <div 
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? "button" : undefined}
        aria-label={onClick ? `${name}, ${level || 'verified skill'}` : undefined}
        className={cn(
          "bg-white border border-[#E2EAF5] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs hover:shadow-sm hover:border-[#CBD8EB] transition-all",
          onClick && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F5F8FF] border border-[#E2EAF5] flex items-center justify-center font-bold text-sm">
            {icon ? (
              typeof icon === 'string' && icon.startsWith('http') ? (
                <img src={icon} alt={name} className="w-6 h-6 object-contain" />
              ) : (
                <span className={iconColor || "text-[#15264B]"}>{icon}</span>
              )
            ) : (
              <Code2 className="w-5 h-5 text-[#3B82F6]" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#15264B] leading-tight">{name}</h4>
            {level && (
              <span className="text-xs text-[#687793] font-medium">{level}</span>
            )}
          </div>
        </div>

        {level && (
          <span className={cn(
            "text-[11px] font-bold px-2.5 py-0.5 rounded-full border",
            level.toLowerCase().includes('expert') && "bg-[#EAF3FF] text-[#1D4ED8] border-[#D2E4FC]",
            level.toLowerCase().includes('advanced') && "bg-[#E4F8EF] text-[#059669] border-[#B9EED9]",
            level.toLowerCase().includes('intermediate') && "bg-[#FFF9E6] text-[#B45309] border-[#FFE89A]"
          )}>
            {level}
          </span>
        )}
      </div>
    );
  }

  // Pill variant for profile headers
  return (
    <span
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF3FF] text-[#15264B] border border-[#D2E4FC] hover:bg-[#dbeafe] transition-colors",
        onClick && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
        className
      )}
    >
      {name}
    </span>
  );
}
