import React from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import { SUBJECT_METAS } from '../../data/subjectTaxonomy';
import type { SubjectId } from '../../types/roadmap';

export const SubjectProgressStrip: React.FC = () => {
  const { days, progress } = useRoadmap();

  // Compute subtask completion per subject
  const subjectProgress = React.useMemo(() => {
    const map: Record<SubjectId, { total: number; done: number }> = {
      'eng-math': { total: 0, done: 0 },
      'discrete-math': { total: 0, done: 0 },
      'digital-logic': { total: 0, done: 0 },
      'prog-ds': { total: 0, done: 0 },
      'algorithms': { total: 0, done: 0 },
      'toc': { total: 0, done: 0 },
      'compiler': { total: 0, done: 0 },
      'os': { total: 0, done: 0 },
      'dbms': { total: 0, done: 0 },
      'coa': { total: 0, done: 0 },
      'networks': { total: 0, done: 0 },
      'aptitude': { total: 0, done: 0 },
      'full-mock': { total: 0, done: 0 },
    };

    for (const d of days) {
      for (const st of d.subtopics) {
        for (const t of st.subtasks) {
          if (map[d.subjectId]) {
            map[d.subjectId].total++;
            if (progress.completedSubtaskIds[t.id] || t.completed) {
              map[d.subjectId].done++;
            }
          }
        }
      }
    }

    return map;
  }, [days, progress]);

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between text-xs text-[#848d97]">
        <span className="font-semibold text-[#e6edf3]">Subject Completion Breakdown</span>
        <span>GATE Weightage Indexed</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {(Object.keys(SUBJECT_METAS) as SubjectId[]).map((subjId) => {
          const meta = SUBJECT_METAS[subjId];
          const data = subjectProgress[subjId] || { total: 0, done: 0 };
          const percent = data.total > 0 ? Math.round((data.done / data.total) * 100) : 0;

          return (
            <div
              key={subjId}
              className="bg-[#0d1117] border border-[#30363d] rounded p-2.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#e6edf3] truncate" title={meta.name}>
                  {meta.shortCode}
                </span>
                <span className="text-[10px] text-[#848d97]">
                  {meta.gateWeightagePercent}% wt
                </span>
              </div>

              <div className="mt-2 flex items-baseline justify-between text-xs">
                <span className="font-bold text-[#c9d1d9]">{percent}%</span>
                <span className="text-[10px] text-[#848d97]">
                  {data.done}/{data.total}
                </span>
              </div>

              <div className="w-full bg-[#21262d] h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: meta.color || '#388bfd',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
