import React from 'react';
import { 
  ReadingFontSize, 
  ReadingTheme, 
  ReadingViewMode 
} from '../types/paper';
import { 
  Bookmark, 
  LayoutGrid, 
  List, 
  Sun, 
  Moon, 
  Coffee 
} from 'lucide-react';

interface ReadingToolbarProps {
  fontSize: ReadingFontSize;
  onChangeFontSize: (size: ReadingFontSize) => void;
  viewMode: ReadingViewMode;
  onChangeViewMode: (mode: ReadingViewMode) => void;
  theme: ReadingTheme;
  onChangeTheme: (theme: ReadingTheme) => void;
  bookmarkedCount: number;
  showBookmarkedOnly: boolean;
  onToggleBookmarkedOnly: () => void;
}

export const ReadingToolbar: React.FC<ReadingToolbarProps> = ({
  fontSize,
  onChangeFontSize,
  viewMode,
  onChangeViewMode,
  theme,
  onChangeTheme,
  bookmarkedCount,
  showBookmarkedOnly,
  onToggleBookmarkedOnly,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-surface border border-theme rounded-xl shadow-2xs text-xs transition-colors">
      {/* Left: View Mode & Reading List Filter */}
      <div className="flex items-center gap-2">
        {/* Layout Mode Toggle */}
        <div className="flex items-center p-0.5 bg-surface-subtle border border-theme rounded-lg">
          <button
            type="button"
            onClick={() => onChangeViewMode('editorial')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              viewMode === 'editorial'
                ? 'shadow-xs'
                : 'text-body-high hover:text-title'
            }`}
            style={
              viewMode === 'editorial'
                ? { backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }
                : undefined
            }
            title="Editorial Reading View (Generous Spacing & TL;DR)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Editorial</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode('compact')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              viewMode === 'compact'
                ? 'shadow-xs'
                : 'text-body-high hover:text-title'
            }`}
            style={
              viewMode === 'compact'
                ? { backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }
                : undefined
            }
            title="Compact Scanning View (Dense rows for quick triage)"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compact</span>
          </button>
        </div>

        {/* Reading List / Bookmark filter */}
        <button
          type="button"
          onClick={onToggleBookmarkedOnly}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap min-h-[36px] ${
            showBookmarkedOnly
              ? 'bg-amber-100/90 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border-amber-300 font-bold'
              : 'bg-surface-subtle text-title border-theme hover:border-theme-strong'
          }`}
          title="Filter saved reading list"
        >
          <Bookmark className={`w-3.5 h-3.5 ${showBookmarkedOnly ? 'fill-amber-600 text-amber-600 dark:fill-amber-400 dark:text-amber-400' : 'opacity-70'}`} />
          <span className="font-semibold">Reading Queue</span>
          <span className="font-mono text-[11px] opacity-75 tabular-nums">
            ({bookmarkedCount})
          </span>
        </button>
      </div>

      {/* Right: Typography Size & Reading Ambiance Themes */}
      <div className="flex items-center gap-3">
        {/* Font Size Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-muted-readable text-[11px] font-mono font-semibold hidden md:inline">
            Type:
          </span>
          <div className="flex items-center p-0.5 bg-surface-subtle border border-theme rounded-lg">
            {(['normal', 'large', 'larger'] as const).map((sz, idx) => {
              const label = idx === 0 ? 'A' : idx === 1 ? 'A+' : 'A++';
              const isActive = fontSize === sz;
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onChangeFontSize(sz)}
                  className={`px-2.5 py-1 text-xs rounded font-bold transition-all ${
                    isActive ? 'shadow-xs' : 'text-body-high hover:text-title'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }
                      : undefined
                  }
                  title={`Reading type size: ${label}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reading Ambiance / Theme Selector */}
        <div className="flex items-center p-0.5 bg-surface-subtle border border-theme rounded-lg gap-0.5">
          <button
            type="button"
            onClick={() => onChangeTheme('paper')}
            className={`p-1.5 rounded transition-all min-h-[32px] min-w-[32px] flex items-center justify-center ${
              theme === 'paper' 
                ? 'bg-amber-100 text-stone-950 font-bold border border-amber-300 shadow-xs' 
                : 'text-body-high hover:text-title'
            }`}
            title="Light Paper Ambiance (Warm Ivory)"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onChangeTheme('sepia')}
            className={`p-1.5 rounded transition-all min-h-[32px] min-w-[32px] flex items-center justify-center ${
              theme === 'sepia' 
                ? 'bg-[#e5dcce] text-[#2c1e13] font-bold border border-[#c2b49e] shadow-xs' 
                : 'text-body-high hover:text-title'
            }`}
            title="Sepia Ambiance (Soft Afternoon Reader)"
          >
            <Coffee className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onChangeTheme('dark')}
            className={`p-1.5 rounded transition-all min-h-[32px] min-w-[32px] flex items-center justify-center ${
              theme === 'dark' 
                ? 'bg-stone-800 text-stone-50 font-bold border border-stone-600 shadow-xs' 
                : 'text-body-high hover:text-title'
            }`}
            title="Night Reading Ambiance (Dark Slate)"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
