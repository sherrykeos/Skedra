import React from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import { ShieldCheck, AlertTriangle, ChevronRight, Zap } from 'lucide-react';

interface WorkloadFeasibilityBannerProps {
  onOpenFastTrack: () => void;
  onOpenSettings: () => void;
}

export const WorkloadFeasibilityBanner: React.FC<WorkloadFeasibilityBannerProps> = ({
  onOpenFastTrack,
  onOpenSettings,
}) => {
  const { feasibility } = useRoadmap();

  if (feasibility.isFeasible) return null;

  return (
    <div className="bg-[#d29922]/10 border border-[#d29922]/30 rounded-lg p-3.5">
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-md bg-[#d29922]/20 text-[#d29922] mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#e3b341]">
              Workload Deficit Detected: +{feasibility.gapHoursPerDayNeeded}h / day Required
            </h4>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#161b22] text-[#848d97] border border-[#30363d] hidden sm:inline">
              Exam Date Feb 7, 2027 Protected
            </span>
          </div>
          <p className="text-xs text-[#848d97] mt-1">
            Current pace requires {Math.round(feasibility.gapMinutes / 60)} extra study hours before the exam. To avoid compromising revision and full-length mocks, adopt one of these recommended trade-offs:
          </p>

          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={onOpenFastTrack}
              className="flex items-center justify-between text-left p-2 rounded bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff]/40 text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[#bc8cff]" />
                <div>
                  <span className="font-medium text-[#e6edf3]">Fast-track familiar topics</span>
                  <p className="text-[10px] text-[#848d97]">Waive theory in Sets, Matrices, Logic</p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#848d97]" />
            </button>

            <button
              onClick={onOpenSettings}
              className="flex items-center justify-between text-left p-2 rounded bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff]/40 text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#58a6ff]" />
                <div>
                  <span className="font-medium text-[#e6edf3]">Adjust Daily Study Hours</span>
                  <p className="text-[10px] text-[#848d97]">Increase hours or adjust rest days</p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#848d97]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
