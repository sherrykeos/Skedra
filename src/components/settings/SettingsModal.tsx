import React, { useState } from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import { X, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    settings,
    updateSettings,
    currentDate,
    setCurrentDate,
    setCurrentDayNumber,
    days,
    triggerRebalance,
  } = useRoadmap();

  const [dailyHours, setDailyHours] = useState(settings.dailyStudyHours);
  const [weekendHours, setWeekendHours] = useState(settings.weekendStudyHours);
  const [masteryThreshold, setMasteryThreshold] = useState(settings.masteryThresholdPercent);
  const [adaptiveEnabled, setAdaptiveEnabled] = useState(settings.adaptiveSchedulingEnabled);
  const [examDate, setExamDate] = useState(settings.examDate);
  const [simulatedDate, setSimulatedDate] = useState(currentDate);

  if (!isOpen) return null;

  const handleSave = () => {
    updateSettings({
      dailyStudyHours: Number(dailyHours),
      weekendStudyHours: Number(weekendHours),
      masteryThresholdPercent: Number(masteryThreshold),
      adaptiveSchedulingEnabled: adaptiveEnabled,
      examDate,
    });

    if (simulatedDate !== currentDate) {
      setCurrentDate(simulatedDate);
      const matchedDay = days.find((d) => d.date === simulatedDate);
      if (matchedDay) {
        setCurrentDayNumber(matchedDay.dayNumber);
      }
      triggerRebalance('manual');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#e6edf3]">
              Schedule Settings &amp; Engine Controls
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#848d97] hover:text-[#e6edf3] rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 text-xs">
          {/* Study Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#848d97] font-medium block mb-1">
                Combined Daily Capacity (Default: 3h)
              </label>
              <input
                type="number"
                min="1"
                max="16"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value) || 1)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-xs text-[#e6edf3] focus:outline-none focus:border-[#58a6ff]"
              />
            </div>

            <div>
              <label className="text-[#848d97] font-medium block mb-1">
                Weekend Study Hours (Sat-Sun)
              </label>
              <input
                type="number"
                min="1"
                max="16"
                step="0.5"
                value={weekendHours}
                onChange={(e) => setWeekendHours(parseFloat(e.target.value) || 1)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-xs text-[#e6edf3] focus:outline-none focus:border-[#58a6ff]"
              />
            </div>
          </div>

          {/* Mastery Threshold */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[#848d97] font-medium">Fast-Track Mastery Threshold</label>
              <span className="font-mono text-[#58a6ff]">{masteryThreshold}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="95"
              step="5"
              value={masteryThreshold}
              onChange={(e) => setMasteryThreshold(parseInt(e.target.value, 10))}
              className="w-full accent-[#1f6feb]"
            />
            <p className="text-[11px] text-[#6e7681] mt-0.5">
              Diagnostic test score required to waive beginner lectures and save study hours (Default: 80%).
            </p>
          </div>

          {/* Fixed Exam Date */}
          <div>
            <label className="text-[#848d97] font-medium block mb-1">
              Fixed Exam Date (GATE CSE 2027)
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-xs text-[#e6edf3] focus:outline-none focus:border-[#58a6ff]"
            />
            <p className="text-[11px] text-[#6e7681] mt-0.5">
              Preserved as a hard immovable deadline. Scheduler never silently shifts this date.
            </p>
          </div>

          {/* Adaptive Engine Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
            <div>
              <span className="font-semibold text-[#e6edf3] block">
                Adaptive Scheduling Engine
              </span>
              <p className="text-[11px] text-[#848d97]">
                Automatically suggest rebalancing when days are missed or finished early
              </p>
            </div>
            <input
              type="checkbox"
              checked={adaptiveEnabled}
              onChange={(e) => setAdaptiveEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#1f6feb] rounded cursor-pointer"
            />
          </div>

          {/* Simulator: Current Date Changer */}
          <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#e6edf3]">
                Simulate Current Study Date
              </span>
              <span className="text-[10px] text-[#58a6ff] bg-[#1f6feb]/10 px-1.5 py-0.5 rounded">
                Testing Utility
              </span>
            </div>
            <p className="text-[11px] text-[#848d97]">
              Jump to future dates (e.g. advance 3 days to test missed days detection &amp; rebalancing):
            </p>
            <input
              type="date"
              value={simulatedDate}
              onChange={(e) => setSimulatedDate(e.target.value)}
              className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-1.5 text-xs text-[#e6edf3] focus:outline-none focus:border-[#58a6ff]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#30363d] bg-[#0d1117] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-[#848d97] hover:text-[#e6edf3]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-md bg-[#1f6feb] hover:bg-[#388bfd] text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
