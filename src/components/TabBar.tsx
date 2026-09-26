'use client';

import { Captions, Palette, Download } from 'lucide-react';
import type { EditorTab } from '@/types';

interface TabBarProps {
  activeTab: EditorTab;
  onChange: (tab: EditorTab) => void;
}

export function TabBar({ activeTab, onChange }: TabBarProps) {
  const tabs: { id: EditorTab; label: string; icon: typeof Captions }[] = [
    { id: 'transcript', label: 'Transcript', icon: Captions },
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'export', label: 'Export', icon: Download },
  ];

  return (
    <div className="flex border-b border-border-subtle bg-bg-surface1 shrink-0">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors duration-150 ease-smooth relative ${
              isActive
                ? 'text-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-t-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
