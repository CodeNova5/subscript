import { useState } from 'react';
import { Trash2, Bold, Highlighter, Smile, Clock } from 'lucide-react';
import type { Segment, Word } from '@/types';
import { formatTime } from '@/utils';

interface TranscriptEditorProps {
  segments: Segment[];
  currentTime: number;
  activeSegmentId: string | null;
  onUpdateWord: (segmentId: string, wordId: string, updates: Partial<Word>) => void;
  onDeleteWord: (segmentId: string, wordId: string) => void;
  onSeekToWord: (word: Word) => void;
}

export function TranscriptEditor({
  segments,
  currentTime,
  activeSegmentId,
  onUpdateWord,
  onDeleteWord,
  onSeekToWord,
}: TranscriptEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (word: Word) => {
    setEditingId(word.id);
    setEditValue(word.text);
  };

  const commitEdit = (segmentId: string, wordId: string) => {
    if (editValue.trim()) {
      onUpdateWord(segmentId, wordId, { text: editValue.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="p-4 space-y-3">
        {segments.map((segment) => {
          const isActiveSegment = segment.id === activeSegmentId;
          const activeWord = segment.words.find(
            (w) => currentTime >= w.start && currentTime < w.end
          );

          return (
            <div
              key={segment.id}
              className={`rounded-xl border p-3 transition-colors duration-150 ease-smooth ${
                isActiveSegment
                  ? 'border-brand-primary/40 bg-brand-primary/5'
                  : 'border-border-subtle bg-bg-surface2'
              }`}
            >
              {/* Segment header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs text-text-muted font-mono">
                  <Clock className="w-3 h-3" />
                  {formatTime(segment.start)} → {formatTime(segment.end)}
                </div>
                <span className="text-xs text-text-muted">
                  {segment.words.length} words
                </span>
              </div>

              {/* Words */}
              <div className="flex flex-wrap gap-1.5">
                {segment.words.map((word) => {
                  const isActiveWord = word.id === activeWord?.id;
                  const isEditing = editingId === word.id;

                  return (
                    <div
                      key={word.id}
                      className={`group relative inline-flex items-center rounded-lg border transition-all duration-150 ease-smooth ${
                        isActiveWord
                          ? 'border-brand-primary bg-brand-primary/15 scale-105'
                          : word.highlight
                          ? 'border-accent-warning/30 bg-accent-warning/5'
                          : 'border-border-subtle bg-bg-app hover:border-border-focus'
                      }`}
                    >
                      {isEditing ? (
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => commitEdit(segment.id, word.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit(segment.id, word.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          className="px-2 py-1 text-sm bg-transparent outline-none text-text-primary w-24"
                        />
                      ) : (
                        <button
                          onClick={() => onSeekToWord(word)}
                          onDoubleClick={() => startEdit(word)}
                          className="px-2 py-1 text-sm text-text-primary"
                        >
                          {word.text}
                          {word.emoji && (
                            <span className="ml-1">{word.emoji}</span>
                          )}
                        </button>
                      )}

                      {/* Word action toolbar */}
                      {!isEditing && (
                        <div className="flex items-center gap-0.5 pr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button
                            onClick={() => onUpdateWord(segment.id, word.id, { highlight: !word.highlight })}
                            className={`p-1 rounded hover:bg-bg-hover transition-colors ${
                              word.highlight ? 'text-accent-warning' : 'text-text-muted'
                            }`}
                            title="Toggle highlight"
                          >
                            <Highlighter className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onUpdateWord(segment.id, word.id, { bold: !word.bold })}
                            className={`p-1 rounded hover:bg-bg-hover transition-colors ${
                              word.bold ? 'text-brand-primary' : 'text-text-muted'
                            }`}
                            title="Toggle bold"
                          >
                            <Bold className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              const newEmoji = word.emoji ? undefined : '🔥';
                              onUpdateWord(segment.id, word.id, { emoji: newEmoji });
                            }}
                            className={`p-1 rounded hover:bg-bg-hover transition-colors ${
                              word.emoji ? 'text-accent-warning' : 'text-text-muted'
                            }`}
                            title="Toggle emoji"
                          >
                            <Smile className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDeleteWord(segment.id, word.id)}
                            className="p-1 rounded hover:bg-bg-hover text-text-muted hover:text-accent-error transition-colors"
                            title="Delete word"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
