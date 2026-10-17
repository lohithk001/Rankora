import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, User, Award, Briefcase } from 'lucide-react';
import { cn } from '../../lib/utils';

export function MobileNav() {
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/app/leaderboard', label: 'Ranks', icon: Trophy },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/skills', label: 'Skills', icon: Award },
    { path: '/hiring', label: 'Hiring', icon: Briefcase },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E2EAF5] px-2 py-1.5 flex items-center justify-around z-40 shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all select-none",
              isActive
                ? "text-[#15264B] font-bold"
                : "text-[#687793] hover:text-[#15264B]"
            )}
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "p-1 rounded-lg transition-colors",
                  isActive && "bg-[#EAF3FF]"
                )}>
                  <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5]" : "stroke-2")} />
                </div>
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
