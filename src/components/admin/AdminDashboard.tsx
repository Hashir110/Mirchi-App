import React, { useEffect } from 'react';
import { Flame, Clock, ChefHat, CheckCircle, Package, ChevronRight, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { getStatusStyle } from '../../lib/constants';

interface AdminDashboardProps {
  onSelectOrder: (order: Order) => void;
}

export function AdminDashboard({ onSelectOrder }: AdminDashboardProps) {
  const { orders, fetchOrders, updateOrderStatus } = useApp();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const pendingOrders = orders.filter((o) => o.status === 'Pending');
  const activeOrders = orders.filter(
    (o) => o.status === 'Accepted' || o.status === 'Preparing' || o.status === 'Ready'
  );
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');

  const handleQuickAction = async (orderId: string, newStatus: Order['status']) => {
    await updateOrderStatus(orderId, newStatus);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-charcoal-950">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 sticky top-0 bg-charcoal-950 z-30 border-b border-charcoal-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-mirchi-500 to-mirchi-red rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-charcoal-400 text-xs">Mirchi Point</p>
            </div>
          </div>
          <button
            onClick={fetchOrders}
            className="p-2 rounded-xl bg-charcoal-900 text-charcoal-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-charcoal-900 rounded-xl p-3 text-center">
            <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{pendingOrders.length}</p>
            <p className="text-[10px] text-charcoal-400">Pending</p>
          </div>
          <div className="bg-charcoal-900 rounded-xl p-3 text-center">
            <ChefHat className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{activeOrders.length}</p>
            <p className="text-[10px] text-charcoal-400">Active</p>
          </div>
          <div className="bg-charcoal-900 rounded-xl p-3 text-center">
            <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{deliveredOrders.length}</p>
            <p className="text-[10px] text-charcoal-400">Done</p>
          </div>
          <div className="bg-charcoal-900 rounded-xl p-3 text-center">
            <Package className="w-5 h-5 text-mirchi-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{orders.length}</p>
            <p className="text-[10px] text-charcoal-400">Total</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-6">
        {pendingOrders.length > 0 && (
          <div className="px-5 mb-4">
            <h2 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              Pending Orders ({pendingOrders.length})
            </h2>
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="card p-4 border-l-4 border-l-yellow-500"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-medium">{order.customer_name}</p>
                      <p className="text-charcoal-400 text-xs">{order.location}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                          getStatusStyle(order.status).color
                        }`}
                      >
                        {order.status}
                      </span>
                      <p className="text-charcoal-500 text-xs mt-1">
                        {formatTime(order.created_at)}
                      </p>
                    </div>
                  </div>

                  <p className="text-charcoal-400 text-xs mb-3">
                    {order.order_items.map((i) => `${i.quantity}x ${i.item_name}`).join(', ')}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-mirchi-400 font-bold">
                      Rs. {order.total.toLocaleString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleQuickAction(order.id, 'Accepted')}
                        className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => onSelectOrder(order)}
                        className="px-3 py-1.5 bg-charcoal-800 text-charcoal-300 text-xs font-semibold rounded-lg hover:bg-charcoal-700 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeOrders.length > 0 && (
          <div className="px-5 mb-4">
            <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ChefHat className="w-3.5 h-3.5" />
              Active Orders ({activeOrders.length})
            </h2>
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="card p-4 border-l-4 border-l-blue-500 cursor-pointer hover:bg-charcoal-800/50 transition-colors"
                  onClick={() => onSelectOrder(order)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-medium">{order.customer_name}</p>
                      <p className="text-charcoal-400 text-xs">{order.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                          getStatusStyle(order.status).color
                        }`}
                      >
                        {order.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-charcoal-500" />
                    </div>
                  </div>

                  <p className="text-charcoal-400 text-xs mb-2">
                    {order.order_items.map((i) => `${i.quantity}x ${i.item_name}`).join(', ')}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-500 text-xs">
                      {formatTime(order.created_at)}
                    </span>
                    <span className="text-mirchi-400 font-bold text-sm">
                      Rs. {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {deliveredOrders.length > 0 && (
          <div className="px-5">
            <h2 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5" />
              Completed Today ({deliveredOrders.length})
            </h2>
            <div className="space-y-3">
              {deliveredOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="card p-4 border-l-4 border-l-green-500 opacity-60 cursor-pointer hover:opacity-100 transition-opacity"
                  onClick={() => onSelectOrder(order)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium text-sm">{order.customer_name}</p>
                      <p className="text-charcoal-400 text-xs">
                        {order.order_items.map((i) => `${i.quantity}x ${i.item_name}`).join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400 text-xs font-semibold">Delivered</span>
                      <p className="text-charcoal-500 text-xs">
                        Rs. {order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {orders.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <Package className="w-16 h-16 text-charcoal-700 mb-4" />
            <h3 className="text-white font-semibold mb-1">No Orders Yet</h3>
            <p className="text-charcoal-400 text-sm text-center">
              Orders will appear here when customers place them
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
