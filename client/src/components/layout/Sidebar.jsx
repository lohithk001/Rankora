import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/react';
import { RankoraLogo } from '../common/RankoraLogo';
import { 
  Home, 
  Trophy, 
  Award, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Lock,
  Sparkles
} from 'lucide-react';
import { useDeveloperProfile } from '../../context/DeveloperProfileContext';
import { cn } from '../../lib/utils';

const NAV_ITEMS = [
  { 
    path: '/dashboard', 
    label: 'Dashboard', 
    icon: Home, 
    badgeBg: 'bg-[#10B981] text-white', 
    inactiveBadgeBg: 'bg-[#E8F8F0] text-[#10B981]',
    isProtected: true
  },
  { 
    path: '/app/leaderboard', 
    label: 'Leaderboard', 
    icon: Trophy, 
    badgeBg: 'bg-[#7C3AED] text-white', 
    inactiveBadgeBg: 'bg-[#F0EBFF] text-[#7C3AED]',
    isProtected: true
  },
  { 
    path: '/skills', 
    label: 'Skills', 
    icon: Award, 
    badgeBg: 'bg-[#D97706] text-white', 
    inactiveBadgeBg: 'bg-[#FEF3C7] text-[#D97706]',
    isProtected: true
  },
  { 
    path: '/assessments', 
    label: 'Assessments', 
    icon: FileText, 
    badgeBg: 'bg-[#9333EA] text-white', 
    inactiveBadgeBg: 'bg-[#F3E8FF] text-[#9333EA]',
    isProtected: true
  },
  { 
    path: '/growth', 
    label: 'Growth', 
    icon: TrendingUp, 
    badgeBg: 'bg-[#16A34A] text-white', 
    inactiveBadgeBg: 'bg-[#DCFCE7] text-[#16A34A]',
    isProtected: true
  },
  { 
    path: '/market-value', 
    label: 'Market Value', 
    icon: DollarSign, 
    badgeBg: 'bg-[#0284C7] text-white', 
    inactiveBadgeBg: 'bg-[#E0F2FE] text-[#0284C7]',
    isProtected: true
  },
  { 
    path: '/hiring', 
    label: 'Hiring', 
    icon: Briefcase, 
    badgeBg: 'bg-[#DB2777] text-white', 
    inactiveBadgeBg: 'bg-[#FCE7F3] text-[#DB2777]',
    isProtected: true
  },
];

