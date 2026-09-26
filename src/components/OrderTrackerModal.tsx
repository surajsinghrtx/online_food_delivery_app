import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, ChefHat, PackageCheck, Bike, MapPin, Receipt, Phone, Store } from 'lucide-react';
import { Order, OrderStatus } from '../types/food';

interface OrderTrackerModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onNewOrder: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  isOpen,
  onClose,
  onNewOrder,
}) => {
  if (!isOpen || !order) return null;

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [minutesRemaining, setMinutesRemaining] = useState<number>(order.estimatedMinutes);

  // Auto-progress order status simulation
  useEffect(() => {
    setCurrentStatus(order.status);
    setMinutesRemaining(order.estimatedMinutes);

    const timer = setInterval(() => {
      setMinutesRemaining((prev) => (prev > 1 ? prev - 1 : 0));
    }, 15000);

    return () => clearInterval(timer);
  }, [order]);

  const stages: { key: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: 'confirmed',
      label: 'Order Confirmed',
      desc: 'Received and dispatched to kitchen station',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      key: 'kitchen_prep',
      label: 'Chefs Cooking',
      desc: 'Wood-fired oven & pan-searing underway',
      icon: <ChefHat className="w-4 h-4" />,
    },
    {
      key: 'packaging',
      label: 'Quality Checked',
      desc: 'Temperature sealed in thermal containers',
      icon: <PackageCheck className="w-4 h-4" />,
    },
    {
      key: 'on_the_way',
      label: order.orderType === 'delivery' ? 'Courier En Route' : 'Ready for Pick-up',
      desc: order.orderType === 'delivery' ? 'Gabriel is on his way via thermal e-bike' : 'Awaiting guest at express counter',
      icon: order.orderType === 'delivery' ? <Bike className="w-4 h-4" /> : <Store className="w-4 h-4" />,
    },
    {
      key: 'delivered',
      label: order.orderType === 'delivery' ? 'Delivered' : 'Picked Up',
      desc: 'Bon appétit! Enjoy your meal',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
  ];

  const stageKeys = stages.map((s) => s.key);
  const currentStageIndex = stageKeys.indexOf(currentStatus);

  const advanceStage = () => {
    if (currentStageIndex < stages.length - 1) {
      const nextStatus = stages[currentStageIndex + 1].key;
      setCurrentStatus(nextStatus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                Live Kitchen Tracking
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-stone-100 mt-0.5">
              Order #{order.orderId}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close tracking"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Estimated ETA Banner */}
          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-stone-400 block">
                {order.orderType === 'delivery' ? 'Estimated Arrival' : 'Estimated Ready Time'}
              </span>
              <div className="flex items-center gap-2 text-2xl sm:text-3xl font-serif text-amber-400">
                <Clock className="w-6 h-6 text-amber-500 shrink-0" />
                <span className="font-mono tabular-nums font-bold">
                  {minutesRemaining > 0 ? `${minutesRemaining} Minutes` : 'Arriving Now'}
                </span>
              </div>
            </div>

            <div className="text-xs text-stone-400 space-y-0.5">
              <p>Ordered at <strong className="text-stone-200">{order.createdAt}</strong></p>
              <p>Type: <strong className="text-stone-200 uppercase">{order.orderType}</strong></p>
            </div>
          </div>

          {/* Vertical Visual Stages Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                Real-Time Preparation Progress
              </h3>
              {currentStageIndex < stages.length - 1 && (
                <button
                  type="button"
                  onClick={advanceStage}
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  Simulate Next Step →
                </button>
              )}
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-800">
              {stages.map((stage, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={stage.key} className="relative flex items-start gap-4">
                    {/* Stage Dot Indicator */}
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isPassed
                          ? 'border-emerald-500 bg-emerald-500 text-stone-950'
                          : isCurrent
                          ? 'border-amber-400 bg-amber-400 animate-pulse'
                          : 'border-stone-700 bg-stone-900'
                      }`}
                    />

                    {/* Stage Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${
                            isCurrent
                              ? 'text-amber-300 font-semibold'
                              : isPassed
                              ? 'text-stone-200'
                              : 'text-stone-500'
                          }`}
                        >
                          {stage.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Card if Delivery */}
          {order.orderType === 'delivery' && (
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-bold text-sm">
                  GS
                </div>
                <div>
                  <h4 className="text-sm font-medium text-stone-200">Gabriel Santos</h4>
                  <p className="text-xs text-stone-400">White-Glove Courier · 4.99 ★</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${order.customer.phone}`}
                  aria-label="Call courier"
                  className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Destination Details */}
          <div className="p-4 bg-stone-950/60 border border-stone-800 rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-stone-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{order.orderType === 'delivery' ? 'Delivery Address:' : 'Pickup Point:'}</span>
            </div>
            <p className="text-stone-300 pl-5">
              {order.customer.address} {order.customer.apartmentSuite && `(${order.customer.apartmentSuite})`}
            </p>
            {order.customer.deliveryNotes && (
              <p className="text-stone-500 italic pl-5">
                Note: "{order.customer.deliveryNotes}"
              </p>
            )}
          </div>

          {/* Itemized Order Receipt Preview */}
          <div className="space-y-3 pt-2 border-t border-stone-800">
            <h3 className="text-xs uppercase tracking-wider text-stone-400 font-semibold flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-stone-400" />
              <span>Itemized Receipt</span>
            </h3>

            <div className="space-y-2 text-xs divide-y divide-stone-800/60">
              {order.items.map((item) => (
                <div key={item.cartItemId} className="pt-2 first:pt-0 flex justify-between gap-4">
                  <div>
                    <span className="font-medium text-stone-200">
                      {item.quantity}× {item.dish.name}
                    </span>
                    <p className="text-stone-400 text-[11px]">
                      {item.portion.name} {item.selectedExtras.length > 0 && `· +${item.selectedExtras.map(e => e.name).join(', ')}`}
                    </p>
                  </div>
                  <span className="font-mono tabular-nums text-stone-300">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800/80 space-y-1 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span className="font-mono tabular-nums">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-400">
                <span>Delivery & Courier Tip</span>
                <span className="font-mono tabular-nums">${(order.deliveryFee + order.tip).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-stone-100 pt-1 border-t border-stone-800">
                <span>Total Paid</span>
                <span className="font-mono tabular-nums text-amber-400">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-medium transition-colors"
          >
            Close & Keep Browsing
          </button>

          <button
            type="button"
            onClick={onNewOrder}
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold transition-colors"
          >
            Start Another Order
          </button>
        </div>

      </div>
    </div>
  );
};
