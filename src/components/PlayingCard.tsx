import React from 'react';
import { Card } from '../types/game';

interface PlayingCardProps {
  card?: Card;
  faceDown?: boolean;
  selected?: boolean;
  isPlayable?: boolean;
  dimmed?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'table' | 'responsive';
  onClick?: () => void;
  cardBackTheme?: 'BLUE' | 'RED';
  className?: string;
  badge?: string;
  inHand?: boolean;
}

export const PlayingCard: React.FC<PlayingCardProps> = ({
  card,
  faceDown = false,
  selected = false,
  isPlayable = true,
  dimmed = false,
  size = 'responsive',
  onClick,
  cardBackTheme = 'BLUE',
  className = '',
  badge,
  inHand = false,
}) => {
  // Traditional standard 2.5 : 3.5 (1 : 1.40) physical playing card proportions
  const sizeClasses = {
    xs: 'w-6 h-8.5 text-[8px]',
    sm: 'w-8 h-11.5 text-[9px]',
    // 20-25% bigger cards for center playing table
    md: 'w-[3.35rem] h-[4.7rem] xs:w-[3.75rem] xs:h-[5.25rem] sm:w-[4.25rem] sm:h-[5.95rem] text-xs',
    table: 'w-[3.35rem] h-[4.7rem] xs:w-[3.75rem] xs:h-[5.25rem] sm:w-[4.25rem] sm:h-[5.95rem] text-xs',
    lg: 'w-16 h-22.5 text-sm',
    // Slightly bigger cards for human player hand
    responsive: 'w-[3.25rem] h-[4.55rem] xs:w-[3.55rem] xs:h-[4.97rem] sm:w-[4.05rem] sm:h-[5.67rem] text-xs',
  }[size];

  // Face-down card: Realistic Bicycle-style card back with crisp white margins
  if (faceDown || !card) {
    const isRedTheme = cardBackTheme === 'RED';
    return (
      <div
        onClick={onClick}
        className={`${sizeClasses} bg-white rounded-[5px] sm:rounded-md p-0.5 sm:p-1 border border-slate-300 relative flex items-center justify-center cursor-pointer select-none transition-transform active:scale-95 shrink-0 card-shadow-table ${className}`}
      >
        <div
          className={`w-full h-full rounded-xs flex items-center justify-center border border-white/80 relative overflow-hidden ${
            isRedTheme ? 'bg-[#991b1b]' : 'bg-[#1e3a8a]'
          }`}
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.22) 13%, transparent 14%),
              radial-gradient(circle at 0 0, rgba(255,255,255,0.15) 13%, transparent 14%),
              radial-gradient(circle at 100% 100%, rgba(255,255,255,0.15) 13%, transparent 14%),
              radial-gradient(circle at 100% 0, rgba(255,255,255,0.15) 13%, transparent 14%),
              radial-gradient(circle at 0 100%, rgba(255,255,255,0.15) 13%, transparent 14%)
            `,
            backgroundSize: '8px 8px',
          }}
        >
          {/* Central decorative Bicycle-style emblem */}
          <div className="w-4 h-5.5 sm:w-5 sm:h-6.5 border border-white/70 rounded-xs flex items-center justify-center bg-black/25 shadow-inner">
            <span className="text-white font-serif font-black text-[8px] sm:text-[9px] tracking-tight">
              28
            </span>
          </div>
        </div>
      </div>
    );
  }

  const shadowClass = selected
    ? 'card-shadow-lifted -translate-y-3'
    : inHand
    ? 'card-shadow-hand'
    : 'card-shadow-table';

  const cardImgSrc = `/assets/cards/${card.suit}_${card.rank}.png`;

  return (
    <div
      onClick={isPlayable ? onClick : undefined}
      className={`
        ${sizeClasses}
        bg-white rounded-[5px] sm:rounded-md border border-slate-300/80
        ${shadowClass}
        ${selected ? 'border-blue-600 ring-2 ring-blue-500/70 z-30' : ''}
        ${dimmed ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        relative flex items-center justify-center select-none shrink-0 transition-all duration-200 ease-out overflow-hidden
        ${className}
      `}
    >
      {/* Real Card Face Image Cropped from Authentic Deck Photo */}
      <img
        src={cardImgSrc}
        alt={`${card.rank} of ${card.suit}`}
        className="w-full h-full object-fill select-none pointer-events-none rounded-[4px] sm:rounded-[5px]"
        draggable={false}
        loading="eager"
      />

      {/* Subtle point marker on card (unobtrusive 28 game indicator) */}
      {card.points > 0 && (
        <div
          title={`${card.points} card points`}
          className="absolute bottom-0.5 right-1 bg-black/80 text-amber-300 font-mono text-[8px] font-bold px-1 rounded-xs border border-amber-400/40 pointer-events-none tabular-nums shadow-xs"
        >
          {card.points}pt
        </div>
      )}

      {/* Optional Badge (e.g. TRUMP) */}
      {badge && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-600 text-white font-bold text-[8px] px-1 py-0.2 rounded-xs shadow-xs uppercase tracking-wide z-20 pointer-events-none">
          {badge}
        </div>
      )}
    </div>
  );
};
