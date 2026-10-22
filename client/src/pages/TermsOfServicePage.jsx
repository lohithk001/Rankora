import React from 'react';
import { Scale, ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function TermsOfServicePage() {
  const lastUpdated = "October 2026";

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8 font-sans">
      
      {/* Header */}
      <div className="space-y-3">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#687793] hover:text-[#15264B] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#DBEAFE]">
            Platform Governance
          </span>
          <span className="text-xs text-[#687793]">Last updated: {lastUpdated}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#15264B] tracking-tight">
          Rankora Terms of Service
        </h1>
        <p className="text-sm sm:text-base text-[#687793] leading-relaxed max-w-2xl">
          Please review these Terms of Service before using the Rankora Developer Intelligence platform, algorithm APIs, and verified engineering ranking dashboards.
        </p>
      </div>

      {/* Axiom Card */}
      <Card className="p-6 bg-gradient-to-br from-[#F5F8FF] to-white border-[#E2EAF5] space-y-3">
        <div className="flex items-center gap-2.5 text-[#2563EB]">
          <Scale className="w-5 h-5 shrink-0" />
          <h2 className="font-bold text-sm sm:text-base text-[#15264B]">Informational Benchmark Notice</h2>
        </div>
        <p className="text-xs sm:text-sm text-[#687793] leading-relaxed">
          Rankora composite scores and estimated market compensation ranges are statistical benchmarks derived from peer engineering evidence. They do not constitute financial guarantees, wage promises, or judgments of intrinsic human worth.
        </p>
      </Card>

      {/* Terms Sections */}
      <div className="space-y-8 text-xs sm:text-sm text-[#475569] leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[#15264B]">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Rankora, creating a developer profile, or connecting external code repositories, you agree to be bound by these Terms. If you do not agree, you must discontinue using Rankora and delete your account.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[#15264B]">2. Integrity & Anti-Gaming Rules</h2>
          <p>
            Rankora relies on verifiable evidence. The following actions constitute violations of platform integrity:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#687793]">
            <li>Submitting plagiarized solutions or third-party code as personal work.</li>
            <li>Employing automated botting, artificial rating farming, or manipulation of external coding handles.</li>
            <li>Attempting to bypass API rate limits, row-level authorization, or assessment time constraints.</li>
            <li>Impersonating another engineer or claiming repos you did not author or contribute to.</li>
          </ul>
          <p>
            Violations result in algorithmic provisional flags, score deduction, or permanent account disqualification.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[#15264B]">3. Intellectual Property Rights</h2>
          <p>
            <strong>Your Code:</strong> You retain 100% ownership of your source code, repositories, and project solutions. Rankora analyzes public repositories solely to extract technical signal metrics.
          </p>
          <p>
            <strong>Rankora Engine:</strong> The scoring algorithms, formula weights, interface designs, badges, and platform trademarks belong exclusively to Rankora.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[#15264B]">4. Recruiter Discovery & Inquiries</h2>
          <p>
            When you enable Recruiter Discovery in your Settings, verified hiring partners may contact you with interview inquiries matching your role-fit scores. You may toggle this off at any time to remain unlisted.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[#15264B]">5. Account Termination & Deletion</h2>
          <p>
            You may terminate your account at any time via the Settings page. Upon confirmation, your developer profile, linked evidence entries, and score history are permanently deleted from active records.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[#15264B]">6. Disclaimer of Warranties</h2>
          <p>
            Rankora is provided "as is" and "as available" without warranties of any kind. We do not guarantee employment placement, salary matches, or error-free scoring from third-party APIs.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[#15264B]">7. Contact & Legal Inquiries</h2>
          <p>
            For legal notices, terms questions, or appeal submissions, please contact our legal counsel:
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB]">
            <Mail className="w-4 h-4" />
            <span>legal@rankora.io</span>
          </div>
        </section>

      </div>

      <div className="pt-6 border-t border-[#E2EAF5] flex items-center justify-between">
        <Link to="/privacy" className="text-xs font-semibold text-[#2563EB] hover:underline">
          ← Read Privacy Policy
        </Link>
        <Link to="/">
          <Button variant="primary" size="sm">
            Accept & Continue
          </Button>
        </Link>
      </div>

    </div>
  );
}
