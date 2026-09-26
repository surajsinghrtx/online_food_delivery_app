import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#090b0e] border-t border-stone-800 text-stone-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-3">
            <span className="font-serif text-2xl font-bold tracking-wider text-stone-100">
              AURA
            </span>
            <p className="text-stone-400 leading-relaxed text-xs">
              Artisanal culinary kitchen delivering wood-fired pizzas, dry-aged Wagyu, and fresh pastas with Michelin-trained precision.
            </p>
            <div className="text-[11px] text-stone-500">
              DOHMH Health Inspection Grade: <strong className="text-emerald-400">A (100/100)</strong>
            </div>
          </div>

          {/* Location & Hours */}
          <div className="space-y-3">
            <h4 className="font-semibold text-stone-200 text-xs uppercase tracking-wider">
              Bistro & Kitchen Hearth
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-stone-400">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>84 Franklin Street, TriBeCa, New York, NY 10013</span>
              </div>
              <div className="flex items-start gap-2 text-stone-400">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p>Mon – Thu: 11:30 AM – 10:30 PM</p>
                  <p>Fri – Sun: 11:30 AM – 11:30 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Concierge */}
          <div className="space-y-3">
            <h4 className="font-semibold text-stone-200 text-xs uppercase tracking-wider">
              Guest Concierge
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-stone-400">
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>(212) 555-0194</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>orders@aurabistro.nyc</span>
              </div>
              <p className="text-[11px] text-stone-500 pt-1">
                For private dining or bespoke catering inquiries, connect directly with our maître d'.
              </p>
            </div>
          </div>

          {/* Dietary & Legal */}
          <div className="space-y-3">
            <h4 className="font-semibold text-stone-200 text-xs uppercase tracking-wider">
              Allergen Advisory
            </h4>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Our kitchen processes wheat, dairy, eggs, and tree nuts. If you have severe anaphylactic food allergies, please contact our culinary team directly before placing an order.
            </p>
            <div className="pt-2 flex gap-4 text-stone-400">
              <a href="#menu" className="hover:text-amber-400 transition-colors">Menu</a>
              <a href="#sourcing" className="hover:text-amber-400 transition-colors">Sourcing</a>
              <a href="#reviews" className="hover:text-amber-400 transition-colors">Reviews</a>
            </div>
          </div>

        </div>

        {/* Quiet Copyright Row */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} AURA Culinary Group. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Terms of Hospitality</span>
            <span aria-hidden="true">·</span>
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Food Safety Standards</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
