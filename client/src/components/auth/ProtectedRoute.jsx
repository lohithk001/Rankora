import React from 'react';
import { useUser, RedirectToSignIn } from '@clerk/react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDeveloperProfile } from '../../context/DeveloperProfileContext';

export function ProtectedRoute({ children, allowIncompleteOnboarding = false }) {
  const { isLoaded, isSignedIn } = useUser();
  const { onboardingStatus } = useDeveloperProfile();
  const location = useLocation();

  if (!isLoaded || (isSignedIn && onboardingStatus.isLoading)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#E2EAF5] shadow-sm space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] flex items-center justify-center mx-auto text-[#2563EB] animate-pulse">
            <span className="font-extrabold text-lg">R</span>
          </div>
          <div className="h-4 w-36 bg-slate-200 rounded-md mx-auto animate-pulse" />
          <div className="h-3 w-48 bg-slate-100 rounded-md mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // If user has not completed onboarding and hasn't skipped it, redirect to /onboarding
  if (!allowIncompleteOnboarding && !onboardingStatus.isCompleted && !onboardingStatus.isSkipped) {
    if (location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" replace state={{ from: location.pathname }} />;
    }
  }

  return children;
}
