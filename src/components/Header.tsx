import React from 'react';
import { Bookmark, ExternalLink } from 'lucide-react';
import { AuthorProfile } from '../types/paper';

interface HeaderProps {
  author: AuthorProfile;
  onOpenContact: () => void;
  paperCount: number;
  bookmarkedCount?: number;
  showBookmarkedOnly?: boolean;
  onToggleBookmarkedOnly?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  author,
  onOpenContact,
  paperCount,
  bookmarkedCount = 0,
  showBookmarkedOnly = false,
  onToggleBookmarkedOnly,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-surface/95 backdrop-blur-md border-b border-theme transition-colors shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <a 
          href="#" 
          className="group flex items-center gap-2 text-title font-editorial text-lg sm:text-xl font-bold tracking-tight hover:opacity-85 transition-opacity"
        >
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: 'var(--text-title)' }}></span>
          <span>{author.name.replace('Dr. ', '')} Archive</span>
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-body-high">
          <a href="#publications" className="hover:text-title transition-colors">
            Publications <span className="text-xs text-muted-readable font-mono tabular-nums">({paperCount})</span>
          </a>
          <a href="#research" className="hover:text-title transition-colors">
            Research Focus
          </a>
          <a href="#metrics" className="hover:text-title transition-colors">
            Metrics & Impact
          </a>
          <a 
            href="#inquiries"
            onClick={(e) => {
              e.preventDefault();
              onOpenContact();
            }}
            className="hover:text-title transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Reading List Toggle (Desktop) */}
          {bookmarkedCount > 0 && onToggleBookmarkedOnly && (
            <button
              type="button"
              onClick={onToggleBookmarkedOnly}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                showBookmarkedOnly
                  ? 'bg-amber-100/90 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border-amber-300'
                  : 'bg-surface-subtle text-title border-theme hover:border-theme-strong'
              }`}
              title="Toggle bookmarked reading queue"
            >
              <Bookmark className={`w-3.5 h-3.5 ${showBookmarkedOnly ? 'fill-amber-600 text-amber-600 dark:fill-amber-400 dark:text-amber-400' : 'opacity-70'}`} />
              <span>Queue ({bookmarkedCount})</span>
            </button>
          )}

          <a
            href={author.scholarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-md transition-opacity shadow-xs whitespace-nowrap min-h-[38px] hover:opacity-90"
            style={{ backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }}
          >
            <span>Google Scholar</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>
    </header>
  );
};
