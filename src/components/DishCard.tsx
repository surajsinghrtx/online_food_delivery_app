import React from 'react';
import { Heart, Plus, Sparkles, Clock, Flame, UtensilsCrossed } from 'lucide-react';
import { Dish } from '../types/food';

interface DishCardProps {
  dish: Dish;
  onCustomize: (dish: Dish) => void;
  onQuickAdd: (dish: Dish) => void;
  isFavorite: boolean;
  onToggleFavorite: (dishId: string) => void;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  onCustomize,
  onQuickAdd,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <article className="group relative flex flex-col bg-stone-900/70 border border-stone-800 rounded-xl overflow-hidden hover:border-stone-700/80 hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-xl hover:shadow-black/40">
      
      {/* 1. Leading Image Container (65-70% visual focus) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
        <img
          src={dish.image}
          alt={dish.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
            const fallback = (e.currentTarget.parentElement?.querySelector('.dish-fallback') as HTMLElement);
            if (fallback) fallback.style.display = 'flex';
          }}
        />

        {/* Resilient Fallback Container */}
        <div className="dish-fallback hidden absolute inset-0 bg-stone-950 items-center justify-center p-6 text-center flex-col gap-2">
          <UtensilsCrossed className="w-8 h-8 text-amber-500/70" />
          <p className="font-serif text-sm text-stone-300">{dish.name}</p>
          <span className="text-[11px] text-stone-500">{dish.categoryLabel}</span>
        </div>

        {/* Ambient Top Shadow for Favorite Affordance */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-stone-950/30 pointer-events-none" />

        {/* Top-Right Favorite Button */}
        <button
          type="button"
          onClick={() => onToggleFavorite(dish.id)}
          aria-label={isFavorite ? `Remove ${dish.name} from favorites` : `Add ${dish.name} to favorites`}
          className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/80 backdrop-blur-md text-stone-300 hover:text-rose-400 hover:bg-stone-900 transition-colors shadow-sm"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quiet 1-Line Subtle Kicker if Chef's Pick */}
        {dish.dietary.chefsPick && (
          <div className="absolute top-3 left-3 text-[11px] font-medium text-amber-300/90 tracking-wide uppercase flex items-center gap-1 drop-shadow">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Chef's Choice</span>
          </div>
        )}

        {/* Prep Time Quiet Indicator bottom-left */}
        <div className="absolute bottom-2.5 left-3 text-[11px] text-stone-300 flex items-center gap-1 drop-shadow pointer-events-none">
          <Clock className="w-3 h-3 text-amber-400" />
          <span className="font-mono tabular-nums">{dish.prepTimeMinutes} min</span>
        </div>
      </div>

      {/* 2. Content & Information Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        
        <div className="space-y-2">
          
          {/* Unboxed Metadata Line with typographic separators */}
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span>{dish.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{dish.calories} kcal</span>
            {dish.dietary.glutenFree && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400">GF</span>
              </>
            )}
            {dish.dietary.vegetarian && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400">Vegetarian</span>
              </>
            )}
            {dish.dietary.spicy && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-rose-400 flex items-center gap-0.5">
                  <Flame className="w-3 h-3 inline" /> Spicy
                </span>
              </>
            )}
          </div>

          {/* Dish Title */}
          <h3 className="font-serif text-lg sm:text-xl font-medium text-stone-100 group-hover:text-amber-300 transition-colors leading-snug">
            {dish.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-400 line-clamp-2 leading-relaxed">
            {dish.description}
          </p>

        </div>

        {/* 3. Action and Price Row */}
        <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-3">
          
          <div>
            <span className="text-[11px] text-stone-500 block uppercase font-medium">Starting at</span>
            <span className="text-lg font-semibold font-mono tabular-nums text-stone-100">
              ${dish.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onCustomize(dish)}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors whitespace-nowrap"
            >
              Customize
            </button>
            <button
              type="button"
              onClick={() => onQuickAdd(dish)}
              aria-label={`Quick add ${dish.name} to cart`}
              className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all duration-150 active:scale-90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </article>
  );
};
