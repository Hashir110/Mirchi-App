export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  is_popular: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone?: string;
  location: string;
  order_type: string;
  payment_method: string;
  status: 'Pending' | 'Accepted' | 'Preparing' | 'Ready' | 'Delivered';
  total: number;
  notes?: string;
  created_at: string;
  order_items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id?: string;
  item_name: string;
  quantity: number;
  price: number;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  discount?: string;
}

export type AppMode = 'user' | 'admin';

export type UserScreen =
  | 'login'
  | 'home'
  | 'menu'
  | 'category'
  | 'checkout'
  | 'success';

export type AdminScreen = 'dashboard' | 'orderDetail';
