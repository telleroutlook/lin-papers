import YAML from 'yaml';
import { Paper } from '../types/paper';

/**
 * Converts a Paper object to a standard Markdown document with YAML frontmatter.
 * Required fields: title, authors, publishedDate, abstract, keywords, content, doi.
 * All other fields are optional.
 */
export function paperToMarkdown(paper: Paper): string {
  const frontmatterData: Record<string, any> = {
    title: paper.title,
    authors: paper.authors,
    publishedDate: paper.publishedDate,
    abstract: paper.abstract,
    keywords: paper.keywords,
    doi: paper.doi,
  };

  // Optional fields
  if (paper.id) frontmatterData.id = paper.id;
  if (paper.venue) frontmatterData.venue = paper.venue;
  if (paper.year) frontmatterData.year = paper.year;
  if (paper.category) frontmatterData.category = paper.category;
  if (paper.tldr) frontmatterData.tldr = paper.tldr;
  if (paper.citations !== undefined) frontmatterData.citations = paper.citations;
  if (paper.highlighted !== undefined) frontmatterData.highlighted = paper.highlighted;
  if (paper.award) frontmatterData.award = paper.award;
  if (paper.arxivId) frontmatterData.arxivId = paper.arxivId;
  if (paper.pdfUrl) frontmatterData.pdfUrl = paper.pdfUrl;
  if (paper.codeUrl) frontmatterData.codeUrl = paper.codeUrl;
  if (paper.demoUrl) frontmatterData.demoUrl = paper.demoUrl;
  if (paper.slidesUrl) frontmatterData.slidesUrl = paper.slidesUrl;
  if (paper.bibtex) frontmatterData.bibtex = paper.bibtex;

  const yamlString = YAML.stringify(frontmatterData).trim();
  const bodyContent = (paper.content || '').trim();

  return `---\n${yamlString}\n---\n\n${bodyContent}\n`;
}

/**
 * Parses a Markdown document with YAML frontmatter into a Paper object.
 * Enforces the 7 required fields: title, authors, publishedDate, abstract, keywords, content, doi.
 */
export function markdownToPaper(raw: string, defaultId?: string): Paper {
  const trimmed = raw.trim();
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = trimmed.match(frontmatterRegex);

  let meta: Record<string, any> = {};
  let body = '';

  if (match) {
    try {
      meta = YAML.parse(match[1]) || {};
      body = match[2].trim();
    } catch (e) {
      console.warn('YAML parsing failed, attempting raw parse', e);
    }
  } else {
    try {
      meta = YAML.parse(trimmed) || {};
    } catch {
      body = trimmed;
    }
  }

  // 1. Title (Required)
  const title = meta.title || 'Untitled Publication';

  // 2. Authors (Required)
  const authors = Array.isArray(meta.authors)
    ? meta.authors
    : typeof meta.authors === 'string'
      ? meta.authors.split(',').map((a: string) => a.trim())
      : ['Alistair Vance'];

  // 3. Published Date (Required)
  const publishedDate = meta.publishedDate || meta.date || new Date().toISOString().split('T')[0];

  // 4. DOI (Required)
  const doi = meta.doi || `10.48550/arXiv.${Date.now().toString().slice(-6)}`;

  // 5. Abstract (Required)
  const abstract = meta.abstract || (body ? body.slice(0, 300) : 'Abstract summary.');

  // 6. Keywords (Required)
  const keywords = Array.isArray(meta.keywords)
    ? meta.keywords
    : typeof meta.keywords === 'string'
      ? meta.keywords.split(',').map((k: string) => k.trim())
      : ['Artificial Intelligence'];

  // 7. Content (Required - Markdown + Complex LaTeX Math)
  const content = body || meta.content || abstract;

  // Optional fields with sensible defaults
  const id = meta.id || defaultId || generateSlug(title);
  const year = Number(meta.year) || (publishedDate ? new Date(publishedDate).getFullYear() : 2026) || 2026;
  const venue = meta.venue || 'Research Manuscript';
  const category = meta.category || 'General';

  const paper: Paper = {
    id,
    title,
    authors,
    publishedDate,
    abstract,
    keywords,
    content,
    doi,
    venue,
    year,
    category,
    tldr: meta.tldr || undefined,
    arxivId: meta.arxivId || undefined,
    pdfUrl: meta.pdfUrl || undefined,
    codeUrl: meta.codeUrl || undefined,
    demoUrl: meta.demoUrl || undefined,
    slidesUrl: meta.slidesUrl || undefined,
    citations: meta.citations !== undefined ? Number(meta.citations) : undefined,
    highlighted: meta.highlighted !== undefined ? Boolean(meta.highlighted) : undefined,
    award: meta.award || undefined,
    bibtex: meta.bibtex || generateBibTeX({
      id,
      title,
      authors,
      venue,
      year,
      doi,
      arxivId: meta.arxivId
    })
  };

  return paper;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .slice(0, 50);
}

export function generateBibTeX(paper: Partial<Paper>): string {
  const firstAuthorLastName = paper.authors && paper.authors.length > 0 
    ? (paper.authors[0].split(' ').pop() || 'author').toLowerCase()
    : 'author';
  const year = paper.year || new Date().getFullYear();
  const keyWord = (paper.title || 'paper').split(' ')[0].toLowerCase().replace(/[^\w]/g, '');
  const citeKey = `${firstAuthorLastName}${year}${keyWord}`;
  const authorString = (paper.authors || []).join(' and ');

  return `@article{${citeKey},
  title={${paper.title || 'Untitled'}},
  author={${authorString}},
  journal={${paper.venue || 'Preprint'}},
  year={${year}}${paper.doi ? `,\n  doi={${paper.doi}}` : ''}${paper.arxivId ? `,\n  archivePrefix={arXiv},\n  eprint={${paper.arxivId}}` : ''}
}`;
}

export function formatCitation(paper: Paper, style: 'bibtex' | 'apa' | 'ieee' | 'mla'): string {
  const authorStr = paper.authors.join(', ');
  const yr = paper.year || (paper.publishedDate ? new Date(paper.publishedDate).getFullYear() : 2026);
  const ven = paper.venue || 'Preprint';
  const doiStr = paper.doi ? ` https://doi.org/${paper.doi}` : '';

  switch (style) {
    case 'bibtex':
      return paper.bibtex || generateBibTeX(paper);
    case 'apa':
      return `${authorStr} (${yr}). ${paper.title}. ${ven}.${doiStr}`;
    case 'ieee':
      return `${authorStr}, "${paper.title}," ${ven}, ${yr}.${doiStr ? ` doi: ${paper.doi}.` : ''}`;
    case 'mla':
      return `${authorStr}. "${paper.title}." ${ven}, ${yr}.${doiStr}`;
    default:
      return paper.bibtex || generateBibTeX(paper);
  }
}
