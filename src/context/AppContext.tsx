import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CartItem, Order, Category, MenuItem } from '../types';
import { supabase } from '../lib/supabase';

interface AppState {
  cart: CartItem[];
  categories: Category[];
  menuItems: MenuItem[];
  isAdmin: boolean;
  isLoggedIn: boolean;
  orders: Order[];
  currentOrderId: string | null;
}

interface AppContextType extends AppState {
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  login: (isAdmin?: boolean) => void;
  logout: () => void;
  createOrder: (order: Omit<Order, 'id' | 'order_items' | 'created_at'>) => Promise<Order | null>;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  fetchMenuData: () => Promise<void>;
  setCurrentOrderId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    cart: [],
    categories: [],
    menuItems: [],
    isAdmin: false,
    isLoggedIn: false,
    orders: [],
    currentOrderId: null,
  });

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setState((prev) => {
      const existing = prev.cart.find((c) => c.id === item.id);
      if (existing) {
        return {
          ...prev,
          cart: prev.cart.map((c) =>
            c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
          ),
        };
      }
      return { ...prev, cart: [...prev.cart, { ...item, quantity: 1 }] };
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.filter((item) => item.id !== id),
    }));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setState((prev) => ({
      ...prev,
      cart:
        quantity <= 0
          ? prev.cart.filter((item) => item.id !== id)
          : prev.cart.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
    }));
  }, []);

  const clearCart = useCallback(() => {
    setState((prev) => ({ ...prev, cart: [] }));
  }, []);

  const getCartTotal = useCallback(() => {
    return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [state.cart]);

  const getCartCount = useCallback(() => {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.cart]);

  const login = useCallback((isAdmin = false) => {
    setState((prev) => ({ ...prev, isLoggedIn: true, isAdmin }));
  }, []);

  const logout = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isLoggedIn: false,
      isAdmin: false,
      cart: [],
      currentOrderId: null,
    }));
  }, []);

  const fetchMenuData = useCallback(async () => {
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('menu_items').select('*').order('name'),
      ]);

      if (categoriesRes.data && itemsRes.data) {
        setState((prev) => ({
          ...prev,
          categories: categoriesRes.data,
          menuItems: itemsRes.data,
        }));
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
    }
  }, []);

  const createOrder = useCallback(
    async (orderData: Omit<Order, 'id' | 'order_items' | 'created_at'>): Promise<Order | null> => {
      try {
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            customer_name: orderData.customer_name,
            customer_phone: orderData.customer_phone,
            location: orderData.location,
            order_type: orderData.order_type,
            payment_method: orderData.payment_method,
            status: 'Pending',
            total: orderData.total,
            notes: orderData.notes,
          })
          .select()
          .single();

        if (orderError || !order) {
          console.error('Error creating order:', orderError);
          return null;
        }

        const orderItems = state.cart.map((item) => ({
          order_id: order.id,
          item_name: item.name,
          quantity: item.quantity,
          price: item.price,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('Error creating order items:', itemsError);
          return null;
        }

        const newOrder: Order = {
          ...order,
          order_items: orderItems.map((item, idx) => ({
            ...item,
            id: `${order.id}-${idx}`,
            menu_item_id: state.cart[idx]?.id,
          })),
        };

        setState((prev) => ({
          ...prev,
          orders: [newOrder, ...prev.orders],
          currentOrderId: order.id,
          cart: [],
        }));

        return newOrder;
      } catch (error) {
        console.error('Error creating order:', error);
        return null;
      }
    },
    [state.cart]
  );

  const fetchOrders = useCallback(async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      setState((prev) => ({ ...prev, orders: orders || [] }));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, []);

  const updateOrderStatus = useCallback(
    async (orderId: string, status: Order['status']) => {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', orderId);

        if (error) {
          console.error('Error updating order status:', error);
          return;
        }

        setState((prev) => ({
          ...prev,
          orders: prev.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        }));
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    },
    []
  );

  const setCurrentOrderId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, currentOrderId: id }));
  }, []);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        login,
        logout,
        createOrder,
        fetchOrders,
        updateOrderStatus,
        fetchMenuData,
        setCurrentOrderId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
