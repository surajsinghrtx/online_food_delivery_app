import React from 'react';
import { Flame, Leaf, Thermometer, Wheat } from 'lucide-react';

export const PhilosophySection: React.FC = () => {
  return (
    <section id="sourcing" className="py-20 border-t border-b border-stone-800/80 bg-stone-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
            <span>Culinary Philosophy</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Artisanal Standards</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-100 tracking-tight" style={{ textWrap: 'balance' }}>
            Uncompromising standards from soil to dispatch.
          </h2>

          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            We reject the shortcuts of industrial ghost kitchens. Every broth, fermentation, and compound butter is prepared in-house by career culinary professionals.
          </p>
        </div>

        {/* 4 Pillars with Quantitative Proof (Claim-to-Proof Adjacency) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
          
          <div className="p-6 bg-stone-900/60 border border-stone-800 rounded-xl space-y-3">
            <Wheat className="w-6 h-6 text-amber-400" />
            <div className="text-2xl font-serif text-stone-100 font-bold font-mono tabular-nums">72 Hours</div>
            <h3 className="font-semibold text-stone-200 text-sm">Cold Fermentation</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Our pizza dough and burger brioche undergo three days of cold proofing, yielding delicate blistered crusts and complex sourdough notes.
            </p>
          </div>

          <div className="p-6 bg-stone-900/60 border border-stone-800 rounded-xl space-y-3">
            <Flame className="w-6 h-6 text-amber-400" />
            <div className="text-2xl font-serif text-stone-100 font-bold font-mono tabular-nums">900°F</div>
            <h3 className="font-semibold text-stone-200 text-sm">Hearth Fired</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Native oak and applewood fired brick ovens impart genuine smoky char in under 90 seconds while sealing fresh ingredients.
            </p>
          </div>

          <div className="p-6 bg-stone-900/60 border border-stone-800 rounded-xl space-y-3">
            <Leaf className="w-6 h-6 text-amber-400" />
            <div className="text-2xl font-serif text-stone-100 font-bold font-mono tabular-nums">100%</div>
            <h3 className="font-semibold text-stone-200 text-sm">Hudson Valley Produce</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              All greens, heritage root vegetables, and herbs are harvested daily from certified organic partner farms within 90 miles.
            </p>
          </div>

          <div className="p-6 bg-stone-900/60 border border-stone-800 rounded-xl space-y-3">
            <Thermometer className="w-6 h-6 text-amber-400" />
            <div className="text-2xl font-serif text-stone-100 font-bold font-mono tabular-nums">145°F</div>
            <h3 className="font-semibold text-stone-200 text-sm">Active Thermal Pods</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Specially calibrated thermal courier cassettes maintain exact cooking temperature and crispness without steam condensation.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
