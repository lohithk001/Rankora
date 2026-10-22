import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { CURRENT_USER, GROWTH_HISTORY } from '../lib/mockData';
import { useDeveloperProfile } from '../context/DeveloperProfileContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FilterBar } from '../components/common/FilterBar';
import { AchievementBadge } from '../components/common/AchievementBadge';
import { SkillBadge } from '../components/common/SkillBadge';
import { Award, ChevronRight, ChevronDown, X, ShieldCheck } from 'lucide-react';

export function SkillsPage() {
  const [tab, setTab] = useState('Skills');
  const [timeRange, setTimeRange] = useState('6M');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const { profile } = useDeveloperProfile();
  const user = profile || CURRENT_USER;

  const tabs = ['Skills', 'Badges', 'Certificates'];
  const timeRanges = ['1M', '3M', '6M', '1Y'];

  const allSkillsList = [
    { name: "Python", level: "Expert", iconColor: "text-[#3B82F6]", bg: "bg-blue-50", category: "Languages", score: 95, repos: 8, problemsSolved: 142 },
    { name: "React", level: "Advanced", iconColor: "text-[#06B6D4]", bg: "bg-cyan-50", category: "Frontend", score: 88, repos: 12, problemsSolved: 64 },
    { name: "Node.js", level: "Advanced", iconColor: "text-[#10B981]", bg: "bg-emerald-50", category: "Backend", score: 86, repos: 9, problemsSolved: 50 },
    { name: "Java", level: "Intermediate", iconColor: "text-[#EF4444]", bg: "bg-red-50", category: "Languages", score: 74, repos: 4, problemsSolved: 85 },
    { name: "SQL", level: "Advanced", iconColor: "text-[#6366F1]", bg: "bg-indigo-50", category: "Databases", score: 89, repos: 10, problemsSolved: 90 },
    { name: "MongoDB", level: "Intermediate", iconColor: "text-[#16A34A]", bg: "bg-green-50", category: "Databases", score: 76, repos: 6, problemsSolved: 32 },
    { name: "Go", level: "Advanced", iconColor: "text-[#00ADD8]", bg: "bg-sky-50", category: "Backend", score: 84, repos: 5, problemsSolved: 48 },
    { name: "TypeScript", level: "Advanced", iconColor: "text-[#3178C6]", bg: "bg-blue-50", category: "Languages", score: 87, repos: 11, problemsSolved: 58 },
  ];

  const visibleSkills = showAllSkills ? allSkillsList : allSkillsList.slice(0, 6);

  const certificatesList = [
    { id: 'c1', title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: 'Aug 2026', credentialId: 'AWS-992144' },
    { id: 'c2', title: 'Meta Front-End Developer Professional', issuer: 'Meta', date: 'Jun 2026', credentialId: 'META-771203' },
    { id: 'c3', title: 'HackerRank Problem Solving (Advanced)', issuer: 'HackerRank', date: 'Jul 2026', credentialId: 'HR-ADV-552' }
  ];

  const badges = user?.badges || [];
  const skillsBreakdown = user?.skillsBreakdown || [];

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedSkill(null);
        setSelectedBadge(null);
      }
    };
    if (selectedSkill || selectedBadge) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSkill, selectedBadge]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header matching Panel 4 */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#15264B] tracking-tight">
          Skills & Badges
        </h1>
        <p className="text-xs sm:text-sm text-[#687793] mt-0.5 font-medium">
          Your verified skills and achievements
        </p>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 Cols): Skills & Badges */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Filter Tabs */}
          <FilterBar
            options={tabs}
            activeOption={tab}
            onSelect={setTab}
          />

          <AnimatePresence mode="wait">
            {/* TAB 1: SKILLS */}
            {tab === 'Skills' && (
              <motion.div 
                key="skills-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {visibleSkills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.05 }}
                      whileHover={{ y: -3, scale: 1.015 }}
                    >
                      <SkillBadge
                        name={skill.name}
                        level={skill.level}
                        variant="card"
                        onClick={() => setSelectedSkill(skill)}
                      />
                    </motion.div>
                  ))}
                </div>

                {allSkillsList.length > 6 && (
                  <button
                    onClick={() => setShowAllSkills(prev => !prev)}
                    aria-expanded={showAllSkills}
                    className="text-xs text-[#1D4ED8] font-bold cursor-pointer hover:underline pl-1 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-md py-1"
                  >
                    <span>
                      {showAllSkills 
                        ? "Show fewer skills" 
                        : `+ ${allSkillsList.length - 6} more verified skills evaluated`}
                    </span>
                    {showAllSkills ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}

                {/* Achievement Badges Section */}
                <Card className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-[#15264B]">
                      Achievement Badges
                    </h2>
                    {badges.length > 0 && (
                      <button 
                        onClick={() => setTab('Badges')}
                        className="text-xs text-[#1D4ED8] font-semibold hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-md px-1.5 py-0.5"
                      >
                        View All ({badges.length})
                      </button>
                    )}
                  </div>

                  {badges.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#687793]">
                      No achievement badges earned yet. Complete challenge assessments to unlock badges.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {badges.slice(0, 4).map((b) => (
                        <AchievementBadge
                          key={b.id}
                          title={b.title}
                          icon={b.icon}
                          colorScheme={b.colorScheme}
                          onClick={() => setSelectedBadge(b)}
                        />
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {/* TAB 2: BADGES */}
            {tab === 'Badges' && (
              <motion.div
                key="badges-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-[#15264B]">Verified Badges & Medallions</h3>
                      <p className="text-xs text-[#687793]">Earned through verifiable evaluations and problem streaks.</p>
                    </div>
                  </div>

                  {badges.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#687793]">
                      No verified badges recorded yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                      {badges.map((b, index) => (
                        <motion.div
                          key={b.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.25, delay: index * 0.05 }}
                          whileHover={{ y: -4, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedBadge(b)}
                          tabIndex={0}
                          role="button"
                          aria-label={`View details for badge ${b.title}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedBadge(b);
                            }
                          }}
                          className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] text-center flex flex-col items-center justify-center space-y-2 hover:border-[#CBD8EB] cursor-pointer transition-shadow shadow-2xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                        >
                          <div className="w-14 h-14 rounded-full bg-white border border-[#E2EAF5] flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform duration-200">
                            {b.icon}
                          </div>
                          <div className="text-xs font-bold text-[#15264B] leading-tight">
                            {b.title}
                          </div>
                          <span className="text-[10px] text-[#059669] font-bold bg-[#E4F8EF] px-2 py-0.5 rounded-full">
                            {b.date}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {/* TAB 3: CERTIFICATES */}
            {tab === 'Certificates' && (
              <motion.div
                key="certificates-tab"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-[#15264B]">External Verified Credentials</h3>
                      <p className="text-xs text-[#687793]">Synced and algorithmically verified from issuing platforms.</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    {certificatesList.map((cert) => (
                      <motion.div 
                        key={cert.id}
                        whileHover={{ y: -2, scale: 1.01 }}
                        className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] flex items-center justify-between gap-4 transition-shadow shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-[#E2EAF5] flex items-center justify-center text-[#15264B] font-bold">
                            <Award className="w-5 h-5 text-[#3B82F6]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-[#15264B]">{cert.title}</h4>
                            <p className="text-[11px] text-[#687793]">{cert.issuer} • Issued {cert.date}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-[#687793] bg-white px-2.5 py-1 rounded-full border border-[#E2EAF5]">
                          {cert.credentialId}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right Column (5 Cols): Your Growth Panel */}
        <Card className="lg:col-span-5 p-6 space-y-5">
          
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-[#15264B]">
              Your Growth
            </h2>

            {/* Time filters */}
            <div 
              role="tablist" 
              aria-label="Growth history range"
              className="flex items-center gap-1 bg-[#F5F8FF] p-1 rounded-full text-[11px] font-semibold border border-[#E2EAF5]"
            >
              {timeRanges.map((tr) => (
                <button
                  key={tr}
                  role="tab"
                  aria-selected={timeRange === tr}
                  onClick={() => setTimeRange(tr)}
                  className={`px-2.5 py-0.5 rounded-full transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
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

          {/* Big Score Callout */}
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#15264B] flex items-baseline gap-2">
              <span>{user?.totalScore || 876}</span>
              <span className="text-xs font-semibold text-[#059669] bg-[#E4F8EF] px-2 py-0.5 rounded-full border border-[#B9EED9]">
                Current Score
              </span>
            </div>
          </div>

          {/* Smooth Green Chart */}
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GROWTH_HISTORY} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGreenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CC9A6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4CC9A6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#687793" fontSize={11} tickLine={false} />
                <YAxis domain={[600, 950]} stroke="#687793" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2EAF5', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#4CC9A6" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#growthGreenGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Score Breakdown Bars with weights */}
          <div className="space-y-3 pt-2 border-t border-[#E2EAF5]">
            <div className="text-xs font-bold text-[#15264B]">Score Breakdown</div>
            {skillsBreakdown.length === 0 ? (
              <div className="text-xs text-[#687793]">No breakdown available.</div>
            ) : (
              skillsBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="text-[#687793] font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#15264B]">{item.score}</span>
                    <span className="text-[11px] text-[#687793] font-mono w-8 text-right">{item.weight}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Verified Evidence Standing Card */}
          <div className="p-3.5 rounded-2xl bg-[#FFF8DC] border border-[#FFE89A] flex items-center gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-base shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#B45309]" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-[#B45309]">Verified Global Standing</div>
              <div className="text-[#92400E] text-[11px]">Rank #{user?.globalRank || 42} • {user?.league || "Diamond League"} Tier (Top 5%)</div>
            </div>
          </div>

        </Card>

      </div>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="skill-modal-title"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSkill(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E2EAF5] space-y-4 relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] flex items-center justify-center font-bold text-[#15264B]">
                    {selectedSkill.name[0]}
                  </div>
                  <div>
                    <h3 id="skill-modal-title" className="text-base font-bold text-[#15264B]">{selectedSkill.name}</h3>
                    <span className="text-xs text-[#059669] font-bold">{selectedSkill.level} Proficiency</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSkill(null)}
                  aria-label="Close skill details"
                  className="text-[#687793] hover:text-[#15264B] p-1 rounded-full hover:bg-slate-100 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 text-center">
                <div className="p-3 rounded-xl bg-[#F5F8FF] border border-[#E2EAF5]">
                  <div className="text-lg font-black text-[#15264B]">{selectedSkill.score}</div>
                  <div className="text-[10px] text-[#687793]">Skill Rating</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F8FF] border border-[#E2EAF5]">
                  <div className="text-lg font-black text-[#15264B]">{selectedSkill.repos}</div>
                  <div className="text-[10px] text-[#687793]">Repositories</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F8FF] border border-[#E2EAF5]">
                  <div className="text-lg font-black text-[#15264B]">{selectedSkill.problemsSolved}</div>
                  <div className="text-[10px] text-[#687793]">Problems</div>
                </div>
              </div>

              <p className="text-xs text-[#687793] leading-relaxed">
                Demonstrated through consistent commits, challenge solutions, and verified production code audits.
              </p>

              <Button variant="secondary" size="md" className="w-full font-semibold" onClick={() => setSelectedSkill(null)}>
                Close
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="badge-modal-title"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBadge(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E2EAF5] space-y-4 text-center relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end">
                <button 
                  onClick={() => setSelectedBadge(null)}
                  aria-label="Close badge details"
                  className="text-[#687793] hover:text-[#15264B] p-1 rounded-full hover:bg-slate-100 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="w-16 h-16 rounded-full bg-[#FFF8DC] border border-[#FFE89A] flex items-center justify-center mx-auto text-3xl shadow-sm">
                {selectedBadge.icon}
              </div>

              <div>
                <h3 id="badge-modal-title" className="text-lg font-extrabold text-[#15264B]">{selectedBadge.title}</h3>
                <span className="text-[11px] font-bold text-[#059669] bg-[#E4F8EF] px-2.5 py-0.5 rounded-full inline-block mt-1">
                  {selectedBadge.date || "Verified Achievement"}
                </span>
              </div>

              <p className="text-xs text-[#687793] leading-relaxed">
                {selectedBadge.desc}
              </p>

              <div className="p-3 bg-[#F5F8FF] rounded-2xl border border-[#E2EAF5] text-left text-xs space-y-1">
                <span className="font-bold text-[#15264B]">Evaluation Criteria:</span>
                <p className="text-[#687793]">{selectedBadge.criteria}</p>
              </div>

              <Button variant="secondary" size="md" className="w-full font-semibold" onClick={() => setSelectedBadge(null)}>
                Close
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
