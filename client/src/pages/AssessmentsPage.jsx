import React, { useState } from 'react';
import { Check, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { ASSESSMENTS_CATALOG } from '../lib/mockData';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { FilterBar } from '../components/common/FilterBar';

export function AssessmentsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [assessments, setAssessments] = useState(ASSESSMENTS_CATALOG);
  const [completedCount, setCompletedCount] = useState(4);
  const [activeTestModal, setActiveTestModal] = useState(null);
  const [isTestSubmitting, setIsTestSubmitting] = useState(false);
  const [testSuccessMessage, setTestSuccessMessage] = useState(null);

  const tabs = ['All', 'Coding', 'DSA', 'System Design', 'Languages'];

  const filteredAssessments = activeTab === 'All' 
    ? assessments 
    : assessments.filter(a => a.category === activeTab);

  const handleStartTest = (item) => {
    setActiveTestModal(item);
    setTestSuccessMessage(null);
  };

  const handleSimulateSubmit = () => {
    setIsTestSubmitting(true);
    setTimeout(() => {
      setIsTestSubmitting(false);
      setTestSuccessMessage(`Simulation Passed! 100/100 test cases verified. Your verified score updated.`);
      setCompletedCount(prev => Math.min(6, prev + 1));
      setAssessments(prev => prev.map(a => 
        a.id === activeTestModal.id ? { ...a, status: 'Verified' } : a
      ));
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header matching Panel 5 */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#15264B] tracking-tight">
          Assessments
        </h1>
        <p className="text-xs sm:text-sm text-[#687793] mt-0.5 font-medium">
          Test your skills and earn verified badges
        </p>
      </div>

      {/* Main 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 Cols): Filter Tabs and Assessment Cards */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Tabs */}
          <FilterBar
            options={tabs}
            activeOption={activeTab}
            onSelect={setActiveTab}
          />

          {/* Assessment Cards List */}
          <div className="space-y-3 pt-2">
            {filteredAssessments.map((item) => (
              <Card 
                key={item.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-[#CBD8EB] transition-all"
              >
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] flex items-center justify-center text-xl shadow-2xs shrink-0">
                    {item.fallbackIcon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-[#15264B]">{item.name}</h3>
                      {item.status === 'Verified' ? (
                        <Badge variant="mint" size="sm">
                          <Check className="w-3 h-3 stroke-[3]" /> Verified
                        </Badge>
                      ) : (
                        <Badge variant="yellow" size="sm">
                          In Progress
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#687793] mt-0.5">
                      <span>{item.description}</span>
                      <span>•</span>
                      <span className="font-semibold text-[#15264B]">{item.badge}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleStartTest(item)}
                  className="text-xs font-bold text-[#1D4ED8] hover:text-[#15264B] flex items-center gap-1 transition cursor-pointer shrink-0"
                >
                  <span>Take Test</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Card>
            ))}
          </div>

        </div>

        {/* Right Column (5 Cols): Trophy Banner & Progress Meter matching Panel 5 */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Trophy Banner Card */}
          <Card className="p-6 sm:p-7 text-center space-y-4 bg-gradient-to-b from-[#FFF8DC]/70 via-white to-white border-[#FFE89A] relative overflow-hidden">
            <div className="w-20 h-20 rounded-full bg-[#FFF8DC] border border-[#FFE89A] mx-auto flex items-center justify-center text-4xl shadow-sm">
              🏆
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#15264B] leading-snug">
                Complete more assessments, boost your score!
              </h3>
              <p className="text-xs text-[#687793] mt-1 font-normal">
                Verified challenge tests directly increase your global rank and recruiter visibility.
              </p>
            </div>
            <Button 
              variant="primary" 
              size="md" 
              className="w-full font-bold shadow-sm"
              onClick={() => handleStartTest(assessments[0])}
            >
              Start Now
            </Button>
          </Card>

          {/* Your Progress Card matching Panel 5 */}
          <Card className="p-6 space-y-5">
            <h3 className="font-bold text-base text-[#15264B]">
              Your Progress
            </h3>

            {/* Circular Gauge */}
            <div className="flex items-center justify-center py-2">
              <div className="relative w-32 h-32 rounded-full border-8 border-[#EEF2F6] border-t-[#4CC9A6] border-r-[#4CC9A6] border-b-[#4CC9A6] flex flex-col items-center justify-center">
                <span className="font-black text-2xl text-[#15264B]">{completedCount}/6</span>
                <span className="text-[10px] text-[#687793] font-semibold">Completed</span>
              </div>
            </div>

            {/* Next Badge item */}
            <div className="p-3.5 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E4F8EF] text-[#059669] flex items-center justify-center text-lg border border-[#B9EED9]">
                🛡️
              </div>
              <div className="text-xs">
                <div className="text-[#687793] text-[10px] font-semibold">Next Badge</div>
                <div className="font-bold text-[#15264B]">System Design Expert</div>
              </div>
            </div>

          </Card>

        </div>

      </div>

      {/* Demo Assessment Simulator Modal */}
      {activeTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#E2EAF5] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#1D4ED8] uppercase tracking-wider">Rankora Skill Test</span>
                <h3 className="text-lg font-bold text-[#15264B]">{activeTestModal.name} Challenge</h3>
              </div>
              <button 
                onClick={() => setActiveTestModal(null)}
                className="text-[#687793] hover:text-[#15264B] p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F8FF] border border-[#E2EAF5] text-xs space-y-2">
              <div className="font-bold text-[#15264B]">Problem Statement:</div>
              <p className="text-[#687793]">
                Given an array of integers and an integer target, design an optimal algorithm that returns indices of the two numbers such that they add up to the target in O(N) time complexity.
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-[#E2EAF5] font-mono text-[11px] text-[#15264B]">
                <code>def two_sum(nums: List[int], target: int) -&gt; List[int]:</code>
              </div>
            </div>

            {testSuccessMessage ? (
              <div className="p-3.5 rounded-2xl bg-[#E4F8EF] border border-[#B9EED9] text-xs text-[#059669] flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{testSuccessMessage}</span>
              </div>
            ) : null}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" size="md" onClick={() => setActiveTestModal(null)}>
                {testSuccessMessage ? "Close" : "Cancel"}
              </Button>
              {!testSuccessMessage && (
                <Button 
                  variant="primary" 
                  size="md" 
                  disabled={isTestSubmitting}
                  onClick={handleSimulateSubmit}
                  className="px-6"
                >
                  {isTestSubmitting ? "Evaluating..." : "Run Test & Verify"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
