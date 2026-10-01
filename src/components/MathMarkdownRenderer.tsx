import React, { useMemo } from 'react';
import katex from 'katex';
import { HighlightText } from './HighlightText';

interface MathMarkdownRendererProps {
  content: string;
  searchQuery?: string;
  className?: string;
}

/**
 * Robust Academic Math & Markdown Renderer
 * Correctly parses:
 * 1. Multiline Display Math: `$$\begin{cases} ... \end{cases}$$` or `$$ ... $$`
 * 2. LaTeX Display Math: `\[ ... \]`
 * 3. Inline Math: `$ ... $` and `\( ... \)`
 * 4. Code Blocks: ```` ```lang ... ``` ````
 * 5. Headings, Lists, Blockquotes, Formatting
 * 6. Search query highlighting outside of mathematical formulas
 */
export const MathMarkdownRenderer: React.FC<MathMarkdownRendererProps> = ({
  content,
  searchQuery = '',
  className = '',
}) => {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // STEP 1: Split entire document by top-level block delimiters:
    // - Code blocks: ``` ... ```
    // - Display math blocks: $$ ... $$ (single-line or multiline)
    // - LaTeX display math blocks: \[ ... \] (single-line or multiline)
    const blockRegex = /(```[\s\S]*?```|\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g;
    const rawBlocks = content.split(blockRegex);

    const elements: React.ReactNode[] = [];

    // Inline math renderer for markdown paragraphs/headings
    const renderInlineMathAndText = (text: string, keyPrefix: string): React.ReactNode => {
      // Split on inline math $...$ or \(...\) without crossing newlines
      const inlineMathRegex = /(\$(?:\\\$|[^\$\n])+\$|\\\((?:\\\)|[^\)])+\\\))/g;
      const inlineParts = text.split(inlineMathRegex);

      return (
        <span key={keyPrefix}>
          {inlineParts.map((part, index) => {
            if (!part) return null;

            const isDollarMath = part.startsWith('$') && part.endsWith('$') && part.length > 2;
            const isParenMath = part.startsWith('\\(') && part.endsWith('\\)') && part.length > 4;

            if (isDollarMath || isParenMath) {
              const mathExpr = isDollarMath ? part.slice(1, -1) : part.slice(2, -2);
              try {
                const html = katex.renderToString(mathExpr, {
                  displayMode: false,
                  throwOnError: false,
                });
                return (
                  <span
                    key={`${keyPrefix}-m-${index}`}
                    className="katex-inline inline-block px-1 align-baseline select-all"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              } catch (err) {
                return (
                  <code key={`${keyPrefix}-err-${index}`} className="text-amber-600 bg-amber-50 dark:bg-amber-950 px-1 rounded font-mono text-xs">
                    {part}
                  </code>
                );
              }
            }

            // Regular text: render bold, italic, code-ticks, search highlights
            return renderFormattedText(part, `${keyPrefix}-t-${index}`, searchQuery);
          })}
        </span>
      );
    };

    // Formatted text helper (bold, italic, code, search highlight)
    const renderFormattedText = (raw: string, key: string, query: string): React.ReactNode => {
      const boldParts = raw.split(/(\*\*[^\*]+\*\*)/g);
      return (
        <React.Fragment key={key}>
          {boldParts.map((bPart, bIdx) => {
            if (bPart.startsWith('**') && bPart.endsWith('**') && bPart.length > 4) {
              const inner = bPart.slice(2, -2);
              return (
                <strong key={`${key}-b-${bIdx}`} className="font-bold text-title">
                  <HighlightText text={inner} query={query} />
                </strong>
              );
            }

            const italicParts = bPart.split(/(\*[^\*]+\*|_[^_]+_)/g);
            return (
              <React.Fragment key={`${key}-bi-${bIdx}`}>
                {italicParts.map((iPart, iIdx) => {
                  if (
                    (iPart.startsWith('*') && iPart.endsWith('*') && iPart.length > 2) ||
                    (iPart.startsWith('_') && iPart.endsWith('_') && iPart.length > 2)
                  ) {
                    const inner = iPart.slice(1, -1);
                    return (
                      <em key={`${key}-i-${iIdx}`} className="italic">
                        <HighlightText text={inner} query={query} />
                      </em>
                    );
                  }

                  const codeParts = iPart.split(/(`[^`]+`)/g);
                  return (
                    <React.Fragment key={`${key}-bic-${iIdx}`}>
                      {codeParts.map((cPart, cIdx) => {
                        if (cPart.startsWith('`') && cPart.endsWith('`') && cPart.length > 2) {
                          const inner = cPart.slice(1, -1);
                          return (
                            <code
                              key={`${key}-c-${cIdx}`}
                              className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-surface-subtle border border-theme text-title"
                            >
                              <HighlightText text={inner} query={query} />
                            </code>
                          );
                        }
                        return <HighlightText key={`${key}-p-${cIdx}`} text={cPart} query={query} />;
                      })}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}
        </React.Fragment>
      );
    };

    // Iterate through top-level blocks
    for (let bIndex = 0; bIndex < rawBlocks.length; bIndex++) {
      const block = rawBlocks[bIndex];
      if (!block) continue;

      // Case 1: Code block ```lang ... ```
      if (block.startsWith('```') && block.endsWith('```') && block.length >= 6) {
        const lines = block.split(/\r?\n/);
        const firstLine = lines[0].slice(3).trim();
        const codeBody = lines.slice(1, -1).join('\n');
        elements.push(
          <div key={`codeblock-${bIndex}`} className="my-3.5 rounded-lg overflow-hidden border border-theme bg-surface-subtle">
            {firstLine && (
              <div className="px-3 py-1 text-[10px] font-mono uppercase bg-theme-strong/10 text-muted-readable border-b border-theme font-semibold">
                {firstLine}
              </div>
            )}
            <pre className="p-3.5 text-xs font-mono text-title overflow-x-auto whitespace-pre leading-relaxed select-all">
              {codeBody}
            </pre>
          </div>
        );
        continue;
      }

      // Case 2: Display Math block: $$ ... $$ or \[ ... \]
      const isDollarDisplay = block.startsWith('$$') && block.endsWith('$$') && block.length >= 4;
      const isBracketDisplay = block.startsWith('\\[') && block.endsWith('\\]') && block.length >= 4;

      if (isDollarDisplay || isBracketDisplay) {
        const mathExpr = isDollarDisplay
          ? block.slice(2, -2).trim()
          : block.slice(2, -2).trim();

        try {
          const html = katex.renderToString(mathExpr, {
            displayMode: true,
            throwOnError: false,
          });
          elements.push(
            <div
              key={`dmath-${bIndex}`}
              className="my-4 p-4 rounded-xl bg-surface-subtle/80 border border-theme overflow-x-auto text-title text-center shadow-2xs select-all text-sm sm:text-base leading-normal scrollbar-thin"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (err) {
          elements.push(
            <pre
              key={`dmath-err-${bIndex}`}
              className="my-3 p-3 text-xs font-mono text-amber-700 bg-amber-50 dark:bg-amber-950/60 rounded border border-amber-300"
            >
              {mathExpr}
            </pre>
          );
        }
        continue;
      }

      // Case 3: Standard Markdown text lines
      const textLines = block.split(/\r?\n/);

      for (let lIndex = 0; lIndex < textLines.length; lIndex++) {
        const line = textLines[lIndex];
        const trimmed = line.trim();
        const lineKey = `blk-${bIndex}-l-${lIndex}`;

        if (!trimmed) {
          elements.push(<div key={`sp-${lineKey}`} className="h-1.5" />);
          continue;
        }

        // Headings
        if (trimmed.startsWith('### ')) {
          elements.push(
            <h4 key={`h3-${lineKey}`} className="font-editorial text-lg sm:text-xl font-bold text-title mt-5 mb-2">
              {renderInlineMathAndText(trimmed.slice(4), `h3-${lineKey}`)}
            </h4>
          );
          continue;
        }

        if (trimmed.startsWith('## ')) {
          elements.push(
            <h3 key={`h2-${lineKey}`} className="font-editorial text-xl sm:text-2xl font-bold text-title mt-6 mb-2.5 pb-1 border-b border-theme/60">
              {renderInlineMathAndText(trimmed.slice(3), `h2-${lineKey}`)}
            </h3>
          );
          continue;
        }

        if (trimmed.startsWith('# ')) {
          elements.push(
            <h2 key={`h1-${lineKey}`} className="font-editorial text-2xl sm:text-3xl font-bold text-title mt-6 mb-3">
              {renderInlineMathAndText(trimmed.slice(2), `h1-${lineKey}`)}
            </h2>
          );
          continue;
        }

        // Blockquotes
        if (trimmed.startsWith('> ')) {
          elements.push(
            <blockquote key={`quote-${lineKey}`} className="my-3 pl-4 py-2 border-l-3 border-theme-strong bg-surface-subtle/80 rounded-r text-sm text-body-high italic">
              {renderInlineMathAndText(trimmed.slice(2), `quote-${lineKey}`)}
            </blockquote>
          );
          continue;
        }

        // Bullet lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          elements.push(
            <li key={`li-${lineKey}`} className="ml-5 list-disc text-sm text-body-high my-1 leading-relaxed">
              {renderInlineMathAndText(trimmed.slice(2), `li-${lineKey}`)}
            </li>
          );
          continue;
        }

        // Numbered lists
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
          elements.push(
            <div key={`nli-${lineKey}`} className="flex items-start gap-2 text-sm text-body-high my-1 leading-relaxed">
              <span className="font-mono text-xs font-bold text-title mt-0.5 shrink-0">{numberedMatch[1]}.</span>
              <span>{renderInlineMathAndText(numberedMatch[2], `nli-${lineKey}`)}</span>
            </div>
          );
          continue;
        }

        // Standard paragraph
        elements.push(
          <p key={`p-${lineKey}`} className="text-sm text-body-high leading-relaxed my-1.5 font-sans">
            {renderInlineMathAndText(line, `p-${lineKey}`)}
          </p>
        );
      }
    }

    return elements;
  }, [content, searchQuery]);

  return <div className={`math-markdown-content space-y-1 ${className}`}>{renderedElements}</div>;
};
