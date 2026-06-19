import React, { useState, useMemo } from 'react';
import { ArrowLeft, ShoppingCart, Star, Plus, Minus, Search, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';

interface CategoryDetailScreenProps {
  category: Category;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export function CategoryDetailScreen({ category, onNavigate, onBack }: CategoryDetailScreenProps) {
  const { menuItems, cart, addToCart, updateQuantity, getCartCount, getCartTotal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopularOnly, setShowPopularOnly] = useState(false);

  const items = useMemo(() => {
    let filtered = menuItems.filter((item) => item.category_id === category.id && item.is_available);

    if (showPopularOnly) {
      filtered = filtered.filter((item) => item.is_popular);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [menuItems, category.id, searchQuery, showPopularOnly]);

  const getItemQuantity = (itemId: string) => {
    const cartItem = cart.find((c) => c.id === itemId);
    return cartItem?.quantity || 0;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 sticky top-0 bg-charcoal-950 z-30">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-charcoal-900 text-charcoal-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-xl font-bold text-white flex-1">
            {category.name}
          </h1>
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

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 py-2.5 text-sm"
            />
          </div>
          <button
            onClick={() => setShowPopularOnly(!showPopularOnly)}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              showPopularOnly
                ? 'bg-mirchi-500 text-white'
                : 'bg-charcoal-900 text-charcoal-300 border border-charcoal-700'
            }`}
          >
            <Star className={`w-4 h-4 ${showPopularOnly ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">Popular</span>
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-24">
        <p className="text-charcoal-400 text-sm mb-4">{items.length} items found</p>
        <div className="space-y-4">
          {items.map((item) => {
            const quantity = getItemQuantity(item.id);

            return (
              <div key={item.id} className="card flex gap-4 p-3">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.is_popular && (
                    <div className="absolute top-1 left-1 bg-mirchi-500 rounded-md px-1.5 py-0.5">
                      <Star className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    {item.description && (
                      <p className="text-charcoal-400 text-xs line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-mirchi-400 font-bold">
                      Rs. {item.price.toLocaleString()}
                    </span>
                    {quantity > 0 ? (
                      <div className="flex items-center gap-2 bg-charcoal-800 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                          className="w-7 h-7 rounded-md bg-charcoal-700 text-white hover:bg-charcoal-600 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center text-white font-medium">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                          className="w-7 h-7 rounded-md bg-mirchi-500 text-white hover:bg-mirchi-600 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image_url: item.image_url,
                          })
                        }
                        className="px-4 py-1.5 bg-mirchi-500 hover:bg-mirchi-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-charcoal-400">No items found</p>
          </div>
        )}
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
