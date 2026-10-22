import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { analytics } from '../../lib/analytics';
import { Button } from '../ui/Button';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('rankora_cookie_consent_decided');
    if (!stored) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    analytics.setConsent(true, true);
    localStorage.setItem('rankora_cookie_consent_decided', 'true');
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    analytics.setConsent(false, false);
    localStorage.setItem('rankora_cookie_consent_decided', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside 
      aria-label="Cookie and Privacy Preferences"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-white/95 backdrop-blur-md border border-[#E2EAF5] shadow-2xl rounded-3xl p-5 animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-[#EAF3FF] text-[#2563EB] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h4 className="font-bold text-xs sm:text-sm text-[#15264B]">
            Privacy & Telemetry Controls
          </h4>
          <p className="text-[11px] sm:text-xs text-[#687793] leading-relaxed">
            We use minimal, privacy-preserving telemetry to improve ranking algorithms without collecting personal identifiable information. Learn more in our{' '}
            <Link to="/privacy" className="text-[#2563EB] font-bold hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 mt-4 pt-3 border-t border-[#E2EAF5]">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRejectNonEssential}
          className="text-xs"
        >
          Essential Only
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleAcceptAll}
          className="text-xs font-bold"
        >
          Accept All
        </Button>
      </div>
    </aside>
  );
}
