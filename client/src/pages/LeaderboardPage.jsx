import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  RotateCw, 
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  X
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

export function LeaderboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, onboardingStatus } = useDeveloperProfile();
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

  // URL Query synced state
  const scope = searchParams.get('scope') || RANKING_SCOPES.GLOBAL;
  const country = searchParams.get('country') || 'Global';
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

  // Fetch leaderboard data with cancellation
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
          sortOrder
        });

        if (!ignore) {
          setDevelopers(result.data || []);
        }
      } catch {
        // Fallback handled inside leaderboardApi
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
  }, [scope, country, skillCategory, league, searchQuery, verifiedOnly, sortField, sortOrder]);

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
        sortOrder
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Post-Onboarding Celebration Welcome Banner */}
      {location.state?.fromOnboarding && !welcomeDismissed && (
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
                Your developer profile (<strong>@{profile.username}</strong>) has been registered. You are benchmarked in <strong>{profile.country || profile.location}</strong> as a <strong>{profile.experience}</strong> engineer.
              </p>
            </div>
          </div>
          <button
            onClick={() => setWelcomeDismissed(true)}
            className="text-[#059669] hover:text-[#065F46] p-1 rounded-lg hover:bg-[#D1FAE5] transition cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Onboarding Incomplete Notice if user skipped */}
      {onboardingStatus.isSkipped && !onboardingStatus.isCompleted && (
        <div className="bg-[#FFF8DC] border border-[#FFE89A] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#92400E]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#D97706] shrink-0" />
            <div>
              <strong>Incomplete Developer Profile:</strong> You skipped onboarding. Complete your setup to claim your rank and verify your skills.
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/onboarding')}
            className="shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center gap-1.5"
          >
            <span>Finish Onboarding</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Header matching other pages */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#15264B] tracking-tight">
            Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-[#687793] mt-0.5 font-medium">
            Top engineers ranked by verified technical intelligence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsMethodologyOpen(true)}
            className="gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#3B82F6]" />
            Ranking Methodology
          </Button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-full border border-[#E2EAF5] bg-white text-[#687793] hover:text-[#15264B] hover:bg-[#F5F8FF] transition-colors cursor-pointer"
            title="Refresh snapshot"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#3B82F6]' : ''}`} />
          </button>
        </div>
      </div>

      {/* User Competitive League Card (if available) */}
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
        totalResults={developers.length}
      />

      {/* Top 3 Podium Cards */}
      {currentPage === 1 && topThree.length >= 2 && !searchQuery && (
        <LeaderboardPodium
          topThree={topThree}
          onOpenBreakdown={setSelectedDeveloperForAudit}
          activeCategory={skillCategory}
        />
      )}

      {/* Main Leaderboard Table */}
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

      {/* Modal: Score Explanation & 5-Dimension Audit */}
      <ScoreExplanationModal
        isOpen={Boolean(selectedDeveloperForAudit)}
        onClose={() => setSelectedDeveloperForAudit(null)}
        developer={selectedDeveloperForAudit}
      />

      {/* Modal: Ranking Methodology & Live Simulator */}
      <RankingMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
}

export default LeaderboardPage;
