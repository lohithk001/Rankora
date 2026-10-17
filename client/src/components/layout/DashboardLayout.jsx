import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { cn } from '../../lib/utils';

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F5F8FF] text-[#15264B] flex flex-col font-sans selection:bg-[#FFE89A] selection:text-[#15264B] overflow-x-hidden">
      
      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl md:hidden overflow-hidden"
          >
            <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} isCollapsed={false} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex w-full relative">
        {/* Desktop Fixed Sidebar */}
        <div className="hidden md:block shrink-0">
          <Sidebar 
            isCollapsed={isSidebarCollapsed} 
            onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)} 
          />
        </div>

        {/* Content Area with left offset matching sidebar width */}
        <div 
          className={cn(
            "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
            isSidebarCollapsed ? "md:ml-[72px]" : "md:ml-[260px] sm:md:ml-[272px]"
          )}
        >
          {/* TopBar sticky to the content area */}
          <TopBar 
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isMobileMenuOpen={isMobileMenuOpen}
          />

          <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-20 md:pb-8">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation for dashboard pages */}
      <MobileNav />
    </div>
  );
}
