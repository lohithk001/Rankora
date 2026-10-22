import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Trophy, Home, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full space-y-6">
        
        {/* Animated Compass & 404 Badge */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#EFF6FF] to-[#DBEAFE] text-[#2563EB] flex items-center justify-center shadow-lg border border-[#BFDBFE]">
            <Compass className="w-10 h-10 animate-spin-slow" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#15264B] text-white font-mono font-black text-xs shadow-md border border-[#334155]">
            404
          </span>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15264B] tracking-tight">
            Signal Route Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#687793] leading-relaxed">
            The developer profile, ranking scope, or URL you requested does not exist or has been relocated in the latest algorithmic release.
          </p>
        </div>

        {/* Quick Route Cards */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 text-left">
          <Link
            to="/leaderboard"
            className="p-3 rounded-2xl bg-white border border-[#E2EAF5] hover:border-[#BFDBFE] hover:bg-[#F5F8FF] transition shadow-xs group"
          >
            <div className="w-7 h-7 rounded-xl bg-[#E8F8F0] text-[#059669] flex items-center justify-center mb-1.5">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="font-bold text-xs text-[#15264B] group-hover:text-[#2563EB]">Leaderboard</div>
            <div className="text-[10px] text-[#687793]">Global verified ranks</div>
          </Link>

          <Link
            to="/dashboard"
            className="p-3 rounded-2xl bg-white border border-[#E2EAF5] hover:border-[#BFDBFE] hover:bg-[#F5F8FF] transition shadow-xs group"
          >
            <div className="w-7 h-7 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-1.5">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <div className="font-bold text-xs text-[#15264B] group-hover:text-[#2563EB]">Dashboard</div>
            <div className="text-[10px] text-[#687793]">Your developer metrics</div>
          </Link>
        </div>

        {/* Primary Navigation Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(-1)}
            className="gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </Button>

          <Link to="/">
            <Button variant="primary" size="md" className="gap-1.5 text-xs font-bold">
              <Home className="w-3.5 h-3.5" />
              <span>Rankora Home</span>
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
