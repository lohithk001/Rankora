import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  RotateCw, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  X,
  Globe,
  ExternalLink,
  Target
} from 'lucide-react';
import { useDeveloperProfile } from '../context/DeveloperProfileContext';
import { 
  RANKING_SCOPES, 
  SKILL_CATEGORIES 
} from '../features/leaderboard/constants/leaderboardConstants';
import { leaderboardApi } from '../features/leaderboard/services/leaderboardApi';
import { LeaderboardFilters } from '../features/leaderboard/components/LeaderboardFilters';
import { LeaderboardPodium } from '../features/leaderboard/components/LeaderboardPodium';
import { LeaderboardTable } from '../features/leaderboard/components/LeaderboardTable';
import { LeagueProgressCard } from '../features/leaderboard/components/LeagueProgressCard';
import { ScoreExplanationModal } from '../features/leaderboard/components/ScoreExplanationModal';
import { RankingMethodologyModal } from '../features/leaderboard/components/RankingMethodologyModal';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function MemberLeaderboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, onboardingStatus } = useDeveloperProfile();
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

  // URL Query synced state
  const scope = searchParams.get('scope') || RANKING_SCOPES.GLOBAL;
  const country = searchParams.get('country') || (profile?.country ? profile.country : 'Global');
  const skillCategory = searchParams.get('track') || SKILL_CATEGORIES.OVERALL;
  const league = searchParams.get('league') || 'All';
  const searchQuery = searchParams.get('q') || '';
  const verifiedOnly = searchParams.get('verified') === 'true';

  // Table pagination and sorting
  const [sortField, setSortField] = useState('rank');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Data state
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [developers, setDevelopers] = useState([]);

  // Modals state
  const [selectedDeveloperForAudit, setSelectedDeveloperForAudit] = useState(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Helper to update search params cleanly
  const updateQueryParam = useCallback((key, value, defaultValue) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (!value || value === defaultValue) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
      return next;
    }, { replace: true });
    setCurrentPage(1);
  }, [setSearchParams]);

  // Fetch leaderboard data including logged-in user profile
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await leaderboardApi.getLeaderboard({
          scope,
          country,
          skillCategory,
          league,
          searchQuery,
          verifiedOnly,
          sortField,
          sortOrder,
          currentUserProfile: profile
        });

        if (!ignore) {
          setDevelopers(result.data || []);
        }
      } catch {
        // Handled inside leaderboardApi
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [scope, country, skillCategory, league, searchQuery, verifiedOnly, sortField, sortOrder, profile]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await leaderboardApi.getLeaderboard({
        scope,
        country,
        skillCategory,
        league,
        searchQuery,
        verifiedOnly,
        sortField,
        sortOrder,
        currentUserProfile: profile
      });
      setDevelopers(result.data || []);
    } catch {
      // Handled
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle scope change
  const handleScopeChange = (newScope) => {
    updateQueryParam('scope', newScope, RANKING_SCOPES.GLOBAL);
    if (newScope === RANKING_SCOPES.GLOBAL) {
      updateQueryParam('country', 'Global', 'Global');
      updateQueryParam('track', SKILL_CATEGORIES.OVERALL, SKILL_CATEGORIES.OVERALL);
      updateQueryParam('league', 'All', 'All');
    }
  };

  // Handle Country change
  const handleCountryChange = (newCountry) => {
    updateQueryParam('country', newCountry, 'Global');
    if (newCountry !== 'Global' && scope !== RANKING_SCOPES.COUNTRY) {
      updateQueryParam('scope', RANKING_SCOPES.COUNTRY, RANKING_SCOPES.GLOBAL);
    }
  };

  // Handle Skill Category change
  const handleSkillCategoryChange = (newTrack) => {
    updateQueryParam('track', newTrack, SKILL_CATEGORIES.OVERALL);
    if (newTrack !== SKILL_CATEGORIES.OVERALL && scope !== RANKING_SCOPES.SKILL) {
      updateQueryParam('scope', RANKING_SCOPES.SKILL, RANKING_SCOPES.GLOBAL);
    }
  };

  // Handle League change
  const handleLeagueChange = (newLeague) => {
    updateQueryParam('league', newLeague, 'All');
    if (newLeague !== 'All' && scope !== RANKING_SCOPES.LEAGUE) {
      updateQueryParam('scope', RANKING_SCOPES.LEAGUE, RANKING_SCOPES.GLOBAL);
    }
  };

  // Handle Search input
  const handleSearchChange = (query) => {
    updateQueryParam('q', query, '');
  };

  // Handle Verified toggle
  const handleVerifiedOnlyChange = (checked) => {
    updateQueryParam('verified', checked ? 'true' : '', '');
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
    setCurrentPage(1);
  };

  // Dual-direction sorting handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder(field === 'score' || field === 'growth' || field === 'coverage' ? 'desc' : 'asc');
    }
    setCurrentPage(1);
  };

  // Current signed-in user row
  const currentUser = useMemo(() => {
    return developers.find(d => d.isCurrentUser) || null;
  }, [developers]);

  // Top 3 developers for podium
  const topThree = useMemo(() => {
    return developers.slice(0, 3);
  }, [developers]);

  // Jump to user row action
  const handleJumpToUser = () => {
    if (!currentUser) return;
    const userIndex = developers.findIndex(d => d.isCurrentUser);
    if (userIndex !== -1) {
      const targetPage = Math.floor(userIndex / pageSize) + 1;
      setCurrentPage(targetPage);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 text-left select-none">
      
      {/* Post-Onboarding Celebration Welcome Banner */}
      {location.state?.fromOnboarding && !welcomeDismissed && profile && (
        <div className="bg-[#E8F8F0] border border-[#A7F3D0] rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-3 shadow-2xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm sm:text-base text-[#065F46]">
                Welcome to Rankora, {profile.displayName}!
              </h3>
              <p className="text-xs text-[#047857] leading-relaxed">
                Your profile (<strong>@{profile.username}</strong>) is benchmarked in <strong>{profile.country || profile.location}</strong>. Your provisional league rank is now active below.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setWelcomeDismissed(true)}
            className="text-[#059669] hover:text-[#065F46] p-1 rounded-lg hover:bg-[#D1FAE5] transition cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Onboarding Incomplete Reminder if user skipped */}
      {onboardingStatus.isSkipped && !onboardingStatus.isCompleted && (
        <div className="bg-[#FFF8DC] border border-[#FFE89A] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#92400E]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#D97706] shrink-0" />
            <div>
              <strong>Provisional Member Standing:</strong> You skipped profile setup. Complete onboarding to verify your skills and unlock your permanent global rank.
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/onboarding')}
            className="shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center gap-1.5 cursor-pointer"
          >
            <span>Finish Onboarding</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Header with Switch to Public Global Leaderboard Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EBF3FF] text-[#2563EB] border border-[#BFDBFE]">
              Member Division
            </span>
            <span className="text-xs text-[#687793] font-medium">Logged-in Active Benchmarks</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#15264B] tracking-tight mt-1">
            Community & League Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-[#687793] mt-0.5 font-medium">
            Live competitive standings comparing your demonstrated signals with registered developer peers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Link out to the Public Global Leaderboard (Real Top 100) */}
          <Link
            to="/leaderboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2EAF5] bg-white text-xs font-bold text-[#2563EB] hover:bg-[#F5F8FF] transition shadow-2xs"
          >
            <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Public Top 100 Leaderboard</span>
            <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
          </Link>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsMethodologyOpen(true)}
            className="gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Methodology</span>
          </Button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl border border-[#E2EAF5] bg-white text-[#687793] hover:text-[#15264B] hover:bg-[#F5F8FF] transition-colors cursor-pointer"
            title="Refresh snapshot"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#3B82F6]' : ''}`} />
          </button>
        </div>
      </div>

      {/* User Personalized Ranking Status Bar */}
      {currentUser && (
        <Card className="p-4 sm:p-5 bg-white border border-[#BFDBFE] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#10B981]"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-[#15264B] text-sm sm:text-base">
                  {currentUser.displayName}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F8F0] text-[#065F46] border border-[#A7F3D0]">
                  Your Position
                </span>
              </div>
              <p className="text-xs text-[#687793]">
                @{currentUser.username} • {currentUser.title}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 self-stretch sm:self-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1F5F9]">
            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Rank In {currentUser.country}</span>
              <span className="text-base font-extrabold text-[#2563EB]">
                #{currentUser.countryRank || currentUser.activeRank || 7}
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Composite Score</span>
              <span className="text-base font-black text-[#15264B]">
                {currentUser.calculatedScore}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleJumpToUser}
              className="text-xs font-bold gap-1.5 cursor-pointer bg-[#F5F8FF] hover:bg-[#EBF3FF] text-[#2563EB] border-[#BFDBFE]"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Jump to My Row</span>
            </Button>
          </div>
        </Card>
      )}

      {/* User Competitive League Progression Card */}
      {currentUser && (
        <LeagueProgressCard currentUser={currentUser} />
      )}

      {/* Filter Bar */}
      <LeaderboardFilters
        scope={scope}
        onScopeChange={handleScopeChange}
        country={country}
        onCountryChange={handleCountryChange}
        skillCategory={skillCategory}
        onSkillCategoryChange={handleSkillCategoryChange}
        league={league}
        onLeagueChange={handleLeagueChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        verifiedOnly={verifiedOnly}
        onVerifiedOnlyChange={handleVerifiedOnlyChange}
        onClearFilters={handleClearFilters}
      />

      {/* Top 3 Podium Cards */}
      <LeaderboardPodium
        topThree={topThree}
        onOpenBreakdown={setSelectedDeveloperForAudit}
        activeCategory={skillCategory}
      />

      {/* Leaderboard Table with User Row Highlight */}
      <LeaderboardTable
        developers={developers}
        isLoading={isLoading}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        onOpenBreakdown={setSelectedDeveloperForAudit}
        activeSkillCategory={skillCategory}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onResetFilters={handleClearFilters}
      />

      {/* Modals */}
      <ScoreExplanationModal
        developer={selectedDeveloperForAudit}
        isOpen={Boolean(selectedDeveloperForAudit)}
        onClose={() => setSelectedDeveloperForAudit(null)}
      />

      <RankingMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

    </div>
  );
}
