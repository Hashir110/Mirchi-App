import React, { useState, useEffect } from 'react';
import { Flame, Smartphone, LayoutDashboard } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Category, Order } from './types';
import { LoginScreen } from './components/user/LoginScreen';
import { HomeScreen } from './components/user/HomeScreen';
import { MenuScreen } from './components/user/MenuScreen';
import { CategoryDetailScreen } from './components/user/CategoryDetailScreen';
import { CheckoutScreen } from './components/user/CheckoutScreen';
import { OrderSuccessScreen } from './components/user/OrderSuccessScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminOrderDetail } from './components/admin/AdminOrderDetail';

type AppMode = 'user' | 'admin';
type UserScreen = 'login' | 'home' | 'menu' | 'category' | 'checkout' | 'success';
type AdminScreen = 'dashboard' | 'orderDetail';

function MobileApp() {
  const [appMode, setAppMode] = useState<AppMode>('user');

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center p-4">
      {/* Mode Toggle */}
      <div className="mb-6 flex items-center gap-4">
        <span className="text-charcoal-400 text-sm font-medium">Preview Mode:</span>
        <div className="flex bg-charcoal-900 rounded-xl p-1">
          <button
            onClick={() => setAppMode('user')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              appMode === 'user'
                ? 'bg-gradient-to-r from-mirchi-500 to-mirchi-600 text-white shadow-lg shadow-mirchi-500/20'
                : 'text-charcoal-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            User App
          </button>
          <button
            onClick={() => setAppMode('admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              appMode === 'admin'
                ? 'bg-gradient-to-r from-mirchi-500 to-mirchi-600 text-white shadow-lg shadow-mirchi-500/20'
                : 'text-charcoal-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Admin App
          </button>
        </div>
      </div>

      {/* Mobile Frame */}
      <div className="mobile-frame relative">
        {/* Notch */}
        <div className="mobile-notch absolute top-0 left-1/2 -translate-x-1/2 z-50" />

        {/* App Content */}
        <div className="h-full pt-7 overflow-hidden">
          {appMode === 'user' ? <UserAppContainer /> : <AdminAppContainer />}
        </div>
      </div>

      {/* Watermark */}
      <div className="mt-6 flex items-center gap-2 text-charcoal-600">
        <Flame className="w-5 h-5" />
        <span className="font-display text-sm font-semibold">Mirchi Point</span>
      </div>
    </div>
  );
}

function UserAppContainer() {
  const { isLoggedIn, login } = useApp();
  const [currentScreen, setCurrentScreen] = useState<UserScreen>('login');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [shouldAutoLogin, setShouldAutoLogin] = useState(false);

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as UserScreen);
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setCurrentScreen('category');
  };

  const handleLogin = () => {
    login();
    setCurrentScreen('home');
  };

  // Auto-login for demo purposes
  useEffect(() => {
    if (shouldAutoLogin && !isLoggedIn) {
      login();
      setCurrentScreen('home');
    }
  }, [shouldAutoLogin, isLoggedIn, login]);

  if (!isLoggedIn && currentScreen === 'login') {
    return (
      <div className="h-full">
        <LoginScreen onLogin={handleLogin} />

        {/* Demo bypass button */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button
            onClick={() => setShouldAutoLogin(true)}
            className="w-full text-center text-charcoal-500 text-xs py-2 hover:text-charcoal-400"
          >
            Skip login (Demo mode)
          </button>
        </div>
      </div>
    );
  }

  switch (currentScreen) {
    case 'home':
      return <HomeScreen onNavigate={handleNavigate} />;
    case 'menu':
      return (
        <MenuScreen onNavigate={handleNavigate} onSelectCategory={handleSelectCategory} />
      );
    case 'category':
      return selectedCategory ? (
        <CategoryDetailScreen
          category={selectedCategory}
          onNavigate={handleNavigate}
          onBack={() => setCurrentScreen('menu')}
        />
      ) : null;
    case 'checkout':
      return <CheckoutScreen onNavigate={handleNavigate} />;
    case 'success':
      return <OrderSuccessScreen onNavigate={handleNavigate} />;
    default:
      return <HomeScreen onNavigate={handleNavigate} />;
  }
}

function AdminAppContainer() {
  const { login, fetchOrders } = useApp();
  const [currentScreen, setCurrentScreen] = useState<AdminScreen>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Auto-login as admin for demo
  useEffect(() => {
    login(true);
    fetchOrders();
  }, [login, fetchOrders]);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setCurrentScreen('orderDetail');
  };

  const handleBack = () => {
    setCurrentScreen('dashboard');
    setSelectedOrder(null);
  };

  switch (currentScreen) {
    case 'dashboard':
      return <AdminDashboard onSelectOrder={handleSelectOrder} />;
    case 'orderDetail':
      return selectedOrder ? (
        <AdminOrderDetail order={selectedOrder} onBack={handleBack} />
      ) : null;
    default:
      return <AdminDashboard onSelectOrder={handleSelectOrder} />;
  }
}

function App() {
  return (
    <AppProvider>
      <MobileApp />
    </AppProvider>
  );
}

export default App;
