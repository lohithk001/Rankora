import React from 'react';
import { motion } from 'motion/react';
import { Trophy, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeveloperAvatar } from '../../../components/common/DeveloperAvatar';

export function LeaderboardPodium({ topThree = [], onOpenBreakdown, activeCategory = 'overall' }) {
  const navigate = useNavigate();

  if (!topThree || topThree.length < 2) return null;

  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  const getScore = (dev) => {
    if (!dev) return 0;
    if (activeCategory && activeCategory !== 'overall' && dev.skillScores?.[activeCategory]) {
      return dev.skillScores[activeCategory];
    }
    return dev.calculatedScore || dev.score || 0;
  };

  return (
    <div className="space-y-3">
      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-end">
        
        {/* Rank #2: Silver / Blue */}
        {second && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="podium-blue rankora-card p-4 sm:p-6 text-center space-y-2.5 sm:space-y-3 flex flex-col items-center cursor-pointer transition-all hover:-translate-y-1 relative group"
            onClick={() => navigate(`/developers/${second.username}`)}
          >
            <div className="w-7 h-7 rounded-full bg-[#EAF3FF] text-[#2563EB] font-extrabold text-xs flex items-center justify-center border border-[#D2E4FC] shadow-2xs">
              2
            </div>
            
            <DeveloperAvatar
              src={second.avatar}
              name={second.displayName || second.name}
              size="lg"
              className="ring-4 ring-white shadow-sm"
            />

            <div>
              <h3 className="font-extrabold text-xs sm:text-base text-[#15264B] leading-tight hover:text-[#2563EB] transition-colors">
                {second.displayName || second.name}
              </h3>
              <div className="text-[11px] text-[#687793] flex items-center justify-center gap-1 mt-0.5 font-medium">
                <span>{second.countryFlag || second.flag}</span>
                <span>{second.country}</span>
              </div>
              <div className="text-[10px] text-[#059669] font-bold mt-0.5">
                {second.league ? `${second.league} League` : 'Top 1%'}
              </div>
            </div>

            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[#2563EB] font-extrabold text-xs sm:text-sm border border-[#D2E4FC] shadow-2xs">
              <span>{getScore(second).toFixed ? getScore(second).toFixed(1) : getScore(second)}</span>
            </div>

            {/* Subtle audit trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenBreakdown(second);
              }}
              className="text-[11px] text-[#687793] hover:text-[#15264B] flex items-center gap-1 hover:underline pt-1 cursor-pointer"
              title="Audit score formula"
            >
              <HelpCircle className="w-3 h-3 text-[#3B82F6]" />
              <span>Score Audit</span>
            </button>
          </motion.div>
        )}

        {/* Rank #1: Gold / Yellow - Center & Larger */}
        {first && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="podium-gold rankora-card p-5 sm:p-7 text-center space-y-3 sm:space-y-3.5 flex flex-col items-center cursor-pointer transition-all hover:-translate-y-1.5 order-first sm:order-none relative overflow-hidden shadow-sm group"
            onClick={() => navigate(`/developers/${first.username}`)}
          >
            <div className="w-8 h-8 rounded-full bg-[#FFF8DC] text-[#B45309] font-black text-sm flex items-center justify-center border border-[#FFE89A] shadow-xs">
              1
            </div>

            <DeveloperAvatar
              src={first.avatar}
              name={first.displayName || first.name}
              size="xl"
              className="ring-4 ring-[#FFE89A] shadow-sm"
            />

            <div>
              <h3 className="font-extrabold text-sm sm:text-lg text-[#15264B] leading-tight hover:text-[#B45309] transition-colors">
                {first.displayName || first.name}
              </h3>
              <div className="text-[11px] text-[#687793] flex items-center justify-center gap-1 mt-0.5 font-medium">
                <span>{first.countryFlag || first.flag}</span>
                <span>{first.country}</span>
              </div>
              <div className="text-[10px] text-[#B45309] font-bold mt-0.5">
                {first.league ? `${first.league} League` : 'Top 0.5%'}
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-[#B45309] font-black text-sm sm:text-base border border-[#FFE89A] shadow-xs">
              <Trophy className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
              <span>{getScore(first).toFixed ? getScore(first).toFixed(1) : getScore(first)}</span>
            </div>

            {/* Subtle audit trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenBreakdown(first);
              }}
              className="text-[11px] text-[#687793] hover:text-[#15264B] flex items-center gap-1 hover:underline pt-1 cursor-pointer"
              title="Audit score formula"
            >
              <HelpCircle className="w-3 h-3 text-[#B45309]" />
              <span>Score Audit</span>
            </button>
          </motion.div>
        )}

        {/* Rank #3: Bronze / Peach */}
        {third && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="podium-peach rankora-card p-4 sm:p-6 text-center space-y-2.5 sm:space-y-3 flex flex-col items-center cursor-pointer transition-all hover:-translate-y-1 relative group"
            onClick={() => navigate(`/developers/${third.username}`)}
          >
            <div className="w-7 h-7 rounded-full bg-[#FFF0ED] text-[#EA580C] font-extrabold text-xs flex items-center justify-center border border-[#FFD3CE] shadow-2xs">
              3
            </div>

            <DeveloperAvatar
              src={third.avatar}
              name={third.displayName || third.name}
              size="lg"
              className="ring-4 ring-white shadow-sm"
            />

            <div>
              <h3 className="font-extrabold text-xs sm:text-base text-[#15264B] leading-tight hover:text-[#EA580C] transition-colors">
                {third.displayName || third.name}
              </h3>
              <div className="text-[11px] text-[#687793] flex items-center justify-center gap-1 mt-0.5 font-medium">
                <span>{third.countryFlag || third.flag}</span>
                <span>{third.country}</span>
              </div>
              <div className="text-[10px] text-[#059669] font-bold mt-0.5">
                {third.league ? `${third.league} League` : 'Top 2%'}
              </div>
            </div>

            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[#EA580C] font-extrabold text-xs sm:text-sm border border-[#FFD3CE] shadow-2xs">
              <span>{getScore(third).toFixed ? getScore(third).toFixed(1) : getScore(third)}</span>
            </div>

            {/* Subtle audit trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenBreakdown(third);
              }}
              className="text-[11px] text-[#687793] hover:text-[#15264B] flex items-center gap-1 hover:underline pt-1 cursor-pointer"
              title="Audit score formula"
            >
              <HelpCircle className="w-3 h-3 text-[#EA580C]" />
              <span>Score Audit</span>
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
