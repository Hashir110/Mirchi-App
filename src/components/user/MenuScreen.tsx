import React from 'react';
import { Pizza, Utensils, Flame, Zap, ChefHat, ChevronRight, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';

interface MenuScreenProps {
  onNavigate: (screen: string) => void;
  onSelectCategory: (category: Category) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  pizza: Pizza,
  pasta: Utensils,
  bbq: Flame,
  'fast-food': Zap,
  desi: ChefHat,
};

const CATEGORY_IMAGES: Record<string, string> = {
  pizza: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400',
  pasta: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=400',
  bbq: 'https://images.pexels.com/photos/7649174/pexels-photo-7649174.jpeg?auto=compress&cs=tinysrgb&w=400',
  'fast-food': 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400',
  desi: 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=400',
};

export function MenuScreen({ onNavigate, onSelectCategory }: MenuScreenProps) {
  const { categories, getCartCount, getCartTotal } = useApp();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center gap-3 sticky top-0 bg-charcoal-950 z-30">
        <button
          onClick={() => onNavigate('home')}
          className="p-2 rounded-xl bg-charcoal-900 text-charcoal-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-xl font-bold text-white flex-1">Menu</h1>
        <button
          onClick={() => onNavigate('checkout')}
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

      {/* Categories Grid */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-24">
        <p className="text-charcoal-400 text-sm mb-4">Select a category to explore</p>
        <div className="grid gap-4">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.slug] || Utensils;
            const image = CATEGORY_IMAGES[category.slug];

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category)}
                className="card overflow-hidden group relative"
              >
                <div className="flex h-28">
                  <div className="w-28 h-full relative overflow-hidden">
                    <img
                      src={image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-charcoal-900" />
                  </div>
                  <div className="flex-1 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-mirchi-500/20 to-mirchi-red/20 rounded-xl flex items-center justify-center border border-mirchi-500/30">
                        <Icon className="w-6 h-6 text-mirchi-400" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-display text-lg font-bold text-white">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-charcoal-400 text-xs">{category.description}</p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-charcoal-500 group-hover:text-mirchi-500 transition-colors" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cart Summary Footer */}
      {getCartCount() > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40">
          <button
            onClick={() => onNavigate('checkout')}
            className="w-full bg-gradient-to-r from-mirchi-500 to-mirchi-600 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-mirchi-500/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-medium">{getCartCount()} items</p>
                <p className="text-white/80 text-xs">View cart</p>
              </div>
            </div>
            <div className="text-white font-bold text-lg">
              Rs. {getCartTotal().toLocaleString()}
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
