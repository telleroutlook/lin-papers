import React from 'react';
import { SearchBar } from './SearchBar';
import { Sparkles, ArrowUpDown, X, RotateCcw } from 'lucide-react';
import { SortOption } from '../types/paper';

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedKeyword: string | null;
  onSelectKeyword: (kw: string | null) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  showHighlightedOnly: boolean;
  onToggleHighlightedOnly: () => void;
  totalFiltered: number;
  totalAll: number;
  popularKeywords?: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedKeyword,
  onSelectKeyword,
  sortBy,
  onSortChange,
  showHighlightedOnly,
  onToggleHighlightedOnly,
  totalFiltered,
  totalAll,
  popularKeywords,
}) => {
  const hasActiveFilters = 
    selectedCategory !== 'All' || 
    searchQuery.trim() !== '' || 
    selectedKeyword !== null || 
    showHighlightedOnly;

  const handleClearFilters = () => {
    onSelectCategory('All');
    onSearchChange('');
    onSelectKeyword(null);
    if (showHighlightedOnly) onToggleHighlightedOnly();
  };

  return (
    <div className="space-y-4">
      {/* Search Bar with instant dynamic filtering, scope indicator, and shortcuts */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        totalFiltered={totalFiltered}
        totalAll={totalAll}
        popularKeywords={popularKeywords}
        onSelectKeyword={onSelectKeyword}
      />

      {/* Categories & Sorting / Featured Row */}
      <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-theme/60">
        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all border ${
                  isActive
                    ? 'shadow-xs border-transparent'
                    : 'bg-surface-subtle text-body-high border-theme hover:border-theme-strong hover:text-title'
                }`}
                style={
                  isActive
                    ? { backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }
                    : undefined
                }
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Right side controls: Featured button & Sort dropdown */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={onToggleHighlightedOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap min-h-[38px] ${
              showHighlightedOnly
                ? 'bg-amber-100/90 dark:bg-amber-950/70 text-amber-950 dark:text-amber-200 border-amber-300'
                : 'bg-surface text-title border-theme hover:border-theme-strong'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${showHighlightedOnly ? 'text-amber-600 dark:text-amber-400' : 'opacity-70'}`} />
            <span>Featured Highlights</span>
          </button>

          <div className="flex items-center gap-1.5 bg-surface border border-theme rounded-lg px-2.5 py-1.5 shadow-2xs min-h-[38px]">
            <ArrowUpDown className="w-3.5 h-3.5 text-title opacity-70 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="text-xs bg-transparent text-title font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="year-desc">Year (Newest First)</option>
              <option value="year-asc">Year (Oldest First)</option>
              <option value="citations-desc">Most Cited</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Keyword / Filter indicators */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-body-high">
          <span className="font-mono text-[11px] text-muted-readable font-semibold">Filtering:</span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100/90 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border border-amber-300 rounded-md font-semibold">
              <span>Text: "{searchQuery}"</span>
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="hover:opacity-75 p-0.5 ml-0.5"
                title="Remove search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {selectedKeyword && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-subtle text-title border border-theme rounded-md font-semibold">
              <span>#{selectedKeyword}</span>
              <button
                type="button"
                onClick={() => onSelectKeyword(null)}
                className="hover:opacity-75 p-0.5 ml-0.5"
                title="Remove keyword filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-subtle text-title border border-theme rounded-md font-semibold">
              <span>Category: {selectedCategory}</span>
              <button
                type="button"
                onClick={() => onSelectCategory('All')}
                className="hover:opacity-75 p-0.5 ml-0.5"
                title="Remove category filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {showHighlightedOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-subtle text-title border border-theme rounded-md font-semibold">
              <span>Featured Only</span>
              <button
                type="button"
                onClick={onToggleHighlightedOnly}
                className="hover:opacity-75 p-0.5 ml-0.5"
                title="Remove featured filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleClearFilters}
            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-title hover:underline underline-offset-2 min-h-[36px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}
    </div>
  );
};
