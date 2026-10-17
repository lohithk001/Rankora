import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function RankoraLogo({
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  linkTo = '/',
  showText = true,
  onClick,
  className
}) {
  const sizeMap = {
    sm: { img: 'w-8 h-8', text: 'text-lg', gap: 'gap-2' },
    md: { img: 'w-9 h-9 sm:w-10 sm:h-10', text: 'text-xl sm:text-2xl', gap: 'gap-2.5' },
    lg: { img: 'w-11 h-11 sm:w-12 sm:h-12', text: 'text-2xl sm:text-[27px]', gap: 'gap-3' },
    xl: { img: 'w-13 h-13 sm:w-14 sm:h-14', text: 'text-3xl sm:text-4xl', gap: 'gap-3.5' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={cn("inline-flex items-center group select-none", currentSize.gap, className)}>
      <img
        src="/rankora-logo.png"
        alt="Rankora Logo"
        className={cn(
          "object-contain transition-transform duration-200 group-hover:scale-108 drop-shadow-sm shrink-0",
          currentSize.img
        )}
      />
      {showText && (
        <span className={cn(
          "font-['Outfit','Plus_Jakarta_Sans',sans-serif] font-black text-[#15264B] tracking-tight transition-colors duration-200 group-hover:text-[#0B1736] leading-none",
          currentSize.text
        )}>
          Rankora
        </span>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link 
        to={linkTo} 
        onClick={onClick}
        className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-[#15264B] rounded-lg"
      >
        {content}
      </Link>
    );
  }

  return content;
}
