import React, { useState, useEffect } from 'react';
import { Paper } from '../types/paper';
import { formatCitation } from '../utils/markdownYaml';
import { X, Copy, Check, Download, Quote } from 'lucide-react';

interface BibTeXModalProps {
  paper: Paper | null;
  onClose: () => void;
}

export const BibTeXModal: React.FC<BibTeXModalProps> = ({ paper, onClose }) => {
  const [style, setStyle] = useState<'bibtex' | 'apa' | 'ieee' | 'mla'>('bibtex');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!paper) return null;

  const citationText = formatCitation(paper, style);

  const handleCopy = () => {
    navigator.clipboard.writeText(citationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBib = () => {
    const bibContent = paper.bibtex || formatCitation(paper, 'bibtex');
    const blob = new Blob([bibContent], { type: 'application/x-bibtex' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paper.id || 'citation'}.bib`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-surface rounded-xl border border-theme shadow-2xl max-w-2xl w-full p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted-readable uppercase tracking-wider font-bold">
              <Quote className="w-3.5 h-3.5 opacity-80" />
              <span>Cite Publication</span>
            </div>
            <h3 className="font-editorial text-lg font-bold text-title leading-snug line-clamp-2">
              {paper.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-title hover:opacity-75 bg-surface-subtle rounded-md transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Style Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface-subtle border border-theme rounded-lg">
          {(['bibtex', 'apa', 'ieee', 'mla'] as const).map((s) => {
            const isActive = style === s;
            return (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`flex-1 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${
                  isActive ? 'shadow-xs' : 'text-body-high hover:text-title'
                }`}
                style={
                  isActive
                    ? { backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }
                    : undefined
                }
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* Citation Box with High Contrast Mono */}
        <div className="relative">
          <pre className="p-4 bg-surface-subtle border border-theme-strong rounded-lg text-xs font-mono text-title overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-64 scrollbar-thin select-all font-medium">
            {citationText}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          {style === 'bibtex' && (
            <button
              onClick={handleDownloadBib}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-title bg-surface-subtle hover:bg-surface border border-theme rounded-md transition-colors min-h-[38px]"
            >
              <Download className="w-3.5 h-3.5 opacity-70" />
              <span>Download .bib</span>
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg shadow-xs min-h-[40px]"
              style={{ backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Citation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
