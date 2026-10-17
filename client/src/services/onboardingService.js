import { DEVELOPERS_DATABASE, CURRENT_USER, LEADERBOARD_DATA } from '../lib/mockData.js';

const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:8080/api/v1';

const STORAGE_KEYS = {
  PROFILES: 'rankora_dev_profiles_v1',
  SKIPPED: 'rankora_onboarding_skipped_v1'
};

/**
 * Development LocalStorage Adapter
 * Safely persists profile data per Clerk user ID during local development
 * and ensures idempotency without mock data claims.
 */
class DevStorageAdapter {
  static getAllProfiles() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  static getProfile(clerkUserId) {
    if (!clerkUserId) return null;
    const profiles = this.getAllProfiles();
    return profiles[clerkUserId] || null;
  }

  static saveProfile(clerkUserId, profile) {
    if (!clerkUserId) return;
    const profiles = this.getAllProfiles();
    profiles[clerkUserId] = {
      ...profile,
      clerkUserId,
      updatedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    } catch (e) {
      console.warn('Failed to save to localStorage adapter:', e);
    }
    // Clear skipped status once completed
    this.removeSkipped(clerkUserId);
    return profiles[clerkUserId];
  }

  static isSkipped(clerkUserId) {
    if (!clerkUserId) return false;
    try {
      const skipped = JSON.parse(localStorage.getItem(STORAGE_KEYS.SKIPPED) || '{}');
      return !!skipped[clerkUserId];
    } catch {
      return false;
    }
  }

  static setSkipped(clerkUserId, value = true) {
    if (!clerkUserId) return;
    try {
      const skipped = JSON.parse(localStorage.getItem(STORAGE_KEYS.SKIPPED) || '{}');
      if (value) {
        skipped[clerkUserId] = true;
      } else {
        delete skipped[clerkUserId];
      }
      localStorage.setItem(STORAGE_KEYS.SKIPPED, JSON.stringify(skipped));
    } catch (e) {
      console.warn('Failed to set skipped in localStorage:', e);
    }
  }

  static removeSkipped(clerkUserId) {
    this.setSkipped(clerkUserId, false);
  }

  static isUsernameTaken(username, excludeClerkUserId = null) {
    const normalized = (username || '').trim().toLowerCase();
    if (!normalized) return false;

    // Check existing stored profiles
    const profiles = this.getAllProfiles();
    for (const [userId, profile] of Object.entries(profiles)) {
      if (excludeClerkUserId && userId === excludeClerkUserId) continue;
      if (profile.username && profile.username.toLowerCase() === normalized) {
        return true;
      }
    }

    // Check mock database sample developers
    if (CURRENT_USER?.username?.toLowerCase() === normalized) return true;
    if (Object.values(DEVELOPERS_DATABASE).some(d => d.username && d.username.toLowerCase() === normalized)) return true;
    if (LEADERBOARD_DATA?.podium?.some(d => d.username && d.username.toLowerCase() === normalized)) return true;
    if (LEADERBOARD_DATA?.rows?.some(d => d.username && d.username.toLowerCase() === normalized)) return true;

    return false;
  }
}

