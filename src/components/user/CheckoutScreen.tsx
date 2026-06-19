import React, { useState } from 'react';
import { ArrowLeft, MapPin, CreditCard, Banknote, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LOCATIONS } from '../../lib/constants';

interface CheckoutScreenProps {
  onNavigate: (screen: string) => void;
}

export function CheckoutScreen({ onNavigate }: CheckoutScreenProps) {
  const { cart, updateQuantity, removeFromCart, getCartTotal, createOrder } = useApp();
  const [name, setName] = useState('');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (!name.trim() || cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const order = await createOrder({
        customer_name: name.trim(),
        location,
        order_type: 'Delivery',
        payment_method: paymentMethod,
        total: getCartTotal(),
        status: 'Pending',
      });

      if (order) {
        onNavigate('success');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = getCartTotal();
  const deliveryFee = subtotal >= 1500 ? 0 : 150;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-5 pt-4 pb-3 flex items-center gap-3 sticky top-0 bg-charcoal-950 z-30">
          <button
            onClick={() => onNavigate('menu')}
            className="p-2 rounded-xl bg-charcoal-900 text-charcoal-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-xl font-bold text-white">Checkout</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 bg-charcoal-900 rounded-2xl flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10 text-charcoal-600" />
          </div>
          <h2 className="font-display text-lg font-bold text-white mb-2">Cart is Empty</h2>
          <p className="text-charcoal-400 text-center text-sm mb-6">
            Add items from the menu to start your order
          </p>
          <button onClick={() => onNavigate('menu')} className="btn-primary">
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center gap-3 sticky top-0 bg-charcoal-950 z-30">
        <button
          onClick={() => onNavigate('menu')}
          className="p-2 rounded-xl bg-charcoal-900 text-charcoal-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-xl font-bold text-white">Checkout</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-6">
        {/* Cart Items */}
        <div className="mb-6">
          <h2 className="text-charcoal-400 text-sm font-medium mb-3">Order Items</h2>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="card p-3 flex gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-medium text-sm">{item.name}</h3>
                    <p className="text-mirchi-400 text-sm font-semibold">
                      Rs. {item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-charcoal-800 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-md bg-charcoal-700 text-white hover:bg-charcoal-600 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-white text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-md bg-mirchi-500 text-white hover:bg-mirchi-600 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-charcoal-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Details */}
        <div className="mb-6">
          <h2 className="text-charcoal-400 text-sm font-medium mb-3">Customer Details</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-500" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field pl-12 appearance-none cursor-pointer"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} className="bg-charcoal-900 text-white">
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Order Type */}
        <div className="mb-6">
          <h2 className="text-charcoal-400 text-sm font-medium mb-3">Order Type</h2>
          <div className="card p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-mirchi-500 to-mirchi-red rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">Delivery</span>
              <p className="text-charcoal-400 text-xs">Estimated 30-45 mins</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-lg border border-green-500/30">
              Delivery
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <h2 className="text-charcoal-400 text-sm font-medium mb-3">Payment Method</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('COD')}
              className={`card p-4 flex flex-col items-center gap-2 transition-all ${
                paymentMethod === 'COD'
                  ? 'border-mirchi-500 bg-mirchi-500/10'
                  : 'border-charcoal-700'
              }`}
            >
              <Banknote
                className={`w-6 h-6 ${
                  paymentMethod === 'COD' ? 'text-mirchi-400' : 'text-charcoal-400'
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  paymentMethod === 'COD' ? 'text-white' : 'text-charcoal-300'
                }`}
              >
                Cash on Delivery
              </span>
            </button>
            <button
              onClick={() => setPaymentMethod('Online')}
              className={`card p-4 flex flex-col items-center gap-2 transition-all ${
                paymentMethod === 'Online'
                  ? 'border-mirchi-500 bg-mirchi-500/10'
                  : 'border-charcoal-700'
              }`}
            >
              <CreditCard
                className={`w-6 h-6 ${
                  paymentMethod === 'Online' ? 'text-mirchi-400' : 'text-charcoal-400'
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  paymentMethod === 'Online' ? 'text-white' : 'text-charcoal-300'
                }`}
              >
                Pay Online
              </span>
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card p-4">
          <h2 className="text-charcoal-400 text-sm font-medium mb-3">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-charcoal-300">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-charcoal-300">
              <span>Delivery Fee</span>
              <span className={deliveryFee === 0 ? 'text-green-400' : ''}>
                {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
              </span>
            </div>
            {deliveryFee === 0 && subtotal < 1500 && (
              <p className="text-charcoal-500 text-xs">
                Add Rs. {(1500 - subtotal).toLocaleString()} more for free delivery
              </p>
            )}
            <div className="border-t border-charcoal-700 pt-2 flex justify-between text-white font-bold">
              <span>Total</span>
              <span className="text-mirchi-400">Rs. {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="px-5 py-4 bg-charcoal-950 border-t border-charcoal-800">
        <button
          onClick={handleCheckout}
          disabled={!name.trim() || cart.length === 0 || isSubmitting}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span>Placing Order...</span>
          ) : (
            <>
              <span>Place Order</span>
              <span className="text-white/80">Rs. {total.toLocaleString()}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
