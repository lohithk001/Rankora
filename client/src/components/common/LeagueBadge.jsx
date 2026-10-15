import React from 'react';
import { Award, Shield, Sparkles, Zap } from 'lucide-react';

export function LeagueBadge({ league = 'Rookie', size = 'md', showIcon = true }) {
  const norm = league.toLowerCase();

  const configs = {
    rookie: {
      label: 'Rookie League',
      desc: 'Foundational verified projects & consistent effort',
      className: 'badge-rookie',
      icon: Shield,
      dotColor: '#10B981'
    },
    rising: {
      label: 'Rising League',
      desc: 'Demonstrated practical capability & working tested code',
      className: 'badge-rising',
      icon: Zap,
      dotColor: '#06B6D4'
    },
    advanced: {
      label: 'Advanced League',
      desc: 'High engineering standards, tests, and architectural design',
      className: 'badge-advanced',
      icon: Award,
      dotColor: '#A855F7'
    },
    elite: {
      label: 'Elite League',
      desc: 'Exceptional verified problem-solving and systems performance',
      className: 'badge-elite',
      icon: Sparkles,
      dotColor: '#F59E0B'
    }
  };

  const current = configs[norm] || configs.rookie;
  const IconComponent = current.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 rounded-xl gap-2 font-semibold'
  };

  return (
    <span 
      title={current.desc}
      className={`inline-flex items-center cursor-help transition-all ${current.className} ${sizeClasses[size] || sizeClasses.md}`}
    >
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{league}</span>
    </span>
  );
}
