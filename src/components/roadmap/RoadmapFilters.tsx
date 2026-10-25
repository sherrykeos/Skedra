import React from 'react';
import type { SubjectId, TrackId } from '../../types/roadmap';
import { SUBJECT_METAS } from '../../data/subjectTaxonomy';
import { Search, Calendar } from 'lucide-react';

interface RoadmapFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedTrack: TrackId | 'all';
  setSelectedTrack: (t: TrackId | 'all') => void;
  selectedSubject: SubjectId | 'all';
  setSelectedSubject: (s: SubjectId | 'all') => void;
  selectedStatus: 'all' | 'in-progress' | 'completed' | 'carried-forward' | 'upcoming';
  setSelectedStatus: (st: 'all' | 'in-progress' | 'completed' | 'carried-forward' | 'upcoming') => void;
  onJumpToToday: () => void;
  todayDayNumber: number;
}

export const RoadmapFilters: React.FC<RoadmapFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTrack,
  setSelectedTrack,
  selectedSubject,
  setSelectedSubject,
  selectedStatus,
  setSelectedStatus,
  onJumpToToday,
  todayDayNumber,
}) => {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 sm:p-4 space-y-3">
      {/* Top Search Bar & Jump to Today */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#848d97] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, algorithms, theorems, subtopics..."
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#e6edf3] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff]"
          />
        </div>

        <button
          onClick={onJumpToToday}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-[#21262d] text-[#e6edf3] hover:bg-[#30363d] border border-[#30363d] text-xs font-medium transition-colors shrink-0"
        >
          <Calendar className="w-3.5 h-3.5 text-[#58a6ff]" />
          <span>Jump to Today (Day {todayDayNumber})</span>
        </button>
      </div>

      {/* Track Filter Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-[#30363d]/60 pt-2.5">
        <span className="text-[11px] font-medium text-[#848d97] mr-1">Study Track:</span>
        <button
          onClick={() => setSelectedTrack('all')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            selectedTrack === 'all'
              ? 'bg-[#1f6feb] text-white'
              : 'bg-[#0d1117] text-[#848d97] hover:text-[#e6edf3] border border-[#30363d]'
          }`}
        >
          All Tracks
        </button>
        <button
          onClick={() => setSelectedTrack('math')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            selectedTrack === 'math'
              ? 'bg-[#8957e5] text-white'
              : 'bg-[#0d1117] text-[#bc8cff] hover:text-white border border-[#8957e5]/40'
          }`}
        >
          Track A: Mathematics
        </button>
        <button
          onClick={() => setSelectedTrack('core-cs')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            selectedTrack === 'core-cs'
              ? 'bg-[#1f6feb] text-white'
              : 'bg-[#0d1117] text-[#58a6ff] hover:text-white border border-[#1f6feb]/40'
          }`}
        >
          Track B: Core CS
        </button>
        <button
          onClick={() => setSelectedTrack('aptitude')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            selectedTrack === 'aptitude'
              ? 'bg-[#f0883e] text-white'
              : 'bg-[#0d1117] text-[#ffa657] hover:text-white border border-[#f0883e]/40'
          }`}
        >
          General Aptitude (Jan)
        </button>
        <button
          onClick={() => setSelectedTrack('mock')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            selectedTrack === 'mock'
              ? 'bg-[#a371f7] text-white'
              : 'bg-[#0d1117] text-[#d2a8ff] hover:text-white border border-[#a371f7]/40'
          }`}
        >
          Full Mocks &amp; Sprint
        </button>
      </div>

      {/* Filter Row: Subject & Status */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#30363d]/60">
        {/* Status Pills */}
        <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-md p-0.5 text-xs">
          {(['all', 'in-progress', 'completed', 'carried-forward', 'upcoming'] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-[#21262d] text-[#e6edf3]'
                    : 'text-[#848d97] hover:text-[#e6edf3]'
                }`}
              >
                {status === 'all'
                  ? 'All Status'
                  : status === 'in-progress'
                  ? 'In Progress'
                  : status === 'completed'
                  ? 'Completed'
                  : status === 'carried-forward'
                  ? 'Carried Forward'
                  : 'Upcoming'}
              </button>
            )
          )}
        </div>

        {/* Subject Select Dropdown */}
        <div className="flex-1 min-w-[200px]">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as SubjectId | 'all')}
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-2.5 py-1 text-xs text-[#e6edf3] focus:outline-none focus:border-[#58a6ff]"
          >
            <option value="all">All Subjects (GATE Syllabus)</option>
            {Object.values(SUBJECT_METAS).map((meta) => (
              <option key={meta.id} value={meta.id}>
                {meta.name} ({meta.shortCode})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
