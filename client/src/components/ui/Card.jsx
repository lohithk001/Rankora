import React from 'react';
import { cn } from '../../lib/utils';

export function Card({
  children,
  className,
  variant = 'default', // 'default', 'small', 'interactive', 'flat'
  ...props
}) {
  const variantStyles = {
    default: "rankora-card p-5 sm:p-6",
    small: "rankora-card-sm p-4",
    interactive: "rankora-card p-5 sm:p-6 cursor-pointer hover:-translate-y-0.5",
    flat: "bg-white border border-[#E2EAF5] rounded-2xl p-5",
  };

  return (
    <div className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn("flex items-center justify-between gap-3 mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn("text-base sm:text-lg font-bold text-[#15264B] tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn("text-xs sm:text-sm text-[#687793]", className)} {...props}>
      {children}
    </p>
  );
}
