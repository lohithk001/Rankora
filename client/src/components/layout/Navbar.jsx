import React, { useState } from 'react';
import { 
  Trophy, 
  User, 
  Layers, 
  Terminal, 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  Settings, 
  ChevronDown, 
  Sliders
} from 'lucide-react';
import { LeagueBadge } from '../common/LeagueBadge';
import { SAMPLE_DEVELOPERS } from '../../lib/mockData';

export function Navbar({ 
  currentTab, 
  setCurrentTab, 
  activeDev, 
  setActiveDev, 
  onOpenFormula 
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // Core prominent links
  const primaryNavItems = [
    { id: 'landing', label: 'Overview' },
    { id: 'leaderboards', label: 'Leaderboards', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'assessments', label: 'Challenges', icon: Terminal },
    { id: 'market', label: 'Market Range', icon: DollarSign },
    { id: 'recruiter', label: 'Recruiter Search', icon: Briefcase, badge: 'Hire' },
  ];

  // Secondary items in 'More' menu to prevent nav crowding
  const secondaryNavItems = [
    { id: 'skills', label: 'Skills & Evidence', icon: Layers },
    { id: 'growth', label: 'Growth Velocity', icon: TrendingUp },
    { id: 'settings', label: 'Settings & Appeals', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080B11]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setCurrentTab('landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <span className="font-display font-black text-white text-lg tracking-tight">R</span>
              </div>
              <div>
                <span className="font-display font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                  Rankora
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">v1.0</span>
                </span>
                <span className="text-[10px] block -mt-1 text-slate-400 font-sans tracking-wide">Developer Intelligence</span>
              </div>
            </button>
          </div>

          {/* Primary Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryNavItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm font-semibold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-semibold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* 'More' Dropdown for secondary tabs */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                  ['skills', 'growth', 'settings'].includes(currentTab)
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {moreDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-48 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl p-1.5 z-50 animate-fadeIn"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  {secondaryNavItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentTab(item.id);
                          setMoreDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition ${
                          currentTab === item.id 
                            ? 'bg-indigo-600/20 text-indigo-300' 
                            : 'text-slate-300 hover:bg-slate-800/70'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Formula Trigger Button */}
            <button
              onClick={onOpenFormula}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-300 hover:text-white hover:border-cyan-500/50 transition"
              title="Inspect transparent formula: S = 0.30P + 0.25E + 0.20T + 0.15C + 0.10G"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-[11px] font-semibold text-cyan-300">S Formula</span>
            </button>

            {/* Active Profile Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 transition text-left"
              >
                <img 
                  src={activeDev.avatar} 
                  alt={activeDev.displayName} 
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/40"
                />
                <div className="hidden md:block text-xs">
                  <div className="font-semibold text-slate-200 leading-tight">
                    {activeDev.displayName.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Score: <span className="text-cyan-400 font-bold">{activeDev.score}</span>
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Persona Switcher Dropdown */}
              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1">
                    Switch Demo Persona
                  </div>
                  <div className="space-y-1">
                    {SAMPLE_DEVELOPERS.map((dev) => {
                      const isSelected = dev.id === activeDev.id;
                      return (
                        <button
                          key={dev.id}
                          onClick={() => {
                            setActiveDev(dev);
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition ${
                            isSelected 
                              ? 'bg-indigo-600/20 text-white border border-indigo-500/30' 
                              : 'text-slate-300 hover:bg-slate-800/70'
                          }`}
                        >
                          <img src={dev.avatar} alt={dev.displayName} className="w-8 h-8 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{dev.displayName}</div>
                            <div className="text-[10px] text-slate-400 truncate">{dev.roleTitle}</div>
                          </div>
                          <LeagueBadge league={dev.league} size="sm" showIcon={false} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Recruiter CTA */}
            <button
              onClick={() => setCurrentTab('recruiter')}
              className="btn-primary text-xs !py-1.5 !px-3"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Recruiter View</span>
            </button>
          </div>

        </div>

        {/* Mobile Horizontal Subnav */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-800/60 gap-1.5 no-scrollbar">
          {[...primaryNavItems, ...secondaryNavItems].map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap ${
                  isActive 
                    ? 'bg-indigo-600 text-white font-medium' 
                    : 'text-slate-400 hover:text-white bg-slate-900/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
