import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Scale, Sparkles, LayoutDashboard } from 'lucide-react';
import { Show, UserButton } from '@clerk/react';
import { RankoraLogo } from '../common/RankoraLogo';
import { Button } from '../ui/Button';

const CURRENT_YEAR = new Date().getFullYear();

export function PublicLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F8FF] text-[#15264B] flex flex-col font-sans selection:bg-[#FFE89A] selection:text-[#15264B]">
      
      {/* Public Top Navigation Bar matching Panel 1 of Reference */}
      <header className="w-full bg-white/85 backdrop-blur-md border-b border-[#E2EAF5] sticky top-0 z-40 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Brand Logo & Desktop Nav Links */}
          <div className="flex items-center gap-8">
            <RankoraLogo size="md" linkTo="/" />

            {/* Center Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-semibold text-[#687793]">
              <Link to="/" className="text-[#15264B] font-bold hover:text-[#0D1933] transition-colors">
                Home
              </Link>
              <Link to="/leaderboard" className="hover:text-[#15264B] transition-colors flex items-center gap-1.5">
                <span>Global Leaderboard</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#E8F8F0] text-[#059669] border border-[#A7F3D0]">
                  Public
                </span>
              </Link>
            </nav>
          </div>

          {/* Right Public Auth Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Show when="signed-out">
              <Link
                to="/sign-in"
                className="text-xs sm:text-sm font-semibold text-[#15264B] hover:text-[#0D1933] px-3 py-2 transition-colors"
              >
                Log in
              </Link>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/sign-up')}
                className="flex items-center gap-1.5 shadow-sm"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Show>
            <Show when="signed-in">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </Show>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#687793] hover:text-[#15264B] hover:bg-[#F5F8FF] rounded-xl transition cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E2EAF5] px-4 py-4 space-y-2 animate-in fade-in slide-in-from-top-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-bold text-[#15264B] hover:bg-[#F5F8FF] rounded-xl"
            >
              Home
            </Link>
            <Link
              to="/leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-[#687793] hover:text-[#15264B] hover:bg-[#F5F8FF] rounded-xl"
            >
              <span>Global Leaderboard</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#E8F8F0] text-[#059669] border border-[#A7F3D0]">
                Public
              </span>
            </Link>
            <div className="pt-3 border-t border-[#E2EAF5] flex flex-col gap-2">
              <Show when="signed-out">
                <Link
                  to="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-bold text-[#15264B] bg-[#F5F8FF] rounded-xl"
                >
                  Log in
                </Link>
                <Link
                  to="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-bold text-white bg-[#15264B] rounded-xl"
                >
                  Get Started
                </Link>
              </Show>
              <Show when="signed-in">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-bold text-white bg-[#2563EB] rounded-xl flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </Link>
                <div className="flex items-center justify-between px-3 py-2 bg-[#F5F8FF] rounded-xl">
                  <span className="text-xs font-semibold text-[#15264B]">Account Profile</span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </Show>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area (Full width, No sidebar) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="w-full border-t border-[#E2EAF5] bg-white py-12 px-4 sm:px-6 lg:px-8 select-none">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-3">
            <RankoraLogo size="md" />
            <p className="text-xs text-[#687793] leading-relaxed max-w-md">
              Rankora aggregates verified problem-solving and software engineering signals from across the web into an objective, explainable developer rank.
            </p>
            <div className="p-3 rounded-xl bg-[#F5F8FF] border border-[#E2EAF5] text-xs text-[#687793] flex items-center gap-2 max-w-md">
              <Scale className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>
                <strong>Evidence Axiom:</strong> Rank verified work and trajectory, never pedigree or resume claims.
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-[#15264B] uppercase tracking-wider text-[11px]">Rankings & Evidence</div>
            <ul className="space-y-1.5 text-[#687793]">
              <li><Link to="/leaderboard" className="hover:text-[#15264B] transition">Global Leaderboard</Link></li>
              <li><Link to="/leaderboard?track=algorithms" className="hover:text-[#15264B] transition">Top 100 Algorithms</Link></li>
              <li><Link to="/leaderboard?scope=country" className="hover:text-[#15264B] transition">Country Rankings</Link></li>
              <li><Link to="/sign-in" className="hover:text-[#15264B] transition">Claim Your Rank</Link></li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-[#15264B] uppercase tracking-wider text-[11px]">Trust & Architecture</div>
            <ul className="space-y-1.5 text-[#687793]">
              <li><Link to="/sign-up" className="hover:text-[#15264B] transition">Join Community</Link></li>
              <li><Link to="/privacy" className="hover:text-[#15264B] transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#15264B] transition">Terms of Service</Link></li>
              <li><span className="text-[#10B981] font-semibold">● Real-time Signal Engine v2.0</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-[#E2EAF5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#687793] gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <p>© {CURRENT_YEAR} Rankora Intelligence. All rights reserved.</p>
            <div className="flex items-center gap-3 font-semibold text-[#15264B]">
              <Link to="/privacy" className="hover:underline">Privacy</Link>
              <span>•</span>
              <Link to="/terms" className="hover:underline">Terms</Link>
            </div>
          </div>
          <p className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Built for developers worldwide.</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
