export interface Category {
  id: string | number;
  name: string;
  image_url?: string;
  description?: string;
}

export interface Meal {
  id: string | number;
  title: string;
  image_url?: string;
  price: number;
  final_price?: number;
  discount_price?: number;
  has_offer?: boolean;
  offer_title?: string;
  rating?: number;
  rating_count?: number;
  sold_count?: number;
  stock_quantity?: number;
  in_stock?: boolean;
  brand?: string;
  vendor?: string;
  includes?: string;
  features?: string;
  size?: string;
  how_to_use?: string;
  description?: string;
  expiry_date?: string;
  category?: Category;
  subcategory?: Category;
}

export interface CartMeal {
  id: string | number;
  title: string;
  image_url?: string;
  stock_quantity?: number;
  in_stock?: boolean;
  unit_price: number;
}

export interface CartItemType {
  id: string; // The cart line item ID
  meal: CartMeal;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface SmartListMeal {
  id: string | number;
  title?: string;
  image_url?: string;
  price?: number;
}

export interface SmartList {
  id: string | number;
  name: string;
  meals?: SmartListMeal[];
}

export interface Address {
  id: string | number;
  streetName?: string;
  buildingNumber?: string;
  floor?: string;
  appartment?: string;
  details?: string;
  title?: string;
  is_default?: boolean;
}

export interface User {
  id?: string | number;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  default_address?: Address;
}

export interface Coupon {
  id: string | number;
  code: string;
  discount: number;
  valid_until?: string;
}

export interface LoyaltyTier {
  id: string | number;
  name: string;
  points_required: number;
  benefits?: string[];
}

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
}

export interface Order {
  id: string | number;
  status: string;
  total_price: number;
  created_at: string;
  items?: CartItemType[];
}

export interface DashboardData {
  total_orders: number;
  total_spent: number;
  loyalty_points: number;
  recent_orders?: Order[];
  top_purchases?: Meal[];
  category_distribution?: { name: string; count: number }[];
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}
