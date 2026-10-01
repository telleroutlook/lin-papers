import { Paper } from '../types/paper';
import { markdownToPaper } from './markdownYaml';

/**
 * Loads all Markdown paper files located in `content/papers/*.md`
 * using Vite's eager glob import.
 */
export function loadPapersFromDirectory(): Paper[] {
  // Vite glob import of raw markdown files
  const modules = import.meta.glob('../../content/papers/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;

  const papers: Paper[] = [];

  for (const [path, rawContent] of Object.entries(modules)) {
    const filename = path.split('/').pop()?.replace(/\.md$/, '') || 'paper';
    if (filename.toLowerCase() === 'readme' || filename.startsWith('_')) {
      continue;
    }
    try {
      const paper = markdownToPaper(rawContent, filename);
      papers.push(paper);
    } catch (err) {
      console.warn(`Failed to parse paper at ${path}:`, err);
    }
  }

  // Sort by date/year descending
  return papers.sort((a, b) => {
    const dateA = a.publishedDate || `${a.year || 2026}-01-01`;
    const dateB = b.publishedDate || `${b.year || 2026}-01-01`;
    return dateB.localeCompare(dateA);
  });
}
