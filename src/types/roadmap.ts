export type SubjectId =
  | 'eng-math'
  | 'discrete-math'
  | 'digital-logic'
  | 'prog-ds'
  | 'algorithms'
  | 'toc'
  | 'compiler'
  | 'os'
  | 'dbms'
  | 'coa'
  | 'networks'
  | 'aptitude'
  | 'full-mock';

export type TrackId = 'math' | 'core-cs' | 'aptitude' | 'mock' | 'parallel';

export type Priority = 'high' | 'medium' | 'low';

export type TaskType = 'learn' | 'revise' | 'pyq' | 'mock' | 'analysis';

export type DayStatus = 'upcoming' | 'in-progress' | 'completed' | 'carried-forward' | 'missed';

export interface Subtask {
  id: string;
  title: string;
  type: TaskType;
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
  track?: TrackId;
  subjectId?: SubjectId;
  subjectName?: string;
}

export interface RoadmapSubtopic {
  id: string;
  name: string;
  description?: string;
  estimatedMinutes: number;
  subtasks: Subtask[];
  mastered?: boolean;
  masteryScore?: number; // 0-100
  masteredAt?: string;
  isFamiliar?: boolean; // Can be fast-tracked
  weightage: Priority; // GATE exam weightage
  track?: TrackId; // 'math' | 'core-cs' | 'aptitude' | 'mock'
  subjectId?: SubjectId;
  subjectName?: string;
  topicName?: string;
}

export interface StudyDay {
  dayNumber: number; // Day 1, Day 2, etc.
  date: string; // YYYY-MM-DD
  track: TrackId; // 'math' | 'core-cs' | 'aptitude' | 'mock' | 'parallel'
  tracks?: TrackId[]; // e.g. ['math', 'core-cs'] for concurrent days
  subjectId: SubjectId;
  subjectName: string;
  topic: string;
  subtopics: RoadmapSubtopic[];
  estimatedMinutes: number;
  status: DayStatus;
  notes?: string;
  isProtected?: boolean; // e.g. Mock test day or exam day cannot be silently overwritten
  isMilestone?: boolean;
  milestoneTitle?: string;
  phase: string;
  originalDate?: string; // If rescheduled
  rescheduledReason?: string;
}

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  shortCode: string;
  track: TrackId;
  color: string;
  textColor: string;
  gateWeightagePercent: number; // Typical GATE CSE marks
  isCore: boolean;
}
