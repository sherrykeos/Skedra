import React from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import {
  Clock,
  Settings,
  Database,
  RefreshCw,
  Zap,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
  activeView: 'dashboard' | 'roadmap';
  setActiveView: (view: 'dashboard' | 'roadmap') => void;
  onOpenSettings: () => void;
  onOpenBackup: () => void;
  onOpenFastTrack: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onOpenSettings,
  onOpenBackup,
  onOpenFastTrack,
}) => {
  const {
    currentDate,
    currentDayNumber,
    stats,
    feasibility,
    overdueTasks,
    triggerRebalance,
  } = useRoadmap();

  return (
    <header className="sticky top-0 z-40 bg-[#161b22] border-b border-[#30363d] px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#1f6feb] flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-sm">
            G27
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-[#e6edf3] tracking-tight leading-none m-0">
                GATE CSE 2027
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#21262d] text-[#848d97] border border-[#30363d]">
                Day {currentDayNumber} • {currentDate}
              </span>
            </div>
            <p className="text-[11px] text-[#848d97] mt-0.5">Adaptive Engineering Roadmap</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="flex items-center bg-[#0d1117] p-1 rounded-md border border-[#30363d]">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeView === 'dashboard'
                ? 'bg-[#21262d] text-[#e6edf3] shadow-sm'
                : 'text-[#848d97] hover:text-[#e6edf3]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('roadmap')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeView === 'roadmap'
                ? 'bg-[#21262d] text-[#e6edf3] shadow-sm'
                : 'text-[#848d97] hover:text-[#e6edf3]'
            }`}
          >
            Day-by-Day Roadmap
          </button>
        </nav>

        {/* Status Pills & Actions */}
        <div className="flex items-center gap-2">
          {/* Days until exam */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0d1117] border border-[#30363d] text-xs">
            <Clock className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span className="text-[#848d97]">Exam in:</span>
            <span className="font-semibold text-[#e6edf3]">{stats.daysUntilExam}d</span>
          </div>

          {/* Feasibility pill */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border ${
              feasibility.isFeasible
                ? 'bg-[#238636]/10 border-[#238636]/30 text-[#3fb950]'
                : 'bg-[#d29922]/10 border-[#d29922]/30 text-[#d29922]'
            }`}
            title={
              feasibility.isFeasible
                ? 'Workload is balanced within daily hours'
                : `Workload deficit of ${feasibility.gapHoursPerDayNeeded}h/day detected`
            }
          >
            {feasibility.isFeasible ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            <span>
              {feasibility.isFeasible
                ? 'On Track'
                : `+${feasibility.gapHoursPerDayNeeded}h/d Gap`}
            </span>
          </div>

          {/* Fast Track Button */}
          <button
            onClick={onOpenFastTrack}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-[#8957e5]/10 text-[#bc8cff] border border-[#8957e5]/30 hover:bg-[#8957e5]/20 transition-colors"
            title="Fast-Track Familiar Topics with Diagnostic Quiz"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fast-Track</span>
          </button>

          {/* Adaptive Rebalance Button */}
          {overdueTasks.length > 0 && (
            <button
              onClick={() => triggerRebalance('missed_days')}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-[#f85149]/10 text-[#ff7b72] border border-[#f85149]/30 hover:bg-[#f85149]/20 transition-colors animate-pulse"
              title="Rebalance overdue tasks into upcoming days"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rebalance ({overdueTasks.length})</span>
            </button>
          )}

          {/* Settings & Backup Buttons */}
          <button
            onClick={onOpenBackup}
            className="p-1.5 text-[#848d97] hover:text-[#e6edf3] hover:bg-[#21262d] rounded transition-colors"
            title="Backup & Restore (JSON)"
          >
            <Database className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-[#848d97] hover:text-[#e6edf3] hover:bg-[#21262d] rounded transition-colors"
            title="Settings & Schedule Controls"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
