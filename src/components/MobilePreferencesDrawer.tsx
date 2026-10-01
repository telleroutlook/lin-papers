import React from 'react';
import { ReadingFontSize, ReadingTheme, ReadingViewMode } from '../types/paper';
import { X, Sun, Moon, Coffee, LayoutGrid, List } from 'lucide-react';

interface MobilePreferencesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: ReadingFontSize;
  onChangeFontSize: (size: ReadingFontSize) => void;
  theme: ReadingTheme;
  onChangeTheme: (theme: ReadingTheme) => void;
  viewMode: ReadingViewMode;
  onChangeViewMode: (mode: ReadingViewMode) => void;
}

export const MobilePreferencesDrawer: React.FC<MobilePreferencesDrawerProps> = ({
  isOpen,
  onClose,
  fontSize,
  onChangeFontSize,
  theme,
  onChangeTheme,
  viewMode,
  onChangeViewMode,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div 
        className="w-full bg-surface rounded-t-3xl border-t border-theme shadow-2xl p-6 pb-8 space-y-5 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="w-10 h-1.5 bg-theme-strong rounded-full mx-auto -mt-2 mb-2 opacity-50"></div>

        <div className="flex items-center justify-between pb-3 border-b border-theme/60">
          <h3 className="font-editorial text-xl font-bold text-title">
            Reading & Display Preferences
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-muted-readable hover:text-title rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Font Size Adjustment */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-muted-readable font-bold">
            Typography Scale
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'normal', label: 'Default', sample: 'Aa (100%)' },
              { id: 'large', label: 'Comfortable', sample: 'Aa+ (115%)' },
              { id: 'larger', label: 'Large Print', sample: 'Aa++ (130%)' },
            ].map((item) => {
              const isActive = fontSize === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChangeFontSize(item.id as ReadingFontSize)}
                  className={`py-3 px-2 rounded-xl border text-center transition-all min-h-[52px] ${
                    isActive
                      ? 'shadow-xs font-bold border-transparent'
                      : 'bg-surface-subtle text-title border-theme font-medium'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }
                      : undefined
                  }
                >
                  <div className="text-xs">{item.label}</div>
                  <div className="text-[10px] opacity-75 mt-0.5">{item.sample}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Reading Ambiance / Theme */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-muted-readable font-bold">
            Reading Ambiance
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onChangeTheme('paper')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 min-h-[54px] ${
                theme === 'paper'
                  ? 'border-amber-400 bg-amber-100 text-stone-950 font-bold shadow-xs'
                  : 'bg-surface-subtle text-title border-theme font-medium'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span className="text-xs">Light Paper</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeTheme('sepia')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 min-h-[54px] ${
                theme === 'sepia'
                  ? 'border-[#c2b49e] bg-[#e5dcce] text-[#2c1e13] font-bold shadow-xs'
                  : 'bg-surface-subtle text-title border-theme font-medium'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span className="text-xs">Sepia</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeTheme('dark')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 min-h-[54px] ${
                theme === 'dark'
                  ? 'border-stone-500 bg-stone-800 text-stone-50 font-bold shadow-xs'
                  : 'bg-surface-subtle text-title border-theme font-medium'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span className="text-xs">Night Dark</span>
            </button>
          </div>
        </div>

        {/* 3. Card View Mode */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-muted-readable font-bold">
            List Density
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChangeViewMode('editorial')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 min-h-[48px] ${
                viewMode === 'editorial'
                  ? 'font-bold border-transparent shadow-xs'
                  : 'bg-surface-subtle text-title border-theme font-medium'
              }`}
              style={
                viewMode === 'editorial'
                  ? { backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }
                  : undefined
              }
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="text-xs">Editorial View</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('compact')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 min-h-[48px] ${
                viewMode === 'compact'
                  ? 'font-bold border-transparent shadow-xs'
                  : 'bg-surface-subtle text-title border-theme font-medium'
              }`}
              style={
                viewMode === 'compact'
                  ? { backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }
                  : undefined
              }
            >
              <List className="w-4 h-4" />
              <span className="text-xs">Compact Rows</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
