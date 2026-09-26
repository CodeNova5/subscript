import { NextRequest, NextResponse } from 'next/server';

interface ExportRequest {
  format: 'srt' | 'json' | 'ass';
  segments: Array<{
    id: string;
    start: number;
    end: number;
    words: Array<{ text: string; start: number; end: number; emoji?: string }>;
  }>;
  style?: {
    fontSize?: number;
    textColor?: string;
    highlightColor?: string;
    bgColor?: string;
    position?: string;
    uppercase?: boolean;
    bold?: boolean;
  };
}

function formatSrtTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

function formatAssTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const cs = Math.floor((seconds % 1) * 100);
  return `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

function hexToAssColor(hex: string): string {
  const clean = hex.replace('#', '');
  const r = clean.substring(0, 2);
  const g = clean.substring(2, 4);
  const b = clean.substring(4, 6);
  return `&H00${b}${g}${r}`.toUpperCase();
}

function generateSrt(segments: ExportRequest['segments']): string {
  return segments
    .map((seg, i) => {
      const text = seg.words.map((w) => w.text + (w.emoji ? ` ${w.emoji}` : '')).join(' ');
      return `${i + 1}\n${formatSrtTime(seg.start)} --> ${formatSrtTime(seg.end)}\n${text}\n`;
    })
    .join('\n');
}

function generateAss(segments: ExportRequest['segments'], style?: ExportRequest['style']): string {
  const fontSize = style?.fontSize ?? 48;
  const primaryColor = hexToAssColor(style?.textColor ?? '#FFFFFF');
  const outlineColor = hexToAssColor(style?.bgColor ?? '#000000');

  const header = `[Script Info]
Title: Subscript Export
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Inter,${fontSize},${primaryColor},${primaryColor},${outlineColor},${outlineColor},${style?.bold ? '1' : '0'},0,0,0,100,100,0,0,1,2,1,2,60,60,60,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  const events = segments
    .map((seg) => {
      const text = seg.words
        .map((w) => {
          const wordText = style?.uppercase ? w.text.toUpperCase() : w.text;
          return wordText + (w.emoji ? ` ${w.emoji}` : '');
        })
        .join(' ');
      return `Dialogue: 0,${formatAssTime(seg.start)},${formatAssTime(seg.end)},Default,,0,0,0,,${text}`;
    })
    .join('\n');

  return header + events + '\n';
}

function generateJson(segments: ExportRequest['segments'], style?: ExportRequest['style']): string {
  return JSON.stringify(
    {
      format: 'subscript-json',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      style: style || {},
      segments,
      stats: {
        segmentCount: segments.length,
        wordCount: segments.reduce((acc, s) => acc + s.words.length, 0),
        duration: segments.length > 0 ? segments[segments.length - 1].end : 0,
      },
    },
    null,
    2
  );
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ExportRequest;

  if (!body.format || !body.segments) {
    return NextResponse.json({ error: 'Missing format or segments' }, { status: 400 });
  }

  let content: string;
  let mimeType: string;
  let fileExtension: string;

  switch (body.format) {
    case 'srt':
      content = generateSrt(body.segments);
      mimeType = 'application/x-subrip';
      fileExtension = 'srt';
      break;
    case 'ass':
      content = generateAss(body.segments, body.style);
      mimeType = 'text/x-ass';
      fileExtension = 'ass';
      break;
    case 'json':
      content = generateJson(body.segments, body.style);
      mimeType = 'application/json';
      fileExtension = 'json';
      break;
    default:
      return NextResponse.json({ error: `Unsupported format: ${body.format}` }, { status: 400 });
  }

  const fileName = `subscript_export.${fileExtension}`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': `${mimeType}; charset=utf-8`,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
  });
}
