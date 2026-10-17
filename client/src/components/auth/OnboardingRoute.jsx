import React from 'react';
import { useUser, RedirectToSignIn } from '@clerk/react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useDeveloperProfile } from '../../context/DeveloperProfileContext';
import { OnboardingPage } from '../../pages/OnboardingPage';

export function OnboardingRoute() {
  const { isLoaded, isSignedIn } = useUser();
  const { onboardingStatus } = useDeveloperProfile();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';

  if (!isLoaded || (isSignedIn && onboardingStatus.isLoading)) {
    return (
      <div className="min-h-screen bg-[#F5F8FF] flex flex-col items-center justify-center p-8">
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

  // Returning user who already finished onboarding goes straight to dashboard
  if (onboardingStatus.isCompleted && !isEditMode) {
    return <Navigate to="/dashboard" replace />;
  }

  return <OnboardingPage />;
}
