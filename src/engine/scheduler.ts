import type { StudyDay, RoadmapSubtopic, Subtask, TrackId } from '../types/roadmap';
import type { UserSettings, SubtaskWithOrigin, MasteryRecord } from '../types/state';
import type {
  RescheduleProposal,
  ScheduleChangeItem,
  WorkloadFeasibility,
  TradeOffRecommendation,
} from '../types/scheduler';

// Helper to check if a date string is before another
export function isDateBefore(dateA: string, dateB: string): boolean {
  return new Date(dateA).getTime() < new Date(dateB).getTime();
}

// Calculate total available study minutes between two dates respecting daily study capacity (default 3 hrs)
export function calculateAvailableMinutes(
  startDateStr: string,
  endDateStr: string,
  settings: UserSettings
): { totalAvailableMinutes: number; daysCount: number } {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (start.getTime() > end.getTime()) {
    return { totalAvailableMinutes: 0, daysCount: 0 };
  }

  let totalMinutes = 0;
  let count = 0;
  const current = new Date(start);

  while (current.getTime() <= end.getTime()) {
    const dayOfWeek = current.getDay(); // 0 is Sunday, 6 is Saturday
    const isRestDay = settings.restDays.includes(dayOfWeek);

    if (!isRestDay) {
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const hours = isWeekend ? settings.weekendStudyHours : settings.dailyStudyHours;
      totalMinutes += Math.round(hours * 60);
    }

    count++;
    current.setDate(current.getDate() + 1);
  }

  return { totalAvailableMinutes: totalMinutes, daysCount: count };
}

// Calculate workload feasibility and trade-offs
export function calculateFeasibility(
  days: StudyDay[],
  settings: UserSettings,
  currentDateStr: string,
  completedTaskIds: Record<string, boolean>
): WorkloadFeasibility {
  let totalRequiredMinutes = 0;

  for (const day of days) {
    for (const subtopic of day.subtopics) {
      for (const task of subtopic.subtasks) {
        if (!completedTaskIds[task.id] && !task.completed) {
          totalRequiredMinutes += task.estimatedMinutes;
        }
      }
    }
  }

  const { totalAvailableMinutes, daysCount } = calculateAvailableMinutes(
    currentDateStr,
    settings.examDate,
    settings
  );

  const gapMinutes = totalRequiredMinutes - totalAvailableMinutes;
  const isFeasible = gapMinutes <= 0;
  const gapHoursPerDayNeeded =
    daysCount > 0 && gapMinutes > 0 ? Number((gapMinutes / 60 / daysCount).toFixed(1)) : 0;

  const recommendations: TradeOffRecommendation[] = [];

  if (!isFeasible) {
    recommendations.push({
      type: 'increase_daily_hours',
      title: `Increase Combined Daily Study by ~${gapHoursPerDayNeeded} hrs`,
      description: `Increasing daily study from ${settings.dailyStudyHours}h to ${(
        settings.dailyStudyHours + gapHoursPerDayNeeded
      ).toFixed(1)}h will eliminate the schedule deficit without dropping any topics.`,
      impactMinutes: gapMinutes,
    });

    recommendations.push({
      type: 'fast_track_diagnostics',
      title: 'Fast-Track Familiar Math Topics',
      description:
        'Validate familiar topics (Linear Algebra, Set Theory, Propositional Logic) via diagnostic quizzes to waive beginner theory and save ~15-20 hours.',
      impactMinutes: 1080,
    });

    recommendations.push({
      type: 'defer_low_weightage',
      title: 'Prioritize Core High-Yield GATE Topics & PYQs',
      description:
        'Keep Algorithms, OS, DBMS, TOC, and PYQs intact; compress or defer secondary low-weight theory subtasks.',
      impactMinutes: Math.min(gapMinutes, 720),
    });
  }

  return {
    isFeasible,
    totalRequiredMinutes,
    totalAvailableMinutes,
    gapMinutes,
    gapHoursPerDayNeeded,
    examDateProtected: true,
    mockDatesProtected: true,
    recommendations,
  };
}

// Detect unfinished tasks from previous dates (missed days or partial completion)
export function detectUnfinishedTasks(
  days: StudyDay[],
  currentDateStr: string,
  completedTaskIds: Record<string, boolean>
): SubtaskWithOrigin[] {
  const unfinished: SubtaskWithOrigin[] = [];

  for (const day of days) {
    if (day.date < currentDateStr) {
      for (const subtopic of day.subtopics) {
        for (const task of subtopic.subtasks) {
          if (!completedTaskIds[task.id] && !task.completed) {
            unfinished.push({
              ...task,
              originalDayNumber: day.dayNumber,
              originalDate: day.date,
              subjectName: subtopic.subjectName || day.subjectName,
              topicName: subtopic.topicName || day.topic,
              subtopicId: subtopic.id,
              subtopicName: subtopic.name,
              weightage: subtopic.weightage,
              track: task.track || subtopic.track || (day.track !== 'parallel' ? day.track : 'core-cs'),
            });
          }
        }
      }
    }
  }

  return unfinished;
}

