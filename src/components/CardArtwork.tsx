import React from 'react';
import { Suit } from '../types/game';

interface SuitIconProps {
  suit: Suit;
  className?: string;
  size?: number;
}

/**
 * Mathematically exact, authentic playing card vector paths.
 * Rendered with small, crisp proportions matching standard casino-grade decks.
 */
export const SUIT_PATHS = {
  SPADES:
    'M12 2C10.6 4.8 5 10.6 5 14.4C5 17.4 7.4 19.2 10.4 18.8C11.2 18.7 11.6 18.2 11.7 17.6C11.5 19 9.8 21.5 8 22H16C14.2 21.5 12.5 19 12.3 17.6C12.4 18.2 12.8 18.7 13.6 18.8C16.6 19.2 19 17.4 19 14.4C19 10.6 13.4 4.8 12 2Z',
  HEARTS:
    'M12 21.5C11.6 21.1 3 14.2 3 8.5C3 5 5.5 2.5 9 2.5C10.8 2.5 11.6 3.4 12 4.1C12.4 3.4 13.2 2.5 15 2.5C18.5 2.5 21 5 21 8.5C21 14.2 12.4 21.1 12 21.5Z',
  DIAMONDS:
    'M12 2C12.2 5 14 9.5 20 12C14 14.5 12.2 19 12 22C11.8 19 10 14.5 4 12C10 9.5 11.8 5 12 2Z',
  CLUBS:
    'M12 2.2C10 2.2 8.4 3.8 8.4 5.8C8.4 6.4 8.6 7 8.9 7.5C6.9 7.6 5.3 9.2 5.3 11.3C5.3 13.4 7 15.1 9.1 15.1C9.8 15.1 10.4 14.9 11 14.5C11.3 15.8 10.5 18.8 8.2 21.8H15.8C13.5 18.8 12.7 15.8 13 14.5C13.6 14.9 14.2 15.1 14.9 15.1C17 15.1 18.7 13.4 18.7 11.3C18.7 9.2 17.1 7.6 15.1 7.5C15.4 7 15.6 6.4 15.6 5.8C15.6 3.8 14 2.2 12 2.2Z',
};

/**
 * Authentic vector SVG suit icon with rich solid colors.
 * Rich red: #dc2626
 * Deep black: #111827
 */
export const SuitIcon: React.FC<SuitIconProps> = ({ suit, className = '', size = 16 }) => {
  const isRed = suit === 'HEARTS' || suit === 'DIAMONDS';
  const fillColor = isRed ? '#dc2626' : '#111827';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fillColor}
      className={`shrink-0 ${className}`}
    >
      <path d={SUIT_PATHS[suit]} />
    </svg>
  );
};

/**
 * Reusable inline suit component for SVG containers.
 */
export const SuitSvgContent: React.FC<{ suit: Suit; size?: number }> = ({ suit, size = 24 }) => {
  const isRed = suit === 'HEARTS' || suit === 'DIAMONDS';
  const fillColor = isRed ? '#dc2626' : '#111827';

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fillColor} className="shrink-0">
      <path d={SUIT_PATHS[suit]} />
    </svg>
  );
};

/**
 * Common suit path snippet for embedded court SVG drawings.
 */
const renderSuitPath = (suit: Suit, x: number, y: number, scale: number = 0.5) => {
  const isRed = suit === 'HEARTS' || suit === 'DIAMONDS';
  const fill = isRed ? '#dc2626' : '#111827';

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <path d={SUIT_PATHS[suit]} fill={fill} stroke="#111827" strokeWidth="0.8" />
    </g>
  );
};

/**
 * Traditional Double-Headed King Illustration (K)
 * Modeled directly on American standard physical playing cards.
 * Features grand arched crown, ermine fur mantle, regal beard, and royal regalia.
 */
