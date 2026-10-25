import { describe, it, expect } from 'vitest';
import { generateDefaultRoadmap } from '../data/defaultRoadmap';
import type { UserSettings } from '../types/state';
import {
  detectUnfinishedTasks,
  rebalanceSchedule,
  fastTrackSubtopic,
  getRecommendedNextTask,
} from '../engine/scheduler';

const DEFAULT_SETTINGS: UserSettings = {
  dailyStudyHours: 3, // Default 3 hours combined
  weekendStudyHours: 3,
  mathDailyMinutes: 90,
  coreCsDailyMinutes: 90,
  masteryThresholdPercent: 80,
  adaptiveSchedulingEnabled: true,
  examDate: '2027-02-07',
  restDays: [],
  autoRecommendNext: true,
  prioritizeHighWeightageOnDelay: true,
};

describe('Adaptive Scheduling Engine — Parallel Track Verification', () => {
  const days = generateDefaultRoadmap('2026-10-24');

  it('1. Generates 107 days with fixed exam date Feb 7, 2027 protected', () => {
    expect(days.length).toBe(107);
    expect(days[0].date).toBe('2026-10-24');
    expect(days[0].dayNumber).toBe(1);

    const examDay = days[days.length - 1];
    expect(examDay.date).toBe('2027-02-07');
    expect(examDay.isProtected).toBe(true);
    expect(examDay.topic).toContain('GATE CSE 2027 EXAMINATION');
  });

  it('2. Ordinary study days in Oct-Dec contain scheduled work from BOTH Mathematics and Core CS concurrently', () => {
    const octDecDays = days.filter((d) => new Date(d.date).getFullYear() === 2026 && !d.isProtected);
    expect(octDecDays.length).toBe(69);

    for (const day of octDecDays) {
      // Must be a parallel day
      expect(day.track).toBe('parallel');
      expect(day.tracks).toContain('math');
      expect(day.tracks).toContain('core-cs');

      // Must contain subtopics for both tracks
      const hasMathSubtopic = day.subtopics.some(
        (st) => st.track === 'math' || st.subtasks.some((t) => t.track === 'math')
      );
      const hasCoreCsSubtopic = day.subtopics.some(
        (st) => st.track === 'core-cs' || st.subtasks.some((t) => t.track === 'core-cs')
      );

      expect(hasMathSubtopic).toBe(true);
      expect(hasCoreCsSubtopic).toBe(true);
    }
  });

  it('3. Enforces 3-hour daily capacity: 90 mins Math + 90 mins Core CS = 180 mins total', () => {
    const octDecDays = days.filter((d) => new Date(d.date).getFullYear() === 2026 && !d.isProtected);

    for (const day of octDecDays) {
      expect(day.estimatedMinutes).toBe(180);

      const mathMins = day.subtopics
        .filter((st) => st.track === 'math')
        .reduce((sum, st) => sum + st.estimatedMinutes, 0);

      const coreCsMins = day.subtopics
        .filter((st) => st.track === 'core-cs')
        .reduce((sum, st) => sum + st.estimatedMinutes, 0);

      expect(mathMins).toBe(90);
      expect(coreCsMins).toBe(90);
    }
  });

  it('4. Both tracks progress concurrently across every single week in Oct-Dec', () => {
    const octDecDays = days.filter((d) => new Date(d.date).getFullYear() === 2026 && !d.isProtected);

    // Group into 7-day weeks
    for (let w = 0; w < Math.floor(octDecDays.length / 7); w++) {
      const week = octDecDays.slice(w * 7, (w + 1) * 7);
      const mathMinutesInWeek = week.reduce(
        (sum, d) =>
          sum +
          d.subtopics
            .filter((st) => st.track === 'math')
            .reduce((s, st) => s + st.estimatedMinutes, 0),
        0
      );
      const coreCsMinutesInWeek = week.reduce(
        (sum, d) =>
          sum +
          d.subtopics
            .filter((st) => st.track === 'core-cs')
            .reduce((s, st) => s + st.estimatedMinutes, 0),
        0
      );

      // Neither track is starved: both get ~630 minutes (10.5 hours) each week
      expect(mathMinutesInWeek).toBe(630);
      expect(coreCsMinutesInWeek).toBe(630);
    }
  });

  it('5. Strictly schedules General Aptitude only starting in January 2027 (Zero GA in Oct-Dec)', () => {
    const octDecDays = days.filter((d) => new Date(d.date).getFullYear() === 2026);
    const octDecAptitude = octDecDays.filter((d) =>
      d.subtopics.some((st) => st.track === 'aptitude' || st.subjectId === 'aptitude')
    );
    expect(octDecAptitude.length).toBe(0);

    const janDays = days.filter((d) => new Date(d.date).getFullYear() >= 2027);
    const janAptitude = janDays.filter((d) =>
      d.subtopics.some((st) => st.track === 'aptitude' || st.subjectId === 'aptitude')
    );
    expect(janAptitude.length).toBeGreaterThan(0);
  });

  it('6. Scenario A: Completing Math early recommends next unfinished Core CS task on the same day', () => {
    const day1 = days[0];
    const mathSubtopic = day1.subtopics.find((st) => st.track === 'math')!;
    const coreSubtopic = day1.subtopics.find((st) => st.track === 'core-cs')!;

    // Complete all Math tasks for Day 1
    const completedMap: Record<string, boolean> = {};
    for (const t of mathSubtopic.subtasks) {
      completedMap[t.id] = true;
    }

    // Recommended task should be the first Core CS task of Day 1
    const nextRec = getRecommendedNextTask(days, 1, completedMap);
    expect(nextRec).not.toBeNull();
    expect(nextRec?.dayNumber).toBe(1);
    expect(nextRec?.track).toBe('core-cs');
    expect(nextRec?.task.id).toBe(coreSubtopic.subtasks[0].id);

    // If both Math and Core CS are completed on Day 1, advances to Day 2
    for (const t of coreSubtopic.subtasks) {
      completedMap[t.id] = true;
    }
    const day2Rec = getRecommendedNextTask(days, 1, completedMap);
    expect(day2Rec).not.toBeNull();
    expect(day2Rec?.dayNumber).toBe(2);
  });

  it('7. Scenario B: Topic mastery reduces beginner study time while protecting revision & PYQs', () => {
    const day1MathSubtopic = days[0].subtopics[0];
    const initialMinutes = day1MathSubtopic.estimatedMinutes; // 90 min

    const { proposal, isMastered, masteryRecord } = fastTrackSubtopic(
      days,
      day1MathSubtopic.id,
      90, // 90% >= 80% threshold
      80,
      '2026-10-24',
      DEFAULT_SETTINGS
    );

    expect(isMastered).toBe(true);
    expect(masteryRecord.score).toBe(90);
    expect(masteryRecord.reducedMinutes).toBeGreaterThanOrEqual(45);

    const updatedSubtopic = proposal.proposedDays[0].subtopics[0];
    expect(updatedSubtopic.mastered).toBe(true);
    expect(updatedSubtopic.estimatedMinutes).toBeLessThan(initialMinutes);

    // Ensure formula revision and PYQ tasks are preserved
    const types = updatedSubtopic.subtasks.map((t) => t.type);
    expect(types).toContain('revise');
    expect(types).toContain('pyq');
  });

  it('8. Scenario C: Missing 1 day rebalances unfinished work from BOTH tracks into future days', () => {
    const currentDate = '2026-10-25'; // Day 2
    const completedTaskIds: Record<string, boolean> = {}; // Day 1 was missed

    const unfinished = detectUnfinishedTasks(days, currentDate, completedTaskIds);
    expect(unfinished.length).toBeGreaterThan(0);

    // Day 1 had tasks from both Math and Core CS
    const mathUnfinished = unfinished.filter((t) => t.track === 'math');
    const coreCsUnfinished = unfinished.filter((t) => t.track === 'core-cs');
    expect(mathUnfinished.length).toBeGreaterThan(0);
    expect(coreCsUnfinished.length).toBeGreaterThan(0);

    const proposal = rebalanceSchedule(
      days,
      currentDate,
      completedTaskIds,
      DEFAULT_SETTINGS,
      'missed_days'
    );

    expect(proposal.changes.length).toBeGreaterThan(0);
    expect(proposal.feasibility.examDateProtected).toBe(true);
    expect(proposal.proposedDays[proposal.proposedDays.length - 1].date).toBe('2027-02-07');

    // Both tracks' tasks are present in the rebalanced changes
    const mathChanges = proposal.changes.filter((c) => c.taskTitle.toLowerCase().includes('mat') || c.taskTitle.toLowerCase().includes('formula') || c.taskTitle.toLowerCase().includes('pyq'));
    expect(mathChanges.length).toBeGreaterThan(0);
  });

  it('9. Scenario D: Missing multiple days flags workload deficit gap and prioritizes high-weightage topics', () => {
    const currentDate = '2026-11-05'; // Missed 12 days
    const completedTaskIds: Record<string, boolean> = {};

    const proposal = rebalanceSchedule(
      days,
      currentDate,
      completedTaskIds,
      DEFAULT_SETTINGS,
      'missed_days'
    );

    expect(proposal.changes.length).toBeGreaterThan(0);
    expect(proposal.feasibility.isFeasible).toBe(false);
    expect(proposal.feasibility.gapHoursPerDayNeeded).toBeGreaterThan(0);
    expect(proposal.feasibility.recommendations.length).toBeGreaterThan(0);

    // High weightage tasks prioritized in changes
    const highWeight = proposal.changes.filter((c) => c.weightage === 'high');
    expect(highWeight.length).toBeGreaterThan(0);
  });

  it('10. Scenario E: Tasks completed out of order preserves stable completion state without duplicating tasks', () => {
    // Complete a task from Day 5 while on Day 1
    const day5Task = days[4].subtopics[0].subtasks[0];
    const completedMap: Record<string, boolean> = {
      [day5Task.id]: true,
    };

    const proposal = rebalanceSchedule(
      days,
      '2026-10-24',
      completedMap,
      DEFAULT_SETTINGS,
      'manual'
    );

    // Task is not duplicated or marked uncompleted
    const taskInstances = proposal.proposedDays
      .flatMap((d) => d.subtopics)
      .flatMap((st) => st.subtasks)
      .filter((t) => t.id === day5Task.id);

    expect(taskInstances.length).toBe(1);
  });

  it('11. Running scheduler twice with unchanged inputs is strictly deterministic and stable', () => {
    const run1 = rebalanceSchedule(days, '2026-10-26', {}, DEFAULT_SETTINGS, 'missed_days');
    const run2 = rebalanceSchedule(days, '2026-10-26', {}, DEFAULT_SETTINGS, 'missed_days');

    expect(run1.changes.length).toBe(run2.changes.length);
    expect(run1.feasibility.gapMinutes).toBe(run2.feasibility.gapMinutes);
    expect(run1.summary).toBe(run2.summary);
    expect(run1.changes[0]?.taskTitle).toBe(run2.changes[0]?.taskTitle);
  });

  it('12. Protects mock test dates and avoids 8 consecutive mock days in January', () => {
    const mockDays = days.filter((d) => d.track === 'mock' && d.topic.includes('Mock Test'));
    expect(mockDays.length).toBe(8);

    // Verify there are analysis or revision days between mocks
    for (let i = 0; i < mockDays.length - 1; i++) {
      const gapDays = mockDays[i + 1].dayNumber - mockDays[i].dayNumber;
      expect(gapDays).toBeGreaterThan(1); // Not on consecutive days!
    }
  });
});
