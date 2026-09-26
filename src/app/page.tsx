'use client';

import { useCallback, useRef, useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { UploadDropzone } from '@/components/UploadDropzone';
import { VideoViewport } from '@/components/VideoViewport';
import { Timeline } from '@/components/Timeline';
import { TranscriptEditor } from '@/components/TranscriptEditor';
import { StylePanel } from '@/components/StylePanel';
import { ExportPanel } from '@/components/ExportPanel';
import { TabBar } from '@/components/TabBar';
import { DEFAULT_STYLE, SAMPLE_SEGMENTS, SAMPLE_VIDEO_DURATION } from '@/data';
import type {
  AppStatus,
  EditorTab,
  RenderProgress,
  Segment,
  StyleSettings,
  VideoMeta,
  Word,
} from '@/types';

export default function Page() {
  const [videoMeta, setVideoMeta] = useState<VideoMeta | null>(null);
  const [segments, setSegments] = useState<Segment[]>(SAMPLE_SEGMENTS);
  const [style, setStyle] = useState<StyleSettings>(DEFAULT_STYLE);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<EditorTab>('transcript');
  const [status, setStatus] = useState<AppStatus>('empty');
  const [progress, setProgress] = useState<RenderProgress | null>(null);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);

  const [undoStack, setUndoStack] = useState<Segment[][]>([]);
  const [redoStack, setRedoStack] = useState<Segment[][]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);

  const pushUndo = useCallback((prev: Segment[]) => {
    setUndoStack((s) => [...s.slice(-49), prev]);
    setRedoStack([]);
  }, []);

  const handleFile = useCallback(async (file: File) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      setVideoMeta({
        name: file.name,
        size: file.size,
        duration: video.duration || SAMPLE_VIDEO_DURATION,
        width: video.videoWidth,
        height: video.videoHeight,
        url,
      });
      setStatus('ready');
      setCurrentTime(0);
    };
    video.src = url;
  }, []);

  const handleLoadSample = useCallback(() => {
    setVideoMeta({
      name: 'sample_video.mp4',
      size: 8_400_000,
      duration: SAMPLE_VIDEO_DURATION,
      width: 1920,
      height: 1080,
      url: '',
    });
    setSegments(SAMPLE_SEGMENTS);
    setStatus('ready');
    setCurrentTime(0);
  }, []);

  const handleReset = useCallback(() => {
    setVideoMeta(null);
    setSegments(SAMPLE_SEGMENTS);
    setStyle(DEFAULT_STYLE);
    setStatus('empty');
    setCurrentTime(0);
    setIsPlaying(false);
    setProgress(null);
    setUndoStack([]);
    setRedoStack([]);
    setActiveTab('transcript');
  }, []);

  const handleTogglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) {
      setIsPlaying((p) => !p);
      return;
    }
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
    const v = videoRef.current;
    if (v && Math.abs(v.currentTime - time) > 0.3) {
      v.currentTime = time;
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted((m) => {
      if (videoRef.current) videoRef.current.muted = !m;
      return !m;
    });
  }, []);

  const handleSeekToWord = useCallback(
    (word: Word) => {
      handleSeek(word.start);
    },
    [handleSeek]
  );

  const handleUpdateWord = useCallback(
    (segmentId: string, wordId: string, updates: Partial<Word>) => {
      setSegments((prev) => {
        pushUndo(prev);
        return prev.map((seg) =>
          seg.id === segmentId
            ? {
                ...seg,
                words: seg.words.map((w) => (w.id === wordId ? { ...w, ...updates } : w)),
              }
            : seg
        );
      });
    },
    [pushUndo]
  );

  const handleDeleteWord = useCallback(
    (segmentId: string, wordId: string) => {
      setSegments((prev) => {
        pushUndo(prev);
        return prev.map((seg) =>
          seg.id === segmentId
            ? { ...seg, words: seg.words.filter((w) => w.id !== wordId) }
            : seg
        );
      });
    },
    [pushUndo]
  );

  const handleUndo = useCallback(() => {
    setUndoStack((undo) => {
      if (undo.length === 0) return undo;
      const prev = undo[undo.length - 1];
      setSegments((current) => {
        setRedoStack((r) => [...r, current]);
        return prev;
      });
      return undo.slice(0, -1);
    });
  }, []);

  const handleRedo = useCallback(() => {
    setRedoStack((redo) => {
      if (redo.length === 0) return redo;
      const next = redo[redo.length - 1];
      setSegments((current) => {
        setUndoStack((u) => [...u, current]);
        return next;
      });
      return redo.slice(0, -1);
    });
  }, []);

  const handleStyleChange = useCallback((updates: Partial<StyleSettings>) => {
    setStyle((s) => ({ ...s, ...updates }));
  }, []);

  const handleRender = useCallback(async () => {
    if (!videoMeta) return;
    setStatus('rendering');
    setActiveTab('export');
    setProgress({ frame: 0, totalFrames: Math.round(videoMeta.duration * 30), stage: 'Encoding video' });

    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          segments,
          style,
          videoName: videoMeta.name,
          duration: videoMeta.duration,
        }),
      });
      const data = await res.json();

      const total = Math.round(videoMeta.duration * 30);
      let frame = 0;
      const interval = setInterval(() => {
        frame += Math.ceil(total / 40);
        if (frame >= total) {
          frame = total;
          clearInterval(interval);
          setProgress({ frame: total, totalFrames: total, stage: data.stage || 'Complete' });
          setStatus('done');
        } else {
          setProgress({ frame, totalFrames: total, stage: data.stage || 'Encoding video' });
        }
      }, 80);
    } catch {
      const total = Math.round(videoMeta.duration * 30);
      let frame = 0;
      const interval = setInterval(() => {
        frame += Math.ceil(total / 40);
        if (frame >= total) {
          frame = total;
          clearInterval(interval);
          setProgress({ frame: total, totalFrames: total, stage: 'Complete' });
          setStatus('done');
        } else {
          setProgress({ frame, totalFrames: total, stage: 'Encoding video' });
        }
      }, 80);
    }
  }, [videoMeta, segments, style]);

  const handleSegmentClick = useCallback((segmentId: string) => {
    setActiveSegmentId(segmentId);
    setActiveTab('transcript');
  }, []);

  const activeSeg = segments.find((s) => currentTime >= s.start && currentTime < s.end);
  const currentSegmentId = activeSeg?.id ?? activeSegmentId;

  if (!videoMeta || status === 'empty') {
    return (
      <div className="h-screen flex flex-col bg-bg-app">
        <TopBar
          videoMeta={null}
          status={status}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onRender={handleRender}
          onReset={handleReset}
        />
        <UploadDropzone onFile={handleFile} onLoadSample={handleLoadSample} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-bg-app">
      <TopBar
        videoMeta={videoMeta}
        status={status}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onRender={handleRender}
        onReset={handleReset}
      />

      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex flex-col min-w-0">
          <VideoViewport
            videoMeta={videoMeta}
            segments={segments}
            style={style}
            currentTime={currentTime}
            isPlaying={isPlaying}
            isMuted={isMuted}
            onTogglePlay={handleTogglePlay}
            onSeek={handleSeek}
            onToggleMute={handleToggleMute}
            videoRef={videoRef}
          />
          <Timeline
            segments={segments}
            currentTime={currentTime}
            duration={videoMeta.duration}
            videoMeta={videoMeta}
            onSeek={handleSeek}
            onSegmentClick={handleSegmentClick}
            activeSegmentId={currentSegmentId}
          />
        </div>

        <div className="w-[400px] flex flex-col bg-bg-surface1 border-l border-border-subtle shrink-0">
          <TabBar activeTab={activeTab} onChange={setActiveTab} />
          {activeTab === 'transcript' && (
            <TranscriptEditor
              segments={segments}
              currentTime={currentTime}
              activeSegmentId={currentSegmentId}
              onUpdateWord={handleUpdateWord}
              onDeleteWord={handleDeleteWord}
              onSeekToWord={handleSeekToWord}
            />
          )}
          {activeTab === 'style' && (
            <StylePanel style={style} onChange={handleStyleChange} />
          )}
          {activeTab === 'export' && (
            <ExportPanel
              status={status}
              progress={progress}
              videoMeta={videoMeta}
              segments={segments}
              style={style}
            />
          )}
        </div>
      </div>
    </div>
  );
}