const KingHalfFigure: React.FC<{ suit: Suit }> = ({ suit }) => {
  const isRed = suit === 'HEARTS' || suit === 'DIAMONDS';
  const primaryCloth = isRed ? '#dc2626' : '#1d4ed8';
  const secondaryCloth = isRed ? '#1e3a8a' : '#dc2626';
  const gold = '#facc15';
  const darkGold = '#b45309';

  return (
    <g>
      {/* Corner Suit Pip inside the court border */}
      {renderSuitPath(suit, 10, 10, 0.55)}

      {/* Royal Robe / Mantle Background */}
      <path
        d="M20 90 L20 48 Q28 40 46 38 L74 38 Q92 40 100 48 L100 90 Z"
        fill={primaryCloth}
        stroke="#18181b"
        strokeWidth="1.5"
      />

      {/* Scepter / Weapon on the side */}
      {suit === 'HEARTS' ? (
        // King of Hearts "Suicide King" raised broadsword
        <g>
          <rect x="76" y="14" width="22" height="5" fill="#e2e8f0" stroke="#18181b" strokeWidth="1.2" />
          <path d="M76 16.5 L46 16.5" stroke="#94a3b8" strokeWidth="3" />
          <polygon points="98,13 103,16.5 98,20" fill="#e2e8f0" stroke="#18181b" strokeWidth="1" />
          {/* Sword hilt and hand */}
          <circle cx="76" cy="16.5" r="3.5" fill={gold} stroke="#18181b" strokeWidth="1" />
          <circle cx="78" cy="22" r="4" fill="#fed7aa" stroke="#18181b" strokeWidth="1" />
        </g>
      ) : (
        // Royal Scepter with jeweled finial
        <g>
          <line x1="86" y1="90" x2="86" y2="34" stroke="#18181b" strokeWidth="2.5" />
          <line x1="86" y1="90" x2="86" y2="34" stroke={gold} strokeWidth="1.8" />
          {/* Scepter cross/orb finial */}
          <circle cx="86" cy="30" r="4.5" fill={gold} stroke="#18181b" strokeWidth="1.2" />
          <circle cx="86" cy="30" r="1.5" fill={secondaryCloth} />
          {/* Hand holding scepter */}
          <ellipse cx="86" cy="52" rx="4" ry="5.5" fill="#fed7aa" stroke="#18181b" strokeWidth="1.2" />
        </g>
      )}

      {/* Ermine Fur Collar (White with black ermine spots) */}
      <path
        d="M28 90 L34 50 L48 42 L60 52 L72 42 L86 50 L92 90 Z"
        fill="#ffffff"
        stroke="#18181b"
        strokeWidth="1.4"
      />
      {/* Black ermine tails on fur */}
      <polygon points="38,62 40,65 39,60" fill="#18181b" />
      <polygon points="82,62 84,65 83,60" fill="#18181b" />
      <polygon points="40,78 42,81 41,76" fill="#18181b" />
      <polygon points="80,78 82,81 81,76" fill="#18181b" />

      {/* Chest Royal Embroidery / Tunic Panels */}
      <rect x="48" y="52" width="24" height="38" fill={secondaryCloth} stroke="#18181b" strokeWidth="1.2" />
      {/* Gold cross and ribbon ornaments */}
      <line x1="48" y1="71" x2="72" y2="71" stroke={gold} strokeWidth="2.5" />
      <line x1="60" y1="52" x2="60" y2="90" stroke={gold} strokeWidth="2.5" />
      <polygon points="60,65 66,71 60,77 54,71" fill={gold} stroke="#18181b" strokeWidth="1" />
      <circle cx="60" cy="71" r="2" fill="#ffffff" />

      {/* King's Flowing Hair */}
      <path
        d="M36 28 Q30 38 34 52 Q40 50 44 44 Z"
        fill={gold}
        stroke="#18181b"
        strokeWidth="1.2"
      />
      <path
        d="M84 28 Q90 38 86 52 Q80 50 76 44 Z"
        fill={gold}
        stroke="#18181b"
        strokeWidth="1.2"
      />

      {/* King's Royal Face */}
      <path
        d="M44 26 L44 42 Q60 54 76 42 L76 26 Z"
        fill="#fed7aa"
        stroke="#18181b"
        strokeWidth="1.4"
      />

      {/* Facial Features: Eyes, Nose, Eyebrows */}
      <ellipse cx="52" cy="31" rx="2" ry="1.2" fill="#18181b" />
      <ellipse cx="68" cy="31" rx="2" ry="1.2" fill="#18181b" />
      <path d="M49 28 Q52 26 55 28" stroke="#18181b" strokeWidth="1" fill="none" />
      <path d="M65 28 Q68 26 71 28" stroke="#18181b" strokeWidth="1" fill="none" />
      <path d="M60 28 L59 36 L62 36" stroke="#18181b" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* King's Curled Mustache & Beard */}
      <path
        d="M50 38 Q60 36 70 38 Q65 43 60 40 Q55 43 50 38 Z"
        fill={darkGold}
        stroke="#18181b"
        strokeWidth="1"
      />
      <path
        d="M54 41 Q60 48 66 41 Q60 45 54 41 Z"
        fill={darkGold}
        stroke="#18181b"
        strokeWidth="1"
      />

      {/* Arched Royal Crown with Jewels */}
      {/* Red velvet cap */}
      <path d="M42 25 Q60 14 78 25 Z" fill="#dc2626" stroke="#18181b" strokeWidth="1.2" />
      {/* Crown base headband */}
      <rect x="40" y="22" width="40" height="5" fill={gold} stroke="#18181b" strokeWidth="1.2" rx="1" />
      {/* Gemstones on crown band */}
      <circle cx="46" cy="24.5" r="1.3" fill="#1d4ed8" />
      <circle cx="53" cy="24.5" r="1.3" fill="#dc2626" />
      <circle cx="60" cy="24.5" r="1.5" fill="#ffffff" />
      <circle cx="67" cy="24.5" r="1.3" fill="#dc2626" />
      <circle cx="74" cy="24.5" r="1.3" fill="#1d4ed8" />
      {/* 5 Crown peaks / arches with pearls */}
      <path
        d="M40 22 L42 15 L48 20 L54 12 L60 18 L66 12 L72 20 L78 15 L80 22 Z"
        fill={gold}
        stroke="#18181b"
        strokeWidth="1.2"
      />
      {/* Top Cross / Finial */}
      <line x1="60" y1="12" x2="60" y2="8" stroke="#18181b" strokeWidth="1.5" />
      <line x1="57" y1="10" x2="63" y2="10" stroke="#18181b" strokeWidth="1.5" />
      <circle cx="42" cy="15" r="1.2" fill="#ffffff" />
      <circle cx="54" cy="12" r="1.2" fill="#ffffff" />
      <circle cx="66" cy="12" r="1.2" fill="#ffffff" />
      <circle cx="78" cy="15" r="1.2" fill="#ffffff" />
    </g>
  );
};

