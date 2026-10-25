import type { StudyDay } from './roadmap';

export interface ScheduleChangeItem {
  type: 'carried_forward' | 'pulled_forward' | 'deferred' | 'time_reduced' | 'rebalanced';
  taskId?: string;
  taskTitle: string;
  subtopicName: string;
  subjectName: string;
  fromDay?: number;
  fromDate?: string;
  toDay?: number;
  toDate?: string;
  reason: string;
  minutesSavedOrShifted: number;
  weightage: 'high' | 'medium' | 'low';
}

export interface TradeOffRecommendation {
  type: 'increase_daily_hours' | 'defer_low_weightage' | 'fast_track_diagnostics' | 'compress_revision';
  title: string;
  description: string;
  impactMinutes: number;
}

export interface WorkloadFeasibility {
  isFeasible: boolean;
  totalRequiredMinutes: number;
  totalAvailableMinutes: number;
  gapMinutes: number; // positive = deficit (infeasible), negative = surplus buffer
  gapHoursPerDayNeeded: number;
  examDateProtected: boolean;
  mockDatesProtected: boolean;
  recommendations: TradeOffRecommendation[];
}

export interface RescheduleProposal {
  id: string;
  createdAt: string;
  trigger: 'early_finish' | 'missed_days' | 'partial_completion' | 'topic_mastered' | 'manual';
  summary: string;
  changes: ScheduleChangeItem[];
  proposedDays: StudyDay[];
  feasibility: WorkloadFeasibility;
  applied: boolean;
}
