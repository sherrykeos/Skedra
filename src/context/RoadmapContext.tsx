import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { StudyDay, DayStatus } from '../types/roadmap';
import type { UserSettings, UserProgressState, AppState } from '../types/state';
import type { RescheduleProposal, WorkloadFeasibility } from '../types/scheduler';
import { generateDefaultRoadmap } from '../data/defaultRoadmap';
import {
  calculateFeasibility,
  detectUnfinishedTasks,
  rebalanceSchedule,
  fastTrackSubtopic,
  advanceToNextStudyDay,
  getRecommendedNextTask,
} from '../engine/scheduler';

const STORAGE_KEY = 'gate27_roadmap_v2'; // Bump version for updated schema

export const DEFAULT_SETTINGS: UserSettings = {
  dailyStudyHours: 3, // Default 3 hours per day across both tracks combined
  weekendStudyHours: 3,
  masteryThresholdPercent: 80,
  adaptiveSchedulingEnabled: true,
  examDate: '2027-02-07',
  restDays: [],
  autoRecommendNext: true,
  prioritizeHighWeightageOnDelay: true,
};

const DEFAULT_START_DATE = '2026-10-24';

interface RoadmapContextValue {
  days: StudyDay[];
  settings: UserSettings;
  progress: UserProgressState;
  currentDate: string;
  currentDayNumber: number;
  activeProposal: RescheduleProposal | null;
  feasibility: WorkloadFeasibility;
  overdueTasks: ReturnType<typeof detectUnfinishedTasks>;
  recommendedNextTask: ReturnType<typeof getRecommendedNextTask>;

  // Actions
  toggleSubtask: (subtaskId: string, dayNumber: number) => void;
  setDayStatus: (dayNumber: number, status: DayStatus) => void;
  setDayNote: (dayNumber: number, note: string) => void;
  advanceNextDay: () => void;
  triggerRebalance: (trigger?: RescheduleProposal['trigger']) => void;
  applyActiveProposal: () => void;
  rejectActiveProposal: () => void;
  fastTrackTopicModal: (subtopicId: string, score: number) => { isMastered: boolean; minutesSaved: number };
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  setCurrentDate: (date: string) => void;
  setCurrentDayNumber: (dayNum: number) => void;
  exportBackupJSON: () => string;
  importBackupJSON: (jsonStr: string) => { success: boolean; error?: string };
  resetProgress: () => void;

  // Computed summary
  stats: {
    totalSubtasks: number;
    completedSubtasks: number;
    completionPercent: number;
    totalStudyMinutes: number;
    completedStudyMinutes: number;
    todayCompletedCount: number;
    todayTotalCount: number;
    todayPercent: number;
    todayMinutesRemaining: number;
    daysUntilExam: number;
    pointsEarned: number;
    weeklyTargetHours: number;
    weeklyCompletedHours: number;
    masteredCount: number;
    // Track-wise statistics
    mathTotalTasks: number;
    mathCompletedTasks: number;
    mathPercent: number;
    coreCsTotalTasks: number;
    coreCsCompletedTasks: number;
    coreCsPercent: number;
    aptitudeTotalTasks: number;
    aptitudeCompletedTasks: number;
    aptitudePercent: number;
    // Today Track Allocations
    todayMathTotal: number;
    todayMathDone: number;
    todayMathMinutes: number;
    todayMathMinutesRemaining: number;
    todayMathPercent: number;
    todayCoreCsTotal: number;
    todayCoreCsDone: number;
    todayCoreCsMinutes: number;
    todayCoreCsMinutesRemaining: number;
    todayCoreCsPercent: number;
    // Weekly Track Progress
    weekMathPercent: number;
    weekCoreCsPercent: number;
    weekMathDone: number;
    weekMathTotal: number;
    weekCoreCsDone: number;
    weekCoreCsTotal: number;
  };
}

const RoadmapContext = createContext<RoadmapContextValue | null>(null);

