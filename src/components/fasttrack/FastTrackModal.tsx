import React, { useState } from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import { getDiagnosticQuestionsForSubtopic } from '../../data/diagnosticQuestions';
import type { DiagnosticQuestion } from '../../data/diagnosticQuestions';
import {
  X,
  Zap,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface FastTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSubtopicId?: string;
}

export const FastTrackModal: React.FC<FastTrackModalProps> = ({
  isOpen,
  onClose,
  initialSubtopicId,
}) => {
  const { days, settings, fastTrackTopicModal } = useRoadmap();

  // Find all familiar or eligible subtopics
  const familiarSubtopics = React.useMemo(() => {
    const list: { id: string; name: string; subjectName: string; dayNumber: number }[] = [];
    for (const d of days) {
      for (const st of d.subtopics) {
        if (!st.mastered) {
          list.push({
            id: st.id,
            name: st.name,
            subjectName: d.subjectName,
            dayNumber: d.dayNumber,
          });
        }
      }
    }
    return list;
  }, [days]);

  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string>(
    initialSubtopicId || familiarSubtopics[0]?.id || ''
  );

  const [validationMode, setValidationMode] = useState<'quiz' | 'pyq-score'>('quiz');

  // Quiz state
  const questions: DiagnosticQuestion[] = React.useMemo(() => {
    return getDiagnosticQuestionsForSubtopic(selectedSubtopicId);
  }, [selectedSubtopicId]);

  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [pyqScoreInput, setPyqScoreInput] = useState<string>('85');
  const [result, setResult] = useState<{
    tested: boolean;
    score: number;
    isMastered: boolean;
    minutesSaved: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleSelectOption = (qId: string, optIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const handleEvaluateQuiz = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctOptionIndex) {
        correct++;
      }
    });

    const scorePercent = Math.round((correct / (questions.length || 1)) * 100);
    const { isMastered, minutesSaved } = fastTrackTopicModal(selectedSubtopicId, scorePercent);

    setResult({
      tested: true,
      score: scorePercent,
      isMastered,
      minutesSaved,
    });
  };

  const handleEvaluatePyqScore = () => {
    const score = Math.min(100, Math.max(0, parseInt(pyqScoreInput, 10) || 0));
    const { isMastered, minutesSaved } = fastTrackTopicModal(selectedSubtopicId, score);

    setResult({
      tested: true,
      score,
      isMastered,
      minutesSaved,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#8957e5]/20 text-[#bc8cff]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#e6edf3]">
                Fast-Track Familiar Topic
              </h3>
              <p className="text-xs text-[#848d97]">
                Validate prior GATE preparation (Threshold: {settings.masteryThresholdPercent}%)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#848d97] hover:text-[#e6edf3] rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Subtopic Selector */}
          <div>
            <label className="text-xs font-medium text-[#848d97] block mb-1">
              Select Topic to Validate:
            </label>
            <select
              value={selectedSubtopicId}
              onChange={(e) => {
                setSelectedSubtopicId(e.target.value);
                setResult(null);
                setUserAnswers({});
              }}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-xs text-[#e6edf3] focus:outline-none focus:border-[#58a6ff]"
            >
              {familiarSubtopics.map((st) => (
                <option key={st.id} value={st.id}>
                  Day {st.dayNumber}: {st.name} ({st.subjectName})
                </option>
              ))}
            </select>
          </div>

          {/* Validation Mode Selector */}
          <div className="flex items-center bg-[#0d1117] p-1 rounded-md border border-[#30363d] text-xs">
            <button
              onClick={() => {
                setValidationMode('quiz');
                setResult(null);
              }}
              className={`flex-1 py-1.5 rounded font-medium transition-colors ${
                validationMode === 'quiz'
                  ? 'bg-[#21262d] text-[#e6edf3]'
                  : 'text-[#848d97] hover:text-[#e6edf3]'
              }`}
            >
              Diagnostic Quiz ({questions.length} Questions)
            </button>
            <button
              onClick={() => {
                setValidationMode('pyq-score');
                setResult(null);
              }}
              className={`flex-1 py-1.5 rounded font-medium transition-colors ${
                validationMode === 'pyq-score'
                  ? 'bg-[#21262d] text-[#e6edf3]'
                  : 'text-[#848d97] hover:text-[#e6edf3]'
              }`}
            >
              Self-Reported PYQ Score %
            </button>
          </div>

          {/* Result Banner if already evaluated */}
          {result && (
            <div
              className={`p-4 rounded-lg border flex items-start gap-3 ${
                result.isMastered
                  ? 'bg-[#238636]/15 border-[#238636]/40 text-[#3fb950]'
                  : 'bg-[#d29922]/15 border-[#d29922]/40 text-[#d29922]'
              }`}
            >
              {result.isMastered ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="text-sm font-bold">
                  {result.isMastered
                    ? `Mastery Validated (${result.score}%) — ${result.minutesSaved} Minutes Saved!`
                    : `Score (${result.score}%) Below ${settings.masteryThresholdPercent}% Threshold`}
                </h4>
                <p className="text-xs text-[#c9d1d9]">
                  {result.isMastered
                    ? `Beginner lectures waived. Short-notes revision and PYQs remain protected on schedule.`
                    : `Concept is not sufficiently solid. Standard study schedule and practice tasks retained.`}
                </p>
              </div>
            </div>
          )}

          {/* Mode A: Diagnostic Quiz Questions */}
          {validationMode === 'quiz' && (
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3.5 space-y-2.5"
                >
                  <p className="text-xs font-semibold text-[#e6edf3]">
                    <span className="text-[#58a6ff] mr-1">Q{idx + 1}.</span> {q.question}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[q.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left text-xs px-3 py-2 rounded-md border transition-colors flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#1f6feb]/20 border-[#1f6feb] text-[#e6edf3]'
                              : 'bg-[#161b22] border-[#30363d] text-[#848d97] hover:text-[#e6edf3]'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && <span className="text-[10px] text-[#58a6ff]">Selected</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mode B: PYQ Score Input */}
          {validationMode === 'pyq-score' && (
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 space-y-3">
              <label className="text-xs text-[#848d97] block">
                Enter your accuracy percentage from solved GATE PYQs (e.g. 80-100%):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={pyqScoreInput}
                  onChange={(e) => setPyqScoreInput(e.target.value)}
                  className="bg-[#161b22] border border-[#30363d] rounded px-3 py-1.5 text-sm font-mono text-[#e6edf3] w-28 focus:outline-none focus:border-[#58a6ff]"
                />
                <span className="text-xs text-[#848d97]">% score (Mastery required: {settings.masteryThresholdPercent}%)</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#30363d] bg-[#0d1117] flex items-center justify-between">
          <span className="text-xs text-[#848d97]">
            {validationMode === 'quiz'
              ? `${Object.keys(userAnswers).length} of ${questions.length} answered`
              : 'Direct score evaluation'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-[#848d97] hover:text-[#e6edf3]"
            >
              Close
            </button>

            <button
              onClick={validationMode === 'quiz' ? handleEvaluateQuiz : handleEvaluatePyqScore}
              className="px-4 py-1.5 rounded-md bg-[#8957e5] hover:bg-[#a371f7] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Evaluate Mastery</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
