import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  BarChart3, 
  ShieldCheck, 
  UserCheck, 
  Play, 
  ChevronDown, 
  X,
  Code2,
  GitBranch,
  Sparkles,
  Trophy,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { RankoraLogo } from '../components/common/RankoraLogo';
import { Button } from '../components/ui/Button';

export function LandingPage() {
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const featureCards = [
    {
      id: 'rankings',
      title: 'Global Rankings',
      desc: 'See where you stand worldwide',
      icon: Star,
      iconColor: 'text-[#D97706]',
      iconBg: 'bg-[#FFF8DC] border border-[#FFE89A]',
      path: '/leaderboard'
    },
    {
      id: 'analytics',
      title: 'Skill Analytics',
      desc: 'Track your growth and strengths',
      icon: BarChart3,
      iconColor: 'text-[#059669]',
      iconBg: 'bg-[#E4F8EF] border border-[#B9EED9]',
      path: '/skills'
    },
    {
      id: 'evidence',
      title: 'Verified Evidence',
      desc: 'Showcase real projects & activity',
      icon: ShieldCheck,
      iconColor: 'text-[#DC2626]',
      iconBg: 'bg-[#FFE8E5] border border-[#FFD3CE]',
      path: '/assessments'
    },
    {
      id: 'recruiter',
      title: 'Recruiter Access',
      desc: 'Get discovered by top companies',
      icon: UserCheck,
      iconColor: 'text-[#7C3AED]',
      iconBg: 'bg-[#F3EFFF] border border-[#DDD0FF]',
      path: '/hiring'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F5F8FF] flex flex-col font-sans">
      
      {/* Top Navigation Bar matching Panel 1 */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-[#E2EAF5] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <RankoraLogo size="md" />

            {/* Center Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-semibold text-[#687793]">
              <Link to="/" className="text-[#15264B] font-bold">
                Home
              </Link>
              <Link to="/leaderboard" className="hover:text-[#15264B] transition-colors">
                Leaderboard
              </Link>
              <Link to="/skills" className="hover:text-[#15264B] transition-colors">
                Explore
              </Link>
              <Link to="/hiring" className="hover:text-[#15264B] transition-colors">
                Hiring
              </Link>
              
              {/* More Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="flex items-center gap-1 hover:text-[#15264B] transition-colors cursor-pointer"
                >
                  <span>More</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {showMoreMenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#E2EAF5] p-2 z-50 animate-in fade-in slide-in-from-top-1">
                    <Link
                      to="/assessments"
                      onClick={() => setShowMoreMenu(false)}
                      className="block px-3 py-2 text-xs font-semibold text-[#15264B] hover:bg-[#F5F8FF] rounded-xl transition"
                    >
                      Assessments
                    </Link>
                    <Link
                      to="/growth"
                      onClick={() => setShowMoreMenu(false)}
                      className="block px-3 py-2 text-xs font-semibold text-[#15264B] hover:bg-[#F5F8FF] rounded-xl transition"
                    >
                      Growth Dashboard
                    </Link>
                    <Link
                      to="/market-value"
                      onClick={() => setShowMoreMenu(false)}
                      className="block px-3 py-2 text-xs font-semibold text-[#15264B] hover:bg-[#F5F8FF] rounded-xl transition"
                    >
                      Market Value
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowMoreMenu(false)}
                      className="block px-3 py-2 text-xs font-semibold text-[#15264B] hover:bg-[#F5F8FF] rounded-xl transition"
                    >
                      Settings
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/leaderboard"
              className="text-xs sm:text-sm font-semibold text-[#15264B] hover:text-[#0D1933] px-3 py-2 transition-colors"
            >
              Log in
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/leaderboard')}
              className="px-5 text-xs font-bold"
            >
              Sign up
            </Button>
          </div>

        </div>
      </header>

      {/* Main Landing Content Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Hero Card matching Screen 1 */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#E2EAF5] shadow-[0_4px_24px_rgba(21,38,75,0.03)] relative overflow-hidden">
          
          {/* Subtle Pastel Background Accents */}
          <div className="absolute -top-16 -right-16 w-80 h-80 bg-[#FFF8DC]/60 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-[#EAF3FF]/80 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Left Column: Headline and Call-to-actions */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#15264B] tracking-tight leading-[1.12]">
                Your Skills.<br />
                <span className="relative inline-block mt-1">
                  Your Global Signal.
                  <span className="absolute left-0 bottom-1 w-full h-3 bg-[#FFE89A]/70 -z-10 rounded-sm transform -rotate-1" />
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#687793] max-w-lg leading-relaxed font-normal">
                Get ranked, grow your skills, and get discovered by top recruiters — all in one place.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/leaderboard')}
                  className="px-8 shadow-sm text-sm font-bold"
                >
                  Get Started
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setShowDemoModal(true)}
                  className="px-6 text-sm font-semibold flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-[#15264B] text-[#15264B]" />
                  <span>Watch Demo</span>
                </Button>
              </div>

              {/* Verified Signal Indicators */}
              <div className="pt-3 flex items-center gap-5 text-xs text-[#687793] font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Evidence-based scoring</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Global peer benchmark</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Illustration & Decorative Badges */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              <div className="relative w-full max-w-sm sm:max-w-md">
                
                {/* Floating Badge: Code Build Grow */}
                <div className="absolute -top-3 right-4 z-20 bg-white/95 backdrop-blur-xs border border-[#FFE89A] px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 text-xs font-bold text-[#B45309] animate-bounce-subtle">
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Code • Build • Grow</span>
                </div>

                {/* Floating Code Chip */}
                <div className="absolute top-12 -left-3 z-20 bg-[#15264B] text-white px-2.5 py-1 rounded-xl shadow-md text-xs font-mono font-bold flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-[#4CC9A6]" />
                  <span>&lt;/&gt;</span>
                </div>

                {/* Floating Git Badge */}
                <div className="absolute bottom-6 -right-2 z-20 bg-white border border-[#E2EAF5] px-2.5 py-1.5 rounded-xl shadow-sm text-xs font-semibold text-[#15264B] flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Verified Commits</span>
                </div>

                {/* Developer Illustration */}
                <div className="rounded-3xl overflow-hidden bg-gradient-to-b from-[#FFF8DC] to-[#F5F8FF] p-4 border border-[#FFE89A]/50">
                  <img 
                    src="/hero-developer.jpg" 
                    alt="Rankora Developer with Laptop and Cat" 
                    className="w-full h-auto object-contain rounded-2xl select-none"
                    onError={(e) => {
                      // Graceful fallback if public asset isn't resolved
                      e.target.style.display = 'none';
                    }}
                  />
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* 4 Feature Mini-Cards matching Screen 1 bottom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pb-6">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.id}
                onClick={() => navigate(card.path)}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2EAF5] shadow-[0_2px_12px_rgba(21,38,75,0.02)] flex flex-col justify-between space-y-4 hover:border-[#CBD8EB] hover:shadow-md cursor-pointer transition-all group hover:-translate-y-0.5"
              >
                <div className={`w-11 h-11 rounded-2xl ${card.iconBg} flex items-center justify-center ${card.iconColor} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#15264B] group-hover:text-[#3B82F6] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#687793] mt-1 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* Interactive Demo Walkthrough Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E2EAF5] space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFE89A] flex items-center justify-center">
                  <Play className="w-4 h-4 fill-[#15264B] text-[#15264B]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#15264B]">Rankora Product Walkthrough</h3>
                  <p className="text-xs text-[#687793]">How verified skill signals work</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="text-[#687793] hover:text-[#15264B] p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#687793]">
              <div className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] space-y-2">
                <div className="font-bold text-[#15264B] flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#D97706]" />
                  <span>1. Multi-Platform Evidence Synthesis</span>
                </div>
                <p>
                  Rankora aggregates your verified challenge solutions from LeetCode, Codeforces, GitHub repositories, and system design assessments into one unified Signal score.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] space-y-2">
                <div className="font-bold text-[#15264B] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#059669]" />
                  <span>2. Peer-Benchmarked Skill Intelligence</span>
                </div>
                <p>
                  Understand your relative percentile globally across problem solving, architectural design, software craft, and collaborative speed.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] space-y-2">
                <div className="font-bold text-[#15264B] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#7C3AED]" />
                  <span>3. Recruiter Discovery Without Resume Spam</span>
                </div>
                <p>
                  Top technology companies search directly by verified proof and compensation benchmarks, giving engineers direct access to premier roles.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="secondary" size="md" onClick={() => setShowDemoModal(false)}>
                Close
              </Button>
              <Button 
                variant="primary" 
                size="md" 
                onClick={() => {
                  setShowDemoModal(false);
                  navigate('/leaderboard');
                }}
                className="flex items-center gap-2"
              >
                <span>Explore Live Leaderboard</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