// Rebalance schedule deterministically while protecting 3-hour daily capacity & parallel track balance
export function rebalanceSchedule(
  days: StudyDay[],
  currentDateStr: string,
  completedTaskIds: Record<string, boolean>,
  settings: UserSettings,
  trigger: RescheduleProposal['trigger'] = 'missed_days'
): RescheduleProposal {
  // Deep clone to ensure purity and stability
  const newDays: StudyDay[] = JSON.parse(JSON.stringify(days));
  const changes: ScheduleChangeItem[] = [];

  // Find unfinished tasks from past days
  const pastUnfinished = detectUnfinishedTasks(newDays, currentDateStr, completedTaskIds);

  // If partial completion today was triggered, include uncompleted tasks from today
  if (trigger === 'partial_completion') {
    const today = newDays.find((d) => d.date === currentDateStr);
    if (today) {
      for (const subtopic of today.subtopics) {
        for (const task of subtopic.subtasks) {
          if (!completedTaskIds[task.id] && !task.completed) {
            // Avoid duplicate entry if already present
            if (!pastUnfinished.some((t) => t.id === task.id)) {
              pastUnfinished.push({
                ...task,
                originalDayNumber: today.dayNumber,
                originalDate: today.date,
                subjectName: subtopic.subjectName || today.subjectName,
                topicName: subtopic.topicName || today.topic,
                subtopicId: subtopic.id,
                subtopicName: subtopic.name,
                weightage: subtopic.weightage,
                track: task.track || subtopic.track || (today.track !== 'parallel' ? today.track : 'core-cs'),
              });
            }
          }
        }
      }
    }
  }

  // Deterministic stable sorting:
  // 1. High weightage first
  // 2. PYQ / Revision over new lectures
  pastUnfinished.sort((a, b) => {
    const weightVal = { high: 3, medium: 2, low: 1 };
    const typeVal = { pyq: 4, revise: 3, learn: 2, mock: 5, analysis: 3 };
    const wDiff = weightVal[b.weightage] - weightVal[a.weightage];
    if (wDiff !== 0) return wDiff;
    const tDiff = typeVal[b.type] - typeVal[a.type];
    if (tDiff !== 0) return tDiff;
    return a.id.localeCompare(b.id); // Strict deterministic tie-breaker
  });

  // Interleave Track A (Math) and Track B (Core CS) so both tracks advance concurrently
  const mathTasks = pastUnfinished.filter((t) => t.track === 'math');
  const coreCsTasks = pastUnfinished.filter((t) => t.track !== 'math');

  const balancedUnfinished: SubtaskWithOrigin[] = [];
  let mIdx = 0;
  let cIdx = 0;
  while (mIdx < mathTasks.length || cIdx < coreCsTasks.length) {
    if (mIdx < mathTasks.length) balancedUnfinished.push(mathTasks[mIdx++]);
    if (cIdx < coreCsTasks.length) balancedUnfinished.push(coreCsTasks[cIdx++]);
  }

  // Upcoming non-protected days on or after currentDateStr
  const upcomingDays = newDays.filter((d) => d.date >= currentDateStr && !d.isProtected);

  let taskPointer = 0;

  for (const day of upcomingDays) {
    if (taskPointer >= balancedUnfinished.length) break;

    // Available daily study capacity (e.g. 3 hours = 180 min, with 1.15x soft buffer)
    const isWeekend = new Date(day.date).getDay() === 0 || new Date(day.date).getDay() === 6;
    const dailyLimitMins = (isWeekend ? settings.weekendStudyHours : settings.dailyStudyHours) * 60;
    const maxCapacity = Math.round(dailyLimitMins * 1.15);

    // Current planned unfinished minutes on this day
    let currentDayMins = day.subtopics.reduce(
      (acc, st) =>
        acc +
        st.subtasks
          .filter((t) => !completedTaskIds[t.id] && !t.completed)
          .reduce((sum, t) => sum + t.estimatedMinutes, 0),
      0
    );

    // Fit unfinished tasks into this day without exceeding daily capacity
    while (taskPointer < balancedUnfinished.length) {
      const taskToMove = balancedUnfinished[taskPointer];

      // Check if task already exists in this day
      const alreadyInDay = day.subtopics.some((st) =>
        st.subtasks.some((t) => t.id === taskToMove.id)
      );

      if (alreadyInDay) {
        taskPointer++;
        continue;
      }

      if (currentDayMins + taskToMove.estimatedMinutes <= maxCapacity) {
        let targetSubtopic = day.subtopics.find((st) => st.id === taskToMove.subtopicId);

        if (!targetSubtopic) {
          targetSubtopic = {
            id: `carried-${taskToMove.subtopicId}`,
            name: `${taskToMove.subtopicName} (Carried Forward)`,
            description: `Carried forward from Day ${taskToMove.originalDayNumber}`,
            estimatedMinutes: taskToMove.estimatedMinutes,
            subtasks: [taskToMove],
            weightage: taskToMove.weightage,
            track: taskToMove.track,
            subjectId: taskToMove.subjectId,
            subjectName: taskToMove.subjectName,
          };
          day.subtopics.unshift(targetSubtopic);
        } else {
          targetSubtopic.subtasks.push(taskToMove);
          targetSubtopic.estimatedMinutes += taskToMove.estimatedMinutes;
        }

        currentDayMins += taskToMove.estimatedMinutes;
        day.estimatedMinutes += taskToMove.estimatedMinutes;
        day.status = day.date === currentDateStr ? 'in-progress' : 'carried-forward';

        changes.push({
          type: 'carried_forward',
          taskId: taskToMove.id,
          taskTitle: taskToMove.title,
          subtopicName: taskToMove.subtopicName,
          subjectName: taskToMove.subjectName,
          fromDay: taskToMove.originalDayNumber,
          fromDate: taskToMove.originalDate,
          toDay: day.dayNumber,
          toDate: day.date,
          reason: `Rebalanced from Day ${taskToMove.originalDayNumber} to protect 3-hour capacity and track progress`,
          minutesSavedOrShifted: taskToMove.estimatedMinutes,
          weightage: taskToMove.weightage,
        });

        taskPointer++;
      } else {
        // Daily capacity reached; advance to next day
        break;
      }
    }
  }

  // Any remaining tasks that could not fit within capacity
  while (taskPointer < pastUnfinished.length) {
    const unplaced = pastUnfinished[taskPointer];
    changes.push({
      type: 'deferred',
      taskId: unplaced.id,
      taskTitle: unplaced.title,
      subtopicName: unplaced.subtopicName,
      subjectName: unplaced.subjectName,
      fromDay: unplaced.originalDayNumber,
      fromDate: unplaced.originalDate,
      reason:
        unplaced.weightage === 'low'
          ? 'Deferred low-weightage theory to preserve 3-hour study limit and protect mock milestones'
          : 'Queued in priority carry-forward backlog due to tight daily capacity',
      minutesSavedOrShifted: unplaced.estimatedMinutes,
      weightage: unplaced.weightage,
    });
    taskPointer++;
  }

  const feasibility = calculateFeasibility(newDays, settings, currentDateStr, completedTaskIds);

  const summary =
    changes.length === 0
      ? 'All study tasks are on track with zero missed deadlines.'
      : `Rebalanced ${changes.length} tasks across upcoming days within your ${settings.dailyStudyHours}h daily limit. Exam deadline (Feb 7, 2027) remains strictly protected.`;

  return {
    id: `prop-${Date.now()}`,
    createdAt: new Date().toISOString(),
    trigger,
    summary,
    changes,
    proposedDays: newDays,
    feasibility,
    applied: false,
  };
}

