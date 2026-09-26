import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Banknote, Smartphone, Check, Lock, Bike, Store, ArrowRight } from 'lucide-react';
import { CartItem, CustomerDetails, Order } from '../types/food';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  orderType: 'delivery' | 'pickup';
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  promoCode?: string;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  orderType,
  subtotal,
  deliveryFee,
  discount,
  tax,
  promoCode,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('Alexandra Wright');
  const [email, setEmail] = useState('alexandra.wright@luxurymail.com');
  const [phone, setPhone] = useState('(212) 555-0194');
  const [address, setAddress] = useState(orderType === 'delivery' ? '450 Greenwich Street, Penthouse 4' : 'AURA Bistro Pick-up Counter');
  const [apartmentSuite, setApartmentSuite] = useState(orderType === 'delivery' ? 'Apt 4B (Dial #401)' : '');
  const [deliveryNotes, setDeliveryNotes] = useState('Please leave with doorman if unavailable.');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cash'>('card');
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [customTip, setCustomTip] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Card details state
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Tip calculation
  const calculatedTip = customTip 
    ? parseFloat(customTip) || 0 
    : (subtotal * tipPercentage) / 100;

  const finalTotal = Math.max(0, subtotal - discount + deliveryFee + tax + calculatedTip);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim() || !phone.trim()) {
      setFormError('Please provide your full name and phone number for order verification.');
      return;
    }

    if (orderType === 'delivery' && !address.trim()) {
      setFormError('Please specify the delivery address.');
      return;
    }

    setIsSubmitting(true);

    // Simulate swift payment & kitchen order submission
    setTimeout(() => {
      const orderId = `AURA-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        orderId,
        items: [...cartItems],
        orderType,
        customer: {
          fullName,
          email,
          phone,
          address,
          apartmentSuite,
          deliveryNotes,
          paymentMethod,
          tipAmount: calculatedTip,
        },
        subtotal,
        deliveryFee,
        tax,
        discount,
        tip: calculatedTip,
        total: finalTotal,
        promoCode,
        status: 'confirmed',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedMinutes: orderType === 'delivery' ? 28 : 15,
      };

      setIsSubmitting(false);
      onOrderSuccess(newOrder);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-500" />
            <h2 className="font-serif text-xl font-semibold text-stone-100">
              Secure Checkout
            </h2>
            <span className="text-xs text-stone-400 font-mono tabular-nums">
              · {orderType === 'delivery' ? 'Courier Dispatch' : 'Curbside Pick-up'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs sm:text-sm">
          
          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
              {formError}
            </div>
          )}

          {/* 1. Recipient Details */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
              1. Guest & Contact Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-stone-400 text-xs block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="text-stone-400 text-xs block mb-1">Mobile Phone (for delivery SMS)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500 text-xs font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-stone-400 text-xs block mb-1">Email Address (for receipt)</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* 2. Destination Details */}
          {orderType === 'delivery' ? (
            <div className="space-y-3 pt-3 border-t border-stone-800">
              <h3 className="text-xs uppercase tracking-wider text-stone-400 font-semibold flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5 text-amber-500" />
                <span>2. Delivery Destination</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-stone-400 text-xs block mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 742 Evergreen Terrace"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="text-stone-400 text-xs block mb-1">Apt / Suite / Gate</label>
                  <input
                    type="text"
                    value={apartmentSuite}
                    onChange={(e) => setApartmentSuite(e.target.value)}
                    placeholder="e.g. Apt 4B"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-stone-400 text-xs block mb-1">Courier Instructions</label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Leave with doorman, ring doorbell twice..."
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <Store className="w-4 h-4" />
                <span>Pick-up Location: AURA Kitchen Hearth</span>
              </div>
              <p className="text-xs text-stone-300">
                84 Franklin Street, TriBeCa, New York, NY 10013
              </p>
              <p className="text-[11px] text-stone-500">
                Your order will be packaged in thermal carrier boxes ready at the express counter.
              </p>
            </div>
          )}

          {/* 3. Courier & Kitchen Tip */}
          <div className="space-y-3 pt-3 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                3. Kitchen & Courier Gratuity
              </h3>
              <span className="font-mono tabular-nums text-xs text-amber-400">
                +${calculatedTip.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 20, 25].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    setTipPercentage(pct);
                    setCustomTip('');
                  }}
                  className={`py-2 text-xs rounded-lg border font-medium transition-colors ${
                    tipPercentage === pct && !customTip
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {pct}% (${((subtotal * pct) / 100).toFixed(2)})
                </button>
              ))}
            </div>
          </div>

          {/* 4. Payment Method */}
          <div className="space-y-3 pt-3 border-t border-stone-800">
            <h3 className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
              4. Payment Method
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-medium">Credit / Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors ${
                  paymentMethod === 'apple_pay'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-xs font-medium">Apple / G-Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors ${
                  paymentMethod === 'cash'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs font-medium">{orderType === 'delivery' ? 'Pay on Delivery' : 'Pay at Counter'}</span>
              </button>
            </div>

            {/* Simulated Card inputs */}
            {paymentMethod === 'card' && (
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl space-y-2.5">
                <div>
                  <label className="text-[11px] text-stone-500 block mb-0.5">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-1.5 bg-stone-900 border border-stone-800 rounded-md text-xs font-mono text-stone-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-stone-500 block mb-0.5">Expires</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-1.5 bg-stone-900 border border-stone-800 rounded-md text-xs font-mono text-stone-200"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-500 block mb-0.5">Security Code (CVC)</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-1.5 bg-stone-900 border border-stone-800 rounded-md text-xs font-mono text-stone-200"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Recap */}
          <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-400">
              <span>Items Total ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
              <span className="font-mono tabular-nums text-stone-200">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Promotional Saving</span>
                <span className="font-mono tabular-nums">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-400">
              <span>{orderType === 'delivery' ? 'Courier Delivery' : 'Pickup'}</span>
              <span className="font-mono tabular-nums text-stone-200">
                {deliveryFee === 0 ? 'Complimentary' : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Tax & Tip</span>
              <span className="font-mono tabular-nums text-stone-200">${(tax + calculatedTip).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-stone-100 pt-2 border-t border-stone-800">
              <span>Total Amount Due</span>
              <span className="font-mono tabular-nums text-amber-400 text-base">
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-stone-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-bit encrypted checkout · Kitchen guarantees 100% satisfaction</span>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 text-stone-950 font-semibold text-sm transition-all duration-200 shadow-xl shadow-amber-950/30 active:scale-98"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>Confirming Order with Kitchen...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Place Order · ${finalTotal.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
