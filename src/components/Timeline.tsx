'use client';

import { useRef } from 'react';
import type { Segment, VideoMeta } from '@/types';
import { formatTimeShort } from '@/utils';

interface TimelineProps {
  segments: Segment[];
  currentTime: number;
  duration: number;
  videoMeta: VideoMeta;
  onSeek: (time: number) => void;
  onSegmentClick: (segmentId: string) => void;
  activeSegmentId: string | null;
}

export function Timeline({
  segments,
  currentTime,
  duration,
  videoMeta,
  onSeek,
  onSegmentClick,
  activeSegmentId,
}: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleTrackClick = (e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    onSeek(pct * duration);
  };

  return (
    <div className="h-20 bg-bg-surface1 border-t border-border-subtle px-4 py-2 shrink-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Timeline</span>
        <span className="text-xs text-text-muted font-mono">
          {segments.length} segments · {segments.reduce((acc, s) => acc + s.words.length, 0)} words
        </span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        className="relative h-8 bg-bg-app rounded-lg cursor-pointer group overflow-hidden"
      >
        {/* Played progress */}
        <div
          className="absolute left-0 top-0 h-full bg-brand-primary/10 rounded-lg pointer-events-none"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Segment blocks */}
        <div className="absolute inset-0 flex gap-0.5 px-0.5 py-0.5">
          {segments.map((seg) => {
            const left = (seg.start / duration) * 100;
            const width = ((seg.end - seg.start) / duration) * 100;
            const isActive = seg.id === activeSegmentId;
            return (
              <div
                key={seg.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSeek(seg.start);
                  onSegmentClick(seg.id);
                }}
                style={{ left: `${left}%`, width: `${width}%` }}
                className={`absolute top-0.5 bottom-0.5 rounded-md transition-all duration-150 ease-smooth cursor-pointer ${
                  isActive
                    ? 'bg-brand-primary ring-1 ring-brand-primary/50'
                    : 'bg-bg-hover hover:bg-border-subtle'
                }`}
              >
                <div className="px-1.5 py-0.5 text-[10px] text-text-secondary font-mono truncate">
                  {formatTimeShort(seg.start)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-brand-primary pointer-events-none z-10"
          style={{ left: `${progressPercent}%` }}
        >
          <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 rounded-full bg-brand-primary ring-2 ring-bg-surface1" />
        </div>
      </div>
    </div>
  );
}
