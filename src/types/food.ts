export interface DishOptionExtra {
  id: string;
  name: string;
  price: number;
}

export interface DishPortion {
  name: string;
  description: string;
  priceMultiplier: number;
}

export interface Dish {
  id: string;
  name: string;
  category: 'signatures' | 'pizza' | 'burgers' | 'bowls' | 'pasta' | 'desserts';
  categoryLabel: string;
  description: string;
  price: number;
  prepTimeMinutes: number;
  calories: number;
  rating: number;
  reviewsCount: number;
  image: string;
  dietary: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    spicy?: boolean;
    chefsPick?: boolean;
    organic?: boolean;
  };
  ingredients: string[];
  allergens: string[];
  portions: DishPortion[];
  spiceLevels: string[];
  extras: DishOptionExtra[];
}

export interface SelectedOptionExtra {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  dish: Dish;
  portion: DishPortion;
  spiceLevel: string;
  selectedExtras: SelectedOptionExtra[];
  specialInstructions: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartmentSuite: string;
  deliveryNotes: string;
  paymentMethod: 'card' | 'apple_pay' | 'cash';
  tipAmount: number;
}

export type OrderStatus = 'confirmed' | 'kitchen_prep' | 'packaging' | 'on_the_way' | 'delivered';

export interface Order {
  orderId: string;
  items: CartItem[];
  orderType: 'delivery' | 'pickup';
  customer: CustomerDetails;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  tip: number;
  total: number;
  promoCode?: string;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: number;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  dishOrdered: string;
  date: string;
  comment: string;
  avatarText: string;
}
