import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { CURRENT_USER } from '../lib/mockData';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/common/ProgressBar';

export function GrowthDashboard() {
  const [timeRange, setTimeRange] = useState('6M');
  const user = CURRENT_USER;

  const timeRanges = ['1M', '3M', '6M', '1Y'];

  // Dynamic history dataset based on selected time range
  const chartData = useMemo(() => {
    if (timeRange === '1M') {
      return [
        { month: 'W1', score: 852, date: 'Week 1' },
        { month: 'W2', score: 860, date: 'Week 2' },
        { month: 'W3', score: 869, date: 'Week 3' },
        { month: 'W4', score: 876, date: 'Week 4' },
      ];
    }
    if (timeRange === '3M') {
      return [
        { month: 'Jul', score: 790, date: 'Jul 2026' },
        { month: 'Aug', score: 840, date: 'Aug 2026' },
        { month: 'Sep', score: 876, date: 'Sep 2026' },
      ];
    }
    if (timeRange === '1Y') {
      return [
        { month: 'Oct', score: 580, date: 'Oct 2025' },
        { month: 'Dec', score: 620, date: 'Dec 2025' },
        { month: 'Feb', score: 660, date: 'Feb 2026' },
        { month: 'Apr', score: 710, date: 'Apr 2026' },
        { month: 'Jun', score: 790, date: 'Jun 2026' },
        { month: 'Aug', score: 840, date: 'Aug 2026' },
        { month: 'Sep', score: 876, date: 'Sep 2026' },
      ];
    }
    // Default 6M
    return [
      { month: 'Apr', score: 680, date: 'Apr 2026' },
      { month: 'May', score: 710, date: 'May 2026' },
      { month: 'Jun', score: 740, date: 'Jun 2026' },
      { month: 'Jul', score: 790, date: 'Jul 2026' },
      { month: 'Aug', score: 840, date: 'Aug 2026' },
      { month: 'Sep', score: 876, date: 'Sep 2026' },
    ];
  }, [timeRange]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header matching Panel 7 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#15264B] tracking-tight">
            Growth Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#687793] mt-0.5 font-medium">
            Track your progress over time
          </p>
        </div>

        {/* Time range pills */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-full text-xs font-semibold border border-[#E2EAF5] shadow-2xs">
          {timeRanges.map((tr) => (
            <button
              key={tr}
              onClick={() => setTimeRange(tr)}
              className={`px-3 py-1 rounded-full transition cursor-pointer ${
                timeRange === tr 
                  ? 'bg-[#15264B] text-white font-bold shadow-2xs' 
                  : 'text-[#687793] hover:text-[#15264B]'
              }`}
            >
              {tr}
            </button>
          ))}
        </div>
      </div>

      {/* Top 2 Cards Row: Overall Score Area Chart & Skill Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Card: Overall Score Chart (7 Cols) */}
        <Card className="lg:col-span-7 p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#15264B]">
                Overall Score
              </h2>
              <span className="text-xs text-[#687793]">Signal trajectory across evaluations</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E4F8EF] text-[#059669] font-bold text-xs border border-[#B9EED9]">
              ↑ 7%
            </div>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGreenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CC9A6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4CC9A6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#687793" fontSize={11} tickLine={false} />
                <YAxis domain={['dataMin - 40', 'dataMax + 40']} stroke="#687793" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2EAF5', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 20px rgba(21,38,75,0.06)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#4CC9A6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#scoreGreenGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right Card: Skill Progress Bars (5 Cols) */}
        <Card className="lg:col-span-5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#15264B]">
              Skill Progress
            </h2>
            <span className="text-xs text-[#687793]">Percentiles</span>
          </div>

          <div className="space-y-4 pt-1">
            {user.skillsBreakdown.map((item) => (
              <ProgressBar
                key={item.name}
                label={item.name}
                score={item.score}
                value={item.score}
                color={item.color}
              />
            ))}
          </div>
        </Card>

      </div>

      {/* Bottom 4 Metric Summary Cards matching Panel 7 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Projects */}
        <Card className="p-5 space-y-1">
          <div className="text-xs text-[#687793] font-semibold">Projects</div>
          <div className="text-2xl sm:text-3xl font-black text-[#15264B]">
            {user.stats.projects}
          </div>
          <div className="text-[11px] font-bold text-[#059669]">
            {user.stats.projectsNew}
          </div>
        </Card>

        {/* Assessments */}
        <Card className="p-5 space-y-1">
          <div className="text-xs text-[#687793] font-semibold">Assessments</div>
          <div className="text-2xl sm:text-3xl font-black text-[#15264B]">
            {user.stats.assessments}
          </div>
          <div className="text-[11px] font-bold text-[#059669]">
            {user.stats.assessmentsCompleted}
          </div>
        </Card>

        {/* Repositories */}
        <Card className="p-5 space-y-1">
          <div className="text-xs text-[#687793] font-semibold">Repositories</div>
          <div className="text-2xl sm:text-3xl font-black text-[#15264B]">
            {user.stats.repositories}
          </div>
          <div className="text-[11px] font-bold text-[#059669]">
            {user.stats.repositoriesNew}
          </div>
        </Card>

        {/* Streak */}
        <Card className="p-5 space-y-1">
          <div className="text-xs text-[#687793] font-semibold">Streak</div>
          <div className="text-2xl sm:text-3xl font-black text-[#15264B]">
            {user.stats.streakDays} days
          </div>
          <div className="text-[11px] font-bold text-[#D97706]">
            {user.stats.streakMessage}
          </div>
        </Card>

      </div>

    </div>
  );
}
