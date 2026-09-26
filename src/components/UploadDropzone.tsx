import { useRef, useState } from 'react';
import { UploadCloud, Film, Sparkles } from 'lucide-react';

interface UploadDropzoneProps {
  onFile: (file: File) => void;
  onLoadSample: () => void;
}

export function UploadDropzone({ onFile, onLoadSample }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      onFile(file);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative w-full max-w-2xl rounded-2xl border-2 border-dashed p-16 text-center cursor-pointer transition-all duration-300 ease-smooth ${
          dragging
            ? 'border-brand-primary bg-brand-primary/5 scale-[1.02]'
            : 'border-border-subtle bg-bg-surface1/50 hover:border-border-focus hover:bg-bg-surface1'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
          }}
        />
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-brand-primary/10 flex items-center justify-center ring-4 ring-brand-primary/5">
            <UploadCloud className="w-10 h-10 text-brand-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Drop your video here</h2>
            <p className="text-text-secondary text-sm">
              or click to browse — MP4, MOV, WebM up to 500MB
            </p>
          </div>
          <div className="flex items-center gap-3 text-text-muted text-xs">
            <span className="flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" /> 1080p max
            </span>
            <span>·</span>
            <span>Auto-transcription</span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Word-level editing
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLoadSample();
          }}
          className="text-sm text-text-secondary hover:text-brand-primary transition-colors duration-150 ease-smooth underline underline-offset-4 decoration-dotted"
        >
          or try with a sample video
        </button>
      </div>
    </div>
  );
}
