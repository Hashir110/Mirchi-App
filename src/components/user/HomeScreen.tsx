import React, { useState, useEffect } from 'react';
import {
  Flame,
  Menu as MenuIcon,
  X,
  Home,
  UtensilsCrossed,
  ShoppingBag,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PROMO_BANNERS } from '../../lib/constants';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const { getCartCount, logout } = useApp();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  const menuItems = [
    { icon: Home, label: 'Home', screen: 'home' },
    { icon: UtensilsCrossed, label: 'Menu', screen: 'menu' },
    { icon: ShoppingBag, label: 'My Orders', screen: 'orders' },
    { icon: LogOut, label: 'Logout', action: handleLogout },
  ];

  return (
    <div className="h-full relative overflow-hidden">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 w-72 h-full bg-charcoal-900 z-50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-mirchi-500 to-mirchi-red rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white">Mirchi Point</h2>
              <p className="text-charcoal-400 text-xs">Taste the Fire</p>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else if (item.screen) {
                    onNavigate(item.screen);
                  }
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-charcoal-300 hover:bg-charcoal-800 hover:text-white transition-all duration-200"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-full flex flex-col overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between sticky top-0 bg-charcoal-950 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-charcoal-900 text-charcoal-300 hover:text-white transition-colors"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-mirchi-500" />
            <span className="font-display text-lg font-bold text-white">Mirchi Point</span>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="relative p-2 rounded-xl bg-charcoal-900"
          >
            <ShoppingCart className="w-5 h-5 text-charcoal-300" />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-mirchi-500 rounded-full text-xs font-bold text-white flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>

        {/* Promo Banner Slider */}
        <div className="px-5 mb-6">
          <div className="relative overflow-hidden rounded-2xl h-44">
            {PROMO_BANNERS.map((banner, idx) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  idx === currentBanner ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  {banner.discount && (
                    <span className="inline-block bg-mirchi-500 text-white text-xs font-bold px-2 py-1 rounded-md w-fit mb-2">
                      {banner.discount}
                    </span>
                  )}
                  <h3 className="font-display text-xl font-bold text-white">
                    {banner.title}
                  </h3>
                  <p className="text-charcoal-300 text-sm">{banner.subtitle}</p>
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={() =>
                setCurrentBanner((prev) => (prev - 1 + PROMO_BANNERS.length) % PROMO_BANNERS.length)
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 rounded-full backdrop-blur-sm hover:bg-black/60 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() =>
                setCurrentBanner((prev) => (prev + 1) % PROMO_BANNERS.length)
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 rounded-full backdrop-blur-sm hover:bg-black/60 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {PROMO_BANNERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBanner(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentBanner
                      ? 'bg-mirchi-500 w-4'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-5 mb-6">
          <h2 className="font-display text-lg font-bold text-white mb-4">
            What would you like?
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: '🍕', label: 'Pizza' },
              { icon: '🍝', label: 'Pasta' },
              { icon: '🍖', label: 'BBQ' },
              { icon: '🍔', label: 'Fast Food' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate('menu')}
                className="flex flex-col items-center gap-2 p-3 bg-charcoal-900 rounded-xl border border-charcoal-800 hover:border-mirchi-500/50 transition-all"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs text-charcoal-300 font-medium">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* View Menu CTA */}
        <div className="px-5 mt-auto pb-6">
          <button
            onClick={() => onNavigate('menu')}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span>View Full Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
