import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ResearchFocusProps {
  onSelectCategory: (category: string) => void;
}

export const ResearchFocus: React.FC<ResearchFocusProps> = ({ onSelectCategory }) => {
  const pillars = [
    {
      index: '01',
      title: 'Latent Reasoning & Test-Time Search',
      category: 'Reasoning & Search',
      description:
        'Moving past brittle token-level autoregression toward continuous energy-guided graph planning. Investigating tree-of-thought representations in low-dimensional latent manifolds.',
      milestone: 'NeurIPS 2025 Oral · ICLR 2025 Spotlight',
    },
    {
      index: '02',
      title: 'Inference Efficiency & Sparse Attention',
      category: 'Inference & Systems',
      description:
        'Overcoming high-bandwidth memory ceilings in million-token architectures. Engineering speculative dynamic sparsification and hardware-aware kernel compression.',
      milestone: '85% KV-cache reduction with lossless recall',
    },
    {
      index: '03',
      title: 'Formal Safety & Agentic Invariants',
      category: 'Alignment & Safety',
      description:
        'Synthesizing discrete Control Barrier Functions and SMT reachability sets to eliminate privilege escalation and unconstrained side-effects in autonomous AI executors.',
      milestone: 'ICML 2025 · Formal Verification Envelopes',
    },
    {
      index: '04',
      title: 'Neuro-Symbolic Physical World Models',
      category: 'Multimodal & World Models',
      description:
        'Embedding differentiable Lagrangian dynamics inside high-resolution diffusion bottlenecks to guarantee geometric conservation laws during continuous video rollout.',
      milestone: 'CVPR 2024 · 1,200 frame consistency',
    },
  ];

  return (
    <section id="research" className="py-12 sm:py-14 border-b border-theme bg-canvas transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div className="space-y-1.5">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-readable font-semibold">
              Scientific Program
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-normal text-title tracking-tight">
              Core Research Pillars
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-body-high max-w-md font-sans leading-relaxed">
            Investigating the mathematical foundations, systems engineering, and safety guarantees required to build reliable cognitive intelligence.
          </p>
        </div>

        {/* 4-Column Editorial Grid with High Contrast Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.index}
              onClick={() => onSelectCategory(pillar.category)}
              className="group p-5 sm:p-6 rounded-xl border border-theme bg-surface hover:border-theme-strong transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-muted-readable font-semibold mb-3">
                  <span>{pillar.index}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity text-title" />
                </div>
                <h3 className="font-editorial text-lg sm:text-xl font-normal text-title leading-snug mb-2 group-hover:underline underline-offset-2 decoration-current/40">
                  {pillar.title}
                </h3>
                <p className="text-xs text-body-high leading-relaxed font-sans mb-4">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-3 border-t border-theme/60 text-[11px] font-mono text-muted-readable font-medium">
                {pillar.milestone}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
