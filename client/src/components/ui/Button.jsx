import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function Button({
  children,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost', 'mint', 'danger'
  size = 'md', // 'sm', 'md', 'lg', 'icon'
  className,
  disabled,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5 h-8",
    md: "text-sm px-5 py-2.5 gap-2 h-10",
    lg: "text-base px-6 py-3 gap-2.5 h-12",
    icon: "p-2 w-9 h-9 rounded-full",
  };

  const variantStyles = {
    primary: "bg-[#15264B] text-white hover:bg-[#0D1933] shadow-sm hover:shadow focus:ring-[#15264B]/30",
    secondary: "bg-white text-[#15264B] border border-[#E2EAF5] hover:bg-[#F5F8FF] hover:border-[#CBD8EB] shadow-2xs focus:ring-[#E2EAF5]",
    mint: "bg-[#4CC9A6] text-[#0A3D2E] hover:bg-[#3db896] shadow-sm hover:shadow font-bold focus:ring-[#4CC9A6]/40",
    outline: "border border-[#15264B] text-[#15264B] bg-transparent hover:bg-[#EAF3FF] focus:ring-[#15264B]/20",
    ghost: "bg-transparent text-[#687793] hover:text-[#15264B] hover:bg-[#EAF3FF] focus:ring-slate-200",
    danger: "bg-[#FFE8E5] text-[#D93829] border border-[#FFD3CE] hover:bg-[#ffd7d3] focus:ring-[#FFE8E5]",
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? undefined : { scale: 1.02, y: -0.5 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {Icon && <Icon className={cn("w-4 h-4 shrink-0", size === 'sm' && "w-3.5 h-3.5")} />}
      {children}
    </motion.button>
  );
}
