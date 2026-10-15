import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Link2, 
  Download, 
  HelpCircle, 
  Check, 
  ShieldCheck, 
  Info,
  Trash2,
  Save,
  CheckCircle2
} from 'lucide-react';
import { CURRENT_USER } from '../lib/mockData';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export function SettingsPage() {
  const [activeSubTab, setActiveSubTab] = useState('connected');
  const [accounts, setAccounts] = useState(CURRENT_USER.connectedAccounts);
  const [displayName, setDisplayName] = useState(CURRENT_USER.displayName);
  const [roleTitle, setRoleTitle] = useState(CURRENT_USER.roleTitle);
  const [headline, setHeadline] = useState(CURRENT_USER.headline);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Privacy toggles
  const [isPublic, setIsPublic] = useState(true);
  const [allowRecruiters, setAllowRecruiters] = useState(true);

  // Notification toggles
  const [notifyRankChange, setNotifyRankChange] = useState(true);
  const [notifyRecruiterView, setNotifyRecruiterView] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(false);

  // Confirm delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
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
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#15264B] tracking-tight">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#687793] mt-0.5 font-medium">
          Manage your account preferences, privacy, and connected platforms
        </p>
      </div>

      {/* Main 2-Column Layout matching Panel 9 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Sub-Nav (4 Cols) */}
        <Card className="md:col-span-4 p-2.5 space-y-1">
          {subNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  isActive 
                    ? 'bg-[#EAF3FF] text-[#15264B] font-bold shadow-2xs' 
                    : 'text-[#687793] hover:text-[#15264B] hover:bg-[#F5F8FF]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#15264B] stroke-[2.5]' : 'text-[#687793]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </Card>

        {/* Right Content Panel (8 Cols) */}
        <div className="md:col-span-8 space-y-6">
          
          {/* TAB 1: CONNECTED ACCOUNTS matching Screen 9 */}
          {activeSubTab === 'connected' && (
            <Card className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#15264B]">
                  Connected Accounts
                </h2>
                <p className="text-xs text-[#687793] mt-0.5">
                  Link your accounts to get better rankings and insights
                </p>
              </div>

              {/* Accounts List */}
              <div className="space-y-3 pt-1">
                {accounts.map((acc) => (
                  <div 
                    key={acc.id}
                    className="p-4 rounded-2xl bg-white border border-[#E2EAF5] flex items-center justify-between gap-4 hover:border-[#CBD8EB] transition shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#F5F8FF] border border-[#E2EAF5] flex items-center justify-center font-bold text-[#15264B] text-sm">
                        {acc.name[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#15264B]">{acc.name}</h3>
                        <div className="text-xs text-[#687793]">
                          {acc.connected 
                            ? `Connected${acc.handle ? ` • ${acc.handle}` : ''}`
                            : 'Not connected'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {acc.connected ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#059669] bg-[#E4F8EF] px-2.5 py-0.5 rounded-full border border-[#B9EED9]">
                          <Check className="w-3 h-3 stroke-[3]" /> Connected
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#687793] font-medium hidden sm:inline">
                          Not connected
                        </span>
                      )}

                      <button
                        onClick={() => toggleConnection(acc.id)}
                        className={`text-xs font-bold px-3 py-1 rounded-full border transition cursor-pointer ${
                          acc.connected 
                            ? 'text-[#15264B] border-[#E2EAF5] hover:bg-[#F5F8FF]' 
                            : 'bg-[#15264B] text-white border-[#15264B] hover:bg-[#0D1933]'
                        }`}
                      >
                        {acc.connected ? 'Manage' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Notice Box matching Panel 9 */}
              <div className="p-4 rounded-2xl bg-[#EAF3FF] border border-[#D2E4FC] flex items-start gap-3">
                <Info className="w-4 h-4 text-[#1D4ED8] shrink-0 mt-0.5" />
                <p className="text-xs text-[#1D4ED8] leading-relaxed">
                  Your data is secure. We only access what you allow and use it to improve your rankings and provide better opportunities. Persistent OAuth and real database persistence will automatically activate when backend services connect.
                </p>
              </div>
            </Card>
          )}

          {/* TAB 2: ACCOUNT SETTINGS */}
          {activeSubTab === 'account' && (
            <Card className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#15264B]">
                  Profile Preferences
                </h2>
                <p className="text-xs text-[#687793] mt-0.5">
                  Update your public developer identity and headline
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
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
          )}

          {/* TAB 3: PRIVACY */}
          {activeSubTab === 'privacy' && (
            <Card className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#15264B]">
                  Privacy & Data Sharing
                </h2>
                <p className="text-xs text-[#687793] mt-0.5">
                  Control who sees your verified signal score and profile
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
              </div>
            </Card>
          )}

          {/* TAB 4: NOTIFICATIONS */}
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
                    <p className="text-[11px] text-[#687793]">Permanently remove your developer score and linked evidence.</p>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => setIsDeleteDialogOpen(true)} className="gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
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

        </div>

      </div>

      {/* Confirmation Dialog for Delete Account */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          alert("Account deletion request submitted for simulation.");
          setIsDeleteDialogOpen(false);
        }}
        title="Delete Rankora Account?"
        description="Are you sure you want to delete your profile? All verified signal scores, achievements, and leaderboard placements will be cleared."
        confirmLabel="Yes, Delete Account"
        variant="danger"
      />

    </div>
  );
}
