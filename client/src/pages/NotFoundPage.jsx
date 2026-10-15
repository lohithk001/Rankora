import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-20 h-20 rounded-3xl bg-[#EAF3FF] text-[#15264B] flex items-center justify-center mb-6 shadow-sm border border-[#D2E4FC]">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6] mb-2">404 Error</span>
      <h1 className="text-3xl font-extrabold text-[#15264B] mb-2">Page Not Found</h1>
      <p className="text-sm text-[#687793] max-w-md mb-6 leading-relaxed">
        The developer page or dashboard route you are looking for doesn't exist or has moved.
      </p>
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="primary" size="md">
            Back to Home
          </Button>
        </Link>
        <Link to="/leaderboard">
          <Button variant="secondary" size="md">
            View Leaderboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
