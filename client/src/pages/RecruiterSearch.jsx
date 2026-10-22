import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Briefcase, Bookmark, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RECRUITER_CANDIDATES } from '../lib/mockData';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/common/EmptyState';
import { DeveloperAvatar } from '../components/common/DeveloperAvatar';

export function RecruiterSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('q') || '');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);
  const [shortlistedIds, setShortlistedIds] = useState(new Set());
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [jobSuccessMessage, setJobSuccessMessage] = useState(null);
  const [isPublishingJob, setIsPublishingJob] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowPostJobModal(false);
      }
    };
    if (showPostJobModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPostJobModal]);

  const handlePublishJob = () => {
    setIsPublishingJob(true);
    setTimeout(() => {
      setIsPublishingJob(false);
      setJobSuccessMessage("Verified job post created! Top matching candidate profiles alerted.");
      setTimeout(() => {
        setShowPostJobModal(false);
        setJobSuccessMessage(null);
      }, 1600);
    }, 700);
  };

  const toggleShortlist = (id, e) => {
    e.stopPropagation();
    setShortlistedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredCandidates = useMemo(() => {
    return RECRUITER_CANDIDATES.filter(c => {
      // Search matching
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesRole = c.role.toLowerCase().includes(q);
        const matchesCompany = c.company.toLowerCase().includes(q);
        const matchesLocation = c.location.toLowerCase().includes(q);
        const matchesSkills = c.skills.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesRole && !matchesCompany && !matchesLocation && !matchesSkills) {
          return false;
        }
      }

      // Role filter
      if (selectedRole !== 'All Roles') {
        if (!c.role.toLowerCase().includes(selectedRole.toLowerCase())) return false;
      }

      // Location filter
      if (selectedLocation !== 'All') {
        if (!c.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      }

      // Remote filter
      if (isRemoteOnly && !c.location.toLowerCase().includes('remote')) {
        return false;
      }

      return true;
    });
  }, [searchTerm, selectedRole, selectedLocation, isRemoteOnly]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedRole('All Roles');
    setSelectedLocation('All');
    setIsRemoteOnly(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header matching Panel 6 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#15264B] tracking-tight">
          Recruiter Discovery
        </h1>
        <p className="text-xs sm:text-sm text-[#687793] mt-0.5 font-medium">
          Top companies are looking for talent like you
        </p>
      </motion.div>

      {/* Main 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 Cols): Search, Filters, and Candidate Cards */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#687793] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search candidates by role, skills or location"
              placeholder="Search by role, skills or location..."
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-[#E2EAF5] rounded-2xl text-xs sm:text-sm text-[#15264B] placeholder-[#687793] shadow-2xs focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#EAF3FF] transition font-sans"
            />
          </div>

          {/* Filters Bar matching Screen 6 */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Roles filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              aria-label="Filter candidates by role"
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#E2EAF5] text-xs text-[#15264B] font-semibold cursor-pointer shadow-2xs hover:bg-[#F5F8FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] transition"
            >
              <option value="All Roles">All Roles</option>
              <option value="Backend">Backend</option>
              <option value="Frontend">Frontend</option>
              <option value="Software Engineer">Fullstack</option>
            </select>

            {/* Location filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              aria-label="Filter candidates by location"
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#E2EAF5] text-xs text-[#15264B] font-semibold cursor-pointer shadow-2xs hover:bg-[#F5F8FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] transition"
            >
              <option value="All">All Locations</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Remote">Remote</option>
            </select>

            {/* Remote toggle button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRemoteOnly(!isRemoteOnly)}
              aria-pressed={isRemoteOnly}
              className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                isRemoteOnly 
                  ? 'bg-[#15264B] text-white border-[#15264B]' 
                  : 'bg-white text-[#15264B] border-[#E2EAF5] hover:bg-[#F5F8FF]'
              }`}
            >
              Remote {isRemoteOnly ? '✓' : ''}
            </motion.button>
          </div>

          {/* Candidate Cards List */}
          <div className="space-y-3.5 pt-1">
            <AnimatePresence mode="popLayout">
              {filteredCandidates.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <EmptyState
                    title="No matching candidates found"
                    description="Try clearing your search query or switching role and location filters."
                    actionLabel="Reset Filters"
                    onAction={resetFilters}
                  />
                </motion.div>
              ) : (
                filteredCandidates.map((candidate, idx) => {
                  const isShortlisted = shortlistedIds.has(candidate.id);
                  return (
                    <motion.div
                      key={candidate.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    >
                      <Card 
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#CBD8EB] transition-all"
                      >
                        <div className="flex items-start sm:items-center gap-4">
                          {/* Avatar */}
                          <DeveloperAvatar
                            src={candidate.avatar}
                            name={candidate.name}
                            size="lg"
                            className="shrink-0"
                          />

                          <div className="space-y-1.5">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base text-[#15264B] leading-tight">
                                  {candidate.role}
                                </h3>
                                <span className="text-[10px] text-[#059669] font-bold bg-[#E4F8EF] px-2 py-0.5 rounded-full border border-[#B9EED9]">
                                  Score {candidate.score}
                                </span>
                              </div>
                              <p className="text-xs text-[#687793] mt-0.5">
                                {candidate.company} • {candidate.location}
                              </p>
                            </div>

                            {/* Skill Pills */}
                            <div className="flex flex-wrap gap-1.5">
                              {candidate.skills.map((s) => (
                                <span 
                                  key={s} 
                                  className="px-2.5 py-0.5 rounded-full bg-[#EAF3FF] text-[#15264B] text-[11px] font-semibold border border-[#D2E4FC]"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Side: Compensation Badge & CTA */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E2EAF5]">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              whileHover={{ scale: 1.1 }}
                              onClick={(e) => toggleShortlist(candidate.id, e)}
                              className={`p-1.5 rounded-full border transition cursor-pointer ${
                                isShortlisted 
                                  ? 'bg-[#FFE8E5] text-[#FF6B6B] border-[#FFD3CE]' 
                                  : 'text-[#687793] border-[#E2EAF5] hover:bg-[#F5F8FF]'
                              }`}
                              title={isShortlisted ? "Remove from shortlist" : "Save candidate"}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-current' : ''}`} />
                            </motion.button>
                            <span className="px-3 py-1 rounded-full bg-[#E4F8EF] text-[#059669] font-bold text-xs border border-[#B9EED9]">
                              {candidate.salary}
                            </span>
                          </div>

                          <Button 
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/developers/${candidate.username}`)}
                            className="px-5 text-xs font-bold"
                          >
                            View Profile
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Right Column (4 Cols): For Recruiters Banner matching Panel 6 */}
        <motion.div
          className="lg:col-span-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="p-6 space-y-4 bg-gradient-to-br from-[#FFF8DC]/60 via-white to-white border-[#FFE89A]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF8DC] text-[#B45309] text-[11px] font-bold border border-[#FFE89A]">
              <Briefcase className="w-3.5 h-3.5" /> For Recruiters
            </div>

            <h3 className="font-extrabold text-base sm:text-lg text-[#15264B] leading-snug">
              Find the best talent using verified skills, real projects and proven performance.
            </h3>

          <div className="py-1 text-center">
            <img 
              src="/recruiter.jpg" 
              alt="Recruiter reviewing developer signals" 
              className="w-36 h-36 mx-auto object-contain rounded-2xl select-none"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          <Button 
            variant="primary" 
            size="md" 
            className="w-full font-bold shadow-sm"
            onClick={() => setShowPostJobModal(true)}
          >
            Post a Job
          </Button>
        </Card>
        </motion.div>

      </div>

      {/* Post a Job Demo Dialog */}
      <AnimatePresence>
        {showPostJobModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="post-job-title"
            onClick={() => setShowPostJobModal(false)}
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
                  <h3 id="post-job-title" className="text-lg font-bold text-[#15264B]">Post Verified Engineering Role</h3>
                  <p className="text-xs text-[#687793]">Reach top 5% verified developers</p>
                </div>
                <button 
                  onClick={() => setShowPostJobModal(false)}
                  aria-label="Close dialog"
                  className="text-[#687793] hover:text-[#15264B] p-1 rounded-full hover:bg-slate-100 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-[#15264B] block mb-1">Target Role Title</label>
                  <input 
                    type="text" 
                    defaultValue="Senior Backend Engineer (Go / Distributed Systems)"
                    className="w-full px-3 py-2 bg-[#F5F8FF] border border-[#E2EAF5] rounded-xl text-xs text-[#15264B] focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#15264B] block mb-1">Minimum Rankora Score Requirement</label>
                  <input 
                    type="text" 
                    defaultValue="850+ (Top 5% Global)"
                    className="w-full px-3 py-2 bg-[#F5F8FF] border border-[#E2EAF5] rounded-xl text-xs text-[#15264B] focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#15264B] block mb-1">Annual Compensation (INR / USD)</label>
                  <input 
                    type="text" 
                    defaultValue="₹24L - ₹36L per annum"
                    className="w-full px-3 py-2 bg-[#F5F8FF] border border-[#E2EAF5] rounded-xl text-xs text-[#15264B] focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              {jobSuccessMessage ? (
                <motion.div 
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl bg-[#E4F8EF] border border-[#B9EED9] text-xs text-[#059669] flex items-center gap-2 font-medium"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{jobSuccessMessage}</span>
                </motion.div>
              ) : (
                <div className="p-3 bg-[#EAF3FF] rounded-2xl border border-[#D2E4FC] text-xs text-[#1D4ED8]">
                  💡 Rankora automatically matches candidates with verified challenge evidence.
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary" size="md" onClick={() => setShowPostJobModal(false)}>
                  {jobSuccessMessage ? "Close" : "Cancel"}
                </Button>
                {!jobSuccessMessage && (
                  <Button 
                    variant="primary" 
                    size="md" 
                    disabled={isPublishingJob}
                    onClick={handlePublishJob}
                    className="font-semibold px-5"
                  >
                    {isPublishingJob ? "Publishing..." : "Publish Job"}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