export const RoadmapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [days, setDays] = useState<StudyDay[]>(() => generateDefaultRoadmap(DEFAULT_START_DATE));
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [currentDate, setCurrentDate] = useState<string>(DEFAULT_START_DATE);
  const [currentDayNumber, setCurrentDayNumber] = useState<number>(1);
  const [activeProposal, setActiveProposal] = useState<RescheduleProposal | null>(null);

  const [progress, setProgress] = useState<UserProgressState>({
    completedSubtaskIds: {},
    completedAtMap: {},
    masteredSubtopics: {},
    dayStatusOverrides: {},
    dayNotes: {},
    lastActiveDate: DEFAULT_START_DATE,
    currentDayNumber: 1,
    carryForwardQueue: [],
    studyLog: [],
  });

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: AppState = JSON.parse(stored);
        if (parsed.activeScheduleDays && Array.isArray(parsed.activeScheduleDays)) {
          // If loaded days has track property, use it; otherwise fallback to new generation
          if (parsed.activeScheduleDays[0]?.track) {
            setDays(parsed.activeScheduleDays);
          }
        }
        if (parsed.settings) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...parsed.settings,
            // Ensure capacity defaults to 3h if previously 5h
            dailyStudyHours: parsed.settings.dailyStudyHours || 3,
          });
        }
        if (parsed.progress) {
          setProgress(parsed.progress);
          if (parsed.progress.currentDayNumber) {
            setCurrentDayNumber(parsed.progress.currentDayNumber);
          }
          if (parsed.progress.lastActiveDate) {
            setCurrentDate(parsed.progress.lastActiveDate);
          }
        }
        if (parsed.activeProposal) {
          setActiveProposal(parsed.activeProposal);
        }
      }
    } catch (err) {
      console.error('Failed to load roadmap from LocalStorage:', err);
    }
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    const stateToSave: AppState = {
      version: 2,
      settings,
      progress: {
        ...progress,
        currentDayNumber,
        lastActiveDate: currentDate,
      },
      activeScheduleDays: days,
      activeProposal,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (err) {
      console.error('Failed to save to LocalStorage:', err);
    }
  }, [days, settings, progress, currentDayNumber, currentDate, activeProposal]);

  // Compute feasibility
  const feasibility = useMemo(() => {
    return calculateFeasibility(days, settings, currentDate, progress.completedSubtaskIds);
  }, [days, settings, currentDate, progress.completedSubtaskIds]);

  // Overdue / carried forward tasks
  const overdueTasks = useMemo(() => {
    return detectUnfinishedTasks(days, currentDate, progress.completedSubtaskIds);
  }, [days, currentDate, progress.completedSubtaskIds]);

  // Recommended next task
  const recommendedNextTask = useMemo(() => {
    return getRecommendedNextTask(days, currentDayNumber, progress.completedSubtaskIds);
  }, [days, currentDayNumber, progress.completedSubtaskIds]);

  // Toggle a single subtask
  const toggleSubtask = useCallback(
    (subtaskId: string, dayNumber: number) => {
      setProgress((prev) => {
        const isCompleted = !prev.completedSubtaskIds[subtaskId];
        const newCompleted = { ...prev.completedSubtaskIds };
        const newCompletedAt = { ...prev.completedAtMap };

        if (isCompleted) {
          newCompleted[subtaskId] = true;
          newCompletedAt[subtaskId] = new Date().toISOString();
        } else {
          delete newCompleted[subtaskId];
          delete newCompletedAt[subtaskId];
        }

        return {
          ...prev,
          completedSubtaskIds: newCompleted,
          completedAtMap: newCompletedAt,
        };
      });

      setDays((prevDays) =>
        prevDays.map((d) => {
          if (d.dayNumber !== dayNumber) return d;
          let allCompleted = true;
          let anyCompleted = false;

          const updatedSubtopics = d.subtopics.map((st) => {
            const updatedSubtasks = st.subtasks.map((task) => {
              if (task.id === subtaskId) {
                const nextState = !task.completed;
                if (nextState) anyCompleted = true;
                else allCompleted = false;
                return {
                  ...task,
                  completed: nextState,
                  completedAt: nextState ? new Date().toISOString() : undefined,
                };
              }
              if (task.completed) anyCompleted = true;
              else allCompleted = false;
              return task;
            });
            return { ...st, subtasks: updatedSubtasks };
          });

          const newStatus: DayStatus = allCompleted
            ? 'completed'
            : anyCompleted
            ? 'in-progress'
            : d.dayNumber === currentDayNumber
            ? 'in-progress'
            : 'upcoming';

          return { ...d, subtopics: updatedSubtopics, status: newStatus };
        })
      );
    },
    [currentDayNumber]
  );

  const setDayStatus = useCallback((dayNumber: number, status: DayStatus) => {
    setDays((prevDays) =>
      prevDays.map((d) => (d.dayNumber === dayNumber ? { ...d, status } : d))
    );
    setProgress((prev) => ({
      ...prev,
      dayStatusOverrides: {
        ...prev.dayStatusOverrides,
        [dayNumber]: status,
      },
    }));
  }, []);

  const setDayNote = useCallback((dayNumber: number, note: string) => {
    setProgress((prev) => ({
      ...prev,
      dayNotes: {
        ...prev.dayNotes,
        [dayNumber]: note,
      },
    }));
    setDays((prevDays) =>
      prevDays.map((d) => (d.dayNumber === dayNumber ? { ...d, notes: note } : d))
    );
  }, []);

  const advanceNextDay = useCallback(() => {
    const res = advanceToNextStudyDay(days, currentDayNumber);
    setDays(res.updatedDays);
    setCurrentDayNumber(res.nextDayNumber);
    const targetDay = res.updatedDays.find((d) => d.dayNumber === res.nextDayNumber);
    if (targetDay) {
      setCurrentDate(targetDay.date);
    }
  }, [days, currentDayNumber]);

  const triggerRebalance = useCallback(
    (trigger: RescheduleProposal['trigger'] = 'missed_days') => {
      const proposal = rebalanceSchedule(
        days,
        currentDate,
        progress.completedSubtaskIds,
        settings,
        trigger
      );
      setActiveProposal(proposal);
    },
    [days, currentDate, progress.completedSubtaskIds, settings]
  );

  const applyActiveProposal = useCallback(() => {
    if (!activeProposal) return;
    setDays(activeProposal.proposedDays);
    setActiveProposal(null);
  }, [activeProposal]);

  const rejectActiveProposal = useCallback(() => {
    setActiveProposal(null);
  }, []);

  const fastTrackTopicModal = useCallback(
    (subtopicId: string, score: number) => {
      const res = fastTrackSubtopic(
        days,
        subtopicId,
        score,
        settings.masteryThresholdPercent,
        currentDate,
        settings
      );

      if (res.isMastered) {
        setDays(res.proposal.proposedDays);
        setProgress((prev) => ({
          ...prev,
          masteredSubtopics: {
            ...prev.masteredSubtopics,
            [subtopicId]: res.masteryRecord,
          },
        }));
      }

      setActiveProposal(res.proposal);
      return { isMastered: res.isMastered, minutesSaved: res.masteryRecord.reducedMinutes };
    },
    [days, settings, currentDate]
  );

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const exportBackupJSON = useCallback(() => {
    const backup: AppState = {
      version: 2,
      settings,
      progress,
      activeScheduleDays: days,
      activeProposal,
      lastRescheduledAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  }, [settings, progress, days, activeProposal]);

  const importBackupJSON = useCallback((jsonStr: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid JSON format: payload is not an object.' };
      }
      if (!Array.isArray(parsed.activeScheduleDays)) {
        return { success: false, error: 'Invalid backup: missing valid activeScheduleDays array.' };
      }
      setDays(parsed.activeScheduleDays);
      if (parsed.settings) setSettings(parsed.settings);
      if (parsed.progress) {
        setProgress(parsed.progress);
        if (parsed.progress.currentDayNumber) setCurrentDayNumber(parsed.progress.currentDayNumber);
        if (parsed.progress.lastActiveDate) setCurrentDate(parsed.progress.lastActiveDate);
      }
      if (parsed.activeProposal) setActiveProposal(parsed.activeProposal);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to parse JSON backup file.' };
    }
  }, []);

  const resetProgress = useCallback(() => {
    const freshDays = generateDefaultRoadmap(DEFAULT_START_DATE);
    setDays(freshDays);
    setSettings(DEFAULT_SETTINGS);
    setCurrentDate(DEFAULT_START_DATE);
    setCurrentDayNumber(1);
    setActiveProposal(null);
    setProgress({
      completedSubtaskIds: {},
      completedAtMap: {},
      masteredSubtopics: {},
      dayStatusOverrides: {},
      dayNotes: {},
      lastActiveDate: DEFAULT_START_DATE,
      currentDayNumber: 1,
      carryForwardQueue: [],
      studyLog: [],
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Track-wise and overall stats computation
  const stats = useMemo(() => {
    let totalSubtasks = 0;
    let completedSubtasks = 0;
    let totalStudyMinutes = 0;
    let completedStudyMinutes = 0;

    let mathTotalTasks = 0;
    let mathCompletedTasks = 0;

    let coreCsTotalTasks = 0;
    let coreCsCompletedTasks = 0;

    let aptitudeTotalTasks = 0;
    let aptitudeCompletedTasks = 0;

    let todayCompletedCount = 0;
    let todayTotalCount = 0;
    let todayMinutesRemaining = 0;

    const todayDay = days.find((d) => d.dayNumber === currentDayNumber || d.date === currentDate);

    for (const d of days) {
      for (const st of d.subtopics) {
        for (const t of st.subtasks) {
          totalSubtasks++;
          totalStudyMinutes += t.estimatedMinutes;
          const isDone = progress.completedSubtaskIds[t.id] || t.completed;
          const trk = t.track || st.track || (d.track !== 'parallel' ? d.track : 'core-cs');

          if (trk === 'math') {
            mathTotalTasks++;
            if (isDone) mathCompletedTasks++;
          } else if (trk === 'core-cs') {
            coreCsTotalTasks++;
            if (isDone) coreCsCompletedTasks++;
          } else if (trk === 'aptitude') {
            aptitudeTotalTasks++;
            if (isDone) aptitudeCompletedTasks++;
          }

          if (isDone) {
            completedSubtasks++;
            completedStudyMinutes += t.estimatedMinutes;
          }
        }
      }
    }

    let todayMathTotal = 0;
    let todayMathDone = 0;
    let todayMathMinutes = 0;
    let todayMathMinutesRemaining = 0;

    let todayCoreCsTotal = 0;
    let todayCoreCsDone = 0;
    let todayCoreCsMinutes = 0;
    let todayCoreCsMinutesRemaining = 0;

    if (todayDay) {
      for (const st of todayDay.subtopics) {
        for (const t of st.subtasks) {
          todayTotalCount++;
          const isDone = progress.completedSubtaskIds[t.id] || t.completed;
          const trk = t.track || st.track || (todayDay.track !== 'parallel' ? todayDay.track : 'core-cs');

          if (trk === 'math') {
            todayMathTotal++;
            todayMathMinutes += t.estimatedMinutes;
            if (isDone) todayMathDone++;
            else todayMathMinutesRemaining += t.estimatedMinutes;
          } else if (trk === 'core-cs') {
            todayCoreCsTotal++;
            todayCoreCsMinutes += t.estimatedMinutes;
            if (isDone) todayCoreCsDone++;
            else todayCoreCsMinutesRemaining += t.estimatedMinutes;
          }

          if (isDone) {
            todayCompletedCount++;
          } else {
            todayMinutesRemaining += t.estimatedMinutes;
          }
        }
      }
    }

    // Weekly Track Progress (7-day window around currentDayNumber)
    const weekStartDay = Math.max(1, Math.floor((currentDayNumber - 1) / 7) * 7 + 1);
    const weekEndDay = Math.min(days.length, weekStartDay + 6);
    const weekDays = days.filter((d) => d.dayNumber >= weekStartDay && d.dayNumber <= weekEndDay);

    let weekMathTotal = 0;
    let weekMathDone = 0;
    let weekCoreCsTotal = 0;
    let weekCoreCsDone = 0;

    for (const wd of weekDays) {
      for (const st of wd.subtopics) {
        for (const t of st.subtasks) {
          const isDone = progress.completedSubtaskIds[t.id] || t.completed;
          const trk = t.track || st.track || (wd.track !== 'parallel' ? wd.track : 'core-cs');
          if (trk === 'math') {
            weekMathTotal++;
            if (isDone) weekMathDone++;
          } else if (trk === 'core-cs') {
            weekCoreCsTotal++;
            if (isDone) weekCoreCsDone++;
          }
        }
      }
    }

    const weekMathPercent =
      weekMathTotal > 0 ? Math.round((weekMathDone / weekMathTotal) * 100) : 0;
    const weekCoreCsPercent =
      weekCoreCsTotal > 0 ? Math.round((weekCoreCsDone / weekCoreCsTotal) * 100) : 0;

    const completionPercent =
      totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
    const mathPercent =
      mathTotalTasks > 0 ? Math.round((mathCompletedTasks / mathTotalTasks) * 100) : 0;
    const coreCsPercent =
      coreCsTotalTasks > 0 ? Math.round((coreCsCompletedTasks / coreCsTotalTasks) * 100) : 0;
    const aptitudePercent =
      aptitudeTotalTasks > 0 ? Math.round((aptitudeCompletedTasks / aptitudeTotalTasks) * 100) : 0;

    const todayPercent =
      todayTotalCount > 0 ? Math.round((todayCompletedCount / todayTotalCount) * 100) : 0;
    const todayMathPercent =
      todayMathTotal > 0 ? Math.round((todayMathDone / todayMathTotal) * 100) : 0;
    const todayCoreCsPercent =
      todayCoreCsTotal > 0 ? Math.round((todayCoreCsDone / todayCoreCsTotal) * 100) : 0;

    const examDate = new Date(settings.examDate);
    const curr = new Date(currentDate);
    const diffTime = examDate.getTime() - curr.getTime();
    const daysUntilExam = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const masteredCount = Object.keys(progress.masteredSubtopics).length;
    const pointsEarned = completedSubtasks * 10 + masteredCount * 50;

    // 3 hours daily capacity -> 21 hours per week
    const weeklyTargetHours = settings.dailyStudyHours * 5 + settings.weekendStudyHours * 2;
    const weeklyCompletedHours = Number(
      ((completedStudyMinutes % (weeklyTargetHours * 60)) / 60).toFixed(1)
    );

    return {
      totalSubtasks,
      completedSubtasks,
      completionPercent,
      totalStudyMinutes,
      completedStudyMinutes,
      todayCompletedCount,
      todayTotalCount,
      todayPercent,
      todayMinutesRemaining,
      daysUntilExam,
      pointsEarned,
      weeklyTargetHours,
      weeklyCompletedHours,
      masteredCount,
      mathTotalTasks,
      mathCompletedTasks,
      mathPercent,
      coreCsTotalTasks,
      coreCsCompletedTasks,
      coreCsPercent,
      aptitudeTotalTasks,
      aptitudeCompletedTasks,
      aptitudePercent,
      todayMathTotal,
      todayMathDone,
      todayMathMinutes,
      todayMathMinutesRemaining,
      todayMathPercent,
      todayCoreCsTotal,
      todayCoreCsDone,
      todayCoreCsMinutes,
      todayCoreCsMinutesRemaining,
      todayCoreCsPercent,
      weekMathPercent,
      weekCoreCsPercent,
      weekMathDone,
      weekMathTotal,
      weekCoreCsDone,
      weekCoreCsTotal,
    };
  }, [days, currentDayNumber, currentDate, progress, settings]);

  const value: RoadmapContextValue = {
    days,
    settings,
    progress,
    currentDate,
    currentDayNumber,
    activeProposal,
    feasibility,
    overdueTasks,
    recommendedNextTask,
    toggleSubtask,
    setDayStatus,
    setDayNote,
    advanceNextDay,
    triggerRebalance,
    applyActiveProposal,
    rejectActiveProposal,
    fastTrackTopicModal,
    updateSettings,
    setCurrentDate,
    setCurrentDayNumber,
    exportBackupJSON,
    importBackupJSON,
    resetProgress,
    stats,
  };

  return <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>;
};

export const useRoadmap = (): RoadmapContextValue => {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
};
