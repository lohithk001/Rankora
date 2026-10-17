import React from 'react';
import { Trophy, CheckCircle } from 'lucide-react';
import { LEAGUE_TIERS } from '../constants/leaderboardConstants';
import { Card } from '../../../components/ui/Card';

export function LeagueProgressCard({ currentUser }) {
  if (!currentUser) return null;

  const currentLeague = currentUser.league || 'Advanced';
  const leagueConfig = LEAGUE_TIERS[currentLeague] || LEAGUE_TIERS.Advanced;
  const progress = currentUser.leagueProgress || {
    currentScore: currentUser.calculatedScore || 87.2,
    currentCoverage: currentUser.evidenceCoverage || 0.82,
    nextLeague: 'Elite',
    pointsNeeded: 4.8,
    coverageNeededPct: 3,
    progressPct: 86
  };

  return (
    <Card className="p-5 sm:p-6 bg-gradient-to-r from-[#EAF3FF] via-white to-[#F4EFFF] border border-[#E2EAF5] space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: League Info */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#FFF8DC] text-[#B45309] border border-[#FFE89A]">
              <Trophy className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
              {currentLeague} League
            </span>
            <span className="text-xs text-[#687793] font-medium">
              Top Tier Engineering Division
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-[#15264B] tracking-tight">
            You are ranked <span className="text-[#3B82F6]">#{currentUser.activeRank || 7}</span> in {currentUser.country || 'India'}
          </h3>

          <p className="text-xs text-[#687793] max-w-xl leading-relaxed">
            {leagueConfig.description}
          </p>
        </div>

        {/* Right: Promotion Roadmap Box */}
        {progress.nextLeague ? (
          <div className="bg-white/80 border border-[#E2EAF5] rounded-2xl p-4 w-full md:w-80 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#15264B] font-bold">Promotion to {progress.nextLeague}</span>
              <span className="text-[#059669] font-extrabold font-mono">
                {Math.round(progress.progressPct)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#E2EAF5] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#4CC9A6] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress.progressPct, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#687793] pt-0.5 font-medium">
              <span>Need: <strong className="text-[#15264B]">+{progress.pointsNeeded.toFixed(1)} pts</strong></span>
              <span>Evidence: <strong className="text-[#15264B]">+{progress.coverageNeededPct}% proof</strong></span>
            </div>
          </div>
        ) : (
          <div className="bg-[#E4F8EF] border border-[#B9EED9] rounded-2xl p-4 text-xs text-[#065F46] flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#059669]" />
            <span>Highest league tier achieved. Elite developers represent the top 1% globally.</span>
          </div>
        )}
      </div>
    </Card>
  );
}
