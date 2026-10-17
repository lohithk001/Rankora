import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Check, 
  UserPlus, 
  CheckCircle2, 
  ChevronRight,
  Award,
  GitBranch,
  FileCheck,
  Calendar,
  Sparkles,
  X
} from 'lucide-react';
import { CURRENT_USER, DEVELOPERS_DATABASE, getCodeforcesDeveloperProfile, getLeaderboardDeveloperProfile } from '../lib/mockData';
import { useDeveloperProfile } from '../context/DeveloperProfileContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { DeveloperAvatar } from '../components/common/DeveloperAvatar';
import { AchievementBadge } from '../components/common/AchievementBadge';
import { SkillBadge } from '../components/common/SkillBadge';
import { FilterBar } from '../components/common/FilterBar';

function CodeforcesIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="10" width="5" height="12" rx="1.5" fill="#FFD700" />
      <rect x="9.5" y="4" width="5" height="18" rx="1.5" fill="#2196F3" />
      <rect x="17" y="14" width="5" height="8" rx="1.5" fill="#F44336" />
    </svg>
  );
}

function GithubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export function DeveloperProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { profile: loggedInProfile, onboardingStatus } = useDeveloperProfile();
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedBadge, setSelectedBadge] = useState(null);

  const profileTabs = ['Overview', 'Projects', 'Assessments', 'Activity'];

  // Resolve developer from database, logged-in profile, Codeforces Top 100, or fallback to CURRENT_USER
  let user = CURRENT_USER;
  if (username) {
    if (loggedInProfile && loggedInProfile.username?.toLowerCase() === username.toLowerCase()) {
      user = loggedInProfile;
    } else {
      user = DEVELOPERS_DATABASE[username] || getCodeforcesDeveloperProfile(username) || getLeaderboardDeveloperProfile(username);
    }
  } else if (loggedInProfile) {
    user = loggedInProfile;
  }

  // Unknown username graceful state
  if (username && !user) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#FFE8E5] text-[#D93829] flex items-center justify-center mx-auto">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#15264B]">Developer Not Found</h2>
        <p className="text-sm text-[#687793]">
          No verified developer profile found for username "@{username}".
        </p>
        <Button variant="secondary" size="md" onClick={() => navigate('/leaderboard')}>
          Return to Leaderboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Onboarding Incomplete Banner if user skipped */}
      {onboardingStatus.isSkipped && !onboardingStatus.isCompleted && (
        <div className="bg-[#FFF8DC] border border-[#FFE89A] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#92400E]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#D97706] shrink-0" />
            <div>
              <strong>Incomplete Developer Profile:</strong> You previously skipped onboarding. Complete your profile to verify your skills and activate your global rank.
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/onboarding')}
            className="shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
          >
            Finish Onboarding →
          </Button>
        </div>
      )}

      {/* Back navigation */}
      <button 
        onClick={() => navigate('/leaderboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#687793] hover:text-[#15264B] transition cursor-pointer select-none"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Leaderboard</span>
      </button>

      {/* Main Profile Header Card matching Screen 3 */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="p-6 sm:p-8 space-y-6 relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            
            {/* Avatar & User Details */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <DeveloperAvatar
                src={user.avatar}
                name={user.displayName}
                size="xl"
                status="online"
                className="ring-4 ring-[#EAF3FF] shadow-sm"
              />

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#15264B] tracking-tight">
                    {user.displayName}
                  </h1>
                  <CheckCircle2 className="w-5 h-5 text-[#3B82F6] fill-[#3B82F6]/20 shrink-0" />
                  
                  {/* Social Links */}
                  <div className="flex items-center gap-2 text-[#687793] ml-2">
                    <a 
                      href="https://github.com/lohith001" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="p-1 hover:text-[#15264B] hover:bg-[#F5F8FF] rounded-lg transition"
                      title="GitHub profile"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="p-1 hover:text-[#0A66C2] hover:bg-[#F5F8FF] rounded-lg transition"
                      title="LinkedIn profile"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                    </a>
                    {user.codeforcesUrl && (
                      <a 
                        href={user.codeforcesUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-1 hover:text-[#15264B] hover:bg-[#F5F8FF] rounded-lg transition"
                        title="Codeforces profile"
                      >
                        <CodeforcesIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#687793] font-semibold">
                  {user.roleTitle} • {user.location}
                </p>

                <p className="text-xs text-[#687793] max-w-xl pt-0.5 leading-relaxed font-normal">
                  {user.headline}
                </p>
              </div>
            </div>

            {/* Connect Action Button */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <Button
                variant={isConnected ? "secondary" : "mint"}
                size="md"
                onClick={() => setIsConnected(!isConnected)}
                className="px-6 text-xs font-bold"
              >
                {isConnected ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Connected</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </>
                )}
              </Button>
            </div>

          </div>

          {/* Tech Stack Pills in Header matching Screen 3 */}
          <div className="space-y-1.5 pt-3 border-t border-[#E2EAF5]">
            <div className="flex flex-wrap items-center gap-2">
              {user.techStack.map((tech) => (
                <SkillBadge key={tech} name={tech} variant="pill" />
              ))}
            </div>
            {(user.isProvisional || user.clerkUserId) && (
              <p className="text-[10px] text-[#687793] italic">
                * User-provided skills remain provisional until verified through repository commit audits and coding challenges.
              </p>
            )}
          </div>

          {/* 4 Stat Cards in a row with hover motion */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-1">
            
            {/* Global Rank */}
            <motion.div 
              whileHover={{ y: -3, scale: 1.015 }}
              className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] flex flex-col justify-between transition-shadow shadow-2xs"
            >
              <span className="text-[11px] font-semibold text-[#687793] uppercase tracking-wider">
                Global Rank
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#15264B] mt-1">
                {user.globalRank}
              </div>
              <div className="mt-2">
                <Badge variant="mint" size="sm">
                  {user.percentileBadge}
                </Badge>
              </div>
            </motion.div>

            {/* Total Score */}
            <motion.div 
              whileHover={{ y: -3, scale: 1.015 }}
              className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] flex flex-col justify-between transition-shadow shadow-2xs"
            >
              <span className="text-[11px] font-semibold text-[#687793] uppercase tracking-wider">
                Total Score
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#15264B] mt-1">
                {user.totalScore}
              </div>
              <div className="mt-2">
                <span className="text-xs font-bold text-[#059669] bg-[#E4F8EF] px-2 py-0.5 rounded-full border border-[#B9EED9]">
                  ↑ {user.scoreChange}
                </span>
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div 
              whileHover={{ y: -3, scale: 1.015 }}
              className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] flex flex-col justify-between transition-shadow shadow-2xs"
            >
              <span className="text-[11px] font-semibold text-[#687793] uppercase tracking-wider">
                Experience
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#15264B] mt-1">
                {user.experience}
              </div>
              <span className="text-[10px] text-[#687793] font-medium mt-2">
                Demonstrated Depth
              </span>
            </motion.div>

            {/* Skills Count with mini bar chart graphic & chevron */}
            <motion.div whileHover={{ y: -3, scale: 1.015 }}>
              <Link 
                to="/skills"
                className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] flex flex-col justify-between hover:border-[#CBD8EB] hover:bg-[#EAF3FF]/40 transition group h-full shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#687793] uppercase tracking-wider">
                    Skills
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#687793] group-hover:text-[#15264B] transition-transform group-hover:translate-x-0.5" />
                </div>
                
                {/* 5-bar mini chart */}
                <div className="flex items-end gap-1.5 h-7 py-1 my-1">
                  <span className="w-2.5 h-4 rounded-sm bg-[#4CC9A6]" />
                  <span className="w-2.5 h-6 rounded-sm bg-[#3B82F6]" />
                  <span className="w-2.5 h-5 rounded-sm bg-[#A78BFA]" />
                  <span className="w-2.5 h-3.5 rounded-sm bg-[#FF6B6B]" />
                  <span className="w-2.5 h-5 rounded-sm bg-[#FBBF24]" />
                </div>

                <span className="text-xs font-bold text-[#1D4ED8]">
                  {user.verifiedSkills ? `${user.verifiedSkills.length} Verified` : "6 Verified"}
                </span>
              </Link>
            </motion.div>

          </div>

        </Card>
      </motion.div>

      {/* Tabs Switcher: Overview, Projects, Assessments, Activity */}
      <div className="flex border-b border-[#E2EAF5] pb-2">
        <FilterBar
          options={profileTabs}
          activeOption={activeTab}
          onSelect={setActiveTab}
          variant="underline"
        />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'Overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Column: Skill Breakdown matching Screen 3 (7 Cols) */}
            <Card className="lg:col-span-7 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-[#15264B]">
                  Skill Breakdown
                </h2>
                <span className="text-xs text-[#687793] font-medium">Algorithmic Signal</span>
              </div>

              <div className="space-y-4 pt-1">
                {user.skillsBreakdown.map((item) => (
                  <ProgressBar
                    key={item.name}
                    label={item.name}
                    score={item.score}
                    weight={item.weight}
                    value={item.score}
                    color={item.color}
                  />
                ))}
              </div>
            </Card>

            {/* Right Column: Badges & Achievements matching Screen 3 (5 Cols) */}
            <Card className="lg:col-span-5 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-[#15264B]">
                  Badges
                </h2>
                <Link to="/skills" className="text-xs text-[#1D4ED8] font-semibold hover:underline">
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
                {user.badges.map((b) => (
                  <AchievementBadge
                    key={b.id}
                    title={b.title}
                    icon={b.icon}
                    colorScheme={b.colorScheme}
                    onClick={() => setSelectedBadge(b)}
                  />
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'Projects' && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-base text-[#15264B]">Verified Projects</h3>
              <p className="text-xs text-[#687793]">Evidence evaluated from GitHub commits and code review audits.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <motion.div 
                  whileHover={{ y: -3, scale: 1.015 }}
                  className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] space-y-2 cursor-pointer transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#15264B]">Distributed Cache Engine</span>
                    <Badge variant="mint" size="sm">High Impact</Badge>
                  </div>
                  <p className="text-xs text-[#687793]">In-memory distributed key-value store with raft consensus in Go.</p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#15264B]">
                    <span>Go</span> • <span>Raft</span> • <span>Docker</span>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -3, scale: 1.015 }}
                  className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] space-y-2 cursor-pointer transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#15264B]">Rankora Interactive Engine</span>
                    <Badge variant="blue" size="sm">Fullstack</Badge>
                  </div>
                  <p className="text-xs text-[#687793]">Developer analytics platform with real-time ranking and skill tracking.</p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#15264B]">
                    <span>React</span> • <span>Tailwind</span> • <span>PostgreSQL</span>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'Assessments' && (
          <motion.div
            key="assessments"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-base text-[#15264B]">Completed Assessments</h3>
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-[#059669]" />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-[#15264B]">LeetCode Algorithmic Mastery</div>
                      <div className="text-xs text-[#687793]">300+ problems evaluated • Top 10% percentile</div>
                    </div>
                  </div>
                  <Badge variant="mint">Verified</Badge>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-[#3B82F6]" />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-[#15264B]">System Design Architect Challenge</div>
                      <div className="text-xs text-[#687793]">Scalable microservices & event streaming evaluation</div>
                    </div>
                  </div>
                  <Badge variant="blue">Advanced</Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'Activity' && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-base text-[#15264B]">Recent Activity</h3>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-[#687793]">
                  <Calendar className="w-4 h-4 text-[#3B82F6]" />
                  <span className="font-semibold text-[#15264B]">Yesterday:</span>
                  <span>Solved 3 hard dynamic programming challenges on LeetCode (+8 signal points).</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#687793]">
                  <GitBranch className="w-4 h-4 text-[#059669]" />
                  <span className="font-semibold text-[#15264B]">3 days ago:</span>
                  <span>Merged feature PR #42 in open source Go microservice repository.</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Detail Dialog with Fluid Motion */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                  className="text-[#687793] hover:text-[#15264B] p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="w-16 h-16 rounded-full bg-[#FFF8DC] border border-[#FFE89A] flex items-center justify-center mx-auto text-3xl shadow-sm">
                {selectedBadge.icon}
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-[#15264B]">{selectedBadge.title}</h3>
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

              <Button variant="secondary" size="md" className="w-full" onClick={() => setSelectedBadge(null)}>
                Close
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