/**
 * Traditional Double-Headed Queen Illustration (Q)
 * Modeled on American standard physical playing cards.
 * Features jeweled coronet, white royal veil, sceptre / heraldic flower, and patterned gown.
 */
const QueenHalfFigure: React.FC<{ suit: Suit }> = ({ suit }) => {
  const isRed = suit === 'HEARTS' || suit === 'DIAMONDS';
  const primaryCloth = isRed ? '#dc2626' : '#1d4ed8';
  const secondaryCloth = isRed ? '#1e3a8a' : '#dc2626';
  const gold = '#facc15';

  return (
    <g>
      {/* Corner Suit Pip inside the court border */}
      {renderSuitPath(suit, 10, 10, 0.55)}

      {/* Royal Robe Background */}
      <path
        d="M20 90 L22 48 Q32 38 48 36 L72 36 Q88 38 98 48 L100 90 Z"
        fill={secondaryCloth}
        stroke="#18181b"
        strokeWidth="1.5"
      />

      {/* Flowing White Veil cascading behind head */}
      <path
        d="M36 28 C28 42 26 62 30 85 L38 85 C34 62 38 44 44 32 Z"
        fill="#ffffff"
        stroke="#18181b"
        strokeWidth="1.2"
      />
      <path
        d="M84 28 C92 42 94 62 90 85 L82 85 C86 62 82 44 76 32 Z"
        fill="#ffffff"
        stroke="#18181b"
        strokeWidth="1.2"
      />

      {/* Queen holding Sceptre or Tudor Rose */}
      <g>
        <line x1="84" y1="90" x2="84" y2="44" stroke="#18181b" strokeWidth="2.2" />
        <line x1="84" y1="90" x2="84" y2="44" stroke={gold} strokeWidth="1.5" />
        {/* Flower / Rose petals */}
        <circle cx="84" cy="40" r="5" fill={primaryCloth} stroke="#18181b" strokeWidth="1.2" />
        <circle cx="84" cy="40" r="2" fill={gold} />
        {/* Hand holding flower */}
        <ellipse cx="84" cy="58" rx="3.8" ry="5" fill="#fed7aa" stroke="#18181b" strokeWidth="1.2" />
      </g>

      {/* Queen's Bodice and Collar */}
      <path
        d="M36 85 L44 52 L60 60 L76 52 L84 85 Z"
        fill={primaryCloth}
        stroke="#18181b"
        strokeWidth="1.4"
      />
      {/* Jeweled Necklace / Collar */}
      <path d="M46 52 Q60 62 74 52" stroke={gold} strokeWidth="2.5" fill="none" />
      <circle cx="60" cy="58" r="2.2" fill="#ffffff" stroke="#18181b" strokeWidth="0.8" />

      {/* Bodice central heraldic cross-hatch */}
      <rect x="52" y="62" width="16" height="28" fill={gold} stroke="#18181b" strokeWidth="1.2" />
      <line x1="52" y1="71" x2="68" y2="71" stroke="#18181b" strokeWidth="1" />
      <line x1="52" y1="80" x2="68" y2="80" stroke="#18181b" strokeWidth="1" />
      <line x1="60" y1="62" x2="60" y2="90" stroke="#18181b" strokeWidth="1" />

      {/* Curled Hair Framing Face */}
      <path d="M44 28 Q40 36 44 44 Q48 40 48 34 Z" fill={gold} stroke="#18181b" strokeWidth="1" />
      <path d="M76 28 Q80 36 76 44 Q72 40 72 34 Z" fill={gold} stroke="#18181b" strokeWidth="1" />

      {/* Queen's Graceful Face */}
      <path
        d="M46 25 L46 38 Q60 48 74 38 L74 25 Z"
        fill="#fed7aa"
        stroke="#18181b"
        strokeWidth="1.3"
      />

      {/* Facial Features: Eyes, arched brows, mouth */}
      <ellipse cx="53" cy="30" rx="1.8" ry="1.2" fill="#18181b" />
      <ellipse cx="67" cy="30" rx="1.8" ry="1.2" fill="#18181b" />
      <path d="M50 27 Q53 25 56 27" stroke="#18181b" strokeWidth="1" fill="none" />
      <path d="M64 27 Q67 25 70 27" stroke="#18181b" strokeWidth="1" fill="none" />
      <path d="M60 28 L59 35 L61 35" stroke="#18181b" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Rose-red lips */}
      <path d="M57 39 Q60 41 63 39 Q60 43 57 39 Z" fill="#dc2626" stroke="#18181b" strokeWidth="0.8" />

      {/* Queen's Coronet Crown */}
      <rect x="42" y="21" width="36" height="4.5" fill={gold} stroke="#18181b" strokeWidth="1.2" rx="1" />
      <circle cx="48" cy="23.2" r="1.2" fill="#dc2626" />
      <circle cx="60" cy="23.2" r="1.3" fill="#ffffff" />
      <circle cx="72" cy="23.2" r="1.2" fill="#1d4ed8" />
      {/* Crown peaks */}
      <path
        d="M42 21 L45 14 L51 19 L60 11 L69 19 L75 14 L78 21 Z"
        fill={gold}
        stroke="#18181b"
        strokeWidth="1.2"
      />
      <circle cx="45" cy="14" r="1.3" fill="#ffffff" />
      <circle cx="60" cy="11" r="1.5" fill="#dc2626" />
      <circle cx="75" cy="14" r="1.3" fill="#ffffff" />
    </g>
  );
};

