import React from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import { AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';

export const OverdueBanner: React.FC = () => {
  const { overdueTasks, triggerRebalance } = useRoadmap();

  if (overdueTasks.length === 0) return null;

  const highWeightageCount = overdueTasks.filter((t) => t.weightage === 'high').length;
  const totalMinutes = overdueTasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);

  return (
    <div className="bg-[#f85149]/10 border border-[#f85149]/30 rounded-lg p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-md bg-[#f85149]/20 text-[#f85149] mt-0.5">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-[#ff7b72] flex items-center gap-2">
            <span>{overdueTasks.length} Unfinished Tasks Carried Forward</span>
            <span className="text-[11px] text-[#848d97] font-normal">
              (~{(totalMinutes / 60).toFixed(1)} hrs pending)
            </span>
          </h4>
          <p className="text-xs text-[#848d97] mt-0.5">
            {highWeightageCount > 0
              ? `${highWeightageCount} high-weightage topics require rebalancing to protect mock milestones.`
              : 'Tasks from previous dates detected. Rebalance into upcoming days based on daily capacity.'}
          </p>
        </div>
      </div>

      <button
        onClick={() => triggerRebalance('missed_days')}
        className="self-stretch sm:self-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#21262d] text-[#e6edf3] hover:bg-[#30363d] border border-[#30363d] text-xs font-medium transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5 text-[#58a6ff]" />
        <span>Rebalance Schedule</span>
        <ArrowRight className="w-3 h-3 text-[#848d97]" />
      </button>
    </div>
  );
};
