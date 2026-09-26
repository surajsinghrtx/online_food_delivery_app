import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Check, Bike, Store } from 'lucide-react';
import { CartItem } from '../types/food';
import { PROMO_CODES } from '../data/menuData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  orderType: 'delivery' | 'pickup';
  onOrderTypeChange: (type: 'delivery' | 'pickup') => void;
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  appliedPromo: string | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  orderType,
  onOrderTypeChange,
  onUpdateQuantity,
  onRemoveItem,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
  onProceedCheckout,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  
  // Delivery calculation
  const deliveryThreshold = 40.0;
  const isFreeDeliveryEligible = subtotal >= deliveryThreshold || appliedPromo === 'FREEDELIVERY';
  const deliveryFee = orderType === 'pickup' ? 0 : (isFreeDeliveryEligible ? 0 : 4.5);

  // Discount calculation
  let discountAmount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const promo = PROMO_CODES[appliedPromo];
    if (subtotal >= promo.minSpend) {
      discountAmount = (subtotal * promo.discountPercent) / 100;
    }
  }

  const tax = (subtotal - discountAmount) * 0.08875;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee + tax);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    const promoInfo = PROMO_CODES[code];
    if (!promoInfo) {
      setPromoError('Invalid promo code. Try WELCOME15 or CHEF20.');
      return;
    }

    if (subtotal < promoInfo.minSpend) {
      setPromoError(`Requires minimum order of $${promoInfo.minSpend.toFixed(2)}.`);
      return;
    }

    const success = onApplyPromo(code);
    if (success) {
      setPromoInput('');
      setPromoError('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="font-serif text-xl font-semibold text-stone-100">
                Your Order
              </h2>
              <span className="text-xs text-stone-400 font-mono tabular-nums">
                ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart"
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery / Pickup Mode Switcher inside Cart */}
          <div className="px-5 pt-4 pb-2">
            <div className="grid grid-cols-2 p-1 bg-stone-950 border border-stone-800 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => onOrderTypeChange('delivery')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors ${
                  orderType === 'delivery'
                    ? 'bg-amber-600 text-white font-semibold shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Courier Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => onOrderTypeChange('pickup')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors ${
                  orderType === 'pickup'
                    ? 'bg-amber-600 text-white font-semibold shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Bistro Pickup</span>
              </button>
            </div>

            {/* Free delivery tracker progress bar */}
            {orderType === 'delivery' && (
              <div className="mt-3 bg-stone-950/60 p-2.5 rounded-lg border border-stone-800/80 text-xs">
                {subtotal >= deliveryThreshold ? (
                  <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Unlocked complimentary courier delivery!</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-stone-400 mb-1">
                      <span>Add ${(deliveryThreshold - subtotal).toFixed(2)} for free delivery</span>
                      <span className="font-mono tabular-nums">{Math.round((subtotal / deliveryThreshold) * 100)}%</span>
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (subtotal / deliveryThreshold) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4 divide-y divide-stone-800/60">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-stone-800/60 flex items-center justify-center text-stone-500">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-lg text-stone-300">Your bag is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  Discover our curated wood-fired pizzas, dry-aged Wagyu smash, and handcrafted pastas.
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.cartItemId} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    
                    {/* Item info */}
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm font-medium text-stone-100">
                        {item.dish.name}
                      </h4>
                      
                      {/* Options breakdown */}
                      <div className="text-[11px] text-stone-400 space-y-0.5">
                        <p>{item.portion.name}</p>
                        <p className="text-stone-400">Flavor: {item.spiceLevel}</p>
                        {item.selectedExtras.length > 0 && (
                          <p className="text-amber-400/90">
                            + {item.selectedExtras.map((e) => e.name).join(', ')}
                          </p>
                        )}
                        {item.specialInstructions && (
                          <p className="text-stone-500 italic">"{item.specialInstructions}"</p>
                        )}
                      </div>
                    </div>

                    {/* Total item price */}
                    <span className="font-mono tabular-nums text-sm font-semibold text-stone-200">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center bg-stone-950 border border-stone-800 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="p-1 text-stone-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-mono tabular-nums font-semibold text-stone-200">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="p-1 text-stone-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.cartItemId)}
                      aria-label="Remove item from cart"
                      className="text-stone-500 hover:text-rose-400 p-1 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-stone-950 border-t border-stone-800 space-y-4">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1">
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Promo applied: <strong>{appliedPromo}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={onRemovePromo}
                      className="text-stone-400 hover:text-stone-100 text-xs underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (WELCOME15)"
                      className="flex-1 px-3 py-1.5 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-100 placeholder:text-stone-500 uppercase focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-400">{promoError}</p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-400 border-t border-stone-900 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-stone-200">${subtotal.toFixed(2)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{orderType === 'delivery' ? 'White-Glove Courier' : 'Pickup Fee'}</span>
                  <span className="font-mono tabular-nums text-stone-200">
                    {deliveryFee === 0 ? 'Complimentary' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Tax (8.875%)</span>
                  <span className="font-mono tabular-nums text-stone-200">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm font-semibold text-stone-100 pt-2 border-t border-stone-800">
                  <span>Estimated Total</span>
                  <span className="font-mono tabular-nums text-base text-amber-400">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={onProceedCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-amber-950/30 active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>

    </div>
  );
};
