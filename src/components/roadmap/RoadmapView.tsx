import React, { useState, useMemo } from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import type { SubjectId, TrackId } from '../../types/roadmap';
import { DayCard } from './DayCard';
import { RoadmapFilters } from './RoadmapFilters';

interface RoadmapViewProps {
  onOpenFastTrackSubtopic: (subtopicId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onOpenFastTrackSubtopic }) => {
  const { days, currentDayNumber } = useRoadmap();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<TrackId | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<
    'all' | 'in-progress' | 'completed' | 'carried-forward' | 'upcoming'
  >('all');

  const filteredDays = useMemo(() => {
    return days.filter((day) => {
      // Track filter
      if (selectedTrack !== 'all') {
        const matchesTrack =
          day.track === selectedTrack ||
          day.tracks?.includes(selectedTrack) ||
          day.subtopics.some((st) => st.track === selectedTrack);
        if (!matchesTrack) {
          return false;
        }
      }

      // Subject filter
      if (selectedSubject !== 'all') {
        const matchesSubject =
          day.subjectId === selectedSubject ||
          day.subtopics.some((st) => st.subjectId === selectedSubject);
        if (!matchesSubject) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'all') {
        const isToday = day.dayNumber === currentDayNumber;
        const allTasks = day.subtopics.flatMap((st) => st.subtasks);
        const allCompleted = allTasks.length > 0 && allTasks.every((t) => t.completed);

        if (selectedStatus === 'completed' && !allCompleted && day.status !== 'completed') {
          return false;
        }
        if (selectedStatus === 'in-progress' && day.status !== 'in-progress' && !isToday) {
          return false;
        }
        if (selectedStatus === 'carried-forward' && day.status !== 'carried-forward') {
          return false;
        }
        if (selectedStatus === 'upcoming' && (allCompleted || isToday || day.status === 'completed')) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTopic = day.topic.toLowerCase().includes(query);
        const matchesSubject = day.subjectName.toLowerCase().includes(query);
        const matchesSubtopics = day.subtopics.some(
          (st) =>
            st.name.toLowerCase().includes(query) ||
            (st.description && st.description.toLowerCase().includes(query))
        );
        return matchesTopic || matchesSubject || matchesSubtopics;
      }

      return true;
    });
  }, [days, selectedTrack, selectedSubject, selectedStatus, searchQuery, currentDayNumber]);

  const handleJumpToToday = () => {
    const el = document.getElementById(`day-${currentDayNumber}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <RoadmapFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTrack={selectedTrack}
        setSelectedTrack={setSelectedTrack}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onJumpToToday={handleJumpToToday}
        todayDayNumber={currentDayNumber}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#848d97] px-1">
        <span>
          Showing {filteredDays.length} of {days.length} study days
        </span>
        <span className="hidden sm:inline">
          Chronological day-by-day roadmap (Oct 24, 2026 – Feb 7, 2027)
        </span>
      </div>

      {/* Days List */}
      {filteredDays.length === 0 ? (
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 text-center text-[#848d97]">
          No study days match your filter criteria.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDays.map((day) => (
            <DayCard
              key={day.dayNumber}
              day={day}
              isToday={day.dayNumber === currentDayNumber}
              onOpenFastTrackSubtopic={onOpenFastTrackSubtopic}
            />
          ))}
        </div>
      )}
    </div>
  );
};