// Fast-track topic mastery reduction
export function fastTrackSubtopic(
  days: StudyDay[],
  subtopicId: string,
  score: number,
  threshold: number,
  currentDateStr: string,
  settings: UserSettings
): {
  proposal: RescheduleProposal;
  masteryRecord: MasteryRecord;
  isMastered: boolean;
} {
  const newDays: StudyDay[] = JSON.parse(JSON.stringify(days));
  const isMastered = score >= threshold;
  let subtopicName = '';
  let minutesSaved = 0;
  const changes: ScheduleChangeItem[] = [];

  for (const day of newDays) {
    const subtopic = day.subtopics.find((st) => st.id === subtopicId);
    if (subtopic) {
      subtopicName = subtopic.name;
      subtopic.mastered = isMastered;
      subtopic.masteryScore = score;
      subtopic.masteredAt = new Date().toISOString();

      if (isMastered) {
        // Waive beginner learn task; keep formula revision and PYQs protected
        for (const task of subtopic.subtasks) {
          if (task.type === 'learn') {
            minutesSaved += task.estimatedMinutes;
            task.completed = true;
            task.completedAt = new Date().toISOString();
          }
        }

        subtopic.estimatedMinutes = Math.max(
          0,
          subtopic.subtasks.reduce(
            (sum, t) => sum + (t.type === 'learn' ? 0 : t.estimatedMinutes),
            0
          )
        );

        day.estimatedMinutes = day.subtopics.reduce((sum, st) => sum + st.estimatedMinutes, 0);

        changes.push({
          type: 'time_reduced',
          taskTitle: `Fast-Track Mastered: ${subtopic.name}`,
          subtopicName: subtopic.name,
          subjectName: day.subjectName,
          fromDay: day.dayNumber,
          fromDate: day.date,
          toDay: day.dayNumber,
          toDate: day.date,
          reason: `Scored ${score}% in diagnostic assessment (threshold ${threshold}%). Beginner lectures waived; saved ${minutesSaved} mins.`,
          minutesSavedOrShifted: minutesSaved,
          weightage: subtopic.weightage,
        });
      }
    }
  }

  const masteryRecord: MasteryRecord = {
    subtopicId,
    subtopicName,
    score,
    date: new Date().toISOString(),
    reducedMinutes: minutesSaved,
  };

  const feasibility = calculateFeasibility(newDays, settings, currentDateStr, {});

  const proposal: RescheduleProposal = {
    id: `prop-fasttrack-${Date.now()}`,
    createdAt: new Date().toISOString(),
    trigger: 'topic_mastered',
    summary: isMastered
      ? `Topic "${subtopicName}" validated as mastered with ${score}%. Saved ${minutesSaved} minutes of lecture time.`
      : `Diagnostic score for "${subtopicName}" was ${score}% (below ${threshold}% threshold). Standard study schedule retained.`,
    changes,
    proposedDays: newDays,
    feasibility,
    applied: false,
  };

  return { proposal, masteryRecord, isMastered };
}

