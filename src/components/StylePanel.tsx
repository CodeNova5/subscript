import { ArrowUp, ArrowDown, Check } from 'lucide-react';
import type { StyleSettings, PresetId, SubtitlePosition } from '@/types';
import { PRESETS } from '@/data';

interface StylePanelProps {
  style: StyleSettings;
  onChange: (updates: Partial<StyleSettings>) => void;
}

export function StylePanel({ style, onChange }: StylePanelProps) {
  const applyPreset = (id: PresetId) => {
    const p = PRESETS[id].preview;
    onChange({
      preset: id,
      textColor: p.textColor,
      highlightColor: p.highlightColor,
      bgColor: p.bgColor,
      showBg: p.showBg,
      bold: p.bold,
      uppercase: p.uppercase,
    });
  };

  const positions: { id: SubtitlePosition; label: string }[] = [
    { id: 'top', label: 'Top' },
    { id: 'center', label: 'Center' },
    { id: 'bottom', label: 'Bottom' },
  ];

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="p-4 space-y-6">
        {/* Presets */}
        <section>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Presets
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(PRESETS) as PresetId[]).map((id) => {
              const preset = PRESETS[id];
              const isActive = style.preset === id;
              return (
                <button
                  key={id}
                  onClick={() => applyPreset(id)}
                  className={`relative rounded-xl border p-3 text-left transition-all duration-150 ease-smooth ${
                    isActive
                      ? 'border-brand-primary bg-brand-primary/10'
                      : 'border-border-subtle bg-bg-surface2 hover:border-border-focus'
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-primary flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                  <div
                    className="mb-2 h-12 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: preset.preview.showBg ? preset.preview.bgColor : 'transparent',
                      color: preset.preview.textColor,
                      textTransform: preset.preview.uppercase ? 'uppercase' : 'none',
                      textShadow: preset.preview.showBg ? 'none' : '0 1px 4px rgba(0,0,0,0.8)',
                    }}
                  >
                    Sample
                  </div>
                  <p className="text-sm font-medium text-text-primary">{preset.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{preset.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Position */}
        <section>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Position
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {positions.map((pos) => (
              <button
                key={pos.id}
                onClick={() => onChange({ position: pos.id })}
                className={`py-2.5 rounded-lg border text-sm font-medium transition-all duration-150 ease-smooth ${
                  style.position === pos.id
                    ? 'border-brand-primary bg-brand-primary/10 text-text-primary'
                    : 'border-border-subtle bg-bg-surface2 text-text-secondary hover:border-border-focus'
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </section>

        {/* Font size */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Font Size
            </h3>
            <span className="text-sm font-mono text-text-primary">{style.fontSize}px</span>
          </div>
          <input
            type="range"
            min={20}
            max={80}
            value={style.fontSize}
            onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex items-center justify-between mt-1 text-xs text-text-muted">
            <span>20px</span>
            <span>80px</span>
          </div>
        </section>

        {/* Colors */}
        <section>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Colors
          </h3>
          <div className="space-y-3">
            <ColorRow
              label="Text"
              value={style.textColor}
              onChange={(v) => onChange({ textColor: v })}
            />
            <ColorRow
              label="Highlight"
              value={style.highlightColor}
              onChange={(v) => onChange({ highlightColor: v })}
            />
            <ColorRow
              label="Background"
              value={style.bgColor}
              onChange={(v) => onChange({ bgColor: v })}
            />
          </div>
        </section>

        {/* Toggles */}
        <section>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Options
          </h3>
          <div className="space-y-2">
            <ToggleRow
              label="Show background"
              checked={style.showBg}
              onChange={(v) => onChange({ showBg: v })}
            />
            <ToggleRow
              label="Uppercase"
              checked={style.uppercase}
              onChange={(v) => onChange({ uppercase: v })}
            />
            <ToggleRow
              label="Bold text"
              checked={style.bold}
              onChange={(v) => onChange({ bold: v })}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-secondary">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-text-muted">{value}</span>
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded-lg border border-border-subtle cursor-pointer bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full py-2 group"
    >
      <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
        {label}
      </span>
      <div
        className={`w-9 h-5 rounded-full transition-colors duration-200 ease-smooth relative ${
          checked ? 'bg-brand-primary' : 'bg-bg-hover'
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-smooth ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </div>
    </button>
  );
}
