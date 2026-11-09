import React, { useState } from 'react';
import { ADMOB_CONFIG } from '../../services/admobService';

interface AdMobBannerProps {
  className?: string;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({ className = '' }) => {
  const [adIndex, setAdIndex] = useState(0);
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Creative variations for the test banner
  const bannerCreatives = [
    {
      brand: 'Championship 28 Online',
      tagline: 'Play Live Tournaments & Win Mega Badges!',
      badge: 'SPONSORED',
      cta: 'JOIN NOW',
      bg: 'from-amber-950/90 via-slate-900 to-amber-950/90',
      border: 'border-amber-500/40',
      icon: '🏆',
    },
    {
      brand: 'Classic Indian Decks',
      tagline: 'Ultra Smooth 100% Plastic Waterproof Cards',
      badge: 'TOP RATED',
      cta: 'EXPLORE',
      bg: 'from-emerald-950/90 via-slate-900 to-teal-950/90',
      border: 'border-emerald-500/40',
      icon: '♠️',
    },
    {
      brand: 'Card Master VIP Club',
      tagline: 'Unlock Exclusive Royal Gold Avatars & Felt Themes',
      badge: 'PREMIUM',
      cta: 'GET VIP',
      bg: 'from-purple-950/90 via-slate-900 to-indigo-950/90',
      border: 'border-purple-500/40',
      icon: '👑',
    },
  ];

  const current = bannerCreatives[adIndex % bannerCreatives.length];

  if (!isOnline) {
    return (
      <div
        className={`w-full max-w-[340px] mx-auto flex items-center justify-center p-2 rounded-lg bg-black/40 border border-slate-800 text-[10px] text-slate-400 select-none ${className}`}
        title={`Google AdMob Banner Test Unit: ${ADMOB_CONFIG.BANNER_TEST_ID}`}
      >
        <span className="flex items-center gap-1.5">
          <span>📡</span>
          <span>Offline · Ads load when connected to Internet</span>
        </span>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-[340px] mx-auto flex flex-col items-center select-none ${className}`}
      title={`Google AdMob Banner Test Unit: ${ADMOB_CONFIG.BANNER_TEST_ID}`}
    >
      {/* Ad Unit Meta Tag */}
      <div className="w-full flex items-center justify-between px-2 py-0.5 text-[9px] text-slate-400 bg-black/60 rounded-t-md border-x border-t border-slate-700/60 font-mono">
        <div className="flex items-center gap-1">
          <span className="bg-amber-400 text-slate-950 font-black px-1 rounded-xs text-[8px] uppercase">
            Test Ad
          </span>
          <span className="truncate max-w-[170px] text-slate-400">
            AdMob: {ADMOB_CONFIG.BANNER_TEST_ID.slice(0, 22)}...
          </span>
        </div>
        <div className="flex items-center gap-1 text-[8px] text-slate-400">
          <span>AdChoices</span>
          <span className="text-cyan-400">ⓘ▷</span>
        </div>
      </div>

      {/* 320x50 Standard Ad Container */}
      <div
        onClick={() => setAdIndex((prev) => prev + 1)}
        className={`w-full h-[52px] bg-gradient-to-r ${current.bg} border ${current.border} rounded-b-md px-2.5 py-1.5 flex items-center justify-between shadow-md cursor-pointer hover:brightness-110 transition-all`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-slate-950/90 border border-slate-700 flex items-center justify-center text-lg shrink-0">
            {current.icon}
          </div>
          <div className="flex flex-col text-left overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-white truncate max-w-[130px]">
                {current.brand}
              </span>
              <span className="text-[8px] font-bold px-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {current.badge}
              </span>
            </div>
            <span className="text-[10px] text-slate-300 truncate max-w-[170px] leading-tight">
              {current.tagline}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          className="shrink-0 px-2.5 py-1 rounded bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-[10px] tracking-wide shadow-sm hover:scale-105 active:scale-95 transition-transform"
        >
          {current.cta}
        </button>
      </div>
    </div>
  );
};
