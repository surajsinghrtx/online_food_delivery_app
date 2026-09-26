import React from 'react';
import { ShoppingBag, Clock, MapPin, Search } from 'lucide-react';
import { CartItem } from '../types/food';

interface NavbarProps {
  orderType: 'delivery' | 'pickup';
  onOrderTypeChange: (type: 'delivery' | 'pickup') => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenTracker: () => void;
  hasActiveOrder: boolean;
  onSearchClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  orderType,
  onOrderTypeChange,
  cartItems,
  onOpenCart,
  onOpenTracker,
  hasActiveOrder,
  onSearchClick,
}) => {
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#0c0e12]/90 backdrop-blur-md border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single element wordmark */}
        <a 
          href="#" 
          className="font-serif text-2xl sm:text-3xl font-semibold tracking-wider text-stone-100 hover:text-amber-400 transition-colors whitespace-nowrap"
        >
          AURA
        </a>

        {/* Zone 2: 4-6 nav links, 1-2 word labels, single-line */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-300">
          <a href="#menu" className="hover:text-amber-400 transition-colors whitespace-nowrap">
            Menu
          </a>
          <a href="#signatures" className="hover:text-amber-400 transition-colors whitespace-nowrap">
            Signatures
          </a>
          <a href="#sourcing" className="hover:text-amber-400 transition-colors whitespace-nowrap">
            Philosophy
          </a>
          <a href="#reviews" className="hover:text-amber-400 transition-colors whitespace-nowrap">
            Reviews
          </a>
          {hasActiveOrder && (
            <button
              onClick={onOpenTracker}
              className="text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-1.5 whitespace-nowrap animate-pulse"
            >
              <Clock className="w-4 h-4" />
              <span>Live Order</span>
            </button>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Quick Search affordance */}
          <button
            onClick={onSearchClick}
            aria-label="Search dishes"
            className="p-2 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800/60 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Dining Mode Switcher */}
          <div className="hidden sm:flex items-center p-1 bg-stone-900 border border-stone-800 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => onOrderTypeChange('delivery')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                orderType === 'delivery'
                  ? 'bg-amber-600/90 text-white font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Delivery (25-35m)
            </button>
            <button
              type="button"
              onClick={() => onOrderTypeChange('pickup')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                orderType === 'pickup'
                  ? 'bg-amber-600/90 text-white font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Pickup (15m)
            </button>
          </div>

          {/* Cart Button */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Shopping Cart with ${totalItemCount} items`}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-stone-100 text-stone-950 hover:bg-amber-400 hover:text-stone-950 font-semibold text-sm transition-all duration-200 shadow-sm active:scale-95"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-mono tabular-nums">
              {totalItemCount > 0 ? `$${totalCartPrice.toFixed(2)}` : 'Cart'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