export const onboardingService = {
  /**
   * Check if username is valid format and available
   */
  async checkUsername(username, currentClerkUserId = null) {
    const trimmed = (username || '').trim();
    const usernameRegex = /^[a-zA-Z0-9_-]{3,24}$/;

    if (!trimmed) {
      return { valid: false, available: false, message: 'Username is required.' };
    }

    if (trimmed.length < 3) {
      return { valid: false, available: false, message: 'Username must be at least 3 characters.' };
    }

    if (trimmed.length > 24) {
      return { valid: false, available: false, message: 'Username must not exceed 24 characters.' };
    }

    if (!usernameRegex.test(trimmed)) {
      return { valid: false, available: false, message: 'Use only letters, numbers, underscores, or dashes.' };
    }

    // Try API first
    try {
      const signal = AbortSignal.timeout ? AbortSignal.timeout(1500) : undefined;
      const res = await fetch(
        `${BASE_URL}/onboarding/check-username/${encodeURIComponent(trimmed)}?excludeUserId=${encodeURIComponent(currentClerkUserId || '')}`,
        { signal }
      );
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Fallback to local adapter
    }

    const taken = DevStorageAdapter.isUsernameTaken(trimmed, currentClerkUserId);
    return {
      valid: true,
      available: !taken,
      username: trimmed,
      message: taken ? 'This username is already taken.' : 'Username is available!'
    };
  },

  /**
   * Get onboarding status for authenticated Clerk user
   */
  async getStatus(clerkUserId, token = null) {
    if (!clerkUserId) {
      return { isCompleted: false, isSkipped: false, profile: null, isLoading: false };
    }

    // 1. Try Backend API
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const signal = AbortSignal.timeout ? AbortSignal.timeout(1500) : undefined;
      const res = await fetch(`${BASE_URL}/onboarding/profile?userId=${encodeURIComponent(clerkUserId)}`, {
        headers,
        signal
      });

      if (res.ok) {
        const data = await res.json();
        if (data.completed && data.profile) {
          // Mirror to local cache for instant future loads
          DevStorageAdapter.saveProfile(clerkUserId, data.profile);
          return {
            isCompleted: true,
            isSkipped: false,
            profile: data.profile,
            source: 'api',
            isPermanentProduction: false
          };
        }
      }
    } catch {
      // API unavailable, proceed to local adapter
    }

    // 2. Development LocalStorage Adapter
    const devProfile = DevStorageAdapter.getProfile(clerkUserId);
    if (devProfile) {
      return {
        isCompleted: true,
        isSkipped: false,
        profile: devProfile,
        source: 'development_adapter',
        isPermanentProduction: false
      };
    }

    const isSkipped = DevStorageAdapter.isSkipped(clerkUserId);
    return {
      isCompleted: false,
      isSkipped,
      profile: null,
      source: 'development_adapter',
      isPermanentProduction: false
    };
  },

  /**
   * Save onboarding profile data for Clerk user
   */
  async completeOnboarding(clerkUserId, profileData, token = null) {
    if (!clerkUserId) {
      throw new Error('Missing verified authenticated Clerk user ID.');
    }

    if (!profileData.displayName?.trim()) {
      throw new Error('Display name is required.');
    }

    if (!profileData.username?.trim()) {
      throw new Error('Username is required.');
    }

    if (!profileData.country?.trim()) {
      throw new Error('Country or region is required.');
    }

    // Format clean record
    const formattedProfile = {
      clerkUserId,
      id: `usr_${clerkUserId.replace(/^user_/, '')}`,
      displayName: profileData.displayName.trim(),
      username: profileData.username.trim().toLowerCase(),
      country: profileData.country.trim(),
      location: profileData.location?.trim() || profileData.country.trim(),
      headline: profileData.headline?.trim() || 'Software Engineer building verified proof on Rankora',
      experienceLevel: profileData.experienceLevel || 'Fresher / Student (0-1 yrs)',
      experience: profileData.experienceLevel || 'Fresher',
      interests: Array.isArray(profileData.interests) ? profileData.interests : [],
      // User-provided skills are labeled as provisional / self-reported
      skills: Array.isArray(profileData.skills)
        ? profileData.skills.map(s => typeof s === 'string'
            ? { name: s, level: 'User-Reported', verified: false, evidenceCount: 0 }
            : s)
        : [],
      techStack: Array.isArray(profileData.skills)
        ? profileData.skills.map(s => typeof s === 'string' ? s : s.name)
        : [],
      githubHandle: profileData.githubHandle?.trim() || '',
      portfolioUrl: profileData.portfolioUrl?.trim() || '',
      linkedinUrl: profileData.linkedinUrl?.trim() || '',
      leetcodeHandle: profileData.leetcodeHandle?.trim() || '',
      visibility: profileData.visibility || 'public',
      consentAccepted: !!profileData.consentAccepted,
      roleTitle: profileData.headline?.trim() || 'Developer',
      avatar: profileData.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${profileData.username.trim()}`,
      globalRank: '#Provisional',
      percentileBadge: 'Provisional Signal',
      totalScore: 720,
      scoreChange: '+0%',
      stats: {
        projects: 0,
        assessments: 0,
        repositories: profileData.githubHandle ? 1 : 0,
        streakDays: 1,
        streakMessage: 'Journey started! 🚀'
      },
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let savedViaApi = false;

    // 1. Attempt API save
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const signal = AbortSignal.timeout ? AbortSignal.timeout(2000) : undefined;
      const res = await fetch(`${BASE_URL}/onboarding/complete`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          clerkUserId,
          profileData: formattedProfile
        }),
        signal
      });

      if (res.ok) {
        savedViaApi = true;
      }
    } catch {
      // API unavailable or errored
    }

    // 2. Persist in Development Local Adapter (guarantees local responsiveness & idempotency)
    const localSaved = DevStorageAdapter.saveProfile(clerkUserId, formattedProfile);

    return {
      success: true,
      profile: localSaved || formattedProfile,
      source: savedViaApi ? 'api' : 'development_adapter',
      isPermanentProduction: false,
      message: savedViaApi
        ? 'Profile saved to Rankora API & local store.'
        : 'Saved via Rankora Development Profile Store (browser-persisted for Clerk user).'
    };
  },

  /**
   * Skip onboarding temporarily
   */
  skip(clerkUserId) {
    if (!clerkUserId) return;
    DevStorageAdapter.setSkipped(clerkUserId, true);
    return { success: true };
  },

  /**
   * Reset onboarding for local testing
   */
  reset(clerkUserId) {
    if (!clerkUserId) return;
    const profiles = DevStorageAdapter.getAllProfiles();
    delete profiles[clerkUserId];
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    DevStorageAdapter.removeSkipped(clerkUserId);
    return { success: true };
  }
};
