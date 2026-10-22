import React from 'react';
import { ShieldCheck, ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function PrivacyPolicyPage() {
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
            Legal & Governance
          </span>
          <span className="text-xs text-[#687793]">Last updated: {lastUpdated}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#15264B] tracking-tight">
          Rankora Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-[#687793] leading-relaxed max-w-2xl">
          We believe developer evaluation must be transparent, evidence-based, and respectful of personal privacy rights. This policy outlines how your data is evaluated, protected, and controlled.
        </p>
      </div>

      {/* Core Privacy Axiom Card */}
      <Card className="p-6 bg-gradient-to-br from-[#F5F8FF] to-white border-[#E2EAF5] space-y-3">
        <div className="flex items-center gap-2.5 text-[#059669]">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <h2 className="font-bold text-sm sm:text-base text-[#15264B]">The Evidence Axiom</h2>
        </div>
        <p className="text-xs sm:text-sm text-[#687793] leading-relaxed">
          Rankora ranks demonstrated software engineering signals and learning velocity—never personal pedigree, university brand names, or protected identity attributes. You retain full ownership of your data, with on-demand account and evidence deletion.
        </p>
      </Card>

      {/* Structured Policy Sections */}
      <div className="space-y-8 text-xs sm:text-sm text-[#475569] leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[#15264B]">1. Information We Collect</h2>
          <p>
            When you register, authenticate, or connect accounts with Rankora, we collect specific categories of information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#687793]">
            <li><strong>Authentication Identity:</strong> Clerk user identifiers, email address, display name, and avatar picture.</li>
            <li><strong>Developer Profile Information:</strong> Country, role headline, years of experience, technical interests, and self-reported skills.</li>
            <li><strong>Public Engineering Evidence:</strong> Public GitHub commit counts, pull request activity, repository code-review metrics, and competitive coding ratings (e.g., Codeforces, LeetCode handles).</li>
            <li><strong>Assessment Telemetry:</strong> Code submission logs, execution times, test coverage metrics, and problem-solving benchmarks.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[#15264B]">2. How We Use Engineering Signals</h2>
          <p>
            Data gathered is processed exclusively for deterministic skill scoring according to the published Rankora scoring formula:
          </p>
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2EAF5] font-mono text-xs text-[#15264B]">
            Score (S) = 0.30P + 0.25E + 0.20T + 0.15C + 0.10G
          </div>
          <p>
            Signals are used to calculate percentile leagues (Rookie, Rising, Advanced, Elite) and calibrate market compensation ranges for recruiter talent matching.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[#15264B]">3. Cookies, Telemetry & Do-Not-Track (DNT)</h2>
          <p>
            Rankora uses essential session cookies for secure Clerk authentication. Non-essential telemetry is strictly opt-in and respects your browser's <code className="bg-[#F1F5F9] px-1 py-0.5 rounded text-[#15264B]">Do-Not-Track</code> preference. We do not sell developer profiles or telemetry data to third-party data brokers or advertisement networks.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[#15264B]">4. GDPR & CCPA Rights: Full Account Deletion</h2>
          <p>
            Under European General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#687793]">
            <li><strong>Export:</strong> Download a portable JSON archive of your verified skills, scores, and evaluations via Settings.</li>
            <li><strong>Rectify:</strong> Dispute or submit evidence audits for re-scoring at any time.</li>
            <li><strong>Erase ("Right to be Forgotten"):</strong> Permanently delete your developer profile and purge all linked evidence records using the Delete Account feature in Settings.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[#15264B]">5. Security & Row-Level Authorization</h2>
          <p>
            All persistent storage employs PostgreSQL Row-Level Security (RLS) policies, verifying that account modifications can only be performed by the authenticated profile owner. Sensitive secrets and private API keys are kept strictly on secure server environments.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[#15264B]">6. Contact Privacy Team</h2>
          <p>
            If you have questions about our data practices or wish to submit an audit inquiry, please reach out to our privacy governance team:
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB]">
            <Mail className="w-4 h-4" />
            <span>privacy@rankora.io</span>
          </div>
        </section>

      </div>

      <div className="pt-6 border-t border-[#E2EAF5] flex items-center justify-between">
        <Link to="/terms" className="text-xs font-semibold text-[#2563EB] hover:underline">
          Read Terms of Service →
        </Link>
        <Link to="/leaderboard">
          <Button variant="secondary" size="sm">
            Explore Leaderboard
          </Button>
        </Link>
      </div>

    </div>
  );
}
