import React from 'react';
import { 
  Search, 
  X, 
  ShieldCheck 
} from 'lucide-react';
import { 
  RANKING_SCOPES, 
  SUPPORTED_COUNTRIES, 
  SKILL_CATEGORIES, 
  LEAGUE_TIERS 
} from '../constants/leaderboardConstants';
import { FilterBar } from '../../../components/common/FilterBar';

const SKILL_CATEGORY_LABELS = {
  [SKILL_CATEGORIES.OVERALL]: 'Overall',
  [SKILL_CATEGORIES.FRONTEND]: 'Frontend',
  [SKILL_CATEGORIES.BACKEND]: 'Backend',
  [SKILL_CATEGORIES.FULLSTACK]: 'Full Stack',
  [SKILL_CATEGORIES.AIML]: 'AI / ML',
  [SKILL_CATEGORIES.DATA_ENG]: 'Data Engineering',
  [SKILL_CATEGORIES.DEVOPS]: 'DevOps & Cloud',
  [SKILL_CATEGORIES.MOBILE]: 'Mobile',
  [SKILL_CATEGORIES.CYBERSECURITY]: 'Cybersecurity',
  [SKILL_CATEGORIES.PROBLEM_SOLVING]: 'Problem Solving'
};

const SCOPE_OPTIONS = [
  { id: RANKING_SCOPES.GLOBAL, label: 'Global' },
  { id: RANKING_SCOPES.COUNTRY, label: 'By Country' },
  { id: RANKING_SCOPES.SKILL, label: 'By Track' },
  { id: RANKING_SCOPES.LEAGUE, label: 'Leagues' }
];

export function LeaderboardFilters({
  scope,
  onScopeChange,
  country,
  onCountryChange,
  skillCategory,
  onSkillCategoryChange,
  league,
  onLeagueChange,
  searchQuery,
  onSearchChange,
  verifiedOnly,
  onVerifiedOnlyChange,
  onClearFilters,
  totalResults
}) {
  const hasActiveFilters = 
    country !== 'Global' || 
    skillCategory !== SKILL_CATEGORIES.OVERALL || 
    league !== 'All' || 
    verifiedOnly || 
    (searchQuery && searchQuery.trim() !== '');

  return (
    <div className="space-y-3.5">
      {/* Top Scope Pills matching Rankora FilterBar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <FilterBar
          options={SCOPE_OPTIONS}
          activeOption={scope}
          onSelect={onScopeChange}
        />

        {/* Global Search Bar */}
        <div className="relative w-full sm:w-72 max-w-full">
          <Search className="w-3.5 h-3.5 text-[#687793] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search developers or skills..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 bg-white border border-[#E2EAF5] rounded-full text-xs text-[#15264B] placeholder-[#687793] focus:outline-none focus:border-[#3B82F6] shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#687793] hover:text-[#15264B] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Secondary Filter Row */}
      <div className="rankora-card-sm p-3 sm:p-4 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Country Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#687793] font-medium">Country:</span>
            <select
              value={country}
              onChange={(e) => onCountryChange(e.target.value)}
              className="bg-[#F5F8FF] border border-[#E2EAF5] rounded-full px-3 py-1 text-xs font-semibold text-[#15264B] focus:outline-none focus:border-[#3B82F6] cursor-pointer"
            >
              <option value="Global">All Countries (Global)</option>
              {SUPPORTED_COUNTRIES.map(c => (
                <option key={c.code} value={c.name}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Track Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#687793] font-medium">Track:</span>
            <select
              value={skillCategory}
              onChange={(e) => onSkillCategoryChange(e.target.value)}
              className="bg-[#F5F8FF] border border-[#E2EAF5] rounded-full px-3 py-1 text-xs font-semibold text-[#15264B] focus:outline-none focus:border-[#3B82F6] cursor-pointer"
            >
              {Object.entries(SKILL_CATEGORY_LABELS).map(([catKey, label]) => (
                <option key={catKey} value={catKey}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* League Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#687793] font-medium">League:</span>
            <select
              value={league}
              onChange={(e) => onLeagueChange(e.target.value)}
              className="bg-[#F5F8FF] border border-[#E2EAF5] rounded-full px-3 py-1 text-xs font-semibold text-[#15264B] focus:outline-none focus:border-[#3B82F6] cursor-pointer"
            >
              <option value="All">All Leagues</option>
              {Object.keys(LEAGUE_TIERS).map(tier => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </div>

          {/* Verified toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none pl-1">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => onVerifiedOnlyChange(e.target.checked)}
              className="accent-[#4CC9A6] cursor-pointer"
            />
            <span className="text-[#15264B] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
              Verified Only
            </span>
          </label>
        </div>

        {/* Results summary and reset */}
        <div className="flex items-center gap-2 text-xs ml-auto">
          <span className="text-[#687793]">
            <strong>{totalResults}</strong> engineers ranked
          </span>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-[#3B82F6] font-bold hover:underline cursor-pointer ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
