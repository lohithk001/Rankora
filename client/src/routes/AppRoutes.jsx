import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';

// Page components
import { LandingPage } from '../pages/LandingPage';
import { LeaderboardPage } from '../pages/LeaderboardPage';
import { DeveloperProfile } from '../pages/DeveloperProfile';
import { SkillsPage } from '../pages/SkillsPage';
import { AssessmentsPage } from '../pages/AssessmentsPage';
import { GrowthDashboard } from '../pages/GrowthDashboard';
import { MarketValuePage } from '../pages/MarketValuePage';
import { RecruiterSearch } from '../pages/RecruiterSearch';
import { SettingsPage } from '../pages/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<DeveloperProfile />} />
          <Route path="/developers/:username" element={<DeveloperProfile />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/growth" element={<GrowthDashboard />} />
          <Route path="/market-value" element={<MarketValuePage />} />
          <Route path="/hiring" element={<RecruiterSearch />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Legacy or fallback redirects */}
          <Route path="/leaderboards" element={<Navigate to="/leaderboard" replace />} />
          <Route path="/market" element={<Navigate to="/market-value" replace />} />
          <Route path="/recruiter" element={<Navigate to="/hiring" replace />} />
          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
