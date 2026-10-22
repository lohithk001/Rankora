import React from 'react';
import { SignUp } from '@clerk/react';
import { motion } from 'motion/react';
import { RankoraLogo } from '../components/common/RankoraLogo';

export function SignUpPage() {
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
            Create your account
          </h1>
          <p className="text-xs text-[#687793]">
            Claim your verified developer rank and showcase your true engineering signal.
          </p>
        </div>

        <div className="w-full flex justify-center">
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
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

        {/* Email Verification and Terms Notice */}
        <div className="w-full p-4 rounded-2xl bg-white border border-[#E2EAF5] shadow-xs text-xs text-[#687793] space-y-1 text-center">
          <p className="font-bold text-[#15264B]">Email Verification Required</p>
          <p className="text-[11px] leading-relaxed">
            A 6-digit one-time passcode will be dispatched to your inbox to authenticate genuine developer identity. By signing up, you agree to our{' '}
            <a href="/terms" className="text-[#2563EB] font-bold hover:underline">Terms of Service</a> and{' '}
            <a href="/privacy" className="text-[#2563EB] font-bold hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
