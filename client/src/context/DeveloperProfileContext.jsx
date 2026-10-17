import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/react';
import { onboardingService } from '../services/onboardingService';
import { CURRENT_USER } from '../lib/mockData';

const DeveloperProfileContext = createContext(null);

export function DeveloperProfileProvider({ children }) {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const [customProfile, setCustomProfile] = useState(null);
  const [onboardingStatus, setOnboardingStatus] = useState({
    isCompleted: false,
    isSkipped: false,
    isLoading: true
  });
  const [persistenceInfo, setPersistenceInfo] = useState({
    adapter: 'development_adapter',
    isProduction: false,
    message: ''
  });

  // Load user onboarding status whenever Clerk user changes
  const loadProfile = useCallback(async () => {
    if (!isUserLoaded) return;

    if (!isSignedIn || !user) {
      setCustomProfile(null);
      setOnboardingStatus({
        isCompleted: false,
        isSkipped: false,
        isLoading: false
      });
      return;
    }

    try {
      let token = null;
      try {
        token = await getToken();
      } catch {
        // Token retrieval optional in dev
      }

      const status = await onboardingService.getStatus(user.id, token);
      if (status.isCompleted && status.profile) {
        setCustomProfile(status.profile);
        setOnboardingStatus({
          isCompleted: true,
          isSkipped: false,
          isLoading: false
        });
        setPersistenceInfo({
          adapter: status.source || 'development_adapter',
          isProduction: false,
          message: status.source === 'api'
            ? 'Synced with Rankora Backend API'
            : 'Persisted in Rankora Local Development Store'
        });
      } else {
        setCustomProfile(null);
        setOnboardingStatus({
          isCompleted: false,
          isSkipped: !!status.isSkipped,
          isLoading: false
        });
      }
    } catch (err) {
      console.warn('Error loading onboarding status:', err);
      setOnboardingStatus({
        isCompleted: false,
        isSkipped: false,
        isLoading: false
      });
    }
  }, [isUserLoaded, isSignedIn, user, getToken]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Complete onboarding
  const completeOnboarding = async (data) => {
    if (!user) throw new Error('You must be signed in to complete onboarding.');

    let token = null;
    try {
      token = await getToken();
    } catch {
      // Optional
    }

    const result = await onboardingService.completeOnboarding(user.id, data, token);
    setCustomProfile(result.profile);
    setOnboardingStatus({
      isCompleted: true,
      isSkipped: false,
      isLoading: false
    });
    setPersistenceInfo({
      adapter: result.source,
      isProduction: false,
      message: result.message
    });
    return result;
  };

  // Skip onboarding
  const skipOnboarding = () => {
    if (!user) return;
    onboardingService.skip(user.id);
    setOnboardingStatus(prev => ({
      ...prev,
      isSkipped: true,
      isLoading: false
    }));
  };

  // Reset for testing
  const resetOnboarding = () => {
    if (!user) return;
    onboardingService.reset(user.id);
    setCustomProfile(null);
    setOnboardingStatus({
      isCompleted: false,
      isSkipped: false,
      isLoading: false
    });
  };

  // Merge custom profile into CURRENT_USER structure
  const activeProfile = customProfile ? {
    ...CURRENT_USER,
    ...customProfile,
    // Keep badges and breakdown structures intact
    badges: CURRENT_USER.badges,
    skillsBreakdown: CURRENT_USER.skillsBreakdown,
    salaryRange: {
      ...CURRENT_USER.salaryRange,
      location: customProfile.location || customProfile.country || CURRENT_USER.salaryRange.location
    }
  } : CURRENT_USER;

  return (
    <DeveloperProfileContext.Provider value={{
      profile: activeProfile,
      customProfile,
      onboardingStatus,
      persistenceInfo,
      completeOnboarding,
      skipOnboarding,
      resetOnboarding,
      refreshProfile: loadProfile
    }}>
      {children}
    </DeveloperProfileContext.Provider>
  );
}

export function useDeveloperProfile() {
  const context = useContext(DeveloperProfileContext);
  if (!context) {
    throw new Error('useDeveloperProfile must be used within a DeveloperProfileProvider');
  }
  return context;
}
