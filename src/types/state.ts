import type { Subtask, DayStatus } from './roadmap';

export interface UserSettings {
  dailyStudyHours: number; // e.g. 3 (180 mins total combined)
  weekendStudyHours: number; // e.g. 3
  mathDailyMinutes?: number; // default 90 min (configurable)
  coreCsDailyMinutes?: number; // default 90 min (configurable)
  masteryThresholdPercent: number; // default 80%
  adaptiveSchedulingEnabled: boolean; // default true
  examDate: string; // '2027-02-07'
  restDays: number[]; // e.g. [0] for Sunday, or []
  autoRecommendNext: boolean;
  prioritizeHighWeightageOnDelay: boolean;
}

export interface SubtaskWithOrigin extends Subtask {
  originalDayNumber: number;
  originalDate: string;
  subjectName: string;
  topicName: string;
  subtopicId: string;
  subtopicName: string;
  weightage: 'high' | 'medium' | 'low';
}

export interface MasteryRecord {
  subtopicId: string;
  subtopicName: string;
  score: number;
  date: string;
  reducedMinutes: number;
}

export interface UserProgressState {
  completedSubtaskIds: Record<string, boolean>; // subtaskId -> boolean
  completedAtMap: Record<string, string>; // subtaskId -> timestamp
  masteredSubtopics: Record<string, MasteryRecord>;
  dayStatusOverrides: Record<number, DayStatus>;
  dayNotes: Record<number, string>;
  lastActiveDate: string; // e.g. '2026-10-24'
  currentDayNumber: number;
  carryForwardQueue: SubtaskWithOrigin[];
  studyLog: {
    date: string;
    minutesStudied: number;
    subtasksCompleted: number;
    pointsEarned: number;
  }[];
}

export interface AppState {
  version: number;
  settings: UserSettings;
  progress: UserProgressState;
  activeScheduleDays: import('./roadmap').StudyDay[];
  lastRescheduledAt?: string;
  activeProposal: import('./scheduler').RescheduleProposal | null;
}
