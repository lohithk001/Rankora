import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useUser } from '@clerk/react';
import { 
  Trophy, 
  Briefcase, 
  DollarSign, 
  Award, 
  Lock, 
  Unlock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DEVELOPERS_DATABASE } from '../lib/mockData';

// Top public ranking preview developers
const TOP_RANKED_PREVIEW = [
  DEVELOPERS_DATABASE["arjun"],
  DEVELOPERS_DATABASE["sarah"],
  DEVELOPERS_DATABASE["daniel"]
].filter(Boolean);

export function LandingPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  // Handle protected navigation: redirect to sign-in if not signed in
  const handleFeatureClick = (path, isProtected) => {
    if (isProtected && !isSignedIn) {
      navigate('/sign-in');
    } else {
      navigate(path);
    }
  };

  const featureCards = [
    {
      id: 'leaderboard',
      title: 'Global Developer Leaderboard',
      desc: 'Explore real-time rankings across algorithms, architecture, and code craft. 100% open to the public.',
      icon: Trophy,
      badge: 'PUBLIC',
      badgeColor: 'bg-[#E8F8F0] text-[#065F46] border border-[#A7F3D0]',
      iconBg: 'bg-[#FFF8DC] text-[#D97706]',
      isProtected: false,
      path: '/leaderboard',
      cta: 'Browse Public Ranks'
    },
    {
      id: 'skills',
      title: 'Forensic Skill Diagnostics',
      desc: 'Multi-dimensional radar metrics analyzing code hygiene, algorithmic complexity, and PR consistency.',
      icon: Award,
      badge: 'LOGIN ONLY',
      badgeColor: 'bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]',
      iconBg: 'bg-[#EBF3FF] text-[#2563EB]',
      isProtected: true,
      path: '/skills',
      cta: isSignedIn ? 'View Your Skills' : 'Sign In to Unlock'
    },
    {
      id: 'market-value',
      title: 'Real-Time Market Rate Engine',
      desc: 'Empirical compensation percentiles mapped directly to your verified engineering rank and location.',
      icon: DollarSign,
      badge: 'LOGIN ONLY',
      badgeColor: 'bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]',
      iconBg: 'bg-[#E6FFFA] text-[#0D9488]',
      isProtected: true,
      path: '/market-value',
      cta: isSignedIn ? 'Calculate Market Value' : 'Sign In to Unlock'
    },
    {
      id: 'hiring',
      title: 'Recruiter Direct Pipeline',
      desc: 'High-signal candidate discovery for tech leads. Bypass resume black holes with verified skill proof.',
      icon: Briefcase,
      badge: 'LOGIN ONLY',
      badgeColor: 'bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]',
      iconBg: 'bg-[#F3E8FF] text-[#9333EA]',
      isProtected: true,
      path: '/hiring',
      cta: isSignedIn ? 'Search Candidates' : 'Sign In to Unlock'
    }
  ];

  return (
    <div className="w-full space-y-10 sm:space-y-14">
      
      {/* 1. Public vs Login-Only Status Alert */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-[#EBF3FF] border border-[#BFDBFE] rounded-2xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
      >
        <div className="flex items-center gap-2.5 text-xs text-[#1E3A8A] font-medium">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span className="font-bold">Transparent Access Model:</span>
          <span>Leaderboard and global rankings are <strong>100% public</strong>. Advanced skill diagnostics, recruiter pipelines, and compensation metrics require sign-in.</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/leaderboard"
            className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 hover:underline"
          >
            <span>View Public Rankings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>

      {/* 2. Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#E2EAF5] shadow-[0_4px_24px_rgba(21,38,75,0.03)] relative overflow-hidden"
      >
        {/* Soft background aura */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#FFF8DC]/70 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#EAF3FF]/80 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Mission & Core Value */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F8FF] border border-[#E2EAF5] text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Objective Developer Benchmark</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-[#15264B] tracking-tight leading-[1.12]">
              Real Signal.<br />
              Public Rankings.<br />
              <span className="relative inline-block mt-1 text-[#2563EB]">
                Zero Resume Fluff.
                <span className="absolute left-0 bottom-1 w-full h-3 bg-[#FFE89A]/60 -z-10 rounded-sm transform -rotate-1" />
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#687793] max-w-xl leading-relaxed">
              Rankora indexes algorithmic challenges, production GitHub contributions, and architecture depth into a verified global ranking. <strong>The leaderboard is open to all</strong>. Sign in to sync your accounts and claim your rank.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/leaderboard')}
                className="px-7 shadow-sm text-sm font-bold flex items-center gap-2 cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-[#FFE89A]" />
                <span>Explore Public Leaderboard</span>
              </Button>

              {isSignedIn ? (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 text-sm font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-[#2563EB]" />
                  <span>Go to Dashboard</span>
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/sign-in')}
                  className="px-6 text-sm font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#687793]" />
                  <span>Sign In to Unlock All</span>
                </Button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-5 text-xs text-[#687793] font-medium border-t border-[#F1F5F9]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>100% Public Leaderboard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>Clerk Protected Auth</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>Anti-Cheat Normalized</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Ranked Developer Preview Card */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-[#E2EAF5] shadow-lg space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#E2EAF5]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                  <span className="text-xs font-bold text-[#15264B] uppercase tracking-wider">
                    Global Rank #1 Signal
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F8F0] text-[#065F46] border border-[#A7F3D0]">
                  Public Verified
                </span>
              </div>

              {/* Top Developer Card Showcase */}
              {TOP_RANKED_PREVIEW[0] && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={TOP_RANKED_PREVIEW[0].avatar}
                      alt={TOP_RANKED_PREVIEW[0].displayName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#FFE89A] shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-[#15264B] text-base">
                          {TOP_RANKED_PREVIEW[0].displayName}
                        </h4>
                        <span className="text-xs font-bold px-1.5 py-0.2 rounded bg-[#FFE89A] text-[#92400E]">
                          {TOP_RANKED_PREVIEW[0].globalRank}
                        </span>
                      </div>
                      <p className="text-xs text-[#687793]">{TOP_RANKED_PREVIEW[0].roleTitle}</p>
                      <p className="text-[11px] text-[#059669] font-bold">{TOP_RANKED_PREVIEW[0].percentileBadge} globally</p>
                    </div>
                  </div>

                  {/* Score breakdown metrics */}
                  <div className="grid grid-cols-3 gap-2 bg-[#F5F8FF] p-3 rounded-2xl border border-[#E2EAF5] text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Composite</span>
                      <span className="text-base font-extrabold text-[#15264B]">{TOP_RANKED_PREVIEW[0].totalScore}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Algorithms</span>
                      <span className="text-base font-extrabold text-[#059669]">99/100</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Systems</span>
                      <span className="text-base font-extrabold text-[#2563EB]">98/100</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {TOP_RANKED_PREVIEW[0].techStack.slice(0, 4).map((tech) => (
                      <span key={tech} className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-[#475569]">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/leaderboard')}
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-bold"
                  >
                    <span>View on Public Leaderboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}

            </div>
          </div>

        </div>
      </motion.div>

      {/* 3. Live Leaderboard Podium Sneak Peek (Open to Public) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#059669] uppercase tracking-wider bg-[#E8F8F0] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                Open Intelligence
              </span>
              <span className="text-xs text-[#94A3B8]">No login required</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#15264B] tracking-tight mt-1">
              Top 3 Verified Developers
            </h2>
            <p className="text-xs sm:text-sm text-[#687793]">
              Anyone can view public scores and verify developer rank integrity without signing up.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/leaderboard')}
            className="flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <span>Open Full 100+ Leaderboard</span>
            <ExternalLink className="w-4 h-4 text-[#2563EB]" />
          </Button>
        </div>

        {/* 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TOP_RANKED_PREVIEW.map((dev, idx) => (
            <motion.div
              key={dev.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-5 border border-[#E2EAF5] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#BFDBFE] transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={dev.avatar}
                      alt={dev.displayName}
                      className="w-12 h-12 rounded-2xl object-cover border border-[#E2EAF5]"
                    />
                    <span className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white ${
                      idx === 0 ? 'bg-[#F59E0B]' : idx === 1 ? 'bg-[#94A3B8]' : 'bg-[#D97706]'
                    }`}>
                      #{idx + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#15264B]">{dev.displayName}</h3>
                    <p className="text-xs text-[#687793]">{dev.roleTitle}</p>
                    <span className="text-[10px] font-bold text-[#059669]">{dev.percentileBadge}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-[#15264B]">{dev.totalScore}</span>
                  <span className="text-[10px] block text-[#94A3B8] -mt-1">Signal Score</span>
                </div>
              </div>

              <div className="bg-[#F5F8FF] rounded-xl p-2.5 text-xs text-[#687793] line-clamp-2">
                "{dev.headline}"
              </div>

              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-[#687793]">{dev.location}</span>
                <Link
                  to={`/developers/${dev.username}`}
                  className="font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  <span>Public Card</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. The "No BS" Matrix: What's Public vs. What's Login-Only */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2EAF5] shadow-xs space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider bg-[#EFF6FF] px-3 py-1 rounded-full">
            Transparent Boundaries
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#15264B] tracking-tight">
            How Rankora Works: Public vs. Login Only
          </h2>
          <p className="text-xs sm:text-sm text-[#687793]">
            We keep competitive ranks transparent for the global community, while private diagnostic tools, salary benchmarks, and direct candidate messaging require authentication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Public Column */}
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCFCE7]">
              <div className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-[#16A34A]" />
                <h3 className="font-bold text-base text-[#166534]">100% Public Access</h3>
              </div>
              <span className="text-xs font-bold text-[#16A34A] bg-white px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
                No Account Needed
              </span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-[#14532D]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span><strong>Global Leaderboard Index:</strong> View, search, and filter top developers worldwide.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span><strong>Competitive Coding Ranks:</strong> Codeforces & algorithmic contest percentiles.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span><strong>Public Developer Portfolios:</strong> Shareable verified ranking badges.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span><strong>Scoring Transparency:</strong> Open formulas for skill weighting and normalization.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/leaderboard')}
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white"
              >
                Go to Public Leaderboard
              </Button>
            </div>
          </div>

          {/* Login Only Column */}
          <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3E8FF]">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#9333EA]" />
                <h3 className="font-bold text-base text-[#6B21A8]">Login-Only Features</h3>
              </div>
              <span className="text-xs font-bold text-[#9333EA] bg-white px-2.5 py-0.5 rounded-full border border-[#E9D5FF]">
                Free Account
              </span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-[#581C87]">
              <li className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#9333EA] shrink-0 mt-0.5" />
                <span><strong>Claim & Sync Your Profile:</strong> Connect GitHub, LeetCode, and verify your personal signal.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#9333EA] shrink-0 mt-0.5" />
                <span><strong>Forensic Skill Analytics:</strong> Deep radar evaluations of commit history and code craft.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#9333EA] shrink-0 mt-0.5" />
                <span><strong>Market Value Calculator:</strong> Real salary benchmarks matched to your engineering signal.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#9333EA] shrink-0 mt-0.5" />
                <span><strong>Recruiter Talent Search:</strong> Direct contact pipeline between tech leads and top engineers.</span>
              </li>
            </ul>

            <div className="pt-2">
              {isSignedIn ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-[#9333EA] hover:bg-[#7E22CE] text-white"
                >
                  Access Your Member Dashboard
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/sign-in')}
                  className="w-full bg-[#9333EA] hover:bg-[#7E22CE] text-white"
                >
                  Sign In to Unlock Member Tools
                </Button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 5. 4 Core Feature Cards with Explicit Public/Login Gate */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#15264B] tracking-tight">
            Explore Rankora Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-[#687793]">
            Click any module below. Public modules open immediately; member modules will prompt for sign-in.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleFeatureClick(card.path, card.isProtected)}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E2EAF5] shadow-2xs hover:border-[#93C5FD] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl ${card.iconBg} flex items-center justify-center font-bold`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#15264B] mt-4 group-hover:text-[#2563EB] transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs text-[#687793] mt-1.5 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-bold text-[#2563EB]">
                  <span>{card.cta}</span>
                  {card.isProtected && !isSignedIn ? (
                    <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 6. Call to Action Banner */}
      <div className="bg-gradient-to-r from-[#15264B] to-[#1E3A8A] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 relative overflow-hidden shadow-xl">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#2563EB]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#FFE89A]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#FFE89A] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/10">
            Join the Verified Network
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Claim Your Developer Rank Today
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Sign up in 30 seconds with Clerk. Benchmark your skills, view your real compensation bracket, and put your engineering signal on the map.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/sign-up')}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 font-bold shadow-lg cursor-pointer"
            >
              Create Free Account
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/sign-in')}
              className="bg-white/15 hover:bg-white/25 text-white border-white/20 px-6 font-semibold cursor-pointer"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}
