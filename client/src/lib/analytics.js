/**
 * Rankora Privacy-First Analytics Engine
 * Compliant with GDPR, CCPA, and Do-Not-Track (DNT) standards.
 * Zero personal identifiable information (PII) collected.
 */

const STORAGE_KEY = 'rankora_analytics_preferences_v1';

class AnalyticsService {
  constructor() {
    this.preferences = this.loadPreferences();
  }

  loadPreferences() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }

    // Default: Check Browser Do Not Track signal
    const dnt = typeof navigator !== 'undefined' && (navigator.doNotTrack === '1' || window.doNotTrack === '1');

    return {
      consentGiven: !dnt,
      telemetryEnabled: !dnt,
      performanceCookies: !dnt,
      updatedAt: new Date().toISOString()
    };
  }

  savePreferences(prefs) {
    this.preferences = {
      ...this.preferences,
      ...prefs,
      updatedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (e) {
      console.warn('Failed saving analytics preferences:', e);
    }
  }

  isEnabled() {
    return !!this.preferences.telemetryEnabled && !!this.preferences.consentGiven;
  }

  setConsent(consentGiven, telemetryEnabled = true) {
    this.savePreferences({
      consentGiven,
      telemetryEnabled: consentGiven ? telemetryEnabled : false
    });
  }

  trackPageView(pageName) {
    if (!this.isEnabled()) return;
    this.logEvent('page_view', { page: pageName, timestamp: new Date().toISOString() });
  }

  trackAction(actionName, properties = {}) {
    if (!this.isEnabled()) return;
    // Strip any sensitive keys
    const sanitizedProps = { ...properties };
    delete sanitizedProps.password;
    delete sanitizedProps.token;
    delete sanitizedProps.email;

    this.logEvent('user_action', { action: actionName, ...sanitizedProps });
  }

  logEvent(type, payload) {
    if (import.meta.env.DEV) {
      console.log(`[Privacy Analytics] [${type}]`, payload);
    }
    // In production, events can be buffered and sent to an aggregate metrics server
  }
}

export const analytics = new AnalyticsService();
