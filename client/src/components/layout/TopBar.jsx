import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Bell, Heart, Menu, X, User, Settings, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { DEVELOPERS_DATABASE, CODEFORCES_TOP_100 } from '../../lib/mockData';
import { RankoraLogo } from '../common/RankoraLogo';
import { DeveloperAvatar } from '../common/DeveloperAvatar';
import { Show, UserButton } from '@clerk/react';
import { useDeveloperProfile } from '../../context/DeveloperProfileContext';

export function TopBar({ onToggleMobileMenu, isMobileMenuOpen }) {
  const navigate = useNavigate();
  const { profile, onboardingStatus } = useDeveloperProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [savedCount, setSavedCount] = useState(3);
  const [isSavedActive, setIsSavedActive] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const results = [];

    // Check core developers
    Object.values(DEVELOPERS_DATABASE).forEach(dev => {
      if (
        dev.displayName.toLowerCase().includes(q) ||
        dev.username.toLowerCase().includes(q)
      ) {
        results.push({
          username: dev.username,
          name: dev.displayName,
          badge: dev.percentileBadge,
          avatar: dev.avatar,
          type: 'Rankora Verified'
        });
      }
    });

    // Check top Codeforces coders
    CODEFORCES_TOP_100.forEach(cf => {
      if (
        cf.handle.toLowerCase().includes(q) ||
        (cf.realName && cf.realName.toLowerCase().includes(q)) ||
        (cf.organization && cf.organization.toLowerCase().includes(q)) ||
        (cf.country && cf.country.toLowerCase().includes(q))
      ) {
        results.push({
          username: cf.handle,
          name: cf.realName ? `${cf.realName} (${cf.handle})` : cf.handle,
          badge: `Rank #${cf.rank} • Rating ${cf.rating}`,
          avatar: cf.avatar && !cf.avatar.includes('no-avatar') ? cf.avatar : `https://api.dicebear.com/7.x/identicon/svg?seed=${cf.handle}`,
          type: cf.title
        });
      }
    });

    return results.slice(0, 5);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    setShowSearchDropdown(false);

    // If matches a Codeforces handle directly
    const cfMatch = CODEFORCES_TOP_100.find(c => 
      c.handle.toLowerCase() === q || 
      (c.realName && c.realName.toLowerCase() === q)
    );
    if (cfMatch) {
      navigate(`/developers/${cfMatch.handle}`);
      return;
    }

    if (q === 'algorithms' || q === 'codeforces' || q === 'cp' || q === 'competitive') {
      navigate('/leaderboard?category=Algorithms');
      return;
    }

    navigate(`/leaderboard?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSelectSuggestion = (username) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    navigate(`/developers/${username}`);
  };

  const notifications = [
    { id: 1, title: 'Rank updated!', desc: 'You climbed 12 positions to #6,421 globally.', time: '10m ago', unread: true },
    { id: 2, title: 'Assessment verified', desc: 'LeetCode 300+ problem evidence verified.', time: '1h ago', unread: true },
    { id: 3, title: 'Recruiter viewed profile', desc: 'Amazon Engineering talent team viewed your score.', time: '1d ago', unread: false },
  ];

  return (
    <header className="h-16 bg-white border-b border-[#E2EAF5] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
      
      {/* Left: Mobile hamburger & Logo (on mobile) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-[#687793] hover:text-[#15264B] hover:bg-[#F5F8FF] rounded-xl transition cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="md:hidden">
          <RankoraLogo size="sm" />
        </div>
      </div>

      {/* Middle: Search input matching reference with live autocomplete */}
      <div className="relative w-72 sm:w-80 md:w-96 max-w-full" ref={searchRef}>
        <form onSubmit={handleSearchSubmit}>
          <Search className="w-4 h-4 text-[#687793] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            placeholder="Search developers, skills, or roles..."
            className="w-full pl-9 pr-4 py-2 bg-[#F5F8FF] border border-[#E2EAF5] rounded-full text-xs sm:text-sm text-[#15264B] placeholder-[#687793] focus:outline-none focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#EAF3FF] transition font-sans"
          />
        </form>

        {/* Live Search Autocomplete Popup */}
        {showSearchDropdown && searchSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E2EAF5] p-2 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="text-[10px] font-bold text-[#687793] uppercase tracking-wider px-2 py-1">
              Top Matches
            </div>
            <div className="space-y-1">
              {searchSuggestions.map((item) => (
                <button
                  key={item.username}
                  onClick={() => handleSelectSuggestion(item.username)}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#F5F8FF] transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <DeveloperAvatar src={item.avatar} name={item.name} size="sm" />
                    <div>
                      <div className="font-bold text-xs text-[#15264B]">{item.name}</div>
                      <div className="text-[10px] text-[#687793] capitalize">{item.type}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#1D4ED8] bg-[#EAF3FF] px-2 py-0.5 rounded-full border border-[#D2E4FC]">
                    {item.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Search icon trigger */}
        <button 
          onClick={handleSearchSubmit}
          className="p-2 text-[#687793] hover:text-[#15264B] hover:bg-[#F5F8FF] rounded-full transition cursor-pointer"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Bell with red/orange dot */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[#687793] hover:text-[#15264B] hover:bg-[#F5F8FF] rounded-full transition relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#FF6B6B] absolute top-1.5 right-1.5 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E2EAF5] p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2EAF5] px-1">
                <span className="font-bold text-xs text-[#15264B]">Notifications</span>
                <span className="text-[10px] text-[#3B82F6] font-semibold cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-1.5">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 hover:bg-[#F5F8FF] rounded-xl transition text-left cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#15264B] flex items-center gap-1.5">
                        {n.title}
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />}
                      </span>
                      <span className="text-[10px] text-[#687793]">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#687793] mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Heart / Bookmarks */}
        <button 
          onClick={() => {
            setIsSavedActive(!isSavedActive);
            setSavedCount(c => isSavedActive ? c - 1 : c + 1);
          }}
          className="p-2 text-[#687793] hover:text-[#FF6B6B] hover:bg-[#FFE8E5]/50 rounded-full transition relative cursor-pointer"
          title="Saved candidates"
        >
          <Heart className={`w-4 h-4 ${isSavedActive ? 'text-[#FF6B6B] fill-[#FF6B6B]' : ''}`} />
          {savedCount > 0 && (
            <span className="text-[9px] font-bold bg-[#EAF3FF] text-[#15264B] px-1 rounded-full absolute -top-1 -right-1 border border-[#D2E4FC]">
              {savedCount}
            </span>
          )}
        </button>

        {/* User Profile / Clerk Auth */}
        <div className="relative pl-1 sm:pl-2 sm:border-l sm:border-[#E2EAF5] flex items-center gap-2" ref={profileRef}>
          <Show when="signed-in">
            <div className="flex items-center gap-2">
              {onboardingStatus.isSkipped && !onboardingStatus.isCompleted && (
                <Link
                  to="/onboarding"
                  className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold text-[#D97706] bg-[#FFF8DC] border border-[#FFE89A] px-2.5 py-1 rounded-full hover:bg-[#FEF3C7] transition"
                >
                  <span>Finish Setup</span>
                  <span>→</span>
                </Link>
              )}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8 rounded-full ring-2 ring-[#E2EAF5] hover:ring-[#2563EB] transition',
                  },
                }}
              />
            </div>
          </Show>
          <Show when="signed-out">
            <>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 cursor-pointer p-0.5 rounded-full hover:ring-2 hover:ring-[#EAF3FF] transition"
                title="User Profile Menu (Demo)"
              >
                <DeveloperAvatar 
                  src={profile.avatar}
                  name={profile.displayName}
                  size="sm"
                  status="online"
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E2EAF5] p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-[#E2EAF5] mb-1">
                    <div className="font-bold text-xs text-[#15264B] flex items-center gap-1">
                      {profile.displayName}
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6] fill-[#3B82F6]/20" />
                    </div>
                    <div className="text-[11px] text-[#687793] truncate">{profile.roleTitle}</div>
                    <div className="text-[10px] text-[#059669] font-bold mt-0.5">Global Rank {profile.globalRank}</div>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      to="/sign-in"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] rounded-xl transition"
                    >
                      <User className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Sign In with Clerk</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#15264B] hover:bg-[#F5F8FF] rounded-xl transition"
                    >
                      <User className="w-3.5 h-3.5 text-[#687793]" />
                      <span>Demo Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#15264B] hover:bg-[#F5F8FF] rounded-xl transition"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#687793]" />
                      <span>Account Settings</span>
                    </Link>
                  </div>
                </div>
              )}
            </>
          </Show>
        </div>

      </div>

    </header>
  );
}
