import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalFiltered: number;
  totalAll: number;
  popularKeywords?: string[];
  onSelectKeyword?: (keyword: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  totalFiltered,
  totalAll,
  popularKeywords = [
    'Test-Time Compute',
    'Sparse Attention',
    'Formal Verification',
    'World Models',
    'KV Cache',
    'Optimization',
  ],
  onSelectKeyword,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener ('/' or 'Cmd+K' to focus search input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }
      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full space-y-3">
      {/* Primary Search Container with High Contrast */}
      <div className="relative group">
        <div className="relative flex items-center bg-surface border border-theme-strong rounded-xl shadow-2xs transition-all duration-200 focus-within:ring-2 focus-within:ring-theme-strong focus-within:shadow-xs">
          {/* Search Icon */}
          <div className="pl-4 pr-2 text-title opacity-70">
            <Search className="w-4 h-4" />
          </div>

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search publications by title, abstract, content, keywords, authors..."
            className="w-full py-3 pr-24 text-sm bg-transparent text-title placeholder:text-muted-readable focus:outline-none font-sans font-medium"
            spellCheck={false}
          />

          {/* Right-side Affordances */}
          <div className="absolute right-3 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  inputRef.current?.focus();
                }}
                className="p-1.5 text-title hover:opacity-70 bg-surface-subtle rounded-md transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                title="Clear search (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd 
                onClick={() => inputRef.current?.focus()}
                className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono font-semibold text-title bg-surface-subtle border border-theme rounded cursor-pointer hover:border-theme-strong transition-colors"
                title="Press '/' or '⌘K' to search"
              >
                <span className="text-[10px]">/</span>
              </kbd>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Results Banner & Quick Suggestion Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        {searchQuery.trim() ? (
          <div className="flex items-center gap-2 text-title">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              Found <strong className="font-bold underline decoration-current/30 tabular-nums">{totalFiltered}</strong>{' '}
              {totalFiltered === 1 ? 'publication' : 'publications'} matching "
              <strong className="font-bold">{searchQuery}</strong>"
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted-readable uppercase tracking-wider font-semibold">
              Quick Index:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {popularKeywords.slice(0, 5).map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => onSearchChange(kw)}
                  className="px-2.5 py-1 bg-surface-subtle hover:bg-surface border border-theme text-title rounded text-[11px] font-mono transition-colors font-medium min-h-[28px]"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-muted-readable text-[11px] font-mono sm:ml-auto">
          Scope: Title · Abstract · Content · Keywords
        </div>
      </div>
    </div>
  );
};
