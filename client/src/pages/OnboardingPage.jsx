import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Globe, 
  ShieldCheck, 
  AlertCircle, 
  Loader2,
  Info,
  X
} from 'lucide-react';
import { RankoraLogo } from '../components/common/RankoraLogo';
import { Button } from '../components/ui/Button';
import { useDeveloperProfile } from '../context/DeveloperProfileContext';
import { onboardingService } from '../services/onboardingService';

function GithubIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const COUNTRIES = [
  "India", "United States", "Germany", "United Kingdom", "Canada", 
  "France", "Japan", "Singapore", "Australia", "Netherlands",
  "Brazil", "South Korea", "Sweden", "Poland", "Ukraine", 
  "Switzerland", "Israel", "Spain", "Italy", "Vietnam"
];

const EXPERIENCE_LEVELS = [
  { id: "Fresher", label: "Fresher / Student", sub: "0 - 1 years of experience" },
  { id: "Junior", label: "Junior Engineer", sub: "1 - 3 years of experience" },
  { id: "Mid-Level", label: "Mid-Level Engineer", sub: "3 - 5 years of experience" },
  { id: "Senior", label: "Senior Engineer", sub: "5 - 8 years of experience" },
  { id: "Staff+", label: "Staff / Lead Architect", sub: "8+ years of experience" },
];

const POPULAR_INTERESTS = [
  "Distributed Systems",
  "Frontend Architecture",
  "Machine Learning & AI",
  "Competitive Programming",
  "DevOps & Cloud",
  "Security & Cryptography",
  "Full-Stack Web",
  "Database Internals",
  "Mobile Apps",
  "Open Source Tooling"
];

