import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { cn } from '../../lib/utils';

export function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#F5F8FF] text-[#15264B] flex flex-col font-sans selection:bg-[#FFE89A] selection:text-[#15264B]">
      
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
      </div>

      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar (hidden on landing page if preferred, or persistent as requested for standard shell) */}
        {!isLandingPage && (
          <div className="hidden md:block shrink-0">
            <Sidebar />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* TopBar (renders on dashboard pages; Landing page can have its own top header) */}
          {!isLandingPage && (
            <TopBar 
              onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              isMobileMenuOpen={isMobileMenuOpen}
            />
          )}

          <main className={cn(
            "flex-1 w-full",
            isLandingPage 
              ? "p-0" 
              : "p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-20 md:pb-8"
          )}>
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation for dashboard pages */}
      {!isLandingPage && <MobileNav />}
    </div>
  );
}
