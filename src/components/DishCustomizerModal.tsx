import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Flame, ShieldAlert, Sparkles, Utensils } from 'lucide-react';
import { Dish, DishPortion, SelectedOptionExtra } from '../types/food';

interface DishCustomizerModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    dish: Dish,
    portion: DishPortion,
    spiceLevel: string,
    selectedExtras: SelectedOptionExtra[],
    specialInstructions: string,
    quantity: number,
    calculatedTotal: number
  ) => void;
}

export const DishCustomizerModal: React.FC<DishCustomizerModalProps> = ({
  dish,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !dish) return null;

  const [selectedPortion, setSelectedPortion] = useState<DishPortion>(dish.portions[0]);
  const [selectedSpice, setSelectedSpice] = useState<string>(dish.spiceLevels[0] || 'Chef Standard');
  const [selectedExtras, setSelectedExtras] = useState<SelectedOptionExtra[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Reset states when dish changes
  useEffect(() => {
    if (dish) {
      setSelectedPortion(dish.portions[0]);
      setSelectedSpice(dish.spiceLevels[0] || 'Chef Standard');
      setSelectedExtras([]);
      setSpecialInstructions('');
      setQuantity(1);
    }
  }, [dish]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toggleExtra = (extra: { id: string; name: string; price: number }) => {
    setSelectedExtras((prev) => {
      const exists = prev.find((item) => item.id === extra.id);
      if (exists) {
        return prev.filter((item) => item.id !== extra.id);
      } else {
        return [...prev, extra];
      }
    });
  };

  // Live price calculation
  const portionBasePrice = dish.price * (selectedPortion ? selectedPortion.priceMultiplier : 1.0);
  const extrasTotal = selectedExtras.reduce((acc, curr) => acc + curr.price, 0);
  const unitTotal = portionBasePrice + extrasTotal;
  const finalPrice = unitTotal * quantity;

  const handleConfirm = () => {
    onAddToCart(
      dish,
      selectedPortion,
      selectedSpice,
      selectedExtras,
      specialInstructions.trim(),
      quantity,
      finalPrice
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      
      <div 
        className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Dish Image & Close Button */}
        <div className="relative h-48 sm:h-56 w-full bg-stone-950 shrink-0">
          <img
            src={dish.image}
            alt={dish.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close customizer"
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Dish Header Info over image */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <span>{dish.categoryLabel}</span>
              <span aria-hidden="true" className="text-stone-500">·</span>
              <span className="font-mono tabular-nums">{dish.calories} kcal</span>
              <span aria-hidden="true" className="text-stone-500">·</span>
              <span className="font-mono tabular-nums">{dish.prepTimeMinutes} mins prep</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-100 mt-1">
              {dish.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Customization Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          <p className="text-sm text-stone-300 leading-relaxed">
            {dish.description}
          </p>

          {/* Ingredients & Allergens Transparency */}
          <div className="bg-stone-950/60 border border-stone-800/80 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-start gap-2 text-stone-400">
              <Utensils className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-200 font-medium">Ingredients: </span>
                <span>{dish.ingredients.join(', ')}</span>
              </div>
            </div>
            {dish.allergens.length > 0 && (
              <div className="flex items-start gap-2 text-stone-400">
                <ShieldAlert className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-300 font-medium">Contains allergens: </span>
                  <span>{dish.allergens.join(', ')}</span>
                </div>
              </div>
            )}
          </div>

          {/* 1. Portion Selection */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-stone-400 font-semibold block">
              1. Choose Portion Size
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {dish.portions.map((portion) => {
                const isSelected = selectedPortion.name === portion.name;
                const portionPrice = dish.price * portion.priceMultiplier;
                return (
                  <button
                    key={portion.name}
                    type="button"
                    onClick={() => setSelectedPortion(portion)}
                    className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 text-stone-100 shadow-sm'
                        : 'border-stone-800 bg-stone-950/40 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-stone-200">{portion.name}</span>
                      <span className="font-mono tabular-nums text-xs font-semibold text-amber-400">
                        ${portionPrice.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-xs text-stone-400">{portion.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Spice & Preparation Profile */}
          {dish.spiceLevels.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider text-stone-400 font-semibold block flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>2. Preparation & Flavor Profile</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {dish.spiceLevels.map((spice) => {
                  const isSelected = selectedSpice === spice;
                  return (
                    <button
                      key={spice}
                      type="button"
                      onClick={() => setSelectedSpice(spice)}
                      className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/15 text-amber-200 font-semibold'
                          : 'border-stone-800 bg-stone-950/50 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {spice}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Artisan Extras & Add-ons */}
          {dish.extras.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider text-stone-400 font-semibold block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>3. Culinary Add-ons & Accompaniments</span>
              </label>
              <div className="space-y-2">
                {dish.extras.map((extra) => {
                  const isChecked = selectedExtras.some((item) => item.id === extra.id);
                  return (
                    <div
                      key={extra.id}
                      onClick={() => toggleExtra(extra)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-amber-500/80 bg-amber-500/10'
                          : 'border-stone-800 bg-stone-950/30 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-amber-500 border-amber-500 text-stone-950'
                              : 'border-stone-700 bg-stone-900'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-stone-200">{extra.name}</span>
                      </div>
                      <span className="font-mono tabular-nums text-xs text-amber-400 font-medium">
                        +${extra.price.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Special Kitchen Instructions */}
          <div className="space-y-2">
            <label htmlFor="instructions-input" className="text-xs uppercase tracking-wider text-stone-400 font-semibold block">
              4. Special Dietary Notes or Chef Instructions
            </label>
            <textarea
              id="instructions-input"
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g., Dressing on the side, extra crispy crust, no cutlery needed..."
              className="w-full p-3 bg-stone-950/70 border border-stone-800 rounded-xl text-xs sm:text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

        </div>

        {/* Sticky Contiguous Footer */}
        <div className="p-4 sm:p-5 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-4">
          
          {/* Quantity Stepper */}
          <div className="flex items-center bg-stone-900 border border-stone-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="p-1.5 rounded-md hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-mono tabular-nums text-sm font-semibold text-stone-100">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="p-1.5 rounded-md hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Order Button */}
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-between px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm transition-all duration-200 shadow-md active:scale-98"
          >
            <span>Add to Order</span>
            <span className="font-mono tabular-nums font-bold">
              ${finalPrice.toFixed(2)}
            </span>
          </button>

        </div>

      </div>

    </div>
  );
};
