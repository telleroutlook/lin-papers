import React, { useEffect, useState } from 'react';
import { Paper, ReadingFontSize } from '../types/paper';
import { MathMarkdownRenderer } from './MathMarkdownRenderer';
import { 
  X, 
  FileText, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  Check, 
  Copy, 
  Sparkles,
  Award,
  Quote,
  Calendar,
  Layers,
  BookOpen
} from 'lucide-react';

interface PaperReaderModalProps {
  paper: Paper | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (paperId: string) => void;
  onOpenBibtex: (paper: Paper) => void;
  fontSize: ReadingFontSize;
  onChangeFontSize: (size: ReadingFontSize) => void;
}

export const PaperReaderModal: React.FC<PaperReaderModalProps> = ({
  paper,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onOpenBibtex,
  fontSize,
  onChangeFontSize,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCite, setCopiedCite] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'abstract'>('content');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!paper) return null;

  const totalWords = ((paper.content || '') + (paper.abstract || '')).split(/\s+/).length;
  const readingTimeMin = Math.max(1, Math.round(totalWords / 130));

  const handleShareLink = () => {
    const url = window.location.origin + window.location.pathname + `#paper-${paper.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCitation = () => {
    const yr = paper.year || (paper.publishedDate ? new Date(paper.publishedDate).getFullYear() : 2026);
    const cite = `${paper.authors.join(', ')} (${yr}). ${paper.title}. ${paper.venue || 'Research Manuscript'}. https://doi.org/${paper.doi}`;
    navigator.clipboard.writeText(cite);
    setCopiedCite(true);
    setTimeout(() => setCopiedCite(false), 2000);
  };

  const fontClass = 
    fontSize === 'larger' 
      ? 'text-lg sm:text-xl' 
      : fontSize === 'large' 
        ? 'text-base sm:text-lg' 
        : 'text-sm sm:text-base';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/70 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-4xl bg-surface sm:rounded-2xl rounded-t-3xl border border-theme shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Grab Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-theme-strong rounded-full opacity-60"></div>
        </div>

        {/* Reader Top Action Bar */}
        <header className="px-5 sm:px-8 py-3.5 border-b border-theme flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2 text-xs">
            {paper.category && (
              <>
                <span className="font-mono uppercase tracking-wider text-[11px] font-bold text-title">
                  {paper.category}
                </span>
                <span aria-hidden="true" className="opacity-40">·</span>
              </>
            )}
            <span className="font-mono text-[11px] text-muted-readable font-semibold">
              {paper.publishedDate}
            </span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span className="font-mono text-[11px] text-muted-readable font-semibold">
              {readingTimeMin} min read
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Font Size Selector (A- / A+) */}
            <div className="hidden sm:flex items-center bg-surface border border-theme rounded-md p-0.5 text-xs mr-2">
              {(['normal', 'large', 'larger'] as const).map((sz, idx) => {
                const label = idx === 0 ? 'A' : idx === 1 ? 'A+' : 'A++';
                const isActive = fontSize === sz;
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => onChangeFontSize(sz)}
                    className={`px-2 py-0.5 rounded transition-colors font-bold ${
                      isActive ? 'shadow-xs' : 'text-body-high hover:text-title'
                    }`}
                    style={
                      isActive
                        ? { backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }
                        : undefined
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Bookmark button */}
            <button
              type="button"
              onClick={() => paper.id && onToggleBookmark(paper.id)}
              className={`p-2 rounded-lg border transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${
                isBookmarked 
                  ? 'bg-amber-100/90 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border-amber-300' 
                  : 'bg-surface text-title border-theme hover:border-theme-strong'
              }`}
              title={isBookmarked ? 'Remove from reading queue' : 'Save to reading queue'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-600 text-amber-600 dark:fill-amber-400 dark:text-amber-400' : ''}`} />
            </button>

            {/* Share link button */}
            <button
              type="button"
              onClick={handleShareLink}
              className="p-2 rounded-lg border border-theme bg-surface text-title hover:border-theme-strong transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Share publication link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-title hover:opacity-70 bg-surface-subtle transition-colors ml-1 min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Close reader (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Reader Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 sm:py-8 space-y-6 scrollbar-thin">
          {/* Header Metadata */}
          <div className="space-y-3">
            {paper.award && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-300">
                <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{paper.award}</span>
              </div>
            )}

            <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-normal text-title leading-tight tracking-tight">
              {paper.title}
            </h1>

            {/* Authors (Required) */}
            <div className="text-xs sm:text-sm text-body-high font-sans leading-relaxed">
              {paper.authors.map((author, idx) => (
                <span key={idx}>
                  <strong className={author.includes('Vance') ? 'text-title font-bold underline decoration-current/30' : 'font-normal'}>
                    {author}
                  </strong>
                  {idx < paper.authors.length - 1 && ', '}
                </span>
              ))}
            </div>

            {/* Publication Date, DOI, and optional Venue */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono pt-1 text-muted-readable">
              {paper.venue && (
                <>
                  <span className="font-bold text-title">{paper.venue}</span>
                  <span aria-hidden="true" className="opacity-40">·</span>
                </>
              )}
              <span className="flex items-center gap-1 text-body-high font-semibold">
                <Calendar className="w-3 h-3 opacity-60" />
                <span>Published: {paper.publishedDate}</span>
              </span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span className="flex items-center gap-1 font-semibold text-title">
                <span>DOI:</span>
                <a
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline underline-offset-2 decoration-current/40"
                >
                  {paper.doi}
                </a>
              </span>
            </div>
          </div>

          {/* TL;DR Callout Box */}
          {paper.tldr && (
            <div className="p-4 rounded-xl border border-theme-strong bg-surface-subtle space-y-1.5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-title font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Executive Takeaway</span>
              </div>
              <p className="text-sm sm:text-base text-body-high font-serif italic leading-relaxed">
                "{paper.tldr}"
              </p>
            </div>
          )}

          {/* Tab Switcher: Full Manuscript Content vs Abstract */}
          <div className="flex items-center gap-1 border-b border-theme pb-2 pt-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all ${
                activeTab === 'content'
                  ? 'shadow-xs'
                  : 'text-body-high hover:text-title'
              }`}
              style={
                activeTab === 'content'
                  ? { backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }
                  : undefined
              }
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Manuscript Content & Formulas</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('abstract')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all ${
                activeTab === 'abstract'
                  ? 'shadow-xs'
                  : 'text-body-high hover:text-title'
              }`}
              style={
                activeTab === 'abstract'
                  ? { backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }
                  : undefined
              }
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Abstract Summary</span>
            </button>
          </div>

          {/* Active Tab: Manuscript Content with KaTeX Math or Abstract */}
          {activeTab === 'content' ? (
            <div className={`space-y-4 pt-1 ${fontClass}`}>
              <MathMarkdownRenderer content={paper.content || paper.abstract} />
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              <h4 className="font-mono text-xs uppercase tracking-wider text-muted-readable font-bold">
                Abstract
              </h4>
              <div className={`p-4 rounded-xl bg-surface-subtle border border-theme text-body-high leading-relaxed ${fontClass}`}>
                <MathMarkdownRenderer content={paper.abstract} />
              </div>
            </div>
          )}

          {/* Keywords (Required) */}
          {paper.keywords && paper.keywords.length > 0 && (
            <div className="pt-5 border-t border-theme/60 space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-readable font-bold">
                Classified Subject Keywords
              </span>
              <div className="flex flex-wrap gap-1.5">
                {paper.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-surface-subtle text-title border border-theme rounded-md text-xs font-mono font-medium"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        <footer className="px-5 sm:px-8 py-3.5 border-t border-theme bg-surface-subtle flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {paper.pdfUrl && (
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg shadow-xs min-h-[44px]"
                style={{ backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }}
              >
                <FileText className="w-4 h-4" />
                <span>Read Full PDF</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            )}

            {paper.codeUrl && (
              <a
                href={paper.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-title bg-surface border border-theme hover:border-theme-strong rounded-lg transition-colors min-h-[44px]"
              >
                <span>Code Repository</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopyCitation}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-title bg-surface border border-theme hover:border-theme-strong rounded-lg transition-colors min-h-[44px]"
            >
              {copiedCite ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 opacity-70" />
                  <span>Copy Citation</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onOpenBibtex(paper)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold text-title bg-surface-subtle hover:bg-surface border border-theme rounded-lg transition-colors min-h-[44px]"
            >
              <Quote className="w-3.5 h-3.5 opacity-70" />
              <span>BibTeX</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
