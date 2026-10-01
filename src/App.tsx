import React, { useState, useEffect, useMemo } from 'react';
import { 
  Paper, 
  AuthorProfile, 
  SortOption, 
  ReadingFontSize, 
  ReadingTheme, 
  ReadingViewMode 
} from './types/paper';
import { INITIAL_PAPERS, INITIAL_AUTHOR } from './data/initialPapers';
import { loadPapersFromDirectory } from './utils/contentLoader';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ResearchFocus } from './components/ResearchFocus';
import { FilterBar } from './components/FilterBar';
import { PaperCard } from './components/PaperCard';
import { BibTeXModal } from './components/BibTeXModal';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';
import { ReadingToolbar } from './components/ReadingToolbar';
import { PaperReaderModal } from './components/PaperReaderModal';
import { MobileBottomDock } from './components/MobileBottomDock';
import { MobilePreferencesDrawer } from './components/MobilePreferencesDrawer';
import { Bookmark, Filter } from 'lucide-react';

export default function App() {
  const [papers, setPapers] = useState<Paper[]>(() => {
    // Immediate synchronous load from content/papers/*.md via Vite eager import
    const localPapers = loadPapersFromDirectory();
    return localPapers.length > 0 ? localPapers : INITIAL_PAPERS;
  });
  const [author, setAuthor] = useState<AuthorProfile>(INITIAL_AUTHOR);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('year-desc');
  const [showHighlightedOnly, setShowHighlightedOnly] = useState<boolean>(false);

  // Reading Experience Preferences (Persisted in localStorage)
  const [fontSize, setFontSize] = useState<ReadingFontSize>(() => {
    return (localStorage.getItem('scholar_font_size') as ReadingFontSize) || 'normal';
  });
  const [viewMode, setViewMode] = useState<ReadingViewMode>(() => {
    return (localStorage.getItem('scholar_view_mode') as ReadingViewMode) || 'editorial';
  });
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>(() => {
    return (localStorage.getItem('scholar_reading_theme') as ReadingTheme) || 'paper';
  });
  const [readingList, setReadingList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('scholar_reading_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState<boolean>(false);

  // Modals & Panels
  const [selectedBibtexPaper, setSelectedBibtexPaper] = useState<Paper | null>(null);
  const [readerPaper, setReaderPaper] = useState<Paper | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobilePrefsOpen, setMobilePrefsOpen] = useState(false);

  // Save reading preferences
  const handleFontSizeChange = (size: ReadingFontSize) => {
    setFontSize(size);
    localStorage.setItem('scholar_font_size', size);
  };

  const handleViewModeChange = (mode: ReadingViewMode) => {
    setViewMode(mode);
    localStorage.setItem('scholar_view_mode', mode);
  };

  const handleThemeChange = (theme: ReadingTheme) => {
    setReadingTheme(theme);
    localStorage.setItem('scholar_reading_theme', theme);
  };

  const toggleBookmark = (paperId: string) => {
    setReadingList((prev) => {
      const next = prev.includes(paperId)
        ? prev.filter((id) => id !== paperId)
        : [...prev, paperId];
      localStorage.setItem('scholar_reading_list', JSON.stringify(next));
      return next;
    });
  };

  // Sync theme class to document root and body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.remove('theme-paper', 'theme-sepia', 'theme-dark');
    root.classList.add(`theme-${readingTheme}`);
    body.classList.remove('theme-paper', 'theme-sepia', 'theme-dark');
    body.classList.add(`theme-${readingTheme}`);
  }, [readingTheme]);

  // Fetch papers from repository backend API on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [papersRes, authorRes] = await Promise.all([
          fetch('/api/papers').then((r) => r.json()).catch(() => null),
          fetch('/api/author').then((r) => r.json()).catch(() => null),
        ]);

        if (papersRes && papersRes.papers && Array.isArray(papersRes.papers) && papersRes.papers.length > 0) {
          setPapers(papersRes.papers);
        } else {
          // Fallback to Vite glob import from content/papers/*.md
          const directoryPapers = loadPapersFromDirectory();
          if (directoryPapers.length > 0) {
            setPapers(directoryPapers);
          }
        }

        if (authorRes && authorRes.author) {
          setAuthor(authorRes.author);
        }
      } catch (err) {
        console.warn('Backend not responding, using content/papers directory files', err);
        const directoryPapers = loadPapersFromDirectory();
        if (directoryPapers.length > 0) {
          setPapers(directoryPapers);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Compute available categories and popular keywords
  const categories = useMemo(() => {
    const set = new Set<string>();
    papers.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [papers]);

  const popularKeywords = useMemo(() => {
    const countMap: Record<string, number> = {};
    papers.forEach((p) => {
      (p.keywords || []).forEach((kw) => {
        countMap[kw] = (countMap[kw] || 0) + 1;
      });
    });
    return Object.keys(countMap)
      .sort((a, b) => countMap[b] - countMap[a])
      .slice(0, 6);
  }, [papers]);

  // Filtered and sorted papers
  const filteredPapers = useMemo(() => {
    return papers
      .filter((paper) => {
        // Reading list bookmark filter
        if (showBookmarkedOnly && (!paper.id || !readingList.includes(paper.id))) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && paper.category !== selectedCategory) {
          return false;
        }

        // Highlighted only
        if (showHighlightedOnly && !paper.highlighted) {
          return false;
        }

        // Keyword filter
        if (selectedKeyword && (!paper.keywords || !paper.keywords.includes(selectedKeyword))) {
          return false;
        }

        // Search query across title, abstract, content, keywords, authors, venue, doi, date
        if (searchQuery.trim() !== '') {
          const terms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
          const matchesAll = terms.every((term) => {
            const inTitle = paper.title.toLowerCase().includes(term);
            const inAbstract = (paper.abstract || '').toLowerCase().includes(term);
            const inContent = (paper.content || '').toLowerCase().includes(term);
            const inTldr = (paper.tldr || '').toLowerCase().includes(term);
            const inVenue = (paper.venue || '').toLowerCase().includes(term);
            const inAuthors = paper.authors.some((a) => a.toLowerCase().includes(term));
            const inKeywords = (paper.keywords || []).some((k) => k.toLowerCase().includes(term));
            const inCategory = (paper.category || '').toLowerCase().includes(term);
            const inDoi = (paper.doi || '').toLowerCase().includes(term);
            const inDate = (paper.publishedDate || '').toLowerCase().includes(term);

            return inTitle || inAbstract || inContent || inTldr || inVenue || inAuthors || inKeywords || inCategory || inDoi || inDate;
          });

          if (!matchesAll) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const yearA = a.year || (a.publishedDate ? new Date(a.publishedDate).getFullYear() : 2026);
        const yearB = b.year || (b.publishedDate ? new Date(b.publishedDate).getFullYear() : 2026);

        switch (sortBy) {
          case 'year-desc':
            return yearB - yearA || (b.citations || 0) - (a.citations || 0);
          case 'year-asc':
            return yearA - yearB || (b.citations || 0) - (a.citations || 0);
          case 'citations-desc':
            return (b.citations || 0) - (a.citations || 0);
          case 'title-asc':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }, [papers, showBookmarkedOnly, readingList, selectedCategory, showHighlightedOnly, selectedKeyword, searchQuery, sortBy]);

  // Group papers by Year if sorting by year, otherwise flat list
  const papersByYear = useMemo(() => {
    if (sortBy !== 'year-desc' && sortBy !== 'year-asc') {
      return null;
    }
    const groups: { year: number; papers: Paper[] }[] = [];
    filteredPapers.forEach((paper) => {
      const year = paper.year || (paper.publishedDate ? new Date(paper.publishedDate).getFullYear() : 2026);
      let group = groups.find((g) => g.year === year);
      if (!group) {
        group = { year, papers: [] };
        groups.push(group);
      }
      group.papers.push(paper);
    });
    return groups;
  }, [filteredPapers, sortBy]);

  const scrollToPublications = () => {
    const el = document.getElementById('publications');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFocusSearch = () => {
    scrollToPublications();
    setTimeout(() => {
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (searchInput) searchInput.focus();
    }, 200);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-canvas text-body-high pb-16 md:pb-0 transition-colors duration-150`}>
      {/* Top Bar Navigation (Clean Reader Presentation) */}
      <Header
        author={author}
        onOpenContact={() => setContactOpen(true)}
        paperCount={papers.length}
        bookmarkedCount={readingList.length}
        showBookmarkedOnly={showBookmarkedOnly}
        onToggleBookmarkedOnly={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
      />

      {/* Hero Section */}
      <Hero
        author={author}
        paperCount={papers.length}
        onOpenContact={() => setContactOpen(true)}
      />

      {/* Core Research Focus */}
      <ResearchFocus
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToPublications();
        }}
      />

      {/* Publications Main Section */}
      <main id="publications" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 mb-6 border-b border-theme">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-readable font-bold">
                Peer-Reviewed & Preprints
              </span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--text-title)' }}></span>
              <span className="font-mono text-xs text-muted-readable font-semibold">
                {filteredPapers.length} of {papers.length} Works
              </span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-normal text-title tracking-tight">
              Selected Publications
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-body-high max-w-sm font-sans leading-relaxed">
            Click on any title to enter distraction-free reading mode with complex LaTeX equations, or filter by tags.
          </p>
        </div>

        {/* Reading Controls Toolbar (Font Size, View Mode, Theme & Reading List) */}
        <div className="mb-5">
          <ReadingToolbar
            fontSize={fontSize}
            onChangeFontSize={handleFontSizeChange}
            viewMode={viewMode}
            onChangeViewMode={handleViewModeChange}
            theme={readingTheme}
            onChangeTheme={handleThemeChange}
            bookmarkedCount={readingList.length}
            showBookmarkedOnly={showBookmarkedOnly}
            onToggleBookmarkedOnly={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
          />
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-7">
          <FilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedKeyword={selectedKeyword}
            onSelectKeyword={setSelectedKeyword}
            sortBy={sortBy}
            onSortChange={setSortBy}
            showHighlightedOnly={showHighlightedOnly}
            onToggleHighlightedOnly={() => setShowHighlightedOnly(!showHighlightedOnly)}
            totalFiltered={filteredPapers.length}
            totalAll={papers.length}
            popularKeywords={popularKeywords}
          />
        </div>

        {/* Active Reading List Banner */}
        {showBookmarkedOnly && (
          <div className="mb-6 p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-100/90 dark:bg-amber-950/80 flex items-center justify-between text-xs text-amber-950 dark:text-amber-100">
            <div className="flex items-center gap-2 font-medium">
              <Bookmark className="w-4 h-4 fill-amber-700 text-amber-700 dark:fill-amber-400 dark:text-amber-400" />
              <span>
                Displaying <strong>{filteredPapers.length}</strong> saved publications in your personal reading queue.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowBookmarkedOnly(false)}
              className="text-xs font-bold underline underline-offset-2 hover:opacity-80"
            >
              Show All Papers
            </button>
          </div>
        )}

        {/* Papers Listing */}
        {filteredPapers.length === 0 ? (
          <div className="py-16 text-center bg-surface border border-theme rounded-xl p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-surface-subtle text-title opacity-70 flex items-center justify-center mx-auto">
              {showBookmarkedOnly ? <Bookmark className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </div>
            <h3 className="font-editorial text-xl font-bold text-title">
              {showBookmarkedOnly ? 'Your reading queue is empty' : 'No matching publications found'}
            </h3>
            <p className="text-xs sm:text-sm text-body-high max-w-md mx-auto">
              {showBookmarkedOnly 
                ? 'Save publications to your reading queue by tapping the bookmark icon on any paper card.'
                : 'No papers matched your active search query or filter tags. Try clearing filters or using broader keywords.'
              }
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSelectedKeyword(null);
                setShowHighlightedOnly(false);
                setShowBookmarkedOnly(false);
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg shadow-xs"
              style={{ backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }}
            >
              Reset All Filters
            </button>
          </div>
        ) : papersByYear ? (
          /* Chronologically grouped view */
          <div className="space-y-10 sm:space-y-12">
            {papersByYear.map((group) => (
              <section key={group.year} className="relative">
                {/* Year Marker */}
                <div className="flex items-center gap-4 mb-4 sm:mb-5">
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold font-mono text-title">
                    {group.year}
                  </h3>
                  <div className="flex-1 h-px border-b border-theme"></div>
                  <span className="text-xs font-mono text-muted-readable font-semibold">
                    {group.papers.length} {group.papers.length === 1 ? 'paper' : 'papers'}
                  </span>
                </div>

                {/* Cards Grid for this year */}
                <div className={`grid grid-cols-1 ${viewMode === 'compact' ? 'gap-3' : 'gap-5'}`}>
                  {group.papers.map((paper) => (
                    <PaperCard
                      key={paper.id || paper.title}
                      paper={paper}
                      searchQuery={searchQuery}
                      fontSize={fontSize}
                      viewMode={viewMode}
                      isBookmarked={Boolean(paper.id && readingList.includes(paper.id))}
                      onToggleBookmark={toggleBookmark}
                      onOpenReader={(p) => setReaderPaper(p)}
                      onOpenBibtex={(p) => setSelectedBibtexPaper(p)}
                      onSelectKeyword={(kw) => setSelectedKeyword(kw)}
                      onSelectCategory={(cat) => setSelectedCategory(cat)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          /* Flat list view (sorted by citations or title) */
          <div className={`grid grid-cols-1 ${viewMode === 'compact' ? 'gap-3' : 'gap-5'}`}>
            {filteredPapers.map((paper) => (
              <PaperCard
                key={paper.id || paper.title}
                paper={paper}
                searchQuery={searchQuery}
                fontSize={fontSize}
                viewMode={viewMode}
                isBookmarked={Boolean(paper.id && readingList.includes(paper.id))}
                onToggleBookmark={toggleBookmark}
                onOpenReader={(p) => setReaderPaper(p)}
                onOpenBibtex={(p) => setSelectedBibtexPaper(p)}
                onSelectKeyword={(kw) => setSelectedKeyword(kw)}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Distraction-Free Paper Reader Modal (Desktop & Mobile Bottom Sheet) */}
      <PaperReaderModal
        paper={readerPaper}
        onClose={() => setReaderPaper(null)}
        isBookmarked={Boolean(readerPaper?.id && readingList.includes(readerPaper.id))}
        onToggleBookmark={toggleBookmark}
        onOpenBibtex={(p) => setSelectedBibtexPaper(p)}
        fontSize={fontSize}
        onChangeFontSize={handleFontSizeChange}
      />

      {/* BibTeX and Citation Modal */}
      <BibTeXModal
        paper={selectedBibtexPaper}
        onClose={() => setSelectedBibtexPaper(null)}
      />

      {/* Academic Inquiries & Collaboration Modal */}
      <ContactModal
        author={author}
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />

      {/* Mobile Preferences Bottom Drawer */}
      <MobilePreferencesDrawer
        isOpen={mobilePrefsOpen}
        onClose={() => setMobilePrefsOpen(false)}
        fontSize={fontSize}
        onChangeFontSize={handleFontSizeChange}
        theme={readingTheme}
        onChangeTheme={handleThemeChange}
        viewMode={viewMode}
        onChangeViewMode={handleViewModeChange}
      />

      {/* Refined Academic Footer */}
      <Footer
        author={author}
        paperCount={papers.length}
        onOpenContact={() => setContactOpen(true)}
      />

      {/* Mobile Bottom Thumb Navigation Dock */}
      <MobileBottomDock
        onFocusSearch={handleFocusSearch}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onScrollToPublications={scrollToPublications}
        bookmarkedCount={readingList.length}
        showBookmarkedOnly={showBookmarkedOnly}
        onToggleBookmarkedOnly={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
        onOpenPreferences={() => setMobilePrefsOpen(true)}
      />
    </div>
  );
}
