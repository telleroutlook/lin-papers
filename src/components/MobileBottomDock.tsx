import React from 'react';
import { BookOpen, Search, Bookmark, SlidersHorizontal } from 'lucide-react';

interface MobileBottomDockProps {
  onFocusSearch: () => void;
  onScrollToTop: () => void;
  onScrollToPublications: () => void;
  bookmarkedCount: number;
  showBookmarkedOnly: boolean;
  onToggleBookmarkedOnly: () => void;
  onOpenPreferences: () => void;
  activeSection?: string;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  onFocusSearch,
  onScrollToTop,
  onScrollToPublications,
  bookmarkedCount,
  showBookmarkedOnly,
  onToggleBookmarkedOnly,
  onOpenPreferences,
}) => {
  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-theme shadow-lg px-2 pb-[env(safe-area-inset-bottom,0px)] transition-colors"
    >
      <div className="grid grid-cols-4 items-center h-14">
        {/* Destination 1: Publications Feed */}
        <button
          type="button"
          onClick={onScrollToPublications}
          className="flex flex-col items-center justify-center h-full min-h-[44px] text-body-high hover:text-title active:scale-95 transition-transform"
        >
          <BookOpen className="w-5 h-5 opacity-80" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Papers</span>
        </button>

        {/* Destination 2: Instant Search */}
        <button
          type="button"
          onClick={onFocusSearch}
          className="flex flex-col items-center justify-center h-full min-h-[44px] text-body-high hover:text-title active:scale-95 transition-transform"
        >
          <Search className="w-5 h-5 opacity-80" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Search</span>
        </button>

        {/* Destination 3: Bookmarks / Reading List */}
        <button
          type="button"
          onClick={onToggleBookmarkedOnly}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] relative active:scale-95 transition-transform ${
            showBookmarkedOnly ? 'text-amber-800 dark:text-amber-300 font-bold' : 'text-body-high hover:text-title'
          }`}
        >
          <div className="relative">
            <Bookmark className={`w-5 h-5 ${showBookmarkedOnly ? 'fill-current' : 'opacity-80'}`} />
            {bookmarkedCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-amber-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {bookmarkedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Queue</span>
        </button>

        {/* Destination 4: Reading Display / Ambiance Settings */}
        <button
          type="button"
          onClick={onOpenPreferences}
          className="flex flex-col items-center justify-center h-full min-h-[44px] text-body-high hover:text-title active:scale-95 transition-transform"
        >
          <SlidersHorizontal className="w-5 h-5 opacity-80" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Display</span>
        </button>
      </div>
    </nav>
  );
};
