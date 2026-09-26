import { Film, Undo2, Redo2, Play, Loader2, Download } from 'lucide-react';
import type { AppStatus, VideoMeta } from '@/types';
import { formatFileSize } from '@/utils';

interface TopBarProps {
  videoMeta: VideoMeta | null;
  status: AppStatus;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onRender: () => void;
  onReset: () => void;
}

export function TopBar({
  videoMeta,
  status,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onRender,
  onReset,
}: TopBarProps) {
  return (
    <header className="flex items-center justify-between h-14 px-4 bg-bg-surface1 border-b border-border-subtle shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
            <Film className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-text-primary text-lg tracking-tight">Subscript</span>
        </div>
        {videoMeta && (
          <>
            <div className="w-px h-6 bg-border-subtle" />
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="truncate max-w-[200px]">{videoMeta.name}</span>
              <span className="text-text-muted">·</span>
              <span className="text-text-muted">{formatFileSize(videoMeta.size)}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 rounded-lg text-text-secondary hover:bg-bg-hover hover:text-text-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-secondary transition-colors duration-150 ease-smooth"
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 rounded-lg text-text-secondary hover:bg-bg-hover hover:text-text-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-secondary transition-colors duration-150 ease-smooth"
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </button>
        {videoMeta && (
          <button
            onClick={onReset}
            className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors duration-150 ease-smooth"
          >
            New
          </button>
        )}
        <div className="w-px h-6 bg-border-subtle mx-1" />
        {status === 'rendering' ? (
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary/80 text-white text-sm font-medium cursor-wait"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Rendering...
          </button>
        ) : status === 'done' ? (
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-success text-white text-sm font-medium hover:bg-accent-success/90 transition-colors duration-150 ease-smooth">
            <Download className="w-4 h-4" />
            Download
          </button>
        ) : (
          <button
            onClick={onRender}
            disabled={!videoMeta}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 ease-smooth"
          >
            <Play className="w-4 h-4" />
            Render Video
          </button>
        )}
      </div>
    </header>
  );
}
