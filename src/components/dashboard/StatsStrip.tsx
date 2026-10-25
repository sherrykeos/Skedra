import React from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import { Calculator, Cpu, BookOpen, Clock } from 'lucide-react';

export const StatsStrip: React.FC = () => {
  const { stats, currentDate } = useRoadmap();
  const isJanuary = new Date(currentDate).getFullYear() >= 2027;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* 1. Track A: Mathematics Progress */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#848d97] text-xs">
          <span className="font-medium text-[#bc8cff] flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-[#bc8cff]" />
            Track A: Mathematics
          </span>
          <span className="text-[10px] bg-[#8957e5]/10 text-[#bc8cff] px-1.5 py-0.2 rounded border border-[#8957e5]/30">
            EM + DM
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-bold text-[#e6edf3]">
            {stats.mathPercent}%
          </span>
          <span className="text-xs text-[#848d97]">
            {stats.mathCompletedTasks} / {stats.mathTotalTasks} tasks
          </span>
        </div>
        <div className="w-full bg-[#21262d] h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-[#8957e5] h-full rounded-full transition-all duration-300"
            style={{ width: `${stats.mathPercent}%` }}
          />
        </div>
      </div>

      {/* 2. Track B: Core Computer Science Progress */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#848d97] text-xs">
          <span className="font-medium text-[#58a6ff] flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#58a6ff]" />
            Track B: Core CS
          </span>
          <span className="text-[10px] bg-[#1f6feb]/10 text-[#58a6ff] px-1.5 py-0.2 rounded border border-[#1f6feb]/30">
            9 Subjects
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-bold text-[#e6edf3]">
            {stats.coreCsPercent}%
          </span>
          <span className="text-xs text-[#848d97]">
            {stats.coreCsCompletedTasks} / {stats.coreCsTotalTasks} tasks
          </span>
        </div>
        <div className="w-full bg-[#21262d] h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-[#1f6feb] h-full rounded-full transition-all duration-300"
            style={{ width: `${stats.coreCsPercent}%` }}
          />
        </div>
      </div>

      {/* 3. Combined Overall Syllabus Completion */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#848d97] text-xs">
          <span className="font-medium text-[#3fb950] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#3fb950]" />
            Combined Syllabus
          </span>
          <span className="text-[10px] text-[#848d97]">
            {stats.masteredCount} Mastered
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-bold text-[#e6edf3]">
            {stats.completionPercent}%
          </span>
          <span className="text-xs text-[#848d97]">
            {stats.completedSubtasks} / {stats.totalSubtasks}
          </span>
        </div>
        <div className="w-full bg-[#21262d] h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-[#238636] h-full rounded-full transition-all duration-300"
            style={{ width: `${stats.completionPercent}%` }}
          />
        </div>
      </div>

      {/* 4. Daily Pace & Capacity (Default 3h) */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#848d97] text-xs">
          <span className="font-medium text-[#e3b341] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#e3b341]" />
            Today &amp; Weekly Pace
          </span>
          <span className="text-[10px] text-[#848d97]">
            3h / day cap
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-bold text-[#e6edf3]">
            {stats.todayPercent}%
          </span>
          <span className="text-xs text-[#848d97]">
            {stats.weeklyCompletedHours}h / {stats.weeklyTargetHours}h wk
          </span>
        </div>
        <div className="w-full bg-[#21262d] h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-[#d29922] h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(
                100,
                Math.round((stats.weeklyCompletedHours / (stats.weeklyTargetHours || 1)) * 100)
              )}%`,
            }}
          />
        </div>
      </div>

      {/* January Aptitude Banner if active in January */}
      {isJanuary && (
        <div className="col-span-2 md:col-span-4 bg-[#f0883e]/10 border border-[#f0883e]/30 rounded-lg p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#f0883e]/20 text-[#ffa657]">
              JANUARY TRACK
            </span>
            <span className="text-xs text-[#e6edf3] font-medium">
              General Aptitude Track Active
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#848d97]">
              {stats.aptitudeCompletedTasks} of {stats.aptitudeTotalTasks} tasks completed ({stats.aptitudePercent}%)
            </span>
            <div className="w-24 bg-[#21262d] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#f0883e] h-full rounded-full transition-all"
                style={{ width: `${stats.aptitudePercent}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
