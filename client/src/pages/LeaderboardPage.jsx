import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Trophy, ArrowUp, ArrowDown, Search, ArrowUpDown } from 'lucide-react';
import { LEADERBOARD_DATA } from '../lib/mockData';
import { Card } from '../components/ui/Card';
import { DeveloperAvatar } from '../components/common/DeveloperAvatar';
import { FilterBar } from '../components/common/FilterBar';
import { cn } from '../lib/utils';

export function LeaderboardPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Global');
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  const categories = ['Global', 'Backend', 'Frontend', 'AI'];
  const timeOptions = ['This Week', 'This Month', 'All Time'];

  const { podium, rows } = LEADERBOARD_DATA;

  // Filter and sort leaderboard table rows
  const filteredRows = useMemo(() => {
    let result = [...rows];

    // Filter by category
    if (activeCategory !== 'Global') {
      result = result.filter(r => r.category === activeCategory || r.isUser);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q) ||
        r.username.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'change') {
        valA = parseInt(a.change.replace('+', '')) || 0;
        valB = parseInt(b.change.replace('+', '')) || 0;
      }

      if (sortOrder === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

    return result;
  }, [rows, activeCategory, searchQuery, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleDeveloperClick = (row) => {
    if (row.isUser || row.username === 'lohith001') {
      navigate('/profile');
    } else {
      navigate(`/developers/${row.username}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Header Card matching Panel 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#15264B] tracking-tight">
            Global Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-[#687793] mt-0.5 font-medium">
            Top developers from around the world
          </p>
        </div>

        {/* Filters: Category Pills + Time Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <FilterBar
            options={categories}
            activeOption={activeCategory}
            onSelect={setActiveCategory}
          />

          {/* Time Filter Popover */}
          <div className="relative">
            <button
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#E2EAF5] text-xs text-[#15264B] font-semibold cursor-pointer shadow-2xs hover:border-[#CBD8EB] transition"
            >
              <span>{timeFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#687793]" />
            </button>

            {showTimeDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-[#E2EAF5] p-1.5 z-40 animate-in fade-in slide-in-from-top-1">
                {timeOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setTimeFilter(opt);
                      setShowTimeDropdown(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer",
                      timeFilter === opt 
                        ? "bg-[#EAF3FF] text-[#15264B]" 
                        : "text-[#687793] hover:text-[#15264B] hover:bg-[#F5F8FF]"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Podium Showcase (Rank 2, Rank 1, Rank 3) */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-4 pb-2">
        
        {/* Rank #2: Sarah Kim (Silver / Blue) */}
        <div 
          onClick={() => navigate(`/developers/${podium[0].username}`)}
          className="podium-blue rankora-card p-4 sm:p-6 text-center space-y-2.5 sm:space-y-3 flex flex-col items-center cursor-pointer transition-all hover:-translate-y-1"
        >
          <div className="w-7 h-7 rounded-full bg-[#EAF3FF] text-[#1D4ED8] font-extrabold text-xs flex items-center justify-center border border-[#D2E4FC] shadow-2xs">
            2
          </div>
          <DeveloperAvatar
            src={podium[0].avatar}
            name={podium[0].name}
            size="lg"
            className="ring-4 ring-white shadow-sm"
          />
          <div>
            <h3 className="font-extrabold text-xs sm:text-base text-[#15264B] leading-tight hover:text-[#3B82F6] transition-colors">
              {podium[0].name}
            </h3>
            <div className="text-[11px] text-[#687793] flex items-center justify-center gap-1 mt-0.5 font-medium">
              <span>{podium[0].flag}</span>
              <span>{podium[0].country}</span>
            </div>
            <div className="text-[10px] text-[#059669] font-bold mt-0.5">
              {podium[0].badge}
            </div>
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[#1D4ED8] font-extrabold text-xs sm:text-sm border border-[#D2E4FC] shadow-2xs">
            <span>{podium[0].score}</span>
          </div>
        </div>

        {/* Rank #1: Arjun Sharma (Gold / Tallest) */}
        <div 
          onClick={() => navigate(`/developers/${podium[1].username}`)}
          className="podium-gold rankora-card p-4 sm:p-7 text-center space-y-2.5 sm:space-y-3 flex flex-col items-center -mt-4 sm:-mt-6 shadow-md cursor-pointer transition-all hover:-translate-y-1.5"
        >
          <div className="text-xl -mb-1 animate-bounce-subtle">👑</div>
          <div className="w-7 h-7 rounded-full bg-[#FFE89A] text-[#15264B] font-extrabold text-xs flex items-center justify-center border border-[#FDE68A] shadow-xs">
            1
          </div>
          <DeveloperAvatar
            src={podium[1].avatar}
            name={podium[1].name}
            size="xl"
            className="ring-4 ring-[#FFE89A] shadow-md"
          />
          <div>
            <h3 className="font-extrabold text-sm sm:text-lg text-[#15264B] leading-tight hover:text-[#B45309] transition-colors">
              {podium[1].name}
            </h3>
            <div className="text-[11px] text-[#687793] flex items-center justify-center gap-1 mt-0.5 font-medium">
              <span>{podium[1].flag}</span>
              <span>{podium[1].country}</span>
            </div>
            <div className="text-[10px] text-[#B45309] font-bold mt-0.5">
              Top 0.5%
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-[#B45309] font-black text-sm sm:text-base border border-[#FFE89A] shadow-xs">
            <Trophy className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
            <span>{podium[1].score}</span>
          </div>
        </div>

        {/* Rank #3: Daniel Lee (Bronze / Peach) */}
        <div 
          onClick={() => navigate(`/developers/${podium[2].username}`)}
          className="podium-peach rankora-card p-4 sm:p-6 text-center space-y-2.5 sm:space-y-3 flex flex-col items-center cursor-pointer transition-all hover:-translate-y-1"
        >
          <div className="w-7 h-7 rounded-full bg-[#FFF0ED] text-[#EA580C] font-extrabold text-xs flex items-center justify-center border border-[#FFD3CE] shadow-2xs">
            3
          </div>
          <DeveloperAvatar
            src={podium[2].avatar}
            name={podium[2].name}
            size="lg"
            className="ring-4 ring-white shadow-sm"
          />
          <div>
            <h3 className="font-extrabold text-xs sm:text-base text-[#15264B] leading-tight hover:text-[#EA580C] transition-colors">
              {podium[2].name}
            </h3>
            <div className="text-[11px] text-[#687793] flex items-center justify-center gap-1 mt-0.5 font-medium">
              <span>{podium[2].flag}</span>
              <span>{podium[2].country}</span>
            </div>
            <div className="text-[10px] text-[#059669] font-bold mt-0.5">
              {podium[2].badge}
            </div>
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[#EA580C] font-extrabold text-xs sm:text-sm border border-[#FFD3CE] shadow-2xs">
            <span>{podium[2].score}</span>
          </div>
        </div>

      </div>

      {/* Leaderboard Table Card */}
      <Card className="p-0 overflow-hidden">
        {/* Table Filter/Search Header */}
        <div className="p-4 border-b border-[#E2EAF5] flex items-center justify-between gap-4">
          <div className="relative w-64 max-w-full">
            <Search className="w-3.5 h-3.5 text-[#687793] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter leaderboard developers..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F5F8FF] border border-[#E2EAF5] rounded-full text-xs text-[#15264B] placeholder-[#687793] focus:outline-none focus:bg-white focus:border-[#3B82F6]"
            />
          </div>
          <div className="text-xs text-[#687793] font-medium hidden sm:block">
            Showing top global rankings
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#E2EAF5] text-[#687793] font-semibold text-xs bg-[#F5F8FF]/50">
                <th 
                  className="py-3 px-6 w-16 text-center cursor-pointer hover:text-[#15264B]"
                  onClick={() => handleSort('rank')}
                >
                  <div className="inline-flex items-center gap-1">
                    <span>#</span>
                    <ArrowUpDown className="w-3 h-3 text-[#687793]" />
                  </div>
                </th>
                <th className="py-3 px-6">Developer</th>
                <th className="py-3 px-6">Country</th>
                <th 
                  className="py-3 px-6 text-right cursor-pointer hover:text-[#15264B]"
                  onClick={() => handleSort('score')}
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    <span>Score</span>
                    <ArrowUpDown className="w-3 h-3 text-[#687793]" />
                  </div>
                </th>
                <th 
                  className="py-3 px-6 text-right cursor-pointer hover:text-[#15264B]"
                  onClick={() => handleSort('change')}
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    <span>Change</span>
                    <ArrowUpDown className="w-3 h-3 text-[#687793]" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAF5]">
              {filteredRows.map((row) => {
                const isUserRow = row.isUser;
                return (
                  <tr 
                    key={row.rank}
                    onClick={() => handleDeveloperClick(row)}
                    className={cn(
                      "transition-colors cursor-pointer select-none",
                      isUserRow 
                        ? "bg-[#E4F8EF]/50 hover:bg-[#E4F8EF]/80 font-semibold" 
                        : "hover:bg-[#F5F8FF]"
                    )}
                  >
                    <td className="py-3.5 px-6 text-center font-bold text-[#687793]">
                      {row.rank}
                    </td>

                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <DeveloperAvatar
                          src={row.avatar}
                          name={row.name}
                          size="sm"
                          className={isUserRow ? "ring-2 ring-[#4CC9A6]" : ""}
                        />
                        <div className="flex flex-col">
                          <span className={cn(
                            "font-bold transition-colors",
                            isUserRow ? "text-[#065F46]" : "text-[#15264B] hover:text-[#3B82F6]"
                          )}>
                            {row.name}
                          </span>
                          {isUserRow && (
                            <span className="text-[10px] text-[#059669] font-bold">Current User</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-6 text-[#15264B] font-medium">
                      <span className="mr-1.5">{row.flag}</span>
                      <span>{row.country}</span>
                    </td>

                    <td className="py-3.5 px-6 text-right font-bold text-[#15264B]">
                      {row.score}
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <span className={cn(
                        "inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold",
                        row.isPositive 
                          ? "bg-[#E4F8EF] text-[#059669] border border-[#B9EED9]" 
                          : "bg-[#FFE8E5] text-[#DC2626] border border-[#FFD3CE]"
                      )}>
                        {row.isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        <span>{row.change}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
