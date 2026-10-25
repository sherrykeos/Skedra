import React, { useState } from 'react';
import { RoadmapProvider } from './context/RoadmapContext';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { FastTrackModal } from './components/fasttrack/FastTrackModal';
import { RescheduleModal } from './components/reschedule/RescheduleModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { BackupModal } from './components/settings/BackupModal';

const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'roadmap'>('dashboard');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);
  const [fastTrackOpen, setFastTrackOpen] = useState(false);
  const [fastTrackSubtopicId, setFastTrackSubtopicId] = useState<string | undefined>(undefined);

  const handleOpenFastTrack = (subtopicId?: string) => {
    setFastTrackSubtopicId(subtopicId);
    setFastTrackOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenBackup={() => setBackupOpen(true)}
        onOpenFastTrack={() => handleOpenFastTrack()}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeView === 'dashboard' ? (
          <DashboardView
            onOpenFastTrack={handleOpenFastTrack}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        ) : (
          <RoadmapView onOpenFastTrackSubtopic={handleOpenFastTrack} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363d] py-3 px-4 text-center text-xs text-[#848d97]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GATE CSE 2027 Adaptive Study Engine • Oct 24, 2026 – Feb 7, 2027</span>
          <span className="font-mono text-[11px] text-[#6e7681]">
            Deterministic Priority Rebalancer • Offline LocalStorage
          </span>
        </div>
      </footer>

      {/* Modals */}
      <FastTrackModal
        isOpen={fastTrackOpen}
        onClose={() => {
          setFastTrackOpen(false);
          setFastTrackSubtopicId(undefined);
        }}
        initialSubtopicId={fastTrackSubtopicId}
      />
      <RescheduleModal />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <BackupModal isOpen={backupOpen} onClose={() => setBackupOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <RoadmapProvider>
      <AppContent />
    </RoadmapProvider>
  );
}
