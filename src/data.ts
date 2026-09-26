import type { Segment, StyleSettings } from '@/types';

export const PRESETS: Record<
  'hormozi' | 'minimalist' | 'pop',
  { name: string; description: string; preview: { textColor: string; highlightColor: string; bgColor: string; showBg: boolean; bold: boolean; uppercase: boolean } }
> = {
  hormozi: {
    name: 'Hormozi',
    description: 'Bold yellow on black, punchy',
    preview: {
      textColor: '#FDE047',
      highlightColor: '#22D3EE',
      bgColor: '#000000',
      showBg: true,
      bold: true,
      uppercase: true,
    },
  },
  minimalist: {
    name: 'Minimalist',
    description: 'Clean white, subtle shadow',
    preview: {
      textColor: '#FFFFFF',
      highlightColor: '#6366F1',
      bgColor: '#000000',
      showBg: false,
      bold: false,
      uppercase: false,
    },
  },
  pop: {
    name: 'Pop',
    description: 'Colorful, rounded, fun',
    preview: {
      textColor: '#F8FAFC',
      highlightColor: '#F472B6',
      bgColor: '#6366F1',
      showBg: true,
      bold: true,
      uppercase: false,
    },
  },
};

export const DEFAULT_STYLE: StyleSettings = {
  preset: 'hormozi',
  position: 'center',
  fontSize: 48,
  bottomOffset: 120,
  textColor: '#FDE047',
  highlightColor: '#22D3EE',
  bgColor: '#000000',
  showBg: true,
  uppercase: true,
  bold: true,
};

export const SAMPLE_SEGMENTS: Segment[] = [
  {
    id: 'seg-1',
    start: 0,
    end: 3.2,
    words: [
      { id: 'w-1', text: 'The', start: 0, end: 0.3 },
      { id: 'w-2', text: 'biggest', start: 0.3, end: 0.7, highlight: true },
      { id: 'w-3', text: 'mistake', start: 0.7, end: 1.1 },
      { id: 'w-4', text: 'people', start: 1.1, end: 1.5 },
      { id: 'w-5', text: 'make', start: 1.5, end: 1.8 },
      { id: 'w-6', text: 'is', start: 1.8, end: 2.0 },
      { id: 'w-7', text: 'giving', start: 2.0, end: 2.4 },
      { id: 'w-8', text: 'up', start: 2.4, end: 2.6, emoji: '🔥' },
      { id: 'w-9', text: 'too', start: 2.6, end: 2.9 },
      { id: 'w-10', text: 'early', start: 2.9, end: 3.2 },
    ],
  },
  {
    id: 'seg-2',
    start: 3.2,
    end: 6.5,
    words: [
      { id: 'w-11', text: 'Success', start: 3.2, end: 3.7, highlight: true },
      { id: 'w-12', text: 'is', start: 3.7, end: 3.9 },
      { id: 'w-13', text: 'not', start: 3.9, end: 4.1 },
      { id: 'w-14', text: 'about', start: 4.1, end: 4.4 },
      { id: 'w-15', text: 'talent', start: 4.4, end: 4.8 },
      { id: 'w-16', text: "it's", start: 4.8, end: 5.1 },
      { id: 'w-17', text: 'about', start: 5.1, end: 5.4 },
      { id: 'w-18', text: 'persistence', start: 5.4, end: 6.0, emoji: '💪' },
      { id: 'w-19', text: 'and', start: 6.0, end: 6.2 },
      { id: 'w-20', text: 'focus', start: 6.2, end: 6.5, highlight: true },
    ],
  },
  {
    id: 'seg-3',
    start: 6.5,
    end: 9.8,
    words: [
      { id: 'w-21', text: 'Every', start: 6.5, end: 6.9 },
      { id: 'w-22', text: 'expert', start: 6.9, end: 7.3 },
      { id: 'w-23', text: 'was', start: 7.3, end: 7.5 },
      { id: 'w-24', text: 'once', start: 7.5, end: 7.8 },
      { id: 'w-25', text: 'a', start: 7.8, end: 7.9 },
      { id: 'w-26', text: 'beginner', start: 7.9, end: 8.4, emoji: '🌱' },
      { id: 'w-27', text: 'who', start: 8.4, end: 8.6 },
      { id: 'w-28', text: 'refused', start: 8.6, end: 9.0, highlight: true },
      { id: 'w-29', text: 'to', start: 9.0, end: 9.2 },
      { id: 'w-30', text: 'quit', start: 9.2, end: 9.8, emoji: '🎯' },
    ],
  },
  {
    id: 'seg-4',
    start: 9.8,
    end: 13.0,
    words: [
      { id: 'w-31', text: 'So', start: 9.8, end: 10.0 },
      { id: 'w-32', text: 'keep', start: 10.0, end: 10.3 },
      { id: 'w-33', text: 'going', start: 10.3, end: 10.7 },
      { id: 'w-34', text: 'even', start: 10.7, end: 11.0 },
      { id: 'w-35', text: 'when', start: 11.0, end: 11.2 },
      { id: 'w-36', text: 'it', start: 11.2, end: 11.3 },
      { id: 'w-37', text: 'gets', start: 11.3, end: 11.6 },
      { id: 'w-38', text: 'hard', start: 11.6, end: 12.0, highlight: true, emoji: '⚡' },
      { id: 'w-39', text: 'that', start: 12.0, end: 12.2 },
      { id: 'w-40', text: 'is', start: 12.2, end: 12.4 },
      { id: 'w-41', text: 'where', start: 12.4, end: 12.7 },
      { id: 'w-42', text: 'growth', start: 12.7, end: 13.0, emoji: '🚀' },
    ],
  },
];

export const SAMPLE_VIDEO_DURATION = 13.0;
