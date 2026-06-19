import React from 'react';
import { CheckCircle, Package, MapPin, CreditCard, ArrowRight, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OrderSuccessScreenProps {
  onNavigate: (screen: string) => void;
}

export function OrderSuccessScreen({ onNavigate }: OrderSuccessScreenProps) {
  const { orders, currentOrderId } = useApp();

  const order = orders.find((o) => o.id === currentOrderId);

  if (!order) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6">
        <p className="text-charcoal-400">Order not found</p>
        <button onClick={() => onNavigate('home')} className="btn-primary mt-4">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Success Animation */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 animate-pulse-slow shadow-lg shadow-green-500/30">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>

        <h1 className="font-display text-2xl font-bold text-white mb-2 text-center">
          Order Confirmed!
        </h1>
        <p className="text-charcoal-400 text-center mb-6">
          Your order has been placed successfully and is being prepared.
        </p>

        {/* Order Summary Card */}
        <div className="card w-full p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-charcoal-400 text-sm">Order ID</span>
            <span className="text-white font-mono text-sm">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Package className="w-4 h-4 text-charcoal-500" />
              <span className="text-charcoal-300">
                {order.order_items.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-charcoal-500" />
              <span className="text-charcoal-300">{order.location}</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <CreditCard className="w-4 h-4 text-charcoal-500" />
              <span className="text-charcoal-300">
                {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Paid Online'}
              </span>
            </div>
          </div>

          <div className="border-t border-charcoal-700 mt-4 pt-3 flex justify-between">
            <span className="text-charcoal-400 text-sm">Total</span>
            <span className="text-mirchi-400 font-bold">
              Rs. {order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="w-full card p-4 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="flex flex-col items-center z-10">
              <div className="w-8 h-8 bg-mirchi-500 rounded-full flex items-center justify-center mb-1">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-charcoal-300">Placed</span>
            </div>

            <div className="flex-1 h-0.5 bg-charcoal-700 mx-2" />

            <div className="flex flex-col items-center z-10">
              <div className="w-8 h-8 bg-charcoal-800 rounded-full flex items-center justify-center mb-1 border-2 border-charcoal-600">
                <span className="text-charcoal-400 text-xs font-bold">2</span>
              </div>
              <span className="text-xs text-charcoal-500">Preparing</span>
            </div>

            <div className="flex-1 h-0.5 bg-charcoal-700 mx-2" />

            <div className="flex flex-col items-center z-10">
              <div className="w-8 h-8 bg-charcoal-800 rounded-full flex items-center justify-center mb-1 border-2 border-charcoal-600">
                <span className="text-charcoal-400 text-xs font-bold">3</span>
              </div>
              <span className="text-xs text-charcoal-500">Delivered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 bg-charcoal-950 border-t border-charcoal-800 space-y-3">
        <button
          onClick={() => onNavigate('home')}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
        <button
          onClick={() => onNavigate('menu')}
          className="w-full btn-secondary flex items-center justify-center gap-2"
        >
          <span>Order More</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
