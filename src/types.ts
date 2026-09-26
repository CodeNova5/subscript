export interface Word {
  id: string;
  text: string;
  start: number; // seconds
  end: number; // seconds
  highlight?: boolean;
  bold?: boolean;
  emoji?: string;
}

export interface Segment {
  id: string;
  words: Word[];
  start: number;
  end: number;
}

export type PresetId = 'hormozi' | 'minimalist' | 'pop';

export type SubtitlePosition = 'top' | 'center' | 'bottom';

export interface StyleSettings {
  preset: PresetId;
  position: SubtitlePosition;
  fontSize: number;
  bottomOffset: number;
  textColor: string;
  highlightColor: string;
  bgColor: string;
  showBg: boolean;
  uppercase: boolean;
  bold: boolean;
}

export interface VideoMeta {
  name: string;
  size: number; // bytes
  duration: number; // seconds
  width: number;
  height: number;
  url: string;
}

export interface RenderProgress {
  frame: number;
  totalFrames: number;
  stage: string;
}

export type EditorTab = 'transcript' | 'style' | 'export';

export type AppStatus = 'empty' | 'ready' | 'rendering' | 'done' | 'error';
