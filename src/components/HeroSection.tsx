import React from 'react';
import { ArrowRight, Sparkles, ChefHat, ShieldCheck } from 'lucide-react';
import { HERO_IMAGE } from '../data/menuData';

interface HeroSectionProps {
  onExploreMenu: () => void;
  onExploreSignatures: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreMenu,
  onExploreSignatures,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-stone-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial & Call to Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Unboxed natural editorial status */}
            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium tracking-wide">
              <span>Michelin-Trained Brigade</span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span>Kitchen Actively Cooking</span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span>Average Dispatch 22 Mins</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-100 leading-[1.12]" style={{ textWrap: 'balance' }}>
              Culinary mastery delivered straight from our hearth to your dining table.
            </h1>

            <p className="text-base sm:text-lg text-stone-400 font-normal leading-relaxed max-w-xl">
              Experience hand-crafted pastas, 72-hour fermented wood-fired pies, and dry-aged Wagyu creations—prepared on demand with organic farm-certified ingredients and precision thermal transport.
            </p>

            {/* Unboxed Metadata Trust Markers */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-stone-400 pt-1">
              <span className="text-stone-200 font-semibold font-mono tabular-nums">4.95 / 5.0</span>
              <span className="text-stone-400">from 1,480+ verified gourmands</span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span className="text-amber-400/90">Zero delivery fee over $40</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onExploreMenu}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-amber-500 text-stone-950 hover:bg-amber-400 font-semibold text-sm transition-all duration-200 shadow-lg shadow-amber-950/20 active:scale-98 whitespace-nowrap"
              >
                <span>Order From Current Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={onExploreSignatures}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg border border-stone-700 bg-stone-900/60 hover:bg-stone-800 text-stone-200 font-medium text-sm transition-all duration-200 whitespace-nowrap"
              >
                <span>View Chef's Reserve</span>
              </button>
            </div>

            {/* Sourcing Micro-proof */}
            <div className="pt-4 border-t border-stone-800/80 flex items-center gap-6 text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5 text-stone-400" />
                <span>Executive Chef Julian Hayes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                <span>100% Compostable Packaging</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Focal Point */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-stone-900 border border-stone-800 shadow-2xl">
              <img
                src={HERO_IMAGE}
                alt="Artisanal culinary feast at AURA Bistro"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                  const fallback = (e.currentTarget.parentElement?.querySelector('.fallback-container') as HTMLElement);
                  if (fallback) fallback.style.display = 'flex';
                }}
              />

              {/* Styled Fallback Container */}
              <div className="fallback-container hidden absolute inset-0 bg-stone-900 items-center justify-center p-8 text-center flex-col gap-3">
                <Sparkles className="w-10 h-10 text-amber-400" />
                <h3 className="font-serif text-xl text-stone-200">AURA Artisanal Kitchen</h3>
                <p className="text-xs text-stone-400 max-w-sm">Every dish freshly prepared to order using local organic farm ingredients.</p>
              </div>

              {/* Ambient gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Quiet overlay caption */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-300 pointer-events-none">
                <span className="font-serif italic text-stone-200">Signature Tasting Selection · Autumn Harvest</span>
                <span className="font-mono tabular-nums text-amber-400 font-semibold">Available Today</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
