import React from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import {
  X,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const RescheduleModal: React.FC = () => {
  const { activeProposal, applyActiveProposal, rejectActiveProposal } = useRoadmap();

  if (!activeProposal) return null;

  const { trigger, summary, changes, feasibility } = activeProposal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-[#1f6feb]/20 text-[#58a6ff]">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#e6edf3]">
                Adaptive Schedule Proposal
              </h3>
              <p className="text-xs text-[#848d97]">
                Trigger: <span className="font-mono text-[#c9d1d9]">{trigger.replace('_', ' ').toUpperCase()}</span>
              </p>
            </div>
          </div>

          <button
            onClick={rejectActiveProposal}
            className="p-1 text-[#848d97] hover:text-[#e6edf3] rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Summary Box */}
          <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
            <p className="text-xs text-[#e6edf3]">{summary}</p>
          </div>

          {/* Exam Date Protection Guarantee */}
          <div className="p-3 bg-[#238636]/10 border border-[#238636]/30 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3fb950]" />
              <div>
                <span className="text-xs font-semibold text-[#3fb950]">
                  Fixed Exam Deadline Protected
                </span>
                <p className="text-[11px] text-[#848d97]">
                  GATE CSE 2027 (Feb 7, 2027) & Mock Test dates remain protected.
                </p>
              </div>
            </div>
          </div>

          {/* Feasibility / Deficit Status */}
          {!feasibility.isFeasible && (
            <div className="p-3 bg-[#d29922]/10 border border-[#d29922]/30 rounded-lg space-y-1.5">
              <div className="flex items-center gap-2 text-[#d29922] text-xs font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>Workload Deficit: +{feasibility.gapHoursPerDayNeeded}h / day Required</span>
              </div>
              <p className="text-[11px] text-[#848d97]">
                High-weightage core topics and PYQs were prioritized. Low-weightage topics will be compressed or deferred if daily capacity is exceeded.
              </p>
            </div>
          )}

          {/* Detailed Change Audit List */}
          <div>
            <h4 className="text-xs font-semibold text-[#848d97] uppercase mb-2">
              Proposed Task Adjustments ({changes.length})
            </h4>

            {changes.length === 0 ? (
              <p className="text-xs text-[#848d97] italic p-3 bg-[#0d1117] rounded">
                No tasks need rescheduling. You are perfectly on track!
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {changes.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-[#0d1117] border border-[#30363d] rounded-md text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#e6edf3]">{item.taskTitle}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase ${
                          item.type === 'carried_forward'
                            ? 'bg-[#1f6feb]/20 text-[#58a6ff]'
                            : item.type === 'time_reduced'
                            ? 'bg-[#238636]/20 text-[#3fb950]'
                            : 'bg-[#d29922]/20 text-[#e3b341]'
                        }`}
                      >
                        {item.type.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#848d97]">
                      <span>{item.subjectName}</span>
                      {item.fromDay && item.toDay && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono text-[#c9d1d9]">
                            Day {item.fromDay} <ArrowRight className="w-2.5 h-2.5" /> Day {item.toDay}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span>{item.minutesSavedOrShifted} min</span>
                    </div>

                    <p className="text-[11px] text-[#6e7681] italic">{item.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#30363d] bg-[#0d1117] flex items-center justify-between">
          <button
            onClick={rejectActiveProposal}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-[#848d97] hover:text-[#e6edf3] transition-colors"
          >
            Reject / Keep Current
          </button>

          <button
            onClick={applyActiveProposal}
            className="px-4 py-1.5 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Accept &amp; Apply Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};
