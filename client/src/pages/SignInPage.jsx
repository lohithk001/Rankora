import React from 'react';
import { SignIn } from '@clerk/react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { RankoraLogo } from '../components/common/RankoraLogo';

export function SignInPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md mx-auto py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="flex justify-center pb-1">
            <RankoraLogo size="md" linkTo="/" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#15264B] tracking-tight">
            Welcome back to Rankora
          </h1>
          <p className="text-xs text-[#687793]">
            Access your verified ranking, skill signals, and peer benchmarks.
          </p>
        </div>

        {/* Quick Demo Access Button */}
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#E8F8F0] hover:bg-[#D4F4E4] border border-[#A7F3D0] text-[#065F46] font-bold text-xs transition cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-[#10B981]" />
          <span>Quick Preview as Demo Developer</span>
        </button>

        <div className="w-full flex justify-center">
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'w-full shadow-sm border border-[#E2EAF5] rounded-3xl bg-white p-6 sm:p-8',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                formButtonPrimary: 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl py-2.5 shadow-sm',
                footerActionLink: 'text-[#2563EB] hover:underline font-bold',
              },
              variables: {
                colorPrimary: '#2563EB',
                colorText: '#15264B',
                colorTextSecondary: '#687793',
                fontFamily: 'inherit',
                borderRadius: '0.75rem',
              },
            }}
          />
        </div>

        {/* Password Reset & Recovery Helper Card */}
        <div className="w-full p-4 rounded-2xl bg-white border border-[#E2EAF5] shadow-xs text-xs text-[#687793] space-y-1 text-center">
          <p className="font-bold text-[#15264B]">Account Recovery & Password Reset</p>
          <p className="text-[11px] leading-relaxed">
            Need to reset your credentials? Click <strong className="text-[#2563EB]">"Forgot password?"</strong> above to receive a secure recovery code on your verified email address.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
