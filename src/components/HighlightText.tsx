import React from 'react';

interface HighlightTextProps {
  text: string | undefined | null;
  query: string;
  className?: string;
  highlightClassName?: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  query,
  className = '',
  highlightClassName = 'bg-amber-300 text-stone-950 font-bold px-1 py-0.5 rounded-xs shadow-xs',
}) => {
  if (!text) return null;
  if (!query || !query.trim()) {
    return <span className={className}>{text}</span>;
  }

  // Extract individual search words (min 1 char), escaping regex chars
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 0)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (terms.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Create regex pattern matching any term
  const regex = new RegExp(`(${terms.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isMatch = terms.some(
          (term) => part.toLowerCase() === term.toLowerCase().replace(/\\/g, '')
        );
        if (isMatch) {
          return (
            <mark key={index} className={highlightClassName}>
              {part}
            </mark>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
};