// Advance early to next study day
export function advanceToNextStudyDay(
  days: StudyDay[],
  currentDayNumber: number
): {
  updatedDays: StudyDay[];
  nextDayNumber: number;
} {
  const newDays: StudyDay[] = JSON.parse(JSON.stringify(days));
  const currentDay = newDays.find((d) => d.dayNumber === currentDayNumber);
  const nextDay = newDays.find((d) => d.dayNumber === currentDayNumber + 1);

  if (currentDay) {
    currentDay.status = 'completed';
  }
  if (nextDay) {
    nextDay.status = 'in-progress';
  }

  return {
    updatedDays: newDays,
    nextDayNumber: nextDay ? nextDay.dayNumber : currentDayNumber,
  };
}

// Recommend next unfinished task based on track balance and priority
export function getRecommendedNextTask(
  days: StudyDay[],
  currentDayNumber: number,
  completedTaskIds: Record<string, boolean>,
  preferredTrack?: TrackId
): {
  task: Subtask;
  dayNumber: number;
  subjectName: string;
  topicName: string;
  track: TrackId;
} | null {
  const currentDay = days.find((d) => d.dayNumber === currentDayNumber);

  const resolveTrack = (t: Subtask, st: RoadmapSubtopic, d: StudyDay): TrackId => {
    return t.track || st.track || (d.track !== 'parallel' ? d.track : 'core-cs');
  };

  // 1. If preferredTrack is specified, first check today for that track
  if (preferredTrack && currentDay) {
    for (const st of currentDay.subtopics) {
      if (st.track === preferredTrack) {
        for (const t of st.subtasks) {
          if (!completedTaskIds[t.id] && !t.completed) {
            return {
              task: t,
              dayNumber: currentDay.dayNumber,
              subjectName: st.subjectName || currentDay.subjectName,
              topicName: st.topicName || currentDay.topic,
              track: preferredTrack,
            };
          }
        }
      }
    }
  }

  // 2. Check current study day for any unfinished tasks across tracks
  if (currentDay) {
    for (const st of currentDay.subtopics) {
      for (const t of st.subtasks) {
        if (!completedTaskIds[t.id] && !t.completed) {
          return {
            task: t,
            dayNumber: currentDay.dayNumber,
            subjectName: st.subjectName || currentDay.subjectName,
            topicName: st.topicName || currentDay.topic,
            track: resolveTrack(t, st, currentDay),
          };
        }
      }
    }
  }

  // 3. If today is complete or preferred track is done for today, check upcoming days
  for (const day of days) {
    if (day.dayNumber > currentDayNumber) {
      for (const st of day.subtopics) {
        if (!preferredTrack || st.track === preferredTrack) {
          for (const t of st.subtasks) {
            if (!completedTaskIds[t.id] && !t.completed) {
              return {
                task: t,
                dayNumber: day.dayNumber,
                subjectName: st.subjectName || day.subjectName,
                topicName: st.topicName || day.topic,
                track: resolveTrack(t, st, day),
              };
            }
          }
        }
      }
    }
  }

  return null;
}
