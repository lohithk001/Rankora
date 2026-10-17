import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Mock localStorage for Node test runner
const storageMap = new Map();
globalThis.localStorage = {
  getItem: (key) => storageMap.get(key) || null,
  setItem: (key, val) => storageMap.set(key, String(val)),
  removeItem: (key) => storageMap.delete(key),
  clear: () => storageMap.clear()
};

// Import service after localStorage mock
const { onboardingService } = await import('../onboardingService.js');

describe('Rankora Developer Onboarding System', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  test('Validation: username rejects invalid lengths and special characters', async () => {
    const tooShort = await onboardingService.checkUsername('ab');
    assert.equal(tooShort.valid, false);

    const invalidChars = await onboardingService.checkUsername('user@name!');
    assert.equal(invalidChars.valid, false);

    const valid = await onboardingService.checkUsername('grace_hopper-42');
    assert.equal(valid.valid, true);
    assert.equal(valid.available, true);
  });

  test('Validation: username collision check detects taken handles', async () => {
    // "arjun" is a known sample developer in mockData
    const res = await onboardingService.checkUsername('arjun');
    assert.equal(res.valid, true);
    assert.equal(res.available, false);
  });

  test('New-user flow: returns incomplete and unskipped status initially', async () => {
    const status = await onboardingService.getStatus('user_new_12345');
    assert.equal(status.isCompleted, false);
    assert.equal(status.isSkipped, false);
    assert.equal(status.profile, null);
  });

  test('Complete onboarding: successfully persists profile with provisional skills', async () => {
    const clerkUserId = 'user_clerk_test_99';
    const profilePayload = {
      displayName: 'Margaret Hamilton',
      username: 'apollo_margaret',
      country: 'United States',
      experienceLevel: 'Staff / Lead Architect',
      interests: ['Distributed Systems', 'Fault Tolerance'],
      skills: ['Assembly', 'Software Engineering', 'System Architecture'],
      githubHandle: 'mhamilton',
      consentAccepted: true
    };

    const res = await onboardingService.completeOnboarding(clerkUserId, profilePayload);
    assert.equal(res.success, true);
    assert.equal(res.profile.displayName, 'Margaret Hamilton');
    assert.equal(res.profile.username, 'apollo_margaret');
    assert.equal(res.profile.country, 'United States');
    
    // Requirement 9: Skills are provisional / user-reported, not automatically verified
    assert.equal(res.profile.skills[0].level, 'User-Reported');
    assert.equal(res.profile.skills[0].verified, false);

    // Returning user flow: subsequent getStatus returns completed profile
    const returningStatus = await onboardingService.getStatus(clerkUserId);
    assert.equal(returningStatus.isCompleted, true);
    assert.equal(returningStatus.isSkipped, false);
    assert.equal(returningStatus.profile.username, 'apollo_margaret');
  });

  test('Idempotency: saving multiple times updates profile without duplicating', async () => {
    const clerkUserId = 'user_clerk_idempotent';
    
    await onboardingService.completeOnboarding(clerkUserId, {
      displayName: 'Ken Thompson',
      username: 'ken_unix',
      country: 'United States',
      experienceLevel: 'Staff+',
      skills: ['C', 'Unix', 'Go'],
      consentAccepted: true
    });

    // Update with new skills
    const updated = await onboardingService.completeOnboarding(clerkUserId, {
      displayName: 'Kenneth L. Thompson',
      username: 'ken_unix',
      country: 'United States',
      experienceLevel: 'Staff+',
      skills: ['C', 'Unix', 'Go', 'Plan 9'],
      consentAccepted: true
    });

    assert.equal(updated.success, true);
    assert.equal(updated.profile.displayName, 'Kenneth L. Thompson');
    assert.equal(updated.profile.skills.length, 4);

    const allProfiles = JSON.parse(globalThis.localStorage.getItem('rankora_dev_profiles_v1'));
    // Exactly 1 record for this Clerk ID
    assert.equal(Object.keys(allProfiles).filter(id => id === clerkUserId).length, 1);
  });

  test('Skip onboarding: marks skipped without blocking and can complete later', async () => {
    const clerkUserId = 'user_clerk_skipper';
    
    onboardingService.skip(clerkUserId);
    const skippedStatus = await onboardingService.getStatus(clerkUserId);
    assert.equal(skippedStatus.isCompleted, false);
    assert.equal(skippedStatus.isSkipped, true);

    // Now completes later
    await onboardingService.completeOnboarding(clerkUserId, {
      displayName: 'Late Completer',
      username: 'late_dev',
      country: 'Canada',
      experienceLevel: 'Junior',
      skills: ['JavaScript'],
      consentAccepted: true
    });

    const finalStatus = await onboardingService.getStatus(clerkUserId);
    assert.equal(finalStatus.isCompleted, true);
    assert.equal(finalStatus.isSkipped, false);
  });

  test('Security: throws error if clerkUserId is missing or empty', async () => {
    await assert.rejects(
      async () => {
        await onboardingService.completeOnboarding('', {
          displayName: 'Hacker',
          username: 'hacker',
          country: 'Nowhere'
        });
      },
      { message: 'Missing verified authenticated Clerk user ID.' }
    );
  });

  test('Validation: throws error if required fields are missing', async () => {
    await assert.rejects(
      async () => {
        await onboardingService.completeOnboarding('user_123', {
          displayName: '',
          username: 'valid_user',
          country: 'India'
        });
      },
      { message: 'Display name is required.' }
    );
  });
});
