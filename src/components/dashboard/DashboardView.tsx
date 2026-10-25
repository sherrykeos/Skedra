import React from 'react';
import { StatsStrip } from './StatsStrip';
import { OverdueBanner } from './OverdueBanner';
import { WorkloadFeasibilityBanner } from './WorkloadFeasibilityBanner';
import { TodayOverview } from './TodayOverview';
import { NextMilestoneCard } from './NextMilestoneCard';
import { SubjectProgressStrip } from './SubjectProgressStrip';

interface DashboardViewProps {
  onOpenFastTrack: (subtopicId?: string) => void;
  onOpenSettings: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenFastTrack,
  onOpenSettings,
}) => {
  return (
    <div className="space-y-4">
      {/* Alert Banners */}
      <OverdueBanner />
      <WorkloadFeasibilityBanner
        onOpenFastTrack={() => onOpenFastTrack()}
        onOpenSettings={onOpenSettings}
      />

      {/* Primary Metrics Strip */}
      <StatsStrip />

      {/* Main Grid: Today's Focus & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2">
          <TodayOverview onOpenFastTrackSubtopic={onOpenFastTrack} />
        </div>

        <div className="space-y-4">
          <NextMilestoneCard />
          <SubjectProgressStrip />
        </div>
      </div>
    </div>
  );
};
