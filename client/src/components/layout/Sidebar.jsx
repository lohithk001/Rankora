import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Trophy, 
  User, 
  Award, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  Settings 
} from 'lucide-react';
import { RankoraLogo } from '../common/RankoraLogo';
import { cn } from '../../lib/utils';

export const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/skills', label: 'Skills', icon: Award },
  { path: '/assessments', label: 'Assessments', icon: FileText },
  { path: '/growth', label: 'Growth', icon: TrendingUp },
  { path: '/market-value', label: 'Market Value', icon: DollarSign },
  { path: '/hiring', label: 'Hiring', icon: Briefcase },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ className, onCloseMobile }) {
  return (
    <aside className={cn(
      "w-60 bg-white border-r border-[#E2EAF5] flex flex-col justify-between p-5 shrink-0 h-screen sticky top-0 overflow-y-auto",
      className
    )}>
      <div className="space-y-7">
        {/* Brand Logo */}
        <div className="px-2 pt-1">
          <RankoraLogo size="md" />
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                end={item.path === '/'}
                className={({ isActive }) => cn(
                  "w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group select-none",
                  isActive
                    ? "bg-[#EAF3FF] text-[#15264B] font-bold shadow-2xs"
                    : "text-[#687793] hover:text-[#15264B] hover:bg-[#F5F8FF]"
                )}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn(
                      "w-4 h-4 transition-colors shrink-0",
                      isActive ? "text-[#15264B] stroke-[2.5]" : "text-[#687793] group-hover:text-[#15264B]"
                    )} />
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Subtle Platform Attribution */}
      <div className="px-3 py-2 text-[11px] text-[#687793] font-medium border-t border-[#E2EAF5] pt-4">
        <p className="font-semibold text-[#15264B]">Rankora Platform</p>
        <p className="text-[10px] text-[#687793] mt-0.5">Global Skill Intelligence v2.0</p>
      </div>
    </aside>
  );
}