/**
 * Traditional Double-Headed Jack / Knave Illustration (J)
 * Modeled on American standard physical playing cards.
 * Features Renaissance flat cap with plume, youthful courtier face, halberd / polearm, and slashed doublet.
 */
const JackHalfFigure: React.FC<{ suit: Suit }> = ({ suit }) => {
  const isRed = suit === 'HEARTS' || suit === 'DIAMONDS';
  const primaryCloth = isRed ? '#dc2626' : '#1d4ed8';
  const secondaryCloth = isRed ? '#1e3a8a' : '#dc2626';
  const gold = '#facc15';

  // Jack of Spades is traditionally in profile facing right (One-Eyed Jack)
  const isProfile = suit === 'SPADES' || suit === 'HEARTS';

  return (
    <g>
      {/* Corner Suit Pip inside the court border */}
      {renderSuitPath(suit, 10, 10, 0.55)}

      {/* Doublet Background */}
      <path
        d="M20 90 L20 48 Q28 38 48 36 L72 36 Q92 38 100 48 L100 90 Z"
        fill={primaryCloth}
        stroke="#18181b"
        strokeWidth="1.5"
      />

      {/* Royal Halberd / Polearm held in hand */}
      <g>
        <line x1="84" y1="90" x2="84" y2="20" stroke="#18181b" strokeWidth="2.5" />
        <line x1="84" y1="90" x2="84" y2="20" stroke="#94a3b8" strokeWidth="1.8" />
        {/* Halberd axe blade & spear point */}
        <polygon points="84,14 84,26 96,20" fill="#cbd5e1" stroke="#18181b" strokeWidth="1.2" />
        <polygon points="84,14 87,8 84,4 81,8" fill="#e2e8f0" stroke="#18181b" strokeWidth="1.2" />
        {/* Circular rosette guard */}
        <circle cx="84" cy="28" r="4.5" fill={gold} stroke="#18181b" strokeWidth="1.2" />
        <circle cx="84" cy="28" r="1.5" fill="#dc2626" />
        {/* Hand holding polearm */}
        <ellipse cx="84" cy="52" rx="4" ry="5.5" fill="#fed7aa" stroke="#18181b" strokeWidth="1.2" />
      </g>

      {/* Slashed Sleeve with Heraldic Banding */}
      <path
        d="M22 65 Q32 50 44 48 L44 90 L24 90 Z"
        fill={secondaryCloth}
        stroke="#18181b"
        strokeWidth="1.2"
      />
      <line x1="22" y1="72" x2="44" y2="72" stroke={gold} strokeWidth="2" />
      <line x1="24" y1="82" x2="44" y2="82" stroke={gold} strokeWidth="2" />

      {/* Chest Doublet / Tunic with Diagonal Heraldic Pattern */}
      <rect x="44" y="50" width="30" height="40" fill={gold} stroke="#18181b" strokeWidth="1.3" />
      <polygon points="44,50 74,80 74,90 44,60" fill={secondaryCloth} />
      <polygon points="56,50 74,68 74,74 50,50" fill={primaryCloth} />
      <polygon points="44,72 62,90 54,90 44,80" fill={primaryCloth} />

      {/* High Standing Collar */}
      <path d="M42 44 L50 38 L60 44 L70 38 L78 44 Z" fill="#ffffff" stroke="#18181b" strokeWidth="1.2" />

      {/* Hair curling over collar */}
      <path d="M36 28 Q32 38 38 48 Q44 44 42 36 Z" fill={gold} stroke="#18181b" strokeWidth="1.2" />
      <path d="M78 28 Q82 38 78 48 Q74 44 76 36 Z" fill={gold} stroke="#18181b" strokeWidth="1.2" />

      {/* Face (Profile for Spades/Hearts, three-quarter for Clubs/Diamonds) */}
      {isProfile ? (
        // One-Eyed Jack in Profile
        <g>
          <path
            d="M44 24 L52 24 L64 24 Q68 28 66 32 L69 34 L66 36 L68 40 Q62 46 50 44 Z"
            fill="#fed7aa"
            stroke="#18181b"
            strokeWidth="1.4"
          />
          {/* Eye in profile */}
          <ellipse cx="60" cy="30" rx="2" ry="1.4" fill="#18181b" />
          <path d="M57 27 Q60 25 63 27" stroke="#18181b" strokeWidth="1" fill="none" />
          {/* Lips in profile */}
          <line x1="64" y1="38" x2="67" y2="38" stroke="#18181b" strokeWidth="1.2" />
        </g>
      ) : (
        // Three-Quarter Face
        <g>
          <path
            d="M46 24 L46 40 Q60 50 74 40 L74 24 Z"
            fill="#fed7aa"
            stroke="#18181b"
            strokeWidth="1.4"
          />
          <ellipse cx="53" cy="31" rx="1.8" ry="1.2" fill="#18181b" />
          <ellipse cx="67" cy="31" rx="1.8" ry="1.2" fill="#18181b" />
          <path d="M50 28 Q53 26 56 28" stroke="#18181b" strokeWidth="1" fill="none" />
          <path d="M64 28 Q67 26 70 28" stroke="#18181b" strokeWidth="1" fill="none" />
          <path d="M60 29 L59 36 L62 36" stroke="#18181b" strokeWidth="1" fill="none" />
          <line x1="57" y1="40" x2="63" y2="40" stroke="#18181b" strokeWidth="1.2" />
        </g>
      )}

      {/* Renaissance Courtier Cap / Bonnet with Plume */}
      {/* Cap main body */}
      <path
        d="M38 24 Q48 10 74 14 Q82 18 80 24 Z"
        fill={secondaryCloth}
        stroke="#18181b"
        strokeWidth="1.3"
      />
      {/* Cap golden brim */}
      <rect x="40" y="22" width="38" height="4" fill={gold} stroke="#18181b" strokeWidth="1.2" rx="1" />
      {/* Feather / Plume curling back */}
      <path
        d="M44 22 C34 14 36 2 52 4 C60 5 62 8 56 12 C48 16 46 18 44 22 Z"
        fill="#facc15"
        stroke="#18181b"
        strokeWidth="1.2"
      />
      <circle cx="44" cy="23" r="2.2" fill="#dc2626" stroke="#18181b" strokeWidth="0.8" />
    </g>
  );
};

