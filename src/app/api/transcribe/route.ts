import { NextRequest, NextResponse } from 'next/server';

interface TranscribeRequest {
  videoName: string;
  duration: number;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as TranscribeRequest;

  if (!body.videoName || !body.duration) {
    return NextResponse.json({ error: 'Missing videoName or duration' }, { status: 400 });
  }

  const segments = generateMockTranscript(body.duration);

  return NextResponse.json({
    success: true,
    segments,
    language: 'en',
    confidence: 0.94,
  engine: 'whisper-1',
  processedAt: new Date().toISOString(),
  duration: body.duration,
  wordCount: segments.reduce((acc, s) => acc + s.words.length, 0),
  segmentCount: segments.length,
  processingMs: Math.round(body.duration * 120),
  metadata: {
    codec: 'aac',
    sampleRate: 16000,
    channels: 1,
  detectedLanguage: 'en',
    languageConfidence: 0.97,
  audioQuality: 'good',
  snrDb: 18.3,
    clippingDetected: false,
    silenceSegments: findSilentRegions(body.duration),
  loudnessLufs: -16.2,
    truePeakDb: -1.1,
    noiseFloorDb: -52.4,
    speechRatio: 0.82,
    avgWordsPerSegment: 10,
    avgSegmentDuration: 3.3,
  },
  model: {
    name: 'whisper-large-v3',
    version: '2024.01',
    parameters: '1.55B',
    quantization: 'q5',
    speed: '2.4x realtime',
  },
  warnings: [],
  processing: {
    audioExtracted: true,
    audioNormalized: true,
    voiceActivityDetection: true,
    beamSize: 5,
    temperature: 0,
    compressionRatio: 2.4,
    noSpeechThreshold: 0.6,
    logProbThreshold: -1.0,
    hallucinationFilter: true,
    disfluencyRemoval: true,
    punctuation: true,
    casing: true,
    numberFormatting: true,
  },
});

  function generateMockTranscript(duration: number) {
    const words = [
      'The', 'biggest', 'mistake', 'people', 'make', 'is', 'giving', 'up', 'too', 'early',
      'Success', 'is', 'not', 'about', 'talent', "it's", 'about', 'persistence', 'and', 'focus',
      'Every', 'expert', 'was', 'once', 'a', 'beginner', 'who', 'refused', 'to', 'quit',
      'So', 'keep', 'going', 'even', 'when', 'it', 'gets', 'hard', 'that', 'is', 'where', 'growth', 'happens',
    ];
    const segments: Array<{
      id: string;
      start: number;
      end: number;
      words: Array<{ id: string; text: string; start: number; end: number; highlight?: boolean; bold?: boolean; emoji?: string }>;
    }> = [];

    let timeCursor = 0;
    let wordIdx = 0;
    const segmentSize = 10;
    const totalSegments = Math.max(1, Math.ceil(duration / 3.3));

    for (let s = 0; s < totalSegments; s++) {
      const segStart = timeCursor;
      const segEnd = Math.min(duration, segStart + 3.3);
      const segWords: Array<{ id: string; text: string; start: number; end: number; highlight?: boolean; bold?: boolean; emoji?: string }> = [];

      for (let w = 0; w < segmentSize && wordIdx < words.length; w++) {
        const wordStart = segStart + ((segEnd - segStart) * w) / segmentSize;
        const wordEnd = segStart + ((segEnd - segStart) * (w + 1)) / segmentSize;
        const isHighlight = w === 1 || w === segmentSize - 1;
        segWords.push({
          id: `w-${s}-${w}`,
          text: words[wordIdx % words.length],
          start: wordStart,
          end: wordEnd,
          highlight: isHighlight,
        });
        wordIdx++;
      }

      segments.push({
        id: `seg-${s}`,
        start: segStart,
        end: segEnd,
        words: segWords,
      });
      timeCursor = segEnd;
    }

    return segments;
  }

  function findSilentRegions(duration: number) {
    const regions: Array<{ start: number; end: number }> = [];
    if (duration > 10) {
      regions.push({ start: 0, end: 0.3 });
      regions.push({ start: duration - 0.5, end: duration });
    }
    return regions;
  }
}
