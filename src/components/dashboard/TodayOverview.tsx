import React, { useState } from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import { SUBJECT_METAS } from '../../data/subjectTaxonomy';
import type { RoadmapSubtopic } from '../../types/roadmap';
import {
  CheckCircle,
  Circle,
  Clock,
  ArrowRight,
  Zap,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Play,
  Calculator,
  Cpu,
  Layers,
} from 'lucide-react';

interface TodayOverviewProps {
  onOpenFastTrackSubtopic: (subtopicId: string) => void;
}

export const TodayOverview: React.FC<TodayOverviewProps> = ({ onOpenFastTrackSubtopic }) => {
  const {
    days,
    currentDayNumber,
    toggleSubtask,
    advanceNextDay,
    stats,
    progress,
    setDayNote,
    recommendedNextTask,
  } = useRoadmap();

  const [expandedSubtopics, setExpandedSubtopics] = useState<Record<string, boolean>>({});
  const [showNoteInput, setShowNoteInput] = useState(false);

  const currentDay = days.find((d) => d.dayNumber === currentDayNumber) || days[0];
  const nextDay = days.find((d) => d.dayNumber === currentDayNumber + 1);

  if (!currentDay) {
    return (
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 text-center text-[#848d97]">
        No study tasks scheduled for today.
      </div>
    );
  }

  const subjectMeta = SUBJECT_METAS[currentDay.subjectId];
  const allTodayTasks = currentDay.subtopics.flatMap((st) => st.subtasks);
  const isTodayComplete =
    allTodayTasks.length > 0 &&
    allTodayTasks.every((t) => progress.completedSubtaskIds[t.id] || t.completed);

  const toggleExpand = (subtopicId: string) => {
    setExpandedSubtopics((prev) => ({
      ...prev,
      [subtopicId]: !prev[subtopicId],
    }));
  };

  const handleContinueNextTask = () => {
    if (recommendedNextTask) {
      toggleSubtask(recommendedNextTask.task.id, recommendedNextTask.dayNumber);
    }
  };

  // Group today's subtopics by track
  const mathSubtopics = currentDay.subtopics.filter(
    (st) => st.track === 'math' || (!st.track && currentDay.track === 'math')
  );
  const coreCsSubtopics = currentDay.subtopics.filter(
    (st) => st.track === 'core-cs' || (!st.track && currentDay.track === 'core-cs')
  );
  const otherSubtopics = currentDay.subtopics.filter(
    (st) => st.track !== 'math' && st.track !== 'core-cs'
  );

  const isParallelDay =
    currentDay.track === 'parallel' || (mathSubtopics.length > 0 && coreCsSubtopics.length > 0);

  // Subtopic Card Renderer
  const renderSubtopicCard = (subtopic: RoadmapSubtopic, accentColor: 'purple' | 'blue' | 'gray') => {
    const isSubtopicMastered =
      subtopic.mastered || !!progress.masteredSubtopics[subtopic.id];
    const isExpanded = expandedSubtopics[subtopic.id] !== false; // default open
    const allTasksDone = subtopic.subtasks.every(
      (t) => progress.completedSubtaskIds[t.id] || t.completed
    );

    const subtopicMeta = subtopic.subjectId ? SUBJECT_METAS[subtopic.subjectId] : undefined;

    return (
      <div
        key={subtopic.id}
        className={`border rounded-lg transition-colors overflow-hidden ${
          allTasksDone
            ? 'border-[#238636]/40 bg-[#238636]/5'
            : accentColor === 'purple'
            ? 'border-[#8957e5]/30 bg-[#0d1117]/80'
            : accentColor === 'blue'
            ? 'border-[#1f6feb]/30 bg-[#0d1117]/80'
            : 'border-[#30363d] bg-[#0d1117]/60'
        }`}
      >
        {/* Subtopic Header */}
        <div
          className="p-3 flex items-center justify-between cursor-pointer hover:bg-[#21262d]/40 transition-colors"
          onClick={() => toggleExpand(subtopic.id)}
        >
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="text-[#848d97] hover:text-[#e6edf3]"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(subtopic.id);
              }}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

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
                <span className="text-sm font-semibold text-[#e6edf3]">
                  {subtopic.name}
                </span>
                {isSubtopicMastered && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#8957e5]/20 text-[#bc8cff] border border-[#8957e5]/40">
                    Mastered ({progress.masteredSubtopics[subtopic.id]?.score ?? 90}%)
                  </span>
                )}
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${
                    subtopic.weightage === 'high'
                      ? 'bg-[#f85149]/10 text-[#ff7b72] border-[#f85149]/30'
                      : subtopic.weightage === 'medium'
                      ? 'bg-[#d29922]/10 text-[#e3b341] border-[#d29922]/30'
                      : 'bg-[#21262d] text-[#848d97] border-[#30363d]'
                  }`}
                >
                  {subtopic.weightage.toUpperCase()} GATE WEIGHT
                </span>
              </div>
              {subtopic.description && (
                <p className="text-xs text-[#848d97] mt-0.5">{subtopic.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSubtopicMastered && subtopic.isFamiliar && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenFastTrackSubtopic(subtopic.id);
                }}
                className="px-2 py-1 rounded text-[11px] font-medium bg-[#8957e5]/10 text-[#bc8cff] border border-[#8957e5]/30 hover:bg-[#8957e5]/20 transition-colors flex items-center gap-1"
                title="Take Diagnostic Quiz to validate mastery & save study hours"
              >
                <Zap className="w-3 h-3" />
                <span>Fast-Track</span>
              </button>
            )}

            <span className="text-xs text-[#848d97] hidden sm:inline">
              {subtopic.estimatedMinutes} min
            </span>
          </div>
        </div>

        {/* Subtasks Checklist */}
        {isExpanded && (
          <div className="px-3 pb-3 pt-1 border-t border-[#30363d]/40 space-y-2">
            {subtopic.subtasks.map((task) => {
              const isTaskCompleted =
                progress.completedSubtaskIds[task.id] || task.completed;

              return (
                <div
                  key={task.id}
                  onClick={() => toggleSubtask(task.id, currentDay.dayNumber)}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                    isTaskCompleted
                      ? 'bg-[#161b22]/50 text-[#848d97] line-through'
                      : 'bg-[#161b22] text-[#e6edf3] hover:bg-[#21262d]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isTaskCompleted ? (
                      <CheckCircle className="w-4 h-4 text-[#3fb950] shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#848d97] shrink-0 hover:text-[#58a6ff]" />
                    )}
                    <span className="text-xs font-medium">{task.title}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase ${
                        task.type === 'learn'
                          ? 'bg-[#1f6feb]/20 text-[#58a6ff]'
                          : task.type === 'revise'
                          ? 'bg-[#d29922]/20 text-[#e3b341]'
                          : task.type === 'pyq'
                          ? 'bg-[#238636]/20 text-[#3fb950]'
                          : 'bg-[#8957e5]/20 text-[#bc8cff]'
                      }`}
                    >
                      {task.type}
                    </span>
                    <span className="text-xs text-[#848d97]">{task.estimatedMinutes}m</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg divide-y divide-[#30363d]">
      {/* Header bar */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#21262d] text-[#e6edf3] border border-[#30363d]">
              Day {currentDay.dayNumber}
            </span>
            <span className="text-xs text-[#848d97]">{currentDay.date}</span>

            {/* Track Badges */}
            {isParallelDay ? (
              <>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold border flex items-center gap-1 bg-[#8957e5]/15 text-[#bc8cff] border-[#8957e5]/30">
                  <Calculator className="w-3 h-3 text-[#bc8cff]" />
                  <span>Track A: Math (90m)</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold border flex items-center gap-1 bg-[#1f6feb]/15 text-[#58a6ff] border-[#1f6feb]/30">
                  <Cpu className="w-3 h-3 text-[#58a6ff]" />
                  <span>Track B: Core CS (90m)</span>
                </span>
              </>
            ) : (
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border flex items-center gap-1 ${
                  currentDay.track === 'math'
                    ? 'bg-[#8957e5]/15 text-[#bc8cff] border-[#8957e5]/30'
                    : currentDay.track === 'core-cs'
                    ? 'bg-[#1f6feb]/15 text-[#58a6ff] border-[#1f6feb]/30'
                    : currentDay.track === 'aptitude'
                    ? 'bg-[#f0883e]/15 text-[#ffa657] border-[#f0883e]/30'
                    : 'bg-[#a371f7]/15 text-[#d2a8ff] border-[#a371f7]/30'
                }`}
              >
                <span>
                  {currentDay.track === 'aptitude'
                    ? 'General Aptitude'
                    : currentDay.track === 'mock'
                    ? 'Mocks & Grand Revision'
                    : currentDay.subjectName}
                </span>
              </span>
            )}

            {/* Subject badge if single subject */}
            {!isParallelDay && subjectMeta && (
              <span
                className="px-2 py-0.5 rounded text-xs font-medium border"
                style={{
                  backgroundColor: `${subjectMeta.color}15`,
                  borderColor: `${subjectMeta.color}40`,
                  color: subjectMeta.textColor,
                }}
              >
                {subjectMeta.name}
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-[#e6edf3] tracking-tight">
            {currentDay.topic}
          </h2>
          <p className="text-xs text-[#848d97] mt-0.5 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-[#58a6ff]">
              <Clock className="w-3.5 h-3.5" />
              Budget: {Math.round((currentDay.estimatedMinutes / 60) * 10) / 10}h (3h daily limit)
            </span>
            <span>•</span>
            <span>
              {stats.todayCompletedCount} of {stats.todayTotalCount} total tasks done ({stats.todayPercent}%)
            </span>
          </p>
        </div>

        {/* Action button: Prominent Continue Studying or Advance */}
        <div className="flex items-center gap-2">
          {isTodayComplete ? (
            <button
              onClick={advanceNextDay}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold transition-colors shadow-sm"
              title="Advance to next study day immediately"
            >
              <Sparkles className="w-4 h-4" />
              <span>Finished Early! Start Day {currentDayNumber + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleContinueNextTask}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1f6feb] hover:bg-[#388bfd] text-white text-xs font-semibold transition-colors shadow-sm"
                title={recommendedNextTask ? `Continue: ${recommendedNextTask.task.title}` : 'Continue Studying'}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Continue Next Task</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                onClick={advanceNextDay}
                className="px-2.5 py-2 rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#848d97] hover:text-[#e6edf3] text-xs font-medium border border-[#30363d] transition-colors"
                title="Advance day without waiting"
              >
                Advance Day &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Next Task Strip */}
      {recommendedNextTask && !isTodayComplete && (
        <div className="px-4 py-2.5 bg-[#0d1117] flex items-center justify-between text-xs border-b border-[#30363d]">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[10px] uppercase font-bold text-[#58a6ff] bg-[#1f6feb]/15 px-1.5 py-0.5 rounded border border-[#1f6feb]/30 shrink-0">
              Up Next
            </span>
            <span className="text-[#848d97] shrink-0 font-medium">
              [{recommendedNextTask.track.toUpperCase()}] Day {recommendedNextTask.dayNumber}:
            </span>
            <span className="text-[#e6edf3] font-medium truncate">
              {recommendedNextTask.task.title}
            </span>
          </div>
          <span className="text-[#848d97] text-[11px] shrink-0 ml-2">
            {recommendedNextTask.task.estimatedMinutes} min
          </span>
        </div>
      )}

      {/* Track Allocation & Weekly Progress Strip */}
      {isParallelDay && (
        <div className="px-4 py-3 bg-[#0d1117] border-b border-[#30363d] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Math Allocation Box */}
          <div className="bg-[#161b22] border border-[#8957e5]/30 rounded-md p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#bc8cff]" />
              <div>
                <div className="font-semibold text-[#bc8cff]">Track A: Mathematics</div>
                <div className="text-[11px] text-[#848d97]">
                  Allocated: 90 mins • {stats.todayMathDone}/{stats.todayMathTotal} tasks done ({stats.todayMathPercent}%)
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#848d97] block">Week Progress</span>
              <span className="font-bold text-[#bc8cff]">{stats.weekMathPercent}%</span>
            </div>
          </div>

          {/* Core CS Allocation Box */}
          <div className="bg-[#161b22] border border-[#1f6feb]/30 rounded-md p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#58a6ff]" />
              <div>
                <div className="font-semibold text-[#58a6ff]">Track B: Core Computer Science</div>
                <div className="text-[11px] text-[#848d97]">
                  Allocated: 90 mins • {stats.todayCoreCsDone}/{stats.todayCoreCsTotal} tasks done ({stats.todayCoreCsPercent}%)
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#848d97] block">Week Progress</span>
              <span className="font-bold text-[#58a6ff]">{stats.weekCoreCsPercent}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Today's subtopics & checklist */}
      <div className="p-4 sm:p-5 space-y-5">
        <div className="flex items-center justify-between text-xs text-[#848d97] font-medium border-b border-[#30363d]/60 pb-2">
          <span>SCHEDULED STUDY TASKS (3-HOUR COMBINED CAPACITY)</span>
          <button
            onClick={() => setShowNoteInput(!showNoteInput)}
            className="flex items-center gap-1 hover:text-[#e6edf3] transition-colors text-[11px]"
          >
            <FileText className="w-3 h-3" />
            <span>{currentDay.notes ? 'Edit Note' : 'Add Note'}</span>
          </button>
        </div>

        {/* Study Note Bar */}
        {showNoteInput && (
          <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-md space-y-2">
            <label className="text-[11px] text-[#848d97] font-medium block">
              Daily Reflection / Focus Notes for Day {currentDayNumber}:
            </label>
            <input
              type="text"
              value={currentDay.notes || ''}
              onChange={(e) => setDayNote(currentDayNumber, e.target.value)}
              placeholder="e.g. Mastered Matrix Orthogonality; solved 15 PYQs in 45 mins."
              className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-1.5 text-xs text-[#e6edf3] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff]"
            />
          </div>
        )}

        {currentDay.notes && !showNoteInput && (
          <div className="p-2.5 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#848d97]">
            <span className="font-semibold text-[#c9d1d9]">Note: </span>
            {currentDay.notes}
          </div>
        )}

        {/* SECTION 1: Track A - Mathematics */}
        {mathSubtopics.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#bc8cff] border-b border-[#8957e5]/20 pb-1.5">
              <span className="flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#bc8cff]" />
                TRACK A: MATHEMATICS (90 MINS ALLOCATED)
              </span>
              <span className="text-[11px] font-normal text-[#848d97]">
                {stats.todayMathDone} of {stats.todayMathTotal} tasks completed
              </span>
            </div>
            <div className="space-y-3">
              {mathSubtopics.map((st) => renderSubtopicCard(st, 'purple'))}
            </div>
          </div>
        )}

        {/* SECTION 2: Track B - Core Computer Science */}
        {coreCsSubtopics.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#58a6ff] border-b border-[#1f6feb]/20 pb-1.5">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#58a6ff]" />
                TRACK B: CORE COMPUTER SCIENCE (90 MINS ALLOCATED)
              </span>
              <span className="text-[11px] font-normal text-[#848d97]">
                {stats.todayCoreCsDone} of {stats.todayCoreCsTotal} tasks completed
              </span>
            </div>
            <div className="space-y-3">
              {coreCsSubtopics.map((st) => renderSubtopicCard(st, 'blue'))}
            </div>
          </div>
        )}

        {/* SECTION 3: Other Tasks (General Aptitude, Mocks, Backlog) */}
        {otherSubtopics.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#ffa657] border-b border-[#f0883e]/20 pb-1.5">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#ffa657]" />
                REVISION, MOCKS & BACKLOG SESSIONS
              </span>
            </div>
            <div className="space-y-3">
              {otherSubtopics.map((st) => renderSubtopicCard(st, 'gray'))}
            </div>
          </div>
        )}
      </div>

      {/* Up Next Preview Footer */}
      {nextDay && (
        <div className="p-3.5 bg-[#0d1117] flex items-center justify-between text-xs text-[#848d97]">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-semibold text-[#c9d1d9] shrink-0">Up Next (Day {nextDay.dayNumber}):</span>
            <span className="text-[#848d97] truncate">{nextDay.topic}</span>
          </div>
          <button
            onClick={advanceNextDay}
            className="text-[#58a6ff] hover:underline flex items-center gap-1 font-medium shrink-0 ml-2"
          >
            <span>Start Next Day</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