const POPULAR_SKILLS = [
  "Python", "TypeScript", "React", "Go", "Rust", 
  "Node.js", "Java", "PostgreSQL", "Docker", "Kubernetes",
  "Next.js", "C++", "SQL", "TailwindCSS"
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { completeOnboarding, skipOnboarding } = useDeveloperProfile();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form State
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('India');
  const [headline, setHeadline] = useState('');

  const [experienceLevel, setExperienceLevel] = useState('Junior');
  const [selectedInterests, setSelectedInterests] = useState(['Full-Stack Web', 'Distributed Systems']);
  const [selectedSkills, setSelectedSkills] = useState(['TypeScript', 'React', 'Node.js']);
  const [customSkillInput, setCustomSkillInput] = useState('');

  const [githubHandle, setGithubHandle] = useState('');
  const [githubConnected, setGithubConnected] = useState(false);
  const [leetcodeHandle, setLeetcodeHandle] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const [visibility, setVisibility] = useState('public');
  const [consentAccepted, setConsentAccepted] = useState(true);

  // Validation & Loading States
  const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill from Clerk user
  useEffect(() => {
    if (user) {
      if (!displayName) {
        const name = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '';
        setDisplayName(name);
      }
      if (!username) {
        const initialHandle = user.username || (user.primaryEmailAddress?.emailAddress ? user.primaryEmailAddress.emailAddress.split('@')[0] : '');
        const cleanHandle = initialHandle.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 24);
        if (cleanHandle) {
          setUsername(cleanHandle);
        }
      }
    }
  }, [user]);

  // Debounced username availability check
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameStatus({ checking: false, available: null, message: '' });
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameStatus({ checking: true, available: null, message: 'Checking availability...' });
      const res = await onboardingService.checkUsername(username, user?.id);
      setUsernameStatus({
        checking: false,
        available: res.available,
        message: res.message
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [username, user?.id]);

  // Handlers for interests and skills
  const toggleInterest = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    const clean = customSkillInput.trim();
    if (clean && !selectedSkills.includes(clean)) {
      setSelectedSkills(prev => [...prev, clean]);
      setCustomSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  // Step navigation validations
  const validateStep = (currentStep) => {
    setErrorMessage('');
    if (currentStep === 1) {
      if (!displayName.trim()) {
        setErrorMessage('Please enter your full name or display name.');
        return false;
      }
      if (!username.trim() || username.length < 3) {
        setErrorMessage('Username must be at least 3 characters.');
        return false;
      }
      if (usernameStatus.available === false) {
        setErrorMessage('The username is already taken. Please choose another.');
        return false;
      }
      if (!country) {
        setErrorMessage('Please select your country or region.');
        return false;
      }
    }
    if (currentStep === 2) {
      if (selectedSkills.length === 0) {
        setErrorMessage('Please select or add at least one primary skill.');
        return false;
      }
    }
    if (currentStep === 4) {
      if (!consentAccepted) {
        setErrorMessage('Please accept the verification terms to complete onboarding.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(totalSteps, prev + 1));
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSkip = () => {
    skipOnboarding();
    navigate('/dashboard');
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await completeOnboarding({
        displayName,
        username,
        country,
        headline: headline || `${experienceLevel} Engineer building verified signal on Rankora`,
        experienceLevel,
        interests: selectedInterests,
        skills: selectedSkills,
        githubHandle: githubHandle || (githubConnected ? username : ''),
        leetcodeHandle,
        portfolioUrl,
        linkedinUrl,
        visibility,
        consentAccepted
      });

      // Redirect to dashboard with celebration state
      navigate('/dashboard', { 
        state: { 
          fromOnboarding: true,
          welcomeUser: displayName 
        } 
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-[#F5F8FF] py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Top Header & Brand */}
        <div className="flex items-center justify-between">
          <RankoraLogo size="md" linkTo="/" />
          
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-semibold text-[#687793] hover:text-[#15264B] transition cursor-pointer"
          >
            Skip for now & explore →
          </button>
        </div>

        {/* Progress Bar & Stepper */}
        <div className="bg-white rounded-2xl p-4 border border-[#E2EAF5] shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#15264B]">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px]">
                {step}
              </span>
              <span>Step {step} of {totalSteps}: {
                step === 1 ? 'Developer Identity' :
                step === 2 ? 'Craft & Skills' :
                step === 3 ? 'Profiles & GitHub (Optional)' :
                'Consent & Review'
              }</span>
            </span>
            <span className="text-[#2563EB]">{progressPercentage}% Complete</span>
          </div>

          <div className="w-full bg-[#E2EAF5] h-2 rounded-full overflow-hidden">
            <motion.div 
              className="bg-[#2563EB] h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-4 text-xs text-[#991B1B] flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444]" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* Multi-Step Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2EAF5] shadow-sm relative overflow-hidden">
          
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-left"
            >
              <div>
                <span className="text-[11px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Step 1 • Profile Signal
                </span>
                <h2 className="text-2xl font-extrabold text-[#15264B] tracking-tight mt-2">
                  Claim your Developer Identity
                </h2>
                <p className="text-xs text-[#687793] mt-1">
                  This identity will be associated with your verified ranking and public engineering score.
                </p>
              </div>

              <div className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#15264B]">
                    Full Name / Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ada Lovelace"
                    className="w-full px-4 py-2.5 bg-[#F5F8FF] border border-[#E2EAF5] rounded-xl text-xs sm:text-sm text-[#15264B] focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                    required
                  />
                </div>

                {/* Username with live check */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#15264B]">
                      Unique Developer Handle <span className="text-red-500">*</span>
                    </label>
                    {usernameStatus.checking ? (
                      <span className="text-[11px] text-[#687793] flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Checking...</span>
                      </span>
                    ) : usernameStatus.available === true ? (
                      <span className="text-[11px] font-bold text-[#10B981] flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Available</span>
                      </span>
                    ) : usernameStatus.available === false ? (
                      <span className="text-[11px] font-bold text-[#EF4444]">
                        Claimed
                      </span>
                    ) : null}
                  </div>

                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#94A3B8]">
                      @
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                      placeholder="lovelace"
                      className="w-full pl-8 pr-4 py-2.5 bg-[#F5F8FF] border border-[#E2EAF5] rounded-xl text-xs sm:text-sm text-[#15264B] focus:outline-none focus:border-[#2563EB] focus:bg-white font-mono transition"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-[#687793]">
                    Your public link: <code>rankora.io/developers/{username || 'your-handle'}</code>
                  </p>
                </div>

                {/* Country / Location */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#15264B]">
                    Country / Global Region <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F5F8FF] border border-[#E2EAF5] rounded-xl text-xs sm:text-sm text-[#15264B] focus:outline-none focus:border-[#2563EB] focus:bg-white transition cursor-pointer"
                    >
                      {COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[11px] text-[#687793]">
                    Used to benchmark your score against regional and global peers.
                  </p>
                </div>

                {/* Headline / Bio */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#15264B]">
                    Developer Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Full Stack Engineer passionate about distributed systems & clean craft"
                    className="w-full px-4 py-2.5 bg-[#F5F8FF] border border-[#E2EAF5] rounded-xl text-xs sm:text-sm text-[#15264B] focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                  />
                </div>

              </div>
            </motion.div>
          )}

          {/* STEP 2: CRAFT & SKILLS */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-left"
            >
              <div>
                <span className="text-[11px] font-bold text-[#10B981] bg-[#E8F8F0] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Step 2 • Engineering Craft
                </span>
                <h2 className="text-2xl font-extrabold text-[#15264B] tracking-tight mt-2">
                  Skills & Experience
                </h2>
                <p className="text-xs text-[#687793] mt-1">
                  Tell us what you build and what technologies you use every day.
                </p>
              </div>

              {/* Notice regarding self-reported skills */}
              <div className="p-3.5 bg-[#FFF8DC] border border-[#FFE89A] rounded-2xl flex items-start gap-2.5 text-xs text-[#92400E]">
                <Info className="w-4 h-4 shrink-0 text-[#D97706] mt-0.5" />
                <p>
                  <strong>Transparency Guarantee:</strong> Skills added here are marked as <em>User-Reported</em>. You can verify them into <em>Rankora Verified Badges</em> via code repositories and challenge audits.
                </p>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#15264B]">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setExperienceLevel(lvl.id)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        experienceLevel === lvl.id
                          ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A] font-bold shadow-2xs'
                          : 'border-[#E2EAF5] bg-white text-[#687793] hover:bg-[#F5F8FF]'
                      }`}
                    >
                      <span className="text-xs font-bold text-[#15264B]">{lvl.label}</span>
                      <span className="text-[10px] text-[#94A3B8]">{lvl.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Developer Interests Chips */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#15264B]">
                  Core Engineering Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_INTERESTS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#15264B] text-white border-[#15264B] font-semibold'
                            : 'bg-[#F5F8FF] text-[#475569] border-[#E2EAF5] hover:bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-[#10B981]" />}
                        <span>{interest}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills Tags */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#15264B]">
                  Primary Skills & Technologies <span className="text-red-500">*</span>
                </label>
                
                {/* Popular pills */}
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SKILLS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#2563EB] text-white border-[#2563EB] font-bold'
                            : 'bg-white text-[#687793] border-[#E2EAF5] hover:border-[#CBD5E1]'
                        }`}
                      >
                        {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                      </button>
                    );
                  })}
                </div>

                {/* Custom skill input */}
                <form onSubmit={handleAddCustomSkill} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    placeholder="Add custom skill (e.g. GraphQL, Redis, Rust)..."
                    className="flex-1 px-3 py-2 bg-[#F5F8FF] border border-[#E2EAF5] rounded-xl text-xs text-[#15264B] focus:outline-none focus:border-[#2563EB]"
                  />
                  <Button type="submit" variant="secondary" size="sm" className="cursor-pointer">
                    Add
                  </Button>
                </form>

                {/* Selected Skills Chips */}
                {selectedSkills.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {selectedSkills.map(s => (
                      <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold border border-[#BFDBFE]">
                        <span>{s}</span>
                        <button type="button" onClick={() => handleRemoveSkill(s)} className="hover:text-red-500 cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </motion.div>
          )}

          {/* STEP 3: OPTIONAL INTEGRATIONS */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-left"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#7C3AED] bg-[#F3EFFF] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Step 3 • Integrations (Optional)
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#15264B] tracking-tight mt-2">
                    Connect External Evidence
                  </h2>
                  <p className="text-xs text-[#687793] mt-1">
                    Linking public profiles helps Rankora automatically evaluate your engineering signals.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Skip Step →
                </button>
              </div>

              {/* GitHub Card with Explicit Security Notice */}
              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2EAF5] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#15264B] text-white flex items-center justify-center">
                      <GithubIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#15264B]">GitHub Account</h4>
                      <p className="text-[11px] text-[#687793]">Commit frequency & public repository analysis</p>
                    </div>
                  </div>

                  {githubConnected ? (
                    <span className="text-xs font-bold text-[#10B981] bg-[#E8F8F0] px-2.5 py-1 rounded-lg border border-[#A7F3D0] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Linked</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setGithubConnected(true)}
                      className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-3 py-1.5 rounded-xl transition cursor-pointer"
                    >
                      Connect
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#687793]">GitHub Username</label>
                  <input
                    type="text"
                    value={githubHandle}
                    onChange={(e) => setGithubHandle(e.target.value)}
                    placeholder="e.g. torvalds"
                    className="w-full px-3 py-2 bg-white border border-[#E2EAF5] rounded-xl text-xs text-[#15264B] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <p className="text-[11px] text-[#059669] flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Privacy guarantee: No write permissions or private repository access requested.</span>
                </p>
              </div>

              {/* LeetCode & Codeforces */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-[#E2EAF5] space-y-1.5">
                  <label className="block text-xs font-bold text-[#15264B]">LeetCode Handle</label>
                  <input
                    type="text"
                    value={leetcodeHandle}
                    onChange={(e) => setLeetcodeHandle(e.target.value)}
                    placeholder="username"
                    className="w-full px-3 py-2 bg-[#F5F8FF] border border-[#E2EAF5] rounded-xl text-xs text-[#15264B]"
                  />
                  <span className="text-[10px] text-[#94A3B8]">Optional problem-solving signal</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E2EAF5] space-y-1.5">
                  <label className="block text-xs font-bold text-[#15264B]">Portfolio / Blog Link</label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://mywebsite.dev"
                    className="w-full px-3 py-2 bg-[#F5F8FF] border border-[#E2EAF5] rounded-xl text-xs text-[#15264B]"
                  />
                  <span className="text-[10px] text-[#94A3B8]">Personal portfolio showcase</span>
                </div>
              </div>

              {/* LinkedIn URL */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2EAF5] space-y-1.5">
                <label className="block text-xs font-bold text-[#15264B]">LinkedIn Profile</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 bg-[#F5F8FF] border border-[#E2EAF5] rounded-xl text-xs text-[#15264B]"
                />
              </div>

            </motion.div>
          )}

          {/* STEP 4: REVIEW & CONSENT */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-left"
            >
              <div>
                <span className="text-[11px] font-bold text-[#D97706] bg-[#FFF8DC] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Step 4 • Final Review
                </span>
                <h2 className="text-2xl font-extrabold text-[#15264B] tracking-tight mt-2">
                  Review & Launch Profile
                </h2>
                <p className="text-xs text-[#687793] mt-1">
                  Verify your profile configuration before activating your developer ranking.
                </p>
              </div>

              {/* Profile Card Preview */}
              <div className="p-5 rounded-3xl bg-[#F5F8FF] border border-[#E2EAF5] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] text-white font-extrabold text-xl flex items-center justify-center shadow-sm">
                    {displayName ? displayName[0].toUpperCase() : 'D'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#15264B]">{displayName || 'Anonymous Developer'}</h3>
                    <p className="text-xs text-[#687793]">@{username} • {country}</p>
                    <span className="text-[10px] font-bold text-[#059669] bg-[#E8F8F0] px-2 py-0.5 rounded-full mt-1 inline-block">
                      {experienceLevel} Engineer
                    </span>
                  </div>
                </div>

                {headline && (
                  <p className="text-xs text-[#475569] bg-white p-3 rounded-xl border border-[#E2EAF5]">
                    "{headline}"
                  </p>
                )}

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#687793] uppercase tracking-wider block">
                    Registered Skills (Provisional until verified)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkills.map(s => (
                      <span key={s} className="text-xs px-2.5 py-0.5 rounded-lg bg-white border border-[#E2EAF5] text-[#15264B] font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Profile Visibility Toggle */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#15264B]">
                  Profile Visibility
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVisibility('public')}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                      visibility === 'public'
                        ? 'border-[#2563EB] bg-[#EFF6FF] font-bold'
                        : 'border-[#E2EAF5] bg-white text-[#687793]'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#15264B] block">Public Leaderboard</span>
                    <span className="text-[11px] text-[#687793]">Visible on global leaderboard and search</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibility('private')}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                      visibility === 'private'
                        ? 'border-[#2563EB] bg-[#EFF6FF] font-bold'
                        : 'border-[#E2EAF5] bg-white text-[#687793]'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#15264B] block">Private / Unlisted</span>
                    <span className="text-[11px] text-[#687793]">Only you can view your detailed analytics</span>
                  </button>
                </div>
              </div>

              {/* Consent Checkbox */}
              <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFF8DC] border border-[#FFE89A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#2563EB] rounded-sm focus:ring-[#2563EB] cursor-pointer"
                />
                <span className="text-xs text-[#92400E] leading-relaxed">
                  <strong>Verification Consent:</strong> I agree that my engineering rank will be calculated from real code evidence. I understand that self-reported skills remain provisional until verified by commit audits or coding assessments.
                </span>
              </label>

              {/* Persistence Notice */}
              <div className="p-3 bg-[#F1F5F9] rounded-xl text-[11px] text-[#64748B] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>
                  Authenticated via Clerk ({user?.id ? `ID: ${user.id.slice(0, 14)}...` : 'Active Session'}). Data is stored securely and linked to your verified account.
                </span>
              </div>

            </motion.div>
          )}

          {/* Navigation Controls */}
          <div className="pt-8 border-t border-[#E2EAF5] flex items-center justify-between">
            {step > 1 ? (
              <Button
                variant="secondary"
                size="md"
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
            ) : (
              <button
                type="button"
                onClick={handleSkip}
                className="text-xs font-semibold text-[#687793] hover:text-[#15264B] transition cursor-pointer"
              >
                Skip for now
              </button>
            )}

            {step < totalSteps ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                className="flex items-center gap-2 cursor-pointer px-6"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                disabled={isSubmitting || !consentAccepted}
                className="flex items-center gap-2 cursor-pointer px-7 bg-[#2563EB] hover:bg-[#1D4ED8]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Launching Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Complete & Open Dashboard</span>
                    <Sparkles className="w-4 h-4 text-[#FFE89A]" />
                  </>
                )}
              </Button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
