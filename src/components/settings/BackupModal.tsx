import React, { useState } from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import { X, Download, Upload, Copy, Check, AlertCircle } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const { exportBackupJSON, importBackupJSON, resetProgress } = useRoadmap();

  const [importText, setImportText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const json = exportBackupJSON();
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const json = exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gate27_roadmap_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setImportText(text);
    };
    reader.readAsText(file);
  };

  const handleApplyImport = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!importText.trim()) {
      setErrorMsg('Please paste backup JSON or select a file to import.');
      return;
    }

    const res = importBackupJSON(importText);
    if (res.success) {
      setSuccessMsg('Roadmap progress successfully restored!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setErrorMsg(res.error || 'Failed to restore backup.');
    }
  };

  const handleFactoryReset = () => {
    resetProgress();
    setShowConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#e6edf3]">
            Backup &amp; Data Persistence
          </h3>
          <button onClick={onClose} className="p-1 text-[#848d97] hover:text-[#e6edf3] rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded bg-[#f85149]/15 border border-[#f85149]/40 text-[#ff7b72] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded bg-[#238636]/15 border border-[#238636]/40 text-[#3fb950] flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Export Section */}
          <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg space-y-2.5">
            <span className="font-semibold text-[#e6edf3] block">Export Backup</span>
            <p className="text-[11px] text-[#848d97]">
              Save your complete study progress, custom schedules, mastery records, and notes to a JSON file.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] border border-[#30363d] transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#58a6ff]" />
                <span>Download .JSON</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] border border-[#30363d] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#3fb950]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg space-y-2.5">
            <span className="font-semibold text-[#e6edf3] block">Import Backup</span>
            <p className="text-[11px] text-[#848d97]">
              Restore state from a previously exported JSON backup file:
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-xs text-[#848d97] file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-medium file:bg-[#21262d] file:text-[#e6edf3] hover:file:bg-[#30363d] cursor-pointer"
            />
            <textarea
              rows={4}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Or paste JSON backup content directly here..."
              className="w-full bg-[#161b22] border border-[#30363d] rounded p-2 text-[11px] font-mono text-[#e6edf3] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff]"
            />
            <button
              onClick={handleApplyImport}
              className="w-full py-1.5 rounded bg-[#1f6feb] hover:bg-[#388bfd] text-white font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Validate &amp; Restore Progress</span>
            </button>
          </div>

          {/* Factory Reset */}
          <div className="pt-2 border-t border-[#30363d] flex items-center justify-between">
            <span className="text-[11px] text-[#848d97]">Reset to clean state</span>
            {showConfirmReset ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-2 py-1 text-[11px] text-[#848d97]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFactoryReset}
                  className="px-2.5 py-1 rounded bg-[#da3633] hover:bg-[#f85149] text-white text-[11px] font-semibold"
                >
                  Confirm Reset All
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="text-[11px] text-[#ff7b72] hover:underline"
              >
                Reset Progress Data
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
