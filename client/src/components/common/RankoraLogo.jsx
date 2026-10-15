import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function RankoraLogo({
  size = 'md', // 'sm', 'md', 'lg'
  linkTo = '/',
  showText = true,
  className
}) {
  const sizeMap = {
    sm: { img: 'w-7 h-7', text: 'text-lg' },
    md: { img: 'w-8 h-8 sm:w-9 sm:h-9', text: 'text-xl' },
    lg: { img: 'w-11 h-11', text: 'text-2xl' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      <img
        src="/rankora-logo.png"
        alt="Rankora Logo"
        className={cn(
          "object-contain transition-transform group-hover:scale-105 drop-shadow-xs shrink-0",
          currentSize.img
        )}
      />
      {showText && (
        <span className={cn(
          "font-extrabold text-[#15264B] tracking-tight transition-colors group-hover:text-[#0D1933]",
          currentSize.text
        )}>
          Rankora
        </span>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-[#15264B] rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