/**
 * Authentic illustrated double-headed royal court cards (Jack, Queen, King).
 * Renders complete symmetrical double-headed traditional court figures
 * with printed rectangular card frame and dividing line.
 */
export const CourtCardIllustration: React.FC<{ rank: 'J' | 'Q' | 'K'; suit: Suit }> = ({
  rank,
  suit,
}) => {
  return (
    <svg viewBox="0 0 120 180" className="w-full h-full select-none shrink-0 drop-shadow-xs">
      <defs>
        <clipPath id="courtTopHalfClip">
          <rect x="3" y="3" width="114" height="87" />
        </clipPath>
      </defs>

      {/* Outer printed court rectangular border */}
      <rect x="2" y="2" width="116" height="176" fill="#fffef8" stroke="#18181b" strokeWidth="1.8" />
      {/* Inner thin decorative border line */}
      <rect x="5" y="5" width="110" height="170" fill="none" stroke="#18181b" strokeWidth="0.8" />

      {/* TOP HALF FIGURE (0 to 90) */}
      <g clipPath="url(#courtTopHalfClip)">
        {rank === 'K' && <KingHalfFigure suit={suit} />}
        {rank === 'Q' && <QueenHalfFigure suit={suit} />}
        {rank === 'J' && <JackHalfFigure suit={suit} />}
      </g>

      {/* TRADITIONAL DIVIDING LINE WITH CENTER JEWEL */}
      <line x1="5" y1="90" x2="115" y2="90" stroke="#18181b" strokeWidth="1.4" />
      <line x1="5" y1="88" x2="115" y2="88" stroke="#facc15" strokeWidth="0.8" />
      <line x1="5" y1="92" x2="115" y2="92" stroke="#facc15" strokeWidth="0.8" />
      {/* Center heraldic diamond emblem */}
      <polygon points="60,83 67,90 60,97 53,90" fill="#facc15" stroke="#18181b" strokeWidth="1.2" />
      <circle cx="60" cy="90" r="2" fill="#dc2626" />

      {/* BOTTOM HALF FIGURE (180° Inverted Mirror) */}
      <g transform="rotate(180 60 90)" clipPath="url(#courtTopHalfClip)">
        {rank === 'K' && <KingHalfFigure suit={suit} />}
        {rank === 'Q' && <QueenHalfFigure suit={suit} />}
        {rank === 'J' && <JackHalfFigure suit={suit} />}
      </g>
    </svg>
  );
};

