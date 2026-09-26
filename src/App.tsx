/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterBar, CategoryFilter, DietaryFilter, SortOption } from './components/FilterBar';
import { DishCard } from './components/DishCard';
import { DishCustomizerModal } from './components/DishCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { PhilosophySection } from './components/PhilosophySection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { DISHES_DATA, PROMO_CODES } from './data/menuData';
import { Dish, CartItem, DishPortion, SelectedOptionExtra, Order } from './types/food';
import { CheckCircle2, Sparkles, ChefHat } from 'lucide-react';

export default function App() {
  // 1. Order Type (Delivery vs Pickup)
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>(() => {
    return (localStorage.getItem('aura_order_type') as 'delivery' | 'pickup') || 'delivery';
  });

  // 2. Cart Items State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 3. Active Order State
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem('aura_active_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 4. Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_favorites');
      return saved ? JSON.parse(saved) : ['dish-1', 'dish-2'];
    } catch {
      return ['dish-1', 'dish-2'];
    }
  });

  // 5. Filtering and Search States
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [activeDietary, setActiveDietary] = useState<DietaryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');

  // 6. Modal and Drawer Visibility States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [customizingDish, setCustomizingDish] = useState<Dish | null>(null);

  // 7. Promo Code State
  const [appliedPromo, setAppliedPromo] = useState<string | null>(() => {
    return localStorage.getItem('aura_applied_promo') || null;
  });

  // 8. Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('aura_order_type', orderType);
  }, [orderType]);

  useEffect(() => {
    localStorage.setItem('aura_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('aura_active_order', JSON.stringify(activeOrder));
    } else {
      localStorage.removeItem('aura_active_order');
    }
  }, [activeOrder]);

  useEffect(() => {
    localStorage.setItem('aura_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (appliedPromo) {
      localStorage.setItem('aura_applied_promo', appliedPromo);
    } else {
      localStorage.removeItem('aura_applied_promo');
    }
  }, [appliedPromo]);

  // Show quick toast notification
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Toggle favorite
  const handleToggleFavorite = (dishId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(dishId);
      if (exists) {
        showToast('Removed from your favorites');
        return prev.filter((id) => id !== dishId);
      } else {
        showToast('Saved to your favorites');
        return [...prev, dishId];
      }
    });
  };

  // Quick Add handler (adds default portion and flavor)
  const handleQuickAdd = (dish: Dish) => {
    const defaultPortion = dish.portions[0];
    const defaultSpice = dish.spiceLevels[0] || 'Chef Standard';
    const unitPrice = dish.price * defaultPortion.priceMultiplier;
    
    // Check if duplicate item exists in cart
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.dish.id === dish.id &&
        item.portion.name === defaultPortion.name &&
        item.spiceLevel === defaultSpice &&
        item.selectedExtras.length === 0 &&
        !item.specialInstructions
    );

    if (existingIndex > -1) {
      setCartItems((prev) => {
        const updated = [...prev];
        const current = updated[existingIndex];
        const newQty = current.quantity + 1;
        updated[existingIndex] = {
          ...current,
          quantity: newQty,
          totalPrice: current.unitPrice * newQty,
        };
        return updated;
      });
    } else {
      const newItem: CartItem = {
        cartItemId: `item-${Date.now()}-${Math.random()}`,
        dish,
        portion: defaultPortion,
        spiceLevel: defaultSpice,
        selectedExtras: [],
        specialInstructions: '',
        quantity: 1,
        unitPrice,
        totalPrice: unitPrice,
      };
      setCartItems((prev) => [newItem, ...prev]);
    }

    showToast(`Added ${dish.name} to order`);
  };

  // Customized Add handler from modal
  const handleCustomAddToCart = (
    dish: Dish,
    portion: DishPortion,
    spiceLevel: string,
    selectedExtras: SelectedOptionExtra[],
    specialInstructions: string,
    quantity: number,
    calculatedTotal: number
  ) => {
    const unitPrice = calculatedTotal / quantity;
    const newItem: CartItem = {
      cartItemId: `item-${Date.now()}-${Math.random()}`,
      dish,
      portion,
      spiceLevel,
      selectedExtras,
      specialInstructions,
      quantity,
      unitPrice,
      totalPrice: calculatedTotal,
    };

    setCartItems((prev) => [newItem, ...prev]);
    showToast(`Added ${quantity}× ${dish.name} to order`);
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: item.unitPrice * newQuantity,
          };
        }
        return item;
      })
    );
  };

  // Remove item from cart
  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  // Apply promo code
  const handleApplyPromo = (code: string) => {
    const promo = PROMO_CODES[code];
    if (promo) {
      setAppliedPromo(code);
      showToast(`Promo ${code} applied successfully!`);
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    showToast('Promo code removed');
  };

  // Proceed from Cart to Checkout
  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Order Placement Success
  const handleOrderSuccess = (newOrder: Order) => {
    setActiveOrder(newOrder);
    setCartItems([]);
    setAppliedPromo(null);
    setIsTrackerOpen(true);
    showToast(`Order #${newOrder.orderId} confirmed with kitchen!`);
  };

  // Start another order
  const handleNewOrder = () => {
    setIsTrackerOpen(false);
    setActiveOrder(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search scroll shortcut
  const handleSearchClick = () => {
    const searchInput = document.getElementById('menu-search-input');
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInput.focus();
    }
  };

  // Filter and sort dishes
  const filteredDishes = useMemo(() => {
    return DISHES_DATA.filter((dish) => {
      // Category filter
      if (activeCategory === 'signatures' && !dish.dietary.chefsPick) {
        return false;
      }
      if (activeCategory !== 'all' && activeCategory !== 'signatures' && dish.category !== activeCategory) {
        return false;
      }

      // Dietary filter
      if (activeDietary === 'chefsPick' && !dish.dietary.chefsPick) return false;
      if (activeDietary === 'vegetarian' && !dish.dietary.vegetarian) return false;
      if (activeDietary === 'glutenFree' && !dish.dietary.glutenFree) return false;
      if (activeDietary === 'organic' && !dish.dietary.organic) return false;
      if (activeDietary === 'vegan' && !dish.dietary.vegan) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(query);
        const matchesDesc = dish.description.toLowerCase().includes(query);
        const matchesCategory = dish.categoryLabel.toLowerCase().includes(query);
        const matchesIngredients = dish.ingredients.some((ing) => ing.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesIngredients) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'prep_time') return a.prepTimeMinutes - b.prepTimeMinutes;
      return 0; // recommended
    });
  }, [activeCategory, activeDietary, searchQuery, sortBy]);

  // Cart summary calculations
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryThreshold = 40.0;
  const isFreeDeliveryEligible = cartSubtotal >= deliveryThreshold || appliedPromo === 'FREEDELIVERY';
  const deliveryFee = orderType === 'pickup' ? 0 : (isFreeDeliveryEligible ? 0 : 4.5);

  let discountAmount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const promo = PROMO_CODES[appliedPromo];
    if (cartSubtotal >= promo.minSpend) {
      discountAmount = (cartSubtotal * promo.discountPercent) / 100;
    }
  }

  const tax = (cartSubtotal - discountAmount) * 0.08875;

  return (
    <div className="min-h-screen bg-[#0c0e12] text-stone-100 flex flex-col selection:bg-amber-500/20">
      
      {/* 1. Global Navigation adhering to Top Bar Contract */}
      <Navbar
        orderType={orderType}
        onOrderTypeChange={setOrderType}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        hasActiveOrder={!!activeOrder}
        onSearchClick={handleSearchClick}
      />

      {/* Floating Active Order Status Bar if order placed */}
      {activeOrder && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 text-xs text-amber-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>
                Order <strong>#{activeOrder.orderId}</strong> is being prepared by our brigade.
              </span>
            </div>
            <button
              onClick={() => setIsTrackerOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold underline whitespace-nowrap"
            >
              Track Live ETA →
            </button>
          </div>
        </div>
      )}

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 border border-amber-500/50 text-stone-100 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* 2. Hero Section with Generated Photography */}
        <HeroSection
          onExploreMenu={() => {
            const menuEl = document.getElementById('menu');
            if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
          }}
          onExploreSignatures={() => {
            setActiveCategory('signatures');
            const menuEl = document.getElementById('menu');
            if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. Interactive Menu Browser & Discovery */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <FilterBar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            activeDietary={activeDietary}
            onSelectDietary={setActiveDietary}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalResultsCount={filteredDishes.length}
          />

          {/* Dishes Grid */}
          {filteredDishes.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <ChefHat className="w-10 h-10 text-stone-600 mx-auto" />
              <h3 className="font-serif text-xl text-stone-300">No culinary items match your filter</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try clearing your search keyword or switching dietary preferences to view our complete kitchen selection.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  setActiveDietary('all');
                  setSearchQuery('');
                }}
                className="mt-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-16">
              {filteredDishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  onCustomize={(d) => setCustomizingDish(d)}
                  onQuickAdd={handleQuickAdd}
                  isFavorite={favorites.includes(dish.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}

        </div>

        {/* 4. Sourcing & Culinary Standards */}
        <PhilosophySection />

        {/* 5. Verified Guest Reviews */}
        <ReviewsSection />

      </main>

      {/* 6. Footer */}
      <Footer />

      {/* MODALS AND SLIDE-OVERS */}
      
      {/* Dish Customizer Modal */}
      <DishCustomizerModal
        dish={customizingDish}
        isOpen={!!customizingDish}
        onClose={() => setCustomizingDish(null)}
        onAddToCart={handleCustomAddToCart}
      />

      {/* Shopping Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        orderType={orderType}
        onOrderTypeChange={setOrderType}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
        onProceedCheckout={handleProceedCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        orderType={orderType}
        subtotal={cartSubtotal}
        deliveryFee={deliveryFee}
        discount={discountAmount}
        tax={tax}
        promoCode={appliedPromo || undefined}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        order={activeOrder}
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        onNewOrder={handleNewOrder}
      />

    </div>
  );
}
