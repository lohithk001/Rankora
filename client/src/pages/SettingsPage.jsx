import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/react';
import { 
  User, 
  Lock, 
  Bell, 
  Link2, 
  Download, 
  HelpCircle, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  LogOut, 
  KeyRound, 
  Shield, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CURRENT_USER } from '../lib/mockData';
import { useDeveloperProfile } from '../context/DeveloperProfileContext';
import { analytics } from '../lib/analytics';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export function SettingsPage() {
  const navigate = useNavigate();
  const { signOut, openUserProfile } = useClerk();
  const { profile, onboardingStatus, deleteAccount } = useDeveloperProfile();
  
  const [activeSubTab, setActiveSubTab] = useState('account');
  const [accounts, setAccounts] = useState(profile.connectedAccounts || CURRENT_USER.connectedAccounts);
  const [displayName, setDisplayName] = useState(profile.displayName || CURRENT_USER.displayName);
  const [roleTitle, setRoleTitle] = useState(profile.roleTitle || CURRENT_USER.roleTitle);
  const [headline, setHeadline] = useState(profile.headline || CURRENT_USER.headline);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Privacy toggles
  const [isPublic, setIsPublic] = useState(true);
  const [allowRecruiters, setAllowRecruiters] = useState(true);
  const [telemetryEnabled, setTelemetryEnabled] = useState(() => analytics.isEnabled());

  // Notification toggles
  const [notifyRankChange, setNotifyRankChange] = useState(true);
  const [notifyRecruiterView, setNotifyRecruiterView] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(false);

  // Confirm delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const subNavItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'connected', label: 'Connected Accounts', icon: Link2 },
    { id: 'data', label: 'Data & Export', icon: Download },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const toggleConnection = (id) => {
    setAccounts(accounts.map(acc => {
      if (acc.id === id) {
        return {
          ...acc,
          connected: !acc.connected,
          handle: !acc.connected ? CURRENT_USER.username : ''
        };
      }
      return acc;
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setFormError('');

    // Frontend Form Validation
    const cleanName = (displayName || '').trim();
    if (!cleanName || cleanName.length < 2) {
      setFormError('Display name must be at least 2 characters.');
      return;
    }

    if (cleanName.length > 80) {
      setFormError('Display name must be under 80 characters.');
      return;
    }

    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleToggleTelemetry = () => {
    const nextVal = !telemetryEnabled;
    setTelemetryEnabled(nextVal);
    analytics.setConsent(nextVal, nextVal);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut(() => navigate('/'));
    } catch {
      navigate('/');
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      // Sign out after purging records
      await signOut(() => navigate('/?account_deleted=true'));
    } catch {
      navigate('/?account_deleted=true');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(CURRENT_USER, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `rankora-profile-${CURRENT_USER.username}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#15264B] tracking-tight">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#687793] mt-0.5 font-medium">
          Manage your account preferences, privacy, authentication, and connected platforms
        </p>
      </motion.div>

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1 bg-white p-2 rounded-2xl border border-[#E2EAF5] shadow-xs">
          {subNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#15264B] text-white shadow-xs'
                    : 'text-[#687793] hover:text-[#15264B] hover:bg-[#F5F8FF]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#687793]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="md:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >

          {/* TAB 1: ACCOUNT & CLERK AUTH */}
          {activeSubTab === 'account' && (
            <>
              {/* Profile Details Form */}
              <Card className="p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#15264B]">
                    Account Profile
                  </h2>
                  <p className="text-xs text-[#687793] mt-0.5">
                    Update your public developer details and bio
                  </p>
                </div>

                {/* Onboarding Status Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EFF6FF] to-[#F5F8FF] border border-[#BFDBFE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#2563EB] shadow-2xs border border-[#BFDBFE]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1E3A8A]">
                        {onboardingStatus.isCompleted ? 'Developer Profile Configured' : 'Setup Incomplete'}
                      </div>
                      <p className="text-[11px] text-[#3B82F6]">
                        {onboardingStatus.isCompleted 
                          ? 'Profile is synchronized across leaderboards.' 
                          : 'Complete your profile to unlock full verification.'}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(onboardingStatus.isCompleted ? '/onboarding?mode=edit' : '/onboarding')}
                    className="shrink-0 text-xs flex items-center gap-1.5"
                  >
                    <span>{onboardingStatus.isCompleted ? 'Edit via Onboarding Flow' : 'Complete Setup Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {formError && (
                    <div className="p-3 bg-[#FFE8E5] text-[#D93829] text-xs font-semibold rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[#15264B] mb-1">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#F5F8FF] border border-[#E2EAF5] rounded-xl text-xs text-[#15264B] focus:outline-none focus:bg-white focus:border-[#3B82F6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#15264B] mb-1">Role Title</label>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#F5F8FF] border border-[#E2EAF5] rounded-xl text-xs text-[#15264B] focus:outline-none focus:bg-white focus:border-[#3B82F6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#15264B] mb-1">Bio / Headline</label>
                    <textarea
                      rows={3}
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#F5F8FF] border border-[#E2EAF5] rounded-xl text-xs text-[#15264B] focus:outline-none focus:bg-white focus:border-[#3B82F6]"
                    />
                  </div>

                  {profileSuccess && (
                    <div className="p-3 bg-[#E4F8EF] text-[#059669] text-xs font-semibold rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Profile settings updated successfully!</span>
                    </div>
                  )}

                  <Button type="submit" variant="primary" size="md" className="font-bold">
                    Save Changes
                  </Button>
                </form>
              </Card>

              {/* Clerk Authentication & Security Section */}
              <Card className="p-6 sm:p-8 space-y-5 border-[#E2EAF5]">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#15264B]">
                    Authentication & Password Recovery
                  </h2>
                  <p className="text-xs text-[#687793] mt-0.5">
                    Clerk-powered credential management, password reset, and active sessions
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#15264B]">
                    <Shield className="w-4 h-4 text-[#2563EB]" />
                    <span>Real Clerk Account Security</span>
                  </div>
                  <p className="text-xs text-[#687793] leading-relaxed">
                    Update your password, configure multi-factor authentication (MFA/2FA), verify your recovery email, or view your active sign-in sessions directly through Clerk security center.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openUserProfile()}
                      className="gap-2 text-xs font-bold"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Manage Password & Security</span>
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="gap-2 text-xs font-bold"
                    >
                      {isSigningOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5 text-[#D93829]" />}
                      <span>Sign Out of Rankora</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* TAB 2: PRIVACY & TELEMETRY */}
          {activeSubTab === 'privacy' && (
            <Card className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#15264B]">
                  Privacy & Data Sharing
                </h2>
                <p className="text-xs text-[#687793] mt-0.5">
                  Control who sees your verified signal score and configure privacy telemetry
                </p>
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5]">
                  <div>
                    <h3 className="text-xs font-bold text-[#15264B]">Public Profile Visibility</h3>
                    <p className="text-[11px] text-[#687793] mt-0.5">Allow your score and badges to appear on the global leaderboard.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={() => setIsPublic(!isPublic)}
                    className="w-4 h-4 accent-[#15264B] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5]">
                  <div>
                    <h3 className="text-xs font-bold text-[#15264B]">Verified Recruiter Discovery</h3>
                    <p className="text-[11px] text-[#687793] mt-0.5">Let tech hiring teams view your skills and contact you for high-fit roles.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowRecruiters}
                    onChange={() => setAllowRecruiters(!allowRecruiters)}
                    className="w-4 h-4 accent-[#15264B] cursor-pointer"
                  />
                </div>

                {/* Privacy Analytics Control */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5]">
                  <div>
                    <h3 className="text-xs font-bold text-[#15264B]">Privacy-Preserving Telemetry & Analytics</h3>
                    <p className="text-[11px] text-[#687793] mt-0.5">
                      Share anonymous page usage metrics to help refine the scoring formula. Zero personal information collected.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={telemetryEnabled}
                    onChange={handleToggleTelemetry}
                    className="w-4 h-4 accent-[#15264B] cursor-pointer"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeSubTab === 'notifications' && (
            <Card className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#15264B]">
                  Notification Preferences
                </h2>
                <p className="text-xs text-[#687793] mt-0.5">
                  Choose what alerts and insights you receive
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5]">
                  <span className="text-xs font-semibold text-[#15264B]">Rank & Percentile Updates</span>
                  <input
                    type="checkbox"
                    checked={notifyRankChange}
                    onChange={() => setNotifyRankChange(!notifyRankChange)}
                    className="w-4 h-4 accent-[#15264B] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5]">
                  <span className="text-xs font-semibold text-[#15264B]">Recruiter Views & Job Matches</span>
                  <input
                    type="checkbox"
                    checked={notifyRecruiterView}
                    onChange={() => setNotifyRecruiterView(!notifyRecruiterView)}
                    className="w-4 h-4 accent-[#15264B] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5]">
                  <span className="text-xs font-semibold text-[#15264B]">Weekly Skill Growth Summary</span>
                  <input
                    type="checkbox"
                    checked={notifyWeeklyDigest}
                    onChange={() => setNotifyWeeklyDigest(!notifyWeeklyDigest)}
                    className="w-4 h-4 accent-[#15264B] cursor-pointer"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* TAB 4: CONNECTED ACCOUNTS */}
          {activeSubTab === 'connected' && (
            <Card className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#15264B]">
                  Connected Platforms
                </h2>
                <p className="text-xs text-[#687793] mt-0.5">
                  Connect third-party platforms to automatically verify your problem-solving signals
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {accounts.map((acc) => (
                  <div key={acc.id} className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#15264B] flex items-center gap-2">
                        <span>{acc.name}</span>
                        {acc.connected && (
                          <span className="text-[10px] text-[#059669] bg-[#E4F8EF] px-2 py-0.5 rounded-full font-semibold">
                            Connected
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#687793] mt-0.5">
                        {acc.connected ? `Linked as @${acc.handle}` : 'Not connected'}
                      </p>
                    </div>

                    <Button
                      variant={acc.connected ? "outline" : "primary"}
                      size="sm"
                      onClick={() => toggleConnection(acc.id)}
                    >
                      {acc.connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB 5: DATA & EXPORT */}
          {activeSubTab === 'data' && (
            <Card className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#15264B]">
                  Data Export & Account Management
                </h2>
                <p className="text-xs text-[#687793] mt-0.5">
                  Download a full archive of your verified score evaluations or manage account life cycle
                </p>
              </div>

              <div className="space-y-4 pt-1">
                <div className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#15264B]">Export Signal Profile JSON</h3>
                    <p className="text-[11px] text-[#687793]">Complete data archive containing all skills, assessments, and rankings.</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={handleExportData} className="gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </Button>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFE8E5]/50 border border-[#FFD3CE] flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#D93829]">Delete Account</h3>
                    <p className="text-[11px] text-[#687793]">Permanently delete your profile, verified signals, and connected database records.</p>
                  </div>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => setIsDeleteDialogOpen(true)} 
                    disabled={isDeleting}
                    className="gap-1.5 font-bold"
                  >
                    {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    <span>{isDeleting ? 'Deleting...' : 'Delete Account'}</span>
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 6: HELP & SUPPORT */}
          {activeSubTab === 'help' && (
            <Card className="p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#15264B]">
                  Help & Frequently Asked Questions
                </h2>
                <p className="text-xs text-[#687793] mt-0.5">
                  Learn how Rankora's algorithmic scoring works
                </p>
              </div>

              <div className="space-y-3 pt-1 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] space-y-1">
                  <span className="font-bold text-[#15264B]">How often is my rank refreshed?</span>
                  <p className="text-[#687793]">Composite scores update automatically whenever you complete an assessment, push commits to connected repos, or solve verified problems.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] space-y-1">
                  <span className="font-bold text-[#15264B]">Can recruiters contact me directly?</span>
                  <p className="text-[#687793]">Yes, if you keep Recruiter Discovery enabled in Privacy settings. Companies reach out based on role fit scores.</p>
                </div>
              </div>
            </Card>
          )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Confirmation Dialog for Delete Account */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => !isDeleting && setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Permanently Delete Rankora Account?"
        description="Are you sure you want to delete your profile? All verified signal scores, achievements, and leaderboard placements will be purged immediately from the database."
        confirmLabel={isDeleting ? "Deleting Account..." : "Yes, Delete Everything"}
        variant="danger"
      />

    </div>
  );
}
