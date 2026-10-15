import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({
  children,
  variant = 'blue', // 'blue', 'mint', 'yellow', 'lavender', 'coral', 'neutral', 'gold'
  size = 'md', // 'sm', 'md'
  className,
  icon: Icon,
  ...props
}) {
  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 gap-1 font-semibold",
    md: "text-xs px-2.5 py-1 gap-1.5 font-semibold",
  };

  const variantStyles = {
    blue: "bg-[#EAF3FF] text-[#1D4ED8] border border-[#D2E4FC]",
    mint: "bg-[#E4F8EF] text-[#059669] border border-[#B9EED9]",
    yellow: "bg-[#FFF9E6] text-[#B45309] border border-[#FFE89A]",
    lavender: "bg-[#F3EFFF] text-[#6D28D9] border border-[#DDD0FF]",
    coral: "bg-[#FFE8E5] text-[#DC2626] border border-[#FFD3CE]",
    neutral: "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]",
    gold: "bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] text-[#92400E] border border-[#FCD34D] shadow-2xs",
    dark: "bg-[#15264B] text-white border border-[#15264B]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors select-none",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
}
