import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { REVIEWS_DATA } from '../data/menuData';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-20 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <span>Verified Diner Feedback</span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span>4.95 Average Score</span>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-100 tracking-tight">
              Honored by our discerning diners.
            </h2>
            
            <p className="text-stone-400 text-sm sm:text-base">
              Over 1,480 gourmet deliveries completed this month with a 99.4% on-time dispatch rate.
            </p>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center gap-4 shrink-0">
            <div className="text-3xl font-serif font-bold text-amber-400 font-mono tabular-nums">4.95</div>
            <div className="text-xs text-stone-400 space-y-0.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p>Based on verified delivery reviews</p>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS_DATA.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-stone-900/60 border border-stone-800 rounded-xl flex flex-col justify-between gap-6 hover:border-stone-700 transition-colors"
            >
              <div className="space-y-4">
                
                {/* Rating & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-stone-500">{rev.date}</span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>

              </div>

              {/* Author & Dish Ordered */}
              <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-200">
                    <span>{rev.author}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-[11px] text-stone-500">{rev.city}</span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-amber-400/90 font-medium block">Ordered:</span>
                  <span className="text-[11px] text-stone-400 max-w-[130px] truncate block">
                    {rev.dishOrdered}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
