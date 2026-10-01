import React from 'react';
import { AuthorProfile } from '../types/paper';
import { BookOpen, ExternalLink, Github, Mail } from 'lucide-react';

interface HeroProps {
  author: AuthorProfile;
  paperCount: number;
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ author, paperCount, onOpenContact }) => {
  return (
    <section className="relative pt-10 sm:pt-12 pb-14 sm:pb-16 border-b border-theme bg-canvas-subtle/40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Academic Persona & Mission */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-readable font-semibold">
                <span>Academic Research Archive</span>
                <span aria-hidden="true" className="opacity-40">·</span>
                <span>{author.affiliation}</span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-title tracking-tight leading-[1.14]">
                Scaling latent reasoning, formal safety, and test-time intelligence.
              </h1>
            </div>

            <p className="text-base sm:text-lg text-body-high font-sans leading-relaxed max-w-2xl">
              {author.bio}
            </p>

            {/* Quick Profile Links */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-sm text-body-high">
              <a
                href={author.scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium hover:text-title underline underline-offset-4 decoration-current/40 hover:decoration-current transition-colors"
              >
                <span>Google Scholar</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
              <span className="opacity-30" aria-hidden="true">/</span>
              <a
                href={author.arxivUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium hover:text-title underline underline-offset-4 decoration-current/40 hover:decoration-current transition-colors"
              >
                <span>arXiv Preprints</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
              <span className="opacity-30" aria-hidden="true">/</span>
              <a
                href={`https://orcid.org/${author.orcid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium hover:text-title underline underline-offset-4 decoration-current/40 hover:decoration-current transition-colors"
              >
                <span>ORCID: {author.orcid}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
              <span className="opacity-30" aria-hidden="true">/</span>
              <a
                href={author.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium hover:text-title underline underline-offset-4 decoration-current/40 hover:decoration-current transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Lab</span>
              </a>
            </div>

            {/* Call to actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#publications"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-title text-canvas hover:opacity-90 transition-opacity shadow-sm min-h-[44px]"
                style={{ backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }}
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Publications ({paperCount})</span>
              </a>
              <button
                type="button"
                onClick={onOpenContact}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-title bg-surface border border-theme hover:border-theme-strong rounded-lg transition-colors min-h-[44px]"
              >
                <Mail className="w-4 h-4 opacity-70" />
                <span>Academic Collaboration</span>
              </button>
            </div>
          </div>

          {/* Right Column: Scholar Seal & Quantitative Rigor */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Visual Seal Card */}
            <div className="p-5 sm:p-6 bg-surface rounded-xl border border-theme shadow-xs relative overflow-hidden transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] uppercase font-mono tracking-widest text-muted-readable font-semibold">Researcher</div>
                  <div className="font-editorial text-xl font-bold text-title">{author.name}</div>
                  <div className="text-xs text-muted-readable mt-0.5">{author.title}</div>
                </div>
                {/* Academic Monogram Seal */}
                <div 
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-editorial text-lg sm:text-xl font-bold tracking-tighter shadow-sm border border-theme"
                  style={{ backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }}
                >
                  AV
                </div>
              </div>

              {/* Research Metrics Bar */}
              <div id="metrics" className="mt-5 pt-4 border-t border-theme grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-surface-subtle rounded-lg border border-theme/40">
                  <div className="font-mono text-xl font-bold text-title tabular-nums">
                    {author.totalCitations.toLocaleString()}+
                  </div>
                  <div className="text-[11px] font-medium text-muted-readable mt-0.5">Citations</div>
                </div>
                <div className="p-2.5 bg-surface-subtle rounded-lg border border-theme/40">
                  <div className="font-mono text-xl font-bold text-title tabular-nums">
                    {author.hIndex}
                  </div>
                  <div className="text-[11px] font-medium text-muted-readable mt-0.5">h-index</div>
                </div>
                <div className="p-2.5 bg-surface-subtle rounded-lg border border-theme/40">
                  <div className="font-mono text-xl font-bold text-title tabular-nums">
                    {author.i10Index}
                  </div>
                  <div className="text-[11px] font-medium text-muted-readable mt-0.5">i10-index</div>
                </div>
              </div>

              {/* Location & Lab footnote */}
              <div className="mt-4 pt-3 border-t border-theme flex items-center justify-between text-xs text-muted-readable">
                <span>{author.location}</span>
                <span className="font-mono text-[10px] bg-surface-subtle text-title px-2 py-0.5 rounded border border-theme/60">
                  Open Science
                </span>
              </div>
            </div>

            {/* Research Focus Teaser */}
            <div id="research-teaser" className="p-5 bg-surface-subtle rounded-xl border border-theme transition-colors">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-readable font-semibold mb-2.5">
                Primary Investigations
              </div>
              <ul className="space-y-1.5 text-xs text-body-high font-medium">
                {author.researchInterests.map((interest, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--text-title)' }}></span>
                    <span>{interest}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