/**
 * Ornate centerpiece for Aces.
 * Iconic grand Ace of Spades with filigree engraving, and large traditional suit pip for other suits.
 */
export const AceCenterpiece: React.FC<{ suit: Suit }> = ({ suit }) => {
  if (suit === 'SPADES') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative select-none">
        <svg viewBox="0 0 100 120" className="w-14 h-16 sm:w-16 sm:h-18 drop-shadow-sm">
          {/* Outer Filigree Wings */}
          <path
            d="M50 8 C34 28 14 54 14 78 C14 96 28 103 40 99 C43 98 45 94 46 90 C45 98 40 110 32 114 H68 C60 110 55 98 54 90 C55 94 57 98 60 99 C72 103 86 96 86 78 C86 54 66 28 50 8 Z"
            fill="#18181b"
          />
          {/* Inner Ornate Filigree Line Engraving */}
          <path
            d="M50 22 C39 39 25 62 25 78 C25 90 33 94 41 92 C45 91 48 88 49 84"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M50 22 C61 39 75 62 75 78 C75 90 67 94 59 92 C55 91 52 88 51 84"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="50" cy="62" r="3.2" fill="#ffffff" />
          <path
            d="M50 36 L50 84"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="2 3"
          />
        </svg>
        <span className="text-[7.5px] font-serif font-black tracking-widest uppercase text-slate-800 -mt-1">
          28 MASTER
        </span>
      </div>
    );
  }

  // Large bold Ace pip for Hearts, Diamonds, Clubs
  return (
    <div className="w-full h-full flex items-center justify-center select-none">
      <SuitIcon suit={suit} size={38} className="drop-shadow-xs" />
    </div>
  );
};

