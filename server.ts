import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PAPERS, INITIAL_AUTHOR } from './src/data/initialPapers';
import { Paper, AuthorProfile } from './src/types/paper';
import { markdownToPaper, paperToMarkdown } from './src/utils/markdownYaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAPERS_DIR = path.join(__dirname, 'content', 'papers');
const AUTHOR_FILE = path.join(__dirname, 'data', 'author.json');

// Ensure papers directory exists
if (!fs.existsSync(PAPERS_DIR)) {
  fs.mkdirSync(PAPERS_DIR, { recursive: true });
}

/**
 * Loads all publications directly from the `content/papers/` directory.
 * Each file is a standard Markdown file with YAML frontmatter.
 */
function loadPapersFromDirectory(): Paper[] {
  try {
    if (fs.existsSync(PAPERS_DIR)) {
      const files = fs.readdirSync(PAPERS_DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_') && f.toLowerCase() !== 'readme.md');
      const papers: Paper[] = [];

      for (const file of files) {
        const filePath = path.join(PAPERS_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const slugId = file.replace(/\.md$/, '');
        const paper = markdownToPaper(fileContent, slugId);
        papers.push(paper);
      }

      if (papers.length > 0) {
        return papers.sort((a, b) => {
          const dateA = a.publishedDate || `${a.year || 2026}-01-01`;
          const dateB = b.publishedDate || `${b.year || 2026}-01-01`;
          return dateB.localeCompare(dateA);
        });
      }
    }
  } catch (error) {
    console.error('Error reading content/papers directory, falling back to initial data:', error);
  }

  return INITIAL_PAPERS;
}

function loadAuthor(): AuthorProfile {
  try {
    if (fs.existsSync(AUTHOR_FILE)) {
      const fileContent = fs.readFileSync(AUTHOR_FILE, 'utf-8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Error reading author.json, falling back to initial author:', error);
  }

  return INITIAL_AUTHOR;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // --- API Routes ---

  // Get all papers directly scanned from content/papers/*.md
  app.get('/api/papers', (_req: Request, res: Response) => {
    const papers = loadPapersFromDirectory();
    res.json({ success: true, count: papers.length, papers });
  });

  // Get single paper by id / slug
  app.get('/api/papers/:id', (req: Request, res: Response) => {
    const papers = loadPapersFromDirectory();
    const paper = papers.find((p) => p.id === req.params.id);
    if (!paper) {
      res.status(404).json({ success: false, error: 'Paper not found in content/papers directory' });
      return;
    }
    res.json({ success: true, paper, rawMarkdown: paperToMarkdown(paper) });
  });

  // Author profile
  app.get('/api/author', (_req: Request, res: Response) => {
    const author = loadAuthor();
    res.json({ success: true, author });
  });

  // In development, hook into Vite dev server middlewares
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static assets from dist
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (reading from content/papers/*.md)`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
