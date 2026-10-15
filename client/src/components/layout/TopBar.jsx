import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Heart, Menu, X, User, Settings, LogOut, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { CURRENT_USER } from '../../lib/mockData';
import { RankoraLogo } from '../common/RankoraLogo';
import { DeveloperAvatar } from '../common/DeveloperAvatar';

export function TopBar({ onToggleMobileMenu, isMobileMenuOpen }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [savedCount, setSavedCount] = useState(3);
  const [isSavedActive, setIsSavedActive] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/hiring?q=${encodeURIComponent(searchQuery.trim())}`);
    }
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

      {/* Middle: Search input matching reference */}
      <form onSubmit={handleSearchSubmit} className="relative w-72 sm:w-80 md:w-96 max-w-full">
        <Search className="w-4 h-4 text-[#687793] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search developers, skills, or roles..."
          className="w-full pl-9 pr-4 py-2 bg-[#F5F8FF] border border-[#E2EAF5] rounded-full text-xs sm:text-sm text-[#15264B] placeholder-[#687793] focus:outline-none focus:bg-white focus:border-[#3B82F6] focus:ring-2 focus:ring-[#EAF3FF] transition font-sans"
        />
      </form>

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

        {/* User Profile Avatar with green status dot & dropdown menu */}
        <div className="relative pl-1 sm:pl-2 sm:border-l sm:border-[#E2EAF5]" ref={profileRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 cursor-pointer p-0.5 rounded-full hover:ring-2 hover:ring-[#EAF3FF] transition"
            title="User Profile Menu"
          >
            <DeveloperAvatar 
              src={CURRENT_USER.avatar}
              name={CURRENT_USER.displayName}
              size="sm"
              status="online"
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E2EAF5] p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-[#E2EAF5] mb-1">
                <div className="font-bold text-xs text-[#15264B] flex items-center gap-1">
                  {CURRENT_USER.displayName}
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6] fill-[#3B82F6]/20" />
                </div>
                <div className="text-[11px] text-[#687793] truncate">{CURRENT_USER.roleTitle}</div>
                <div className="text-[10px] text-[#059669] font-bold mt-0.5">Global Rank {CURRENT_USER.globalRank}</div>
              </div>

              <div className="space-y-0.5">
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#15264B] hover:bg-[#F5F8FF] rounded-xl transition"
                >
                  <User className="w-3.5 h-3.5 text-[#687793]" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#15264B] hover:bg-[#F5F8FF] rounded-xl transition"
                >
                  <Settings className="w-3.5 h-3.5 text-[#687793]" />
                  <span>Account Settings</span>
                </Link>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#FF6B6B] hover:bg-[#FFE8E5] rounded-xl transition cursor-pointer text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
