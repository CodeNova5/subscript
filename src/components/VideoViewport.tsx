'use client';

import { useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import type { Segment, StyleSettings, VideoMeta } from '@/types';
import { formatTimeShort } from '@/utils';

interface VideoViewportProps {
  videoMeta: VideoMeta;
  segments: Segment[];
  style: StyleSettings;
  currentTime: number;
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onToggleMute: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export function VideoViewport({
  videoMeta,
  segments,
  style,
  currentTime,
  isPlaying,
  isMuted,
  onTogglePlay,
  onSeek,
  onToggleMute,
  videoRef,
}: VideoViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const activeSegment = segments.find(
    (s) => currentTime >= s.start && currentTime < s.end
  );

  const activeWord = activeSegment?.words.find(
    (w) => currentTime >= w.start && currentTime < w.end
  );

  const positionClass =
    style.position === 'top'
      ? 'top-[8%]'
      : style.position === 'center'
      ? 'top-1/2 -translate-y-1/2'
      : 'bottom-[8%]';

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        onTogglePlay();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onTogglePlay]);

  return (
    <div className="flex-1 flex flex-col bg-black min-h-0">
      <div
        ref={containerRef}
        className="relative flex-1 flex items-center justify-center overflow-hidden bg-black min-h-0"
      >
        <video
          ref={videoRef}
          src={videoMeta.url}
          className="max-w-full max-h-full object-contain"
          onTimeUpdate={(e) => onSeek(e.currentTarget.currentTime)}
          onClick={onTogglePlay}
        />

        {/* Subtitle overlay */}
        {activeSegment && (
          <div
            className={`absolute left-1/2 -translate-x-1/2 px-6 py-2 max-w-[80%] text-center pointer-events-none ${positionClass}`}
            style={{
              fontSize: `${style.fontSize}px`,
              lineHeight: 1.2,
              fontWeight: style.bold ? 700 : 400,
              textTransform: style.uppercase ? 'uppercase' : 'none',
              backgroundColor: style.showBg ? style.bgColor : 'transparent',
              borderRadius: style.showBg ? '8px' : 0,
              textShadow: style.showBg
                ? 'none'
                : '0 2px 8px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.8)',
            }}
          >
            {activeSegment.words.map((word) => (
              <span
                key={word.id}
                style={{
                  color: word.id === activeWord?.id ? style.highlightColor : style.textColor,
                  transition: 'color 100ms linear',
                }}
              >
                {word.text}
                {word.emoji ? ` ${word.emoji}` : ''}{' '}
              </span>
            ))}
          </div>
        )}

        {/* Center play button when paused */}
        {!isPlaying && (
          <button
            onClick={onTogglePlay}
            className="absolute inset-0 flex items-center justify-center group"
          >
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/20 group-hover:ring-white/40 group-hover:scale-110 transition-all duration-200 ease-smooth">
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            </div>
          </button>
        )}
      </div>

      {/* Transport controls bar */}
      <div className="h-14 bg-bg-surface1 border-t border-border-subtle flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSeek(Math.max(0, currentTime - 5))}
            className="p-2 rounded-lg text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors duration-150 ease-smooth"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={onTogglePlay}
            className="p-2.5 rounded-lg bg-brand-primary text-white hover:bg-brand-hover transition-colors duration-150 ease-smooth"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" fill="white" />
            ) : (
              <Play className="w-4 h-4" fill="white" />
            )}
          </button>
          <button
            onClick={() => onSeek(Math.min(videoMeta.duration, currentTime + 5))}
            className="p-2 rounded-lg text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors duration-150 ease-smooth"
          >
            <SkipForward className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleMute}
            className="p-2 rounded-lg text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors duration-150 ease-smooth ml-1"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        <div className="font-mono text-sm text-text-secondary">
          <span className="text-text-primary">{formatTimeShort(currentTime)}</span>
          <span className="text-text-muted"> / {formatTimeShort(videoMeta.duration)}</span>
        </div>

        <button
          onClick={handleFullscreen}
          className="p-2 rounded-lg text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors duration-150 ease-smooth"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