export function Sidebar({ 
  className, 
  onCloseMobile, 
  isCollapsed = false, 
  onToggleCollapse 
}) {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { profile, onboardingStatus } = useDeveloperProfile();

  return (
    <aside 
      style={{
        position: onCloseMobile ? 'relative' : 'fixed',
        top: 0,
        left: 0,
        height: onCloseMobile ? '100%' : '100dvh',
      }}
      className={cn(
        "z-30 shrink-0 overflow-y-auto overflow-x-hidden flex flex-col justify-between relative bg-white border-r border-[#E2EAF5] transition-all duration-300 ease-in-out select-none",
        isCollapsed ? "w-[72px] p-2" : "w-[260px] sm:w-[272px] p-4",
        onCloseMobile && "w-full h-full",
        "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full",
        className
      )}
    >
      {/* Soft Pastel Background Accents */}
      
      {/* Top right subtle lavender/blue blur */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#E4EDFE]/80 via-[#EDF3FF]/40 to-transparent rounded-full blur-2xl pointer-events-none -z-0" />

      {/* TOP & NAV CONTAINER */}
      <div className="relative z-10 space-y-4">
        
        {/* Brand Logo, Subtitle & Collapse Action */}
        <div className="px-1 pt-1 flex items-start justify-between gap-1">
          <div className={cn("min-w-0", isCollapsed && "mx-auto")}>
            <RankoraLogo 
              size={isCollapsed ? "sm" : "lg"} 
              showText={!isCollapsed} 
              onClick={onCloseMobile} 
            />
            {!isCollapsed && (
              <p className="text-[11px] font-medium text-[#687793] mt-1 tracking-tight truncate">
                Your skills. Your growth. Your rank.
              </p>
            )}
          </div>

          {/* Expand/Collapse Toggle Button for Desktop */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-[#687793] hover:text-[#15264B] hover:bg-[#F5F8FF] border border-transparent hover:border-[#E2EAF5] transition-all cursor-pointer shrink-0 mt-1"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
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
                end={item.path === '/dashboard'}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) => cn(
                  "relative w-full flex items-center rounded-2xl text-sm font-semibold transition-all group select-none",
                  isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2.5",
                  isActive
                    ? item.path === '/dashboard'
                      ? "bg-[#E8F8F0] text-[#15264B] font-bold"
                      : "bg-[#EBF3FF] text-[#15264B] font-bold"
                    : "text-[#475569] hover:text-[#15264B] hover:bg-[#F8FAFC]"
                )}
              >
                {({ isActive }) => (
                  <>
                    {/* Left Active Emerald Indicator Pill Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#10B981] rounded-r-full" />
                    )}

                    {/* Colored Icon Square Tile */}
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                      isActive ? item.badgeBg : item.inactiveBadgeBg
                    )}>
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </div>

                    {/* Nav Item Label (hidden when collapsed) */}
                    {!isCollapsed && (
                      <span className="truncate tracking-tight">{item.label}</span>
                    )}

                    {/* Public or Locked Badge when not collapsed */}
                    {!isCollapsed && (
                      <>
                        {item.publicBadge ? (
                          <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#E8F8F0] text-[#059669] border border-[#A7F3D0] tracking-tight">
                            {item.publicBadge}
                          </span>
                        ) : item.isProtected && !isSignedIn ? (
                          <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-[#94A3B8] bg-[#F1F5F9] px-1.5 py-0.5 rounded-md">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Login</span>
                          </span>
                        ) : item.hasChevron ? (
                          <ChevronRight className={cn(
                            "w-4 h-4 ml-auto transition-transform group-hover:translate-x-0.5",
                            isActive ? "text-[#15264B]" : "text-[#94A3B8]"
                          )} />
                        ) : null}
                      </>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM CONTAINER: Floating User Card */}
      <div className="relative z-10 pt-4 space-y-2">
        {/* Onboarding skipped banner */}
        {!isCollapsed && onboardingStatus.isSkipped && !onboardingStatus.isCompleted && (
          <button
            type="button"
            onClick={() => { navigate('/onboarding'); onCloseMobile?.(); }}
            className="w-full p-2.5 rounded-xl bg-[#FFF8DC] border border-[#FFE89A] hover:bg-[#FEF3C7] text-left transition cursor-pointer flex items-center justify-between gap-1 shadow-2xs group"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
              <div className="truncate">
                <span className="text-[11px] font-bold text-[#92400E] block truncate">Complete Onboarding</span>
                <span className="text-[9px] text-[#B45309] block truncate">Claim verified rank badge</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#D97706] shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        <div 
          role="button"
          tabIndex={0}
          aria-label={`View ${profile.displayName}'s profile`}
          onClick={() => { navigate('/profile'); onCloseMobile?.(); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/profile');
              onCloseMobile?.();
            }
          }}
          title={isCollapsed ? profile.displayName : undefined}
          className={cn(
            "bg-white rounded-2xl border border-[#E2EAF5] shadow-xs cursor-pointer hover:border-[#CBD5E1] hover:shadow-sm transition-all select-none group focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none",
            isCollapsed ? "p-2 flex justify-center" : "p-2.5 sm:p-3 flex items-center justify-between"
          )}
        >
          <div className={cn("flex items-center min-w-0", !isCollapsed && "gap-2.5")}>
            <div className="relative shrink-0">
              <img 
                src={profile.avatar} 
                alt={profile.displayName}
                className="w-10 h-10 rounded-full object-cover border border-[#E2EAF5]"
              />
              <span className="w-3 h-3 rounded-full bg-[#10B981] border-2 border-white absolute bottom-0 right-0 shadow-2xs" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-[#15264B] truncate leading-tight group-hover:text-[#2563EB] transition-colors">
                  {profile.displayName}
                </h4>
                <p className="text-[11px] text-[#687793] truncate leading-tight mt-0.5">
                  @{profile.username || 'developer'}
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <ChevronDown className="w-4 h-4 text-[#687793] group-hover:text-[#15264B] transition-colors shrink-0 ml-1" />
          )}
        </div>
      </div>
    </aside>
  );
}
