import React from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import { Flag, ShieldCheck, Calendar } from 'lucide-react';

export const NextMilestoneCard: React.FC = () => {
  const { days, currentDayNumber } = useRoadmap();

  // Find next milestone on or after currentDayNumber
  const nextMilestone =
    days.find((d) => d.dayNumber >= currentDayNumber && (d.isMilestone || d.isProtected)) ||
    days[days.length - 1];

  if (!nextMilestone) return null;

  const daysUntil = Math.max(0, nextMilestone.dayNumber - currentDayNumber);

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between text-xs text-[#848d97] mb-2">
          <span className="flex items-center gap-1.5 font-medium">
            <Flag className="w-3.5 h-3.5 text-[#a371f7]" />
            NEXT MAJOR MILESTONE
          </span>
          {nextMilestone.isProtected && (
            <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-[#238636]/10 text-[#3fb950] border border-[#238636]/30">
              <ShieldCheck className="w-3 h-3" />
              Protected Date
            </span>
          )}
        </div>

        <h3 className="text-sm font-bold text-[#e6edf3]">
          {nextMilestone.milestoneTitle || nextMilestone.topic}
        </h3>
        <p className="text-xs text-[#848d97] mt-1">
          {nextMilestone.subjectName} • Day {nextMilestone.dayNumber} ({nextMilestone.date})
        </p>
      </div>

      <div className="mt-3 pt-3 border-t border-[#30363d]/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-[#848d97]">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {daysUntil === 0
              ? 'Today!'
              : daysUntil === 1
              ? 'Tomorrow'
              : `In ${daysUntil} days`}
          </span>
        </div>
        <span className="text-[11px] font-mono font-medium text-[#58a6ff] bg-[#1f6feb]/10 px-2 py-0.5 rounded border border-[#1f6feb]/20">
          Target Day {nextMilestone.dayNumber}
        </span>
      </div>
    </div>
  );
};
