import React, { useState } from 'react';

interface FixedWrapTextBoxProps {
  text: string;
  widthClass?: string; // e.g. 'w-[220px]', 'w-[200px]', 'w-[240px]', etc.
  maxLines?: 1 | 2 | 3 | 4 | 5;
  variant?: 'default' | 'subtle' | 'danger';
  className?: string;
  placeholderEmpty?: string;
}

export const FixedWrapTextBox: React.FC<FixedWrapTextBoxProps> = ({
  text,
  widthClass = 'w-[220px]',
  maxLines = 3,
  variant = 'default',
  className = '',
  placeholderEmpty = '—',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!text || !text.trim()) {
    return <span className="text-slate-400 text-xs">{placeholderEmpty}</span>;
  }

  const cleanText = text.trim();

  // Max lines clamp class
  const clampClass =
    maxLines === 1
      ? 'line-clamp-1'
      : maxLines === 2
      ? 'line-clamp-2'
      : maxLines === 4
      ? 'line-clamp-4'
      : maxLines === 5
      ? 'line-clamp-5'
      : 'line-clamp-3';

  // Variant styles
  const variantStyles =
    variant === 'danger'
      ? 'text-rose-700 bg-rose-50/90 border border-rose-200/80 px-2 py-1 rounded-md text-[11px] font-medium leading-relaxed'
      : variant === 'subtle'
      ? 'text-slate-600 text-[11px] leading-relaxed'
      : 'text-slate-800 font-medium text-xs leading-relaxed';

  return (
    <div
      className={`relative inline-block ${widthClass} text-left group`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`${clampClass} ${variantStyles} ${className} break-words [overflow-wrap:anywhere] whitespace-normal cursor-default transition-colors`}
        title={cleanText}
      >
        {cleanText}
      </div>

      {/* Floating Tooltip popover when text is long (above 60 chars or hovered) */}
      {showTooltip && cleanText.length > 50 && (
        <div className="absolute z-50 bottom-full left-0 mb-1.5 w-72 max-w-sm p-2.5 bg-slate-900/95 text-white text-xs font-normal rounded-lg shadow-xl backdrop-blur-xs break-words [overflow-wrap:anywhere] whitespace-normal pointer-events-none animate-in fade-in zoom-in-95 duration-100 border border-slate-700">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 tracking-wider">
            Nội dung đầy đủ:
          </div>
          {cleanText}
        </div>
      )}
    </div>
  );
};
