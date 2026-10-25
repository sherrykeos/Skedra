import React, { useState } from 'react';
import type { StudyDay, RoadmapSubtopic } from '../../types/roadmap';
import { SUBJECT_METAS } from '../../data/subjectTaxonomy';
import { useRoadmap } from '../../context/RoadmapContext';
import {
  CheckCircle,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Zap,
  RotateCcw,
  Flag,
  FileText,
  Calculator,
  Cpu,
} from 'lucide-react';

interface DayCardProps {
  day: StudyDay;
  isToday: boolean;
  onOpenFastTrackSubtopic: (subtopicId: string) => void;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  isToday,
  onOpenFastTrackSubtopic,
}) => {
  const { toggleSubtask, progress, setDayStatus, setDayNote } = useRoadmap();
  const [isExpanded, setIsExpanded] = useState<boolean>(isToday || day.status === 'in-progress');
  const [showNoteInput, setShowNoteInput] = useState<boolean>(false);

  const allTasks = day.subtopics.flatMap((st) => st.subtasks);
  const completedTasksCount = allTasks.filter(
    (t) => progress.completedSubtaskIds[t.id] || t.completed
  ).length;
  const percent =
    allTasks.length > 0 ? Math.round((completedTasksCount / allTasks.length) * 100) : 0;

  const isCompleted = day.status === 'completed' || percent === 100;
  const isCarriedForward = day.status === 'carried-forward';

  const mathSubtopics = day.subtopics.filter(
    (st) => st.track === 'math' || (!st.track && day.track === 'math')
  );
  const coreCsSubtopics = day.subtopics.filter(
    (st) => st.track === 'core-cs' || (!st.track && day.track === 'core-cs')
  );
  const otherSubtopics = day.subtopics.filter(
    (st) => st.track !== 'math' && st.track !== 'core-cs'
  );

  const isParallelDay =
    day.track === 'parallel' || (mathSubtopics.length > 0 && coreCsSubtopics.length > 0);

  const renderSubtopic = (subtopic: RoadmapSubtopic, badgeColor: 'purple' | 'blue' | 'gray') => {
    const isMastered = subtopic.mastered || !!progress.masteredSubtopics[subtopic.id];
    const subtopicMeta = subtopic.subjectId ? SUBJECT_METAS[subtopic.subjectId] : undefined;

    return (
      <div
        key={subtopic.id}
        className={`bg-[#161b22] border rounded-md p-3 space-y-2 ${
          badgeColor === 'purple'
            ? 'border-[#8957e5]/30'
            : badgeColor === 'blue'
            ? 'border-[#1f6feb]/30'
            : 'border-[#30363d]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {subtopicMeta && (
                <span
                  className="px-1.5 py-0.2 rounded text-[10px] font-medium border"
                  style={{
                    backgroundColor: `${subtopicMeta.color}15`,
                    borderColor: `${subtopicMeta.color}40`,
                    color: subtopicMeta.textColor,
                  }}
                >
                  {subtopicMeta.shortCode}
                </span>
              )}
              <span className="text-xs font-semibold text-[#e6edf3]">
                {subtopic.name}
              </span>
              {isMastered && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#8957e5]/20 text-[#bc8cff]">
                  Mastered
                </span>
              )}
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-medium uppercase ${
                  subtopic.weightage === 'high'
                    ? 'text-[#ff7b72] bg-[#f85149]/10'
                    : 'text-[#848d97] bg-[#21262d]'
                }`}
              >
                {subtopic.weightage} weight
              </span>
            </div>
            {subtopic.description && (
              <p className="text-[11px] text-[#848d97] mt-0.5">
                {subtopic.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isMastered && subtopic.isFamiliar && (
              <button
                type="button"
                onClick={() => onOpenFastTrackSubtopic(subtopic.id)}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#8957e5]/10 text-[#bc8cff] border border-[#8957e5]/30 hover:bg-[#8957e5]/20 transition-colors flex items-center gap-1"
              >
                <Zap className="w-2.5 h-2.5" />
                <span>Fast-Track</span>
              </button>
            )}
            <span className="text-[11px] text-[#848d97]">
              {subtopic.estimatedMinutes}m
            </span>
          </div>
        </div>

        {/* Individual subtasks checkboxes */}
        <div className="space-y-1.5 pt-1">
          {subtopic.subtasks.map((task) => {
            const isDone = progress.completedSubtaskIds[task.id] || task.completed;

            return (
              <div
                key={task.id}
                onClick={() => toggleSubtask(task.id, day.dayNumber)}
                className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${
                  isDone
                    ? 'bg-[#0d1117]/60 text-[#848d97] line-through'
                    : 'bg-[#0d1117] text-[#c9d1d9] hover:bg-[#21262d]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isDone ? (
                    <CheckCircle className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-[#848d97] shrink-0 hover:text-[#58a6ff]" />
                  )}
                  <span className="text-xs">{task.title}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-1 py-0.2 rounded text-[9px] uppercase font-mono ${
                      task.type === 'learn'
                        ? 'text-[#58a6ff] bg-[#1f6feb]/10'
                        : task.type === 'revise'
                        ? 'text-[#e3b341] bg-[#d29922]/10'
                        : 'text-[#3fb950] bg-[#238636]/10'
                    }`}
                  >
                    {task.type}
                  </span>
                  <span className="text-[11px] text-[#848d97]">
                    {task.estimatedMinutes}m
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      id={`day-${day.dayNumber}`}
      className={`border rounded-lg transition-all ${
        isToday
          ? 'border-[#58a6ff] bg-[#161b22] ring-1 ring-[#58a6ff]/30 shadow-md'
          : isCompleted
          ? 'border-[#238636]/40 bg-[#161b22]/90'
          : isCarriedForward
          ? 'border-[#d29922]/50 bg-[#161b22]'
          : 'border-[#30363d] bg-[#161b22]'
      }`}
    >
      {/* Day Header Bar */}
      <div
        className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none hover:bg-[#21262d]/40 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`w-9 h-9 rounded-md flex flex-col items-center justify-center shrink-0 border text-xs font-mono font-bold ${
              isToday
                ? 'bg-[#1f6feb] text-white border-[#58a6ff]'
                : isCompleted
                ? 'bg-[#238636]/20 text-[#3fb950] border-[#238636]/40'
                : 'bg-[#21262d] text-[#848d97] border-[#30363d]'
            }`}
          >
            <span className="text-[9px] uppercase font-sans">Day</span>
            <span>{day.dayNumber}</span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#848d97]">{day.date}</span>

              {/* Parallel Track Badges */}
              {isParallelDay ? (
                <>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase border bg-[#8957e5]/15 text-[#bc8cff] border-[#8957e5]/30 flex items-center gap-1">
                    <Calculator className="w-2.5 h-2.5" />
                    Track A: Math (90m)
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase border bg-[#1f6feb]/15 text-[#58a6ff] border-[#1f6feb]/30 flex items-center gap-1">
                    <Cpu className="w-2.5 h-2.5" />
                    Track B: Core CS (90m)
                  </span>
                </>
              ) : (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase border ${
                    day.track === 'math'
                      ? 'bg-[#8957e5]/15 text-[#bc8cff] border-[#8957e5]/30'
                      : day.track === 'core-cs'
                      ? 'bg-[#1f6feb]/15 text-[#58a6ff] border-[#1f6feb]/30'
                      : day.track === 'aptitude'
                      ? 'bg-[#f0883e]/15 text-[#ffa657] border-[#f0883e]/30'
                      : 'bg-[#a371f7]/15 text-[#d2a8ff] border-[#a371f7]/30'
                  }`}
                >
                  {day.track === 'math'
                    ? 'Track A: Math'
                    : day.track === 'core-cs'
                    ? 'Track B: Core CS'
                    : day.track === 'aptitude'
                    ? 'General Aptitude'
                    : 'Mocks & Rev'}
                </span>
              )}

              {/* Status Badge */}
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                  isCompleted
                    ? 'bg-[#238636]/20 text-[#3fb950]'
                    : isToday
                    ? 'bg-[#1f6feb]/20 text-[#58a6ff]'
                    : isCarriedForward
                    ? 'bg-[#d29922]/20 text-[#e3b341]'
                    : 'bg-[#21262d] text-[#848d97]'
                }`}
              >
                {isCompleted ? 'Completed' : isToday ? 'Today' : isCarriedForward ? 'Carried Forward' : 'Upcoming'}
              </span>

              {day.isProtected && (
                <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-[#8957e5]/10 text-[#bc8cff] border border-[#8957e5]/30">
                  <Flag className="w-2.5 h-2.5" />
                  Protected Milestone
                </span>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-semibold text-[#e6edf3] mt-1">
              {day.topic}
            </h3>
          </div>
        </div>

        {/* Progress & duration */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="text-right">
            <div className="text-xs font-semibold text-[#e6edf3]">
              {completedTasksCount} / {allTasks.length} tasks ({percent}%)
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#848d97] justify-end mt-0.5">
              <Clock className="w-3 h-3 text-[#58a6ff]" />
              <span>{Math.round((day.estimatedMinutes / 60) * 10) / 10} hrs</span>
            </div>
          </div>

          <button
            type="button"
            className="p-1 text-[#848d97] hover:text-[#e6edf3]"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable subtopic content */}
      {isExpanded && (
        <div className="border-t border-[#30363d] p-3.5 sm:p-4 bg-[#0d1117]/50 space-y-4">
          {/* Reopen or Mark Complete Controls */}
          <div className="flex items-center justify-between text-xs text-[#848d97] pb-2 border-b border-[#30363d]/40">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowNoteInput(!showNoteInput)}
                className="hover:text-[#e6edf3] flex items-center gap-1"
              >
                <FileText className="w-3 h-3" />
                <span>{day.notes ? 'Edit Note' : 'Add Note'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {isCompleted ? (
                <button
                  type="button"
                  onClick={() => setDayStatus(day.dayNumber, 'in-progress')}
                  className="text-[11px] text-[#848d97] hover:text-[#e6edf3] flex items-center gap-1 transition-colors"
                  title="Reopen completed day"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reopen Day</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setDayStatus(day.dayNumber, 'completed')}
                  className="text-[11px] text-[#3fb950] hover:underline transition-colors"
                >
                  Mark All Tasks Done
                </button>
              )}
            </div>
          </div>

          {/* Day Note */}
          {showNoteInput && (
            <div className="p-2.5 bg-[#161b22] border border-[#30363d] rounded text-xs space-y-1.5">
              <input
                type="text"
                value={day.notes || ''}
                onChange={(e) => setDayNote(day.dayNumber, e.target.value)}
                placeholder="Study log or notes for this day..."
                className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2.5 py-1 text-xs text-[#e6edf3] focus:outline-none focus:border-[#58a6ff]"
              />
            </div>
          )}

          {day.notes && !showNoteInput && (
            <div className="p-2 bg-[#161b22] border border-[#30363d] rounded text-xs text-[#848d97]">
              <span className="text-[#c9d1d9] font-medium">Note: </span>
              {day.notes}
            </div>
          )}

          {/* Parallel Track Layout or Linear Subtopics */}
          {mathSubtopics.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#bc8cff]">
                <Calculator className="w-3.5 h-3.5" />
                <span>TRACK A: MATHEMATICS (90 MINS)</span>
              </div>
              <div className="space-y-2">
                {mathSubtopics.map((st) => renderSubtopic(st, 'purple'))}
              </div>
            </div>
          )}

          {coreCsSubtopics.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#58a6ff]">
                <Cpu className="w-3.5 h-3.5" />
                <span>TRACK B: CORE COMPUTER SCIENCE (90 MINS)</span>
              </div>
              <div className="space-y-2">
                {coreCsSubtopics.map((st) => renderSubtopic(st, 'blue'))}
              </div>
            </div>
          )}

          {otherSubtopics.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="space-y-2">
                {otherSubtopics.map((st) => renderSubtopic(st, 'gray'))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
