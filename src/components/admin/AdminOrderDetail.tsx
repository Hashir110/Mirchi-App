import React from 'react';
import { ArrowLeft, User, MapPin, Phone, CreditCard, Clock, Package, CheckCircle, XCircle, ChefHat } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { getStatusStyle, ORDER_STATUSES } from '../../lib/constants';

interface AdminOrderDetailProps {
  order: Order;
  onBack: () => void;
}

export function AdminOrderDetail({ order, onBack }: AdminOrderDetailProps) {
  const { updateOrderStatus } = useApp();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusUpdate = async (newStatus: Order['status']) => {
    await updateOrderStatus(order.id, newStatus);
  };

  return (
    <div className="h-full flex flex-col bg-charcoal-950">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 sticky top-0 bg-charcoal-950 z-30 border-b border-charcoal-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-charcoal-900 text-charcoal-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-lg font-bold text-white">Order Details</h1>
            <p className="text-charcoal-400 text-xs font-mono">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              getStatusStyle(order.status).color
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-6">
        {/* Customer Info */}
        <div className="card p-4 mb-4">
          <h2 className="text-charcoal-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Customer Information
          </h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-charcoal-800 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-charcoal-400" />
              </div>
              <div>
                <p className="text-white font-medium">{order.customer_name}</p>
                {order.customer_phone && (
                  <p className="text-charcoal-400 text-xs flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {order.customer_phone}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-charcoal-800 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-charcoal-400" />
              </div>
              <div>
                <p className="text-charcoal-400 text-xs">Delivery Location</p>
                <p className="text-white">{order.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-charcoal-800 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-charcoal-400" />
              </div>
              <div>
                <p className="text-charcoal-400 text-xs">Order Time</p>
                <p className="text-white text-sm">{formatDate(order.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="card p-4 mb-4">
          <h2 className="text-charcoal-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Order Items ({order.order_items.reduce((sum, item) => sum + item.quantity, 0)} items)
          </h2>

          <div className="space-y-3">
            {order.order_items.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b border-charcoal-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-charcoal-800 rounded-lg flex items-center justify-center">
                    <span className="text-mirchi-400 text-sm font-bold">{item.quantity}</span>
                  </div>
                  <span className="text-white">{item.item_name}</span>
                </div>
                <span className="text-charcoal-300">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-charcoal-700">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-charcoal-400">Subtotal</span>
              <span className="text-charcoal-300">Rs. {order.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-charcoal-400">Delivery Fee</span>
              <span className="text-charcoal-300">Included</span>
            </div>
            <div className="flex justify-between font-bold mt-2">
              <span className="text-white">Total</span>
              <span className="text-mirchi-400">Rs. {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="card p-4 mb-4">
          <h2 className="text-charcoal-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Payment & Delivery
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-charcoal-400" />
                <span className="text-charcoal-300">Payment</span>
              </div>
              <span className="text-white font-medium">
                {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Paid Online'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-charcoal-400" />
                <span className="text-charcoal-300">Type</span>
              </div>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-lg">
                {order.order_type}
              </span>
            </div>
          </div>
        </div>

        {/* Update Status Actions */}
        <div className="card p-4">
          <h2 className="text-charcoal-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Update Status
          </h2>

          <div className="grid grid-cols-2 gap-2">
            {ORDER_STATUSES.map((status) => {
              const isActive = order.status === status.value;
              return (
                <button
                  key={status.value}
                  onClick={() => handleStatusUpdate(status.value as Order['status'])}
                  disabled={isActive}
                  className={`p-3 rounded-xl flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-mirchi-500/20 border-2 border-mirchi-500 cursor-not-allowed'
                      : 'bg-charcoal-800 border-2 border-charcoal-700 hover:border-charcoal-600'
                  }`}
                >
                  {status.value === 'Pending' && (
                    <Clock className={`w-4 h-4 ${isActive ? 'text-yellow-400' : 'text-charcoal-400'}`} />
                  )}
                  {status.value === 'Accepted' && (
                    <CheckCircle className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-charcoal-400'}`} />
                  )}
                  {status.value === 'Preparing' && (
                    <ChefHat className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-charcoal-400'}`} />
                  )}
                  {status.value === 'Ready' && (
                    <Package className={`w-4 h-4 ${isActive ? 'text-mirchi-400' : 'text-charcoal-400'}`} />
                  )}
                  {status.value === 'Delivered' && (
                    <CheckCircle className={`w-4 h-4 ${isActive ? 'text-green-400' : 'text-charcoal-400'}`} />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      isActive ? 'text-white' : 'text-charcoal-300'
                    }`}
                  >
                    {status.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
