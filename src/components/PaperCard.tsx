import React, { useState } from 'react';
import { Paper, ReadingFontSize, ReadingViewMode } from '../types/paper';
import { HighlightText } from './HighlightText';
import { MathMarkdownRenderer } from './MathMarkdownRenderer';
import { 
  FileText, 
  ExternalLink, 
  Github, 
  Quote, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Check, 
  Copy, 
  Edit2, 
  Search, 
  Bookmark, 
  BookOpen,
  Calendar
} from 'lucide-react';

interface PaperCardProps {
  paper: Paper;
  searchQuery?: string;
  fontSize?: ReadingFontSize;
  viewMode?: ReadingViewMode;
  isBookmarked?: boolean;
  onToggleBookmark?: (paperId: string) => void;
  onOpenReader?: (paper: Paper) => void;
  onOpenBibtex: (paper: Paper) => void;
  onSelectKeyword?: (keyword: string) => void;
  onSelectCategory?: (category: string) => void;
}

export const PaperCard: React.FC<PaperCardProps> = ({
  paper,
  searchQuery = '',
  fontSize = 'normal',
  viewMode = 'editorial',
  isBookmarked = false,
  onToggleBookmark,
  onOpenReader,
  onOpenBibtex,
  onSelectKeyword,
  onSelectCategory,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [copiedQuick, setCopiedQuick] = useState(false);

  // Check if search terms appear in the abstract or content
  const terms = searchQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const matchInAbstract = terms.length > 0 && terms.some((t) => 
    (paper.abstract || '').toLowerCase().includes(t) || (paper.content || '').toLowerCase().includes(t)
  );

  const matchInKeywords = terms.length > 0 && terms.some((t) => 
    (paper.keywords || []).some((k) => k.toLowerCase().includes(t))
  );

  const handleCopyCitation = (e: React.MouseEvent) => {
    e.stopPropagation();
    const yr = paper.year || (paper.publishedDate ? new Date(paper.publishedDate).getFullYear() : 2026);
    const citation = `${paper.authors.join(', ')} (${yr}). ${paper.title}. ${paper.venue || 'Research Manuscript'}. https://doi.org/${paper.doi}`;
    navigator.clipboard.writeText(citation);
    setCopiedQuick(true);
    setTimeout(() => setCopiedQuick(false), 2000);
  };

  const titleClass =
    fontSize === 'larger'
      ? 'text-2xl sm:text-3xl'
      : fontSize === 'large'
        ? 'text-xl sm:text-2xl'
        : 'text-lg sm:text-xl md:text-2xl';

  const bodyClass =
    fontSize === 'larger'
      ? 'text-sm sm:text-base leading-relaxed'
      : fontSize === 'large'
        ? 'text-xs sm:text-sm md:text-base leading-relaxed'
        : 'text-xs sm:text-sm leading-relaxed';

  // --------------------------------------------------------------------------
  // COMPACT VIEW: Ultra-fast scanning view for researchers browsing 20+ papers
  // --------------------------------------------------------------------------
  if (viewMode === 'compact') {
    return (
      <article 
        className="group relative bg-surface border border-theme rounded-xl p-4 sm:p-5 transition-all duration-200 hover:border-theme-strong hover:shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono text-title font-bold">
              {paper.year || (paper.publishedDate ? new Date(paper.publishedDate).getFullYear() : 2026)}
            </span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span className="font-semibold text-title">{paper.venue || 'Manuscript'}</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span className="text-muted-readable font-mono text-[11px]">{paper.publishedDate}</span>
            {paper.category && (
              <>
                <span aria-hidden="true" className="opacity-40">·</span>
                <span className="text-muted-readable">{paper.category}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {paper.award && (
              <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300/40">
                {paper.award}
              </span>
            )}
            {onToggleBookmark && paper.id && (
              <button
                type="button"
                onClick={() => onToggleBookmark(paper.id!)}
                className="p-1 text-muted-readable hover:text-title transition-colors"
                title={isBookmarked ? 'Remove from reading queue' : 'Add to reading queue'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600 text-amber-600 dark:fill-amber-400 dark:text-amber-400' : ''}`} />
              </button>
            )}
          </div>
        </div>

        <h3 className="font-editorial text-lg font-medium text-title mb-1 leading-snug">
          <button
            type="button"
            onClick={() => onOpenReader && onOpenReader(paper)}
            className="text-left hover:underline underline-offset-2 decoration-current/40"
          >
            <HighlightText text={paper.title} query={searchQuery} />
          </button>
        </h3>

        <div className="text-xs text-muted-readable line-clamp-1 mb-2 font-sans">
          {paper.authors.join(', ')}
        </div>

        {paper.tldr && (
          <p className="text-xs text-body-high italic line-clamp-2 mb-3 bg-surface-subtle p-2.5 rounded border border-theme/50">
            "{paper.tldr}"
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-theme/60 text-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenReader && onOpenReader(paper)}
              className="inline-flex items-center gap-1 font-semibold text-title hover:underline min-h-[36px]"
            >
              <BookOpen className="w-3.5 h-3.5 opacity-70" />
              <span>Read Full Manuscript & Formulas</span>
            </button>

            {paper.pdfUrl && (
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-body-high hover:text-title min-h-[36px]"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-muted-readable hover:text-title underline"
            >
              DOI: {paper.doi}
            </a>
            <button
              type="button"
              onClick={handleCopyCitation}
              className="text-body-high hover:text-title p-1"
              title="Copy citation"
            >
              {copiedQuick ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => onOpenBibtex(paper)}
              className="text-body-high hover:text-title font-mono text-[11px] p-1"
              title="BibTeX citation"
            >
              BibTeX
            </button>
          </div>
        </div>
      </article>
    );
  }

  // --------------------------------------------------------------------------
  // EDITORIAL VIEW: Standard spacious card with high typographic polish
  // --------------------------------------------------------------------------
  return (
    <article 
      id={paper.id ? `paper-${paper.id}` : undefined}
      className="group relative bg-surface border border-theme rounded-xl p-5 sm:p-7 transition-all duration-200 hover:border-theme-strong hover:shadow-sm"
    >
      {/* Top Metadata Line */}
      <div className="flex flex-wrap items-center justify-between gap-y-1.5 text-xs text-muted-readable mb-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category - clickable if present */}
          {paper.category && (
            <>
              <button
                type="button"
                onClick={() => onSelectCategory && onSelectCategory(paper.category!)}
                className="font-semibold text-body-high hover:text-title hover:underline transition-colors"
              >
                <HighlightText text={paper.category} query={searchQuery} />
              </button>
              <span aria-hidden="true" className="opacity-40">·</span>
            </>
          )}

          {/* Venue & Published Date */}
          {paper.venue && (
            <>
              <span className="font-bold text-title">
                <HighlightText text={paper.venue} query={searchQuery} />
              </span>
              <span aria-hidden="true" className="opacity-40">·</span>
            </>
          )}

          <span className="font-mono text-muted-readable font-semibold flex items-center gap-1">
            <Calendar className="w-3 h-3 opacity-60" />
            <span>{paper.publishedDate}</span>
          </span>

          <span aria-hidden="true" className="opacity-40">·</span>

          {/* DOI (Required) */}
          <a
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-muted-readable hover:text-title hover:underline"
          >
            DOI: {paper.doi}
          </a>
        </div>

        {/* Citations, Bookmark & Award */}
        <div className="flex items-center gap-2.5">
          {searchQuery.trim() && (matchInAbstract || matchInKeywords) && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-900 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/70 px-2 py-0.5 rounded border border-amber-300/60">
              <Search className="w-3 h-3 text-amber-700 dark:text-amber-300" />
              <span>
                {matchInAbstract && matchInKeywords
                  ? 'Matched in text & index'
                  : matchInAbstract
                  ? 'Matched in content'
                  : 'Matched in index'}
              </span>
            </span>
          )}

          {paper.award && (
            <div className="flex items-center gap-1 text-amber-800 dark:text-amber-300 font-semibold text-[11px] bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200/50">
              <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{paper.award}</span>
            </div>
          )}

          {paper.citations !== undefined && paper.citations > 0 && (
            <span className="font-mono text-[11px] text-muted-readable font-semibold tabular-nums hidden sm:inline">
              {paper.citations} cit.
            </span>
          )}

          {/* Reading List Bookmark Trigger */}
          {onToggleBookmark && paper.id && (
            <button
              type="button"
              onClick={() => onToggleBookmark(paper.id!)}
              className={`p-1.5 rounded-md border transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
                isBookmarked 
                  ? 'bg-amber-100/80 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-amber-300/80' 
                  : 'bg-surface-subtle text-muted-readable border-theme hover:text-title hover:border-theme-strong'
              }`}
              title={isBookmarked ? 'Remove from reading queue' : 'Save to reading queue'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600 text-amber-600 dark:fill-amber-400 dark:text-amber-400' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Primary Paper Title with Search Highlighting & Click-to-Read */}
      <h2 className={`font-editorial ${titleClass} font-normal text-title leading-snug tracking-tight mb-2.5 transition-colors`}>
        <button
          type="button"
          onClick={() => onOpenReader && onOpenReader(paper)}
          className="text-left hover:underline underline-offset-3 decoration-current/40"
          title="Open manuscript & mathematical formulation reader"
        >
          <HighlightText text={paper.title} query={searchQuery} />
        </button>
      </h2>

      {/* Authors list (Required) */}
      <div className="text-xs sm:text-sm text-body-high mb-3.5 leading-relaxed font-sans">
        {paper.authors.map((author, index) => {
          const isLead = author.includes('Vance') || author.includes('Alistair');
          return (
            <React.Fragment key={index}>
              <span className={isLead ? 'font-bold text-title underline decoration-current/30' : ''}>
                <HighlightText text={author} query={searchQuery} />
              </span>
              {index < paper.authors.length - 1 && <span className="opacity-50">, </span>}
            </React.Fragment>
          );
        })}
      </div>

      {/* TL;DR Highlight quote box (Optional) */}
      {paper.tldr && (
        <div className="mb-4 pl-3.5 py-2.5 border-l-2 border-theme-strong bg-surface-subtle rounded-r text-xs sm:text-sm text-body-high italic font-sans leading-relaxed">
          <span className="font-bold not-italic text-title mr-1.5 font-mono text-[11px] uppercase tracking-wide">
            TL;DR:
          </span>
          <HighlightText text={paper.tldr} query={searchQuery} />
        </div>
      )}

      {/* Expandable Abstract with KaTeX Math rendering */}
      <div className="mb-4">
        <div 
          className={`${bodyClass} text-body-high font-sans transition-all ${
            expanded ? '' : 'line-clamp-2 sm:line-clamp-3'
          }`}
        >
          {paper.abstract ? (
            <div className="space-y-1.5 leading-relaxed">
              <MathMarkdownRenderer content={paper.abstract} searchQuery={searchQuery} />
            </div>
          ) : (
            <p className="italic text-muted-readable">Abstract summary pending publication archive sync.</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-2.5">
          {paper.abstract && paper.abstract.length > 80 && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-title hover:underline transition-colors min-h-[38px] py-1"
            >
              <span>{expanded ? 'Show Less' : matchInAbstract && !expanded ? 'Read Full Abstract (Matches Inside)' : 'Read Full Abstract'}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}

          <span className="opacity-30 hidden sm:inline" aria-hidden="true">·</span>

          <button
            type="button"
            onClick={() => onOpenReader && onOpenReader(paper)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-title bg-surface-subtle hover:bg-surface border border-theme hover:border-theme-strong px-2.5 py-1 rounded-md transition-colors min-h-[38px]"
          >
            <BookOpen className="w-3.5 h-3.5 opacity-70" />
            <span>Manuscript & Formulas</span>
          </button>
        </div>
      </div>

      {/* Keywords (Required) */}
      {paper.keywords && paper.keywords.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 mb-4 text-xs">
          <span className="font-mono text-[11px] text-muted-readable font-semibold mr-1">Index:</span>
          {paper.keywords.map((kw, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelectKeyword && onSelectKeyword(kw)}
              className="text-body-high hover:text-title bg-surface-subtle hover:bg-surface-subtle/80 border border-theme px-2.5 py-1 rounded text-[11px] font-mono transition-colors min-h-[28px]"
            >
              #<HighlightText text={kw} query={searchQuery} />
            </button>
          ))}
        </div>
      )}

      {/* Bottom Action Affordances */}
      <div className="pt-3 border-t border-theme/60 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-title bg-surface-subtle hover:bg-surface border border-theme hover:border-theme-strong rounded-md transition-colors min-h-[40px]"
            >
              <FileText className="w-3.5 h-3.5 opacity-70" />
              <span>PDF</span>
            </a>
          )}

          {paper.doi && (
            <a
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-title bg-surface-subtle hover:bg-surface border border-theme hover:border-theme-strong rounded-md transition-colors min-h-[40px]"
            >
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              <span>DOI</span>
            </a>
          )}

          {paper.arxivId && (
            <a
              href={`https://arxiv.org/abs/${paper.arxivId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-title bg-surface-subtle hover:bg-surface border border-theme hover:border-theme-strong rounded-md transition-colors min-h-[40px]"
            >
              <span>arXiv</span>
            </a>
          )}

          {paper.codeUrl && (
            <a
              href={paper.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-title bg-surface-subtle hover:bg-surface border border-theme hover:border-theme-strong rounded-md transition-colors min-h-[40px]"
            >
              <Github className="w-3.5 h-3.5 opacity-70" />
              <span>Code</span>
            </a>
          )}
        </div>

        {/* Right side cite triggers */}
        <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
          <button
            type="button"
            onClick={handleCopyCitation}
            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-title bg-surface-subtle hover:bg-surface border border-theme rounded-md transition-colors text-xs font-medium min-h-[40px]"
            title="Copy standard citation"
          >
            {copiedQuick ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 opacity-70" />
                <span>Cite</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onOpenBibtex(paper)}
            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-title bg-surface-subtle hover:bg-surface border border-theme rounded-md transition-colors text-xs font-mono font-medium min-h-[40px]"
            title="View & copy BibTeX citation"
          >
            <Quote className="w-3.5 h-3.5 opacity-70" />
            <span>BibTeX</span>
          </button>
        </div>
      </div>
    </article>
  );
};