/**
 * Traditional Number Card Pip Grid layout for 7, 8, 9, 10.
 * Symmetrically and authentically placed matching standard physical American decks.
 */
export const NumberCardPips: React.FC<{ rank: '7' | '8' | '9' | '10'; suit: Suit }> = ({
  rank,
  suit,
}) => {
  const pipSize = 12;

  switch (rank) {
    case '7':
      return (
        <div className="w-full h-full px-2 py-1 flex flex-col justify-between items-center select-none">
          {/* Row 1: Top pair */}
          <div className="w-full flex justify-between">
            <SuitIcon suit={suit} size={pipSize} />
            <SuitIcon suit={suit} size={pipSize} />
          </div>
          {/* Row 2: Center upper pip */}
          <div className="w-full flex justify-center -my-0.5">
            <SuitIcon suit={suit} size={pipSize} />
          </div>
          {/* Row 3: Middle pair */}
          <div className="w-full flex justify-between">
            <SuitIcon suit={suit} size={pipSize} />
            <SuitIcon suit={suit} size={pipSize} />
          </div>
          {/* Row 4: Bottom pair (inverted) */}
          <div className="w-full flex justify-between rotate-180">
            <SuitIcon suit={suit} size={pipSize} />
            <SuitIcon suit={suit} size={pipSize} />
          </div>
        </div>
      );

    case '8':
      return (
        <div className="w-full h-full px-2 py-1 flex justify-between items-center select-none">
          {/* Left Column: 3 pips */}
          <div className="h-full flex flex-col justify-between">
            <SuitIcon suit={suit} size={pipSize} />
            <SuitIcon suit={suit} size={pipSize} />
            <div className="rotate-180"><SuitIcon suit={suit} size={pipSize} /></div>
          </div>
          {/* Center Column: 2 pips */}
          <div className="h-full flex flex-col justify-around py-3">
            <SuitIcon suit={suit} size={pipSize} />
            <div className="rotate-180"><SuitIcon suit={suit} size={pipSize} /></div>
          </div>
          {/* Right Column: 3 pips */}
          <div className="h-full flex flex-col justify-between">
            <SuitIcon suit={suit} size={pipSize} />
            <SuitIcon suit={suit} size={pipSize} />
            <div className="rotate-180"><SuitIcon suit={suit} size={pipSize} /></div>
          </div>
        </div>
      );

    case '9':
      return (
        <div className="w-full h-full px-2 py-0.5 flex justify-between items-center select-none">
          {/* Left Column: 4 pips */}
          <div className="h-full flex flex-col justify-between">
            <SuitIcon suit={suit} size={pipSize} />
            <SuitIcon suit={suit} size={pipSize} />
            <div className="rotate-180"><SuitIcon suit={suit} size={pipSize} /></div>
            <div className="rotate-180"><SuitIcon suit={suit} size={pipSize} /></div>
          </div>
          {/* Center Column: 1 central pip */}
          <div className="h-full flex flex-col justify-center">
            <SuitIcon suit={suit} size={pipSize} />
          </div>
          {/* Right Column: 4 pips */}
          <div className="h-full flex flex-col justify-between">
            <SuitIcon suit={suit} size={pipSize} />
            <SuitIcon suit={suit} size={pipSize} />
            <div className="rotate-180"><SuitIcon suit={suit} size={pipSize} /></div>
            <div className="rotate-180"><SuitIcon suit={suit} size={pipSize} /></div>
          </div>
        </div>
      );

    case '10':
      return (
        <div className="w-full h-full px-2 py-0.5 flex justify-between items-center select-none">
          {/* Left Column: 4 pips */}
          <div className="h-full flex flex-col justify-between">
            <SuitIcon suit={suit} size={pipSize} />
            <SuitIcon suit={suit} size={pipSize} />
            <div className="rotate-180"><SuitIcon suit={suit} size={pipSize} /></div>
            <div className="rotate-180"><SuitIcon suit={suit} size={pipSize} /></div>
          </div>
          {/* Center Column: 2 pips */}
          <div className="h-full flex flex-col justify-around py-3">
            <SuitIcon suit={suit} size={pipSize} />
            <div className="rotate-180"><SuitIcon suit={suit} size={pipSize} /></div>
          </div>
          {/* Right Column: 4 pips */}
          <div className="h-full flex flex-col justify-between">
            <SuitIcon suit={suit} size={pipSize} />
            <SuitIcon suit={suit} size={pipSize} />
            <div className="rotate-180"><SuitIcon suit={suit} size={pipSize} /></div>
            <div className="rotate-180"><SuitIcon suit={suit} size={pipSize} /></div>
          </div>
        </div>
      );
  }
};
