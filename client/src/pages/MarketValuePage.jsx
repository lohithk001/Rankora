import React, { useState, useEffect } from 'react';
import { BarChart2, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CURRENT_USER } from '../lib/mockData';
import { useDeveloperProfile } from '../context/DeveloperProfileContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function MarketValuePage() {
  const { profile } = useDeveloperProfile();
  const salaryRange = profile?.salaryRange || CURRENT_USER.salaryRange;
  const [selectedLocation, setSelectedLocation] = useState('Bengaluru, India');
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [selectedExp, setSelectedExp] = useState('0 - 2 years');
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowDetailsModal(false);
      }
    };
    if (showDetailsModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDetailsModal]);

  // Dynamic salary ranges based on location & exp
  const salaryData = {
    min: selectedLocation.includes('Bengaluru') ? '₹12L' : '$95k',
    max: selectedLocation.includes('Bengaluru') ? '₹18L' : '$140k',
    base: selectedLocation.includes('Bengaluru') ? '₹8L — ₹13L' : '$80k — $115k',
    bonuses: selectedLocation.includes('Bengaluru') ? '₹1L — ₹2L' : '$10k — $15k',
    equity: selectedLocation.includes('Bengaluru') ? '₹1L — ₹2L' : '$5k — $10k',
  };

  const compBreakdown = [
    { label: 'Base Salary', value: salaryData.base, desc: 'Guaranteed annual gross' },
    { label: 'Bonuses', value: salaryData.bonuses, desc: 'Performance & annual incentives' },
    { label: 'Equity', value: salaryData.equity, desc: 'Stock options / RSUs vested' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header matching Panel 8 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#15264B] tracking-tight">
          Market Value
        </h1>
        <p className="text-xs sm:text-sm text-[#687793] mt-0.5 font-medium">
          Estimated compensation based on your skills, location and experience
        </p>
      </motion.div>

      {/* Filter Dropdown Selectors */}
      <motion.div 
        className="flex flex-wrap items-center gap-2.5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          aria-label="Filter by location"
          className="px-3.5 py-1.5 rounded-full bg-white border border-[#E2EAF5] text-xs text-[#15264B] font-semibold cursor-pointer shadow-2xs hover:bg-[#F5F8FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] transition"
        >
          <option value="Bengaluru, India">Bengaluru, India</option>
          <option value="Remote Global">Remote Global</option>
          <option value="San Francisco, USA">San Francisco, USA</option>
        </select>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          aria-label="Filter by engineering role"
          className="px-3.5 py-1.5 rounded-full bg-white border border-[#E2EAF5] text-xs text-[#15264B] font-semibold cursor-pointer shadow-2xs hover:bg-[#F5F8FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] transition"
        >
          <option value="Software Engineer">Software Engineer</option>
          <option value="Backend Developer">Backend Developer</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="AI / ML Engineer">AI / ML Engineer</option>
        </select>

        <select
          value={selectedExp}
          onChange={(e) => setSelectedExp(e.target.value)}
          aria-label="Filter by years of experience"
          className="px-3.5 py-1.5 rounded-full bg-white border border-[#E2EAF5] text-xs text-[#15264B] font-semibold cursor-pointer shadow-2xs hover:bg-[#F5F8FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] transition"
        >
          <option value="0 - 2 years">0 - 2 years</option>
          <option value="3 - 5 years">3 - 5 years</option>
          <option value="5+ years">5+ years</option>
        </select>
      </motion.div>

      {/* Main Estimated Salary Banner Card matching Panel 8 */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <Card className="p-6 sm:p-10 relative overflow-hidden bg-gradient-to-r from-[#EAF3FF]/80 via-[#E4F8EF]/60 to-[#FFF8DC]/60 border-[#D2E4FC] hover:border-[#B5D5FA] transition-all">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-8 space-y-3">
              <span className="text-xs font-bold text-[#687793] uppercase tracking-wider">
                Estimated Salary Range
              </span>

              <motion.div 
                key={salaryData.min + salaryData.max}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#15264B] tracking-tight"
              >
                {salaryData.min} — {salaryData.max} <span className="text-sm sm:text-lg font-medium text-[#687793]">per year</span>
              </motion.div>

              <p className="text-xs text-[#687793]">
                Based on similar verified developer profiles and market trends in your region
              </p>

              <div className="pt-2">
                <Button 
                  variant="primary" 
                  size="md" 
                  onClick={() => setShowDetailsModal(true)}
                  className="px-6 font-bold text-xs"
                >
                  View Details
                </Button>
              </div>
            </div>

            {/* Wallet & Coins Illustration */}
            <div className="md:col-span-4 flex justify-center md:justify-end">
              <img 
                src="/wallet.jpg" 
                alt="Market compensation illustration" 
                className="w-36 h-36 sm:w-44 sm:h-44 object-contain rounded-2xl select-none" 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

          </div>
        </Card>
      </motion.div>

      {/* Compensation Breakdown (3 Columns) matching Panel 8 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#15264B]">
          <span>Compensation Breakdown</span>
          <BarChart2 className="w-4 h-4 text-[#687793]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {compBreakdown.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + idx * 0.06 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <Card className="p-5 space-y-1 hover:border-[#CBD8EB] transition-all">
                <div className="text-xs text-[#687793] font-semibold">{item.label}</div>
                <div className="text-xl font-black text-[#15264B]">
                  {item.value}
                </div>
                <div className="text-[10px] text-[#687793]">{item.desc}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Paying Skills */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
      >
        <Card className="p-6 space-y-3 hover:border-[#CBD8EB] transition-all">
          <h3 className="text-sm font-bold text-[#15264B]">
            Top Paying Skills in Your Target Bracket
          </h3>

          <div className="flex flex-wrap gap-2 pt-1">
            {salaryRange.topSkills.map((sk) => (
              <span
                key={sk}
                className="px-3.5 py-1.5 rounded-full bg-[#EAF3FF] text-[#15264B] text-xs font-semibold border border-[#D2E4FC] select-none"
              >
                {sk}
              </span>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Required Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2EAF5] flex items-start gap-3 text-xs text-[#687793]">
        <Info className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#15264B]">Demo Benchmark Notice</p>
          <p>
            Compensation figures shown are illustrative market benchmarks based on aggregated developer surveys and hiring partner posts. Actual compensation varies by company, individual candidate signal, negotiation, and market conditions. Rankora evaluates developer ability; a score reflects technical evidence and is never equated with personal human worth.
          </p>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="market-modal-title"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#E2EAF5] space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 id="market-modal-title" className="text-lg font-bold text-[#15264B]">Market Benchmark Insights</h3>
                  <p className="text-xs text-[#687793]">{selectedRole} • {selectedLocation}</p>
                </div>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  aria-label="Close market insights"
                  className="text-[#687793] hover:text-[#15264B] p-1 rounded-full hover:bg-slate-100 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#687793]">
                <div className="p-3 bg-[#F5F8FF] rounded-2xl border border-[#E2EAF5] space-y-1">
                  <span className="font-bold text-[#15264B]">Median Industry Compensation:</span>
                  <p>Developers in the top 5% Rankora bracket typically receive offers in the 75th percentile of this range.</p>
                </div>

                <div className="p-3 bg-[#F5F8FF] rounded-2xl border border-[#E2EAF5] space-y-1">
                  <span className="font-bold text-[#15264B]">Highest Leverage Skills:</span>
                  <p>System Design and Go demonstrate the highest salary premium (+22% average lift).</p>
                </div>
              </div>

              <Button variant="secondary" size="md" className="w-full font-semibold" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
