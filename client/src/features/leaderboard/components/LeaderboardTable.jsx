import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { DeveloperAvatar } from '../../../components/common/DeveloperAvatar';
import { LoadingSkeleton } from '../../../components/common/LoadingSkeleton';
import { EmptyState } from '../../../components/common/EmptyState';
import { cn } from '../../../lib/utils';

export function LeaderboardTable({
  developers = [],
  isLoading = false,
  sortField = 'rank',
  sortOrder = 'asc',
  onSort,
  onOpenBreakdown,
  activeSkillCategory = 'overall',
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onResetFilters
}) {
  const navigate = useNavigate();

  // Client-side pagination calculation
  const totalItems = developers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const pageDevelopers = developers.slice(startIndex, startIndex + pageSize);

  const renderSortIndicator = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-[#687793] opacity-50 ml-1 inline" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-3 h-3 text-[#15264B] ml-1 inline" />
      : <ArrowDown className="w-3 h-3 text-[#15264B] ml-1 inline" />;
  };

  if (isLoading) {
    return <LoadingSkeleton type="table" count={pageSize || 10} />;
  }

  if (developers.length === 0) {
    return (
      <EmptyState
        title="No developers match your filters"
        description="Try expanding your country, track, or league selection to view ranked engineers."
        icon={HelpCircle}
        actionLabel="Reset All Filters"
        onAction={onResetFilters}
        className="my-2 bg-white"
      />
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      {/* Table Subheader */}
      <div className="p-4 border-b border-[#E2EAF5] flex items-center justify-between text-xs text-[#687793] font-medium">
        <span>Displaying verified engineering intelligence</span>
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-[#E2EAF5] text-[#687793] font-semibold text-xs bg-[#F5F8FF]/50 select-none">
              <th 
                className="py-3 px-5 w-16 text-center cursor-pointer hover:text-[#15264B]"
                onClick={() => onSort('rank')}
              >
                <div className="inline-flex items-center gap-1">
                  <span>#</span>
                  {renderSortIndicator('rank')}
                </div>
              </th>

              <th 
                className="py-3 px-5 cursor-pointer hover:text-[#15264B]"
                onClick={() => onSort('name')}
              >
                <div className="inline-flex items-center gap-1">
                  <span>Developer</span>
                  {renderSortIndicator('name')}
                </div>
              </th>

              <th className="py-3 px-5">Country</th>

              <th className="py-3 px-5">League</th>

              <th 
                className="py-3 px-5 text-right cursor-pointer hover:text-[#15264B]"
                onClick={() => onSort('score')}
              >
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>Score</span>
                  {renderSortIndicator('score')}
                </div>
              </th>

              <th 
                className="py-3 px-5 text-right cursor-pointer hover:text-[#15264B]"
                onClick={() => onSort('growth')}
              >
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>Change</span>
                  {renderSortIndicator('growth')}
                </div>
              </th>

              <th className="py-3 px-5 text-right">Audit</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2EAF5]">
            {pageDevelopers.map((dev) => {
              const displayScore = (activeSkillCategory && activeSkillCategory !== 'overall' && dev.skillScores?.[activeSkillCategory])
                ? dev.skillScores[activeSkillCategory]
                : dev.calculatedScore;

              const rankChange = dev.recentGrowthPct !== undefined
                ? Math.round(dev.recentGrowthPct)
                : (dev.previousGlobalRank ? (dev.previousGlobalRank - dev.activeRank) : 0);

              const isPositive = rankChange >= 0;
              const isUserRow = dev.isCurrentUser;

              return (
                <tr 
                  key={dev.id || dev.username}
                  tabIndex={0}
                  role="row"
                  onClick={() => navigate(`/developers/${dev.username}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/developers/${dev.username}`);
                    }
                  }}
                  className={cn(
                    "transition-colors cursor-pointer select-none focus-visible:bg-[#F5F8FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2563EB]",
                    isUserRow 
                      ? "bg-[#E4F8EF]/50 hover:bg-[#E4F8EF]/80 font-semibold" 
                      : "hover:bg-[#F5F8FF]"
                  )}
                >
                  {/* Rank */}
                  <td className="py-3.5 px-5 text-center font-bold text-[#687793]">
                    {dev.activeRank}
                  </td>

                  {/* Developer */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <DeveloperAvatar
                        src={dev.avatar}
                        name={dev.displayName || dev.name}
                        size="sm"
                        className={isUserRow ? "ring-2 ring-[#4CC9A6]" : ""}
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "font-bold transition-colors",
                            isUserRow ? "text-[#065F46]" : "text-[#15264B] hover:text-[#3B82F6]"
                          )}>
                            {dev.displayName || dev.name}
                          </span>
                          {dev.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                          )}
                          {isUserRow && (
                            <span className="text-[10px] text-[#059669] font-bold">Current User</span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#687793] font-normal truncate max-w-xs">
                          @{dev.username} • {dev.title}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Country */}
                  <td className="py-3.5 px-5 text-[#15264B] font-medium whitespace-nowrap">
                    <span className="mr-1.5">{dev.countryFlag || dev.flag}</span>
                    <span>{dev.country}</span>
                    {dev.countryRank && (
                      <span className="text-[10px] text-[#687793] block">
                        Rank #{dev.countryRank}
                      </span>
                    )}
                  </td>

                  {/* League */}
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span className={cn(
                      "inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border",
                      dev.league === 'Elite' ? "bg-[#FFF8DC] text-[#B45309] border-[#FFE89A]" :
                      dev.league === 'Advanced' ? "bg-[#EAF3FF] text-[#2563EB] border-[#D2E4FC]" :
                      dev.league === 'Rising' ? "bg-[#E4F8EF] text-[#059669] border-[#B9EED9]" :
                      "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]"
                    )}>
                      {dev.league}
                    </span>
                  </td>

                  {/* Score */}
                  <td className="py-3.5 px-5 text-right font-bold text-[#15264B] whitespace-nowrap">
                    {typeof displayScore === 'number' ? displayScore.toFixed(1) : displayScore}
                  </td>

                  {/* Change */}
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold",
                      isPositive 
                        ? "bg-[#E4F8EF] text-[#059669] border border-[#B9EED9]" 
                        : "bg-[#FFE8E5] text-[#DC2626] border border-[#FFD3CE]"
                    )}>
                      {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3 text-[#DC2626]" />}
                      <span>{isPositive ? `+${rankChange}` : rankChange}</span>
                    </span>
                  </td>

                  {/* Audit Action */}
                  <td className="py-3.5 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onOpenBreakdown(dev)}
                      className="p-1 rounded-full text-[#687793] hover:text-[#15264B] hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Audit score formula"
                    >
                      <HelpCircle className="w-4 h-4 text-[#3B82F6]" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-[#F5F8FF]/50 border-t border-[#E2EAF5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#687793]">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-white border border-[#E2EAF5] rounded-full px-2.5 py-0.5 text-[#15264B] font-semibold cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="ml-2">
            Showing {startIndex + 1}–{Math.min(startIndex + pageSize, totalItems)} of {totalItems}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-full border border-[#E2EAF5] bg-white text-[#687793] hover:text-[#15264B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-bold text-[#15264B] px-2">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-full border border-[#E2EAF5] bg-white text-[#687793] hover:text-[#15264B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Card>
  );
}
