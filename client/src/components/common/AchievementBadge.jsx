import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { Trophy, Award, Star, Heart, GitBranch, Sparkles } from 'lucide-react';

const ICON_MAP = {
  '🏆': Trophy,
  '🛡️': Award,
  '⭐': Star,
  '💜': Heart,
  '🌿': GitBranch,
  '✨': Sparkles,
};

export function AchievementBadge({
  title,
  subtitle,
  icon,
  colorScheme = 'amber', // 'amber', 'teal', 'orange', 'purple', 'emerald', 'yellow'
  onClick,
  className
}) {
  const IconComponent = typeof icon === 'string' && ICON_MAP[icon] ? ICON_MAP[icon] : null;

  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  const colorStyles = {
    amber: "bg-gradient-to-b from-[#FFF8DC] to-[#FFE89A] text-[#B45309] border-[#FDE68A]",
    teal: "bg-gradient-to-b from-[#E4F8EF] to-[#BAE6FD] text-[#0D9488] border-[#99F6E4]",
    orange: "bg-gradient-to-b from-[#FFF0ED] to-[#FFD3CE] text-[#EA580C] border-[#FED7AA]",
    purple: "bg-gradient-to-b from-[#F3EFFF] to-[#DDD0FF] text-[#7C3AED] border-[#DDD0FF]",
    emerald: "bg-gradient-to-b from-[#ECFDF5] to-[#A7F3D0] text-[#059669] border-[#6EE7B7]",
    yellow: "bg-gradient-to-b from-[#FEF9C3] to-[#FDE047] text-[#A16207] border-[#FACC15]",
  };

  return (
    <motion.div 
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      aria-label={onClick ? `Achievement: ${title}` : undefined}
      whileHover={onClick ? { y: -3 } : undefined}
      whileTap={onClick ? { scale: 0.96 } : undefined}
      className={cn(
        "flex flex-col items-center text-center p-2 group select-none rounded-xl",
        onClick && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
        className
      )}
    >
      <motion.div 
        whileHover={{ scale: 1.12, rotate: [0, -5, 5, 0] }}
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
        className={cn(
          "w-12 h-12 rounded-full border flex items-center justify-center shadow-xs mb-2",
          colorStyles[colorScheme] || colorStyles.amber
        )}
      >
        {IconComponent ? (
          <IconComponent className="w-5 h-5" />
        ) : typeof icon === 'string' ? (
          <span className="text-xl">{icon}</span>
        ) : (
          icon || <Award className="w-5 h-5" />
        )}
      </motion.div>
      <span className="text-xs font-bold text-[#15264B] leading-tight max-w-[90px]">
        {title}
      </span>
      {subtitle && (
        <span className="text-[10px] text-[#687793] mt-0.5">{subtitle}</span>
      )}
    </motion.div>
  );
}
