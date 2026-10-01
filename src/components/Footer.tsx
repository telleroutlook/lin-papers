import React from 'react';
import { AuthorProfile } from '../types/paper';
import { ExternalLink, ArrowUp, Mail, Quote } from 'lucide-react';

interface FooterProps {
  author: AuthorProfile;
  paperCount: number;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  author,
  paperCount,
  onOpenContact,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 border-t border-theme bg-canvas-subtle transition-colors">
      {/* Top Academic Manifesto & Quick Actions */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14">
          {/* Column 1: Scholar Bio & Academic Lineage */}
          <div className="md:col-span-5 space-y-4">
            <div className="space-y-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-readable font-bold">
                Academic Portfolio & Archive
              </span>
              <h4 className="font-editorial text-2xl font-normal text-title">
                {author.name}
              </h4>
              <p className="text-xs text-body-high font-sans leading-relaxed">
                {author.title} at {author.affiliation}.
              </p>
            </div>

            <p className="text-xs text-body-high font-sans leading-relaxed">
              Committed to open scientific research, reproducible algorithmic formulations, and transparent empirical benchmarks in foundation AI systems.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <button
                type="button"
                onClick={onOpenContact}
                className="inline-flex items-center gap-1.5 font-bold text-title hover:underline underline-offset-4"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Academic Inquiries</span>
              </button>
              <span className="opacity-30" aria-hidden="true">·</span>
              <span className="text-xs text-muted-readable font-mono">
                Static Markdown-Driven Repository
              </span>
            </div>
          </div>

          {/* Column 2: Profiles & Academic Indexes */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="font-mono text-xs uppercase tracking-wider text-muted-readable font-bold">
              Research Indexes
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={author.scholarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-body-high hover:text-title inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Google Scholar Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href={author.arxivUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-body-high hover:text-title inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>arXiv Repository</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href={`https://orcid.org/${author.orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-body-high hover:text-title inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>ORCID ({author.orcid})</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href={author.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-body-high hover:text-title inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>GitHub Research Group</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Citation & Open Access Mandate */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="font-mono text-xs uppercase tracking-wider text-muted-readable font-bold">
              Open Science & Citation
            </h5>
            <div className="p-3.5 bg-surface border border-theme rounded-lg space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-title">
                <Quote className="w-3.5 h-3.5 opacity-70" />
                <span>Archival Attribution</span>
              </div>
              <p className="leading-relaxed text-[11px] text-body-high">
                All preprints and proceedings are archived under CC-BY 4.0. To cite this portfolio collection:
              </p>
              <pre className="p-2.5 bg-surface-subtle border border-theme rounded text-[10px] font-mono text-title whitespace-pre-wrap select-all font-medium">
{`@misc{vance_archive_2026,
  author = {Vance, Alistair},
  title = {Selected Academic Publications Archive},
  year = {2026},
  url = {https://vance-lab.stanford.edu}
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Bottom Baseline Bar */}
        <div className="mt-10 pt-5 border-t border-theme/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-2 text-muted-readable font-semibold">
            <span>© {new Date().getFullYear()} {author.name}. All papers preserved for scholarly review.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-muted-readable font-semibold">
              {paperCount} Works Cataloged
            </span>
            <span aria-hidden="true" className="opacity-30">·</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 font-bold text-title hover:underline transition-colors min-h-[36px]"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
