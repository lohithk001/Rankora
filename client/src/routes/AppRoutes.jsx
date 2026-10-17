import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { OnboardingRoute } from '../components/auth/OnboardingRoute';
import { DeveloperProfileProvider } from '../context/DeveloperProfileContext';

// Page components
import { LandingPage } from '../pages/LandingPage';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';
import { GlobalLeaderboardPage } from '../pages/GlobalLeaderboardPage';
import { MemberLeaderboardPage } from '../pages/MemberLeaderboardPage';
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
      <DeveloperProfileProvider>
        <Routes>
          {/* PUBLIC MARKETING & AUTH ROUTES — STANDALONE FULL WIDTH, NO SIDEBAR */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/leaderboard" element={<GlobalLeaderboardPage />} />
            <Route path="/global-leaderboard" element={<Navigate to="/leaderboard" replace />} />
            <Route path="/developers/:username" element={<DeveloperProfile />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/onboarding" element={<OnboardingRoute />} />
          </Route>

          {/* APPLICATION & DASHBOARD ROUTES — PROTECTED WITH SIDEBAR */}
          <Route element={<DashboardLayout />}>
            {/* LOGIN ONLY FEATURES: Protected routes requiring active authentication */}
            <Route path="/dashboard" element={<ProtectedRoute><GrowthDashboard /></ProtectedRoute>} />
            <Route path="/app/leaderboard" element={<ProtectedRoute><MemberLeaderboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><DeveloperProfile /></ProtectedRoute>} />
            <Route path="/skills" element={<ProtectedRoute><SkillsPage /></ProtectedRoute>} />
            <Route path="/assessments" element={<ProtectedRoute><AssessmentsPage /></ProtectedRoute>} />
            <Route path="/growth" element={<ProtectedRoute><GrowthDashboard /></ProtectedRoute>} />
            <Route path="/market-value" element={<ProtectedRoute><MarketValuePage /></ProtectedRoute>} />
            <Route path="/hiring" element={<ProtectedRoute><RecruiterSearch /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            {/* Fallback redirects */}
            <Route path="/leaderboards" element={<Navigate to="/leaderboard" replace />} />
            <Route path="/market" element={<Navigate to="/market-value" replace />} />
            <Route path="/recruiter" element={<Navigate to="/hiring" replace />} />
            
            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </DeveloperProfileProvider>
    </BrowserRouter>
  );
}
