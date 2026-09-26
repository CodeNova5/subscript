import { useState } from 'react';
import { Download, FileVideo, FileText, FileJson, Settings2 } from 'lucide-react';
import type { AppStatus, RenderProgress, VideoMeta } from '@/types';

interface ExportPanelProps {
  status: AppStatus;
  progress: RenderProgress | null;
  videoMeta: VideoMeta | null;
}

export function ExportPanel({ status, progress, videoMeta }: ExportPanelProps) {
  const [format, setFormat] = useState<'mp4' | 'srt' | 'json'>('mp4');
  const [resolution, setResolution] = useState<'720p' | '1080p' | 'original'>('original');
  const [burnIn, setBurnIn] = useState(true);

  const formats = [
    { id: 'mp4' as const, label: 'MP4 Video', icon: FileVideo, desc: 'Burned-in subtitles' },
    { id: 'srt' as const, label: 'SRT File', icon: FileText, desc: 'Subtitle file only' },
    { id: 'json' as const, label: 'JSON Data', icon: FileJson, desc: 'Word-level data' },
  ];

  const resolutions = [
    { id: '720p' as const, label: '720p' },
    { id: '1080p' as const, label: '1080p' },
    { id: 'original' as const, label: 'Original' },
  ];

  const isRendering = status === 'rendering';
  const isDone = status === 'done';
  const progressPct =
    progress && progress.totalFrames > 0
      ? Math.round((progress.frame / progress.totalFrames) * 100)
      : 0;

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="p-4 space-y-6">
        {/* Format selection */}
        <section>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Export Format
          </h3>
          <div className="space-y-2">
            {formats.map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 ease-smooth text-left ${
                  format === f.id
                    ? 'border-brand-primary bg-brand-primary/10'
                    : 'border-border-subtle bg-bg-surface2 hover:border-border-focus'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    format === f.id ? 'bg-brand-primary/20' : 'bg-bg-app'
                  }`}
                >
                  <f.icon className={`w-5 h-5 ${format === f.id ? 'text-brand-primary' : 'text-text-secondary'}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{f.label}</p>
                  <p className="text-xs text-text-muted">{f.desc}</p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-colors ${
                    format === f.id ? 'border-brand-primary bg-brand-primary' : 'border-border-subtle'
                  }`}
                />
              </button>
            ))}
          </div>
        </section>

        {/* Video options */}
        {format === 'mp4' && (
          <section className="space-y-4 animate-[fadeIn_200ms_ease-smooth]">
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                Resolution
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {resolutions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setResolution(r.id)}
                    className={`py-2.5 rounded-lg border text-sm font-medium transition-all duration-150 ease-smooth ${
                      resolution === r.id
                        ? 'border-brand-primary bg-brand-primary/10 text-text-primary'
                        : 'border-border-subtle bg-bg-surface2 text-text-secondary hover:border-border-focus'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-text-secondary">Burn in subtitles</span>
              <button
                onClick={() => setBurnIn(!burnIn)}
                className={`w-9 h-5 rounded-full transition-colors duration-200 ease-smooth relative ${
                  burnIn ? 'bg-brand-primary' : 'bg-bg-hover'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-smooth ${
                    burnIn ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </section>
        )}

        {/* Render progress */}
        {isRendering && (
          <section className="rounded-xl border border-border-subtle bg-bg-surface2 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-text-primary">{progress?.stage || 'Preparing...'}</span>
              <span className="text-sm font-mono text-text-secondary">{progressPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-bg-app overflow-hidden">
              <div
                className="h-full bg-brand-primary rounded-full transition-all duration-300 ease-smooth"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-text-muted mt-2 font-mono">
              Frame {progress?.frame || 0} / {progress?.totalFrames || 0}
            </p>
          </section>
        )}

        {/* Done state */}
        {isDone && (
          <section className="rounded-xl border border-accent-success/30 bg-accent-success/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-accent-success flex items-center justify-center">
                <Download className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-text-primary">Export complete</span>
            </div>
            <p className="text-xs text-text-secondary">
              Your {format.toUpperCase()} file is ready to download.
            </p>
            <button className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent-success text-white text-sm font-medium hover:bg-accent-success/90 transition-colors duration-150 ease-smooth">
              <Download className="w-4 h-4" />
              Download File
            </button>
          </section>
        )}

        {/* Summary */}
        <section>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Settings2 className="w-3 h-3" />
            Summary
          </h3>
          <div className="rounded-xl border border-border-subtle bg-bg-surface2 p-3 space-y-2 text-sm">
            <SummaryRow label="Format" value={format.toUpperCase()} />
            <SummaryRow label="Resolution" value={resolution === 'original' ? 'Original' : resolution} />
            {videoMeta && <SummaryRow label="Duration" value={`${Math.round(videoMeta.duration)}s`} />}
            <SummaryRow label="Subtitles" value={burnIn ? 'Burned in' : 'Sidecar'} />
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-muted">{label}</span>
      <span className="text-text-primary font-medium">{value}</span>
    </div>
  );
}
