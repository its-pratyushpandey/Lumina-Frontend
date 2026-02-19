import { useEffect, useState } from 'react';

import { orderAPI } from '@/services/api';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await orderAPI.getAllOrders({ limit: 50 });
      setOrders(res.data.orders || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (orderId: string, orderStatus: string) => {
    setSavingId(orderId);
    setError(null);
    try {
      const res = await orderAPI.updateOrderStatus(orderId, { orderStatus });
      const updated = res.data;
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to update order status');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6" data-testid="admin-orders">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-heading font-bold">Orders</h2>
          <p className="text-gray-600 mt-1">View and update order statuses.</p>
        </div>

        <button
          type="button"
          onClick={load}
          className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl">{error}</div>}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[860px] w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">Order</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Payment</th>
                  <th className="text-right px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="font-medium">{o._id}</div>
                      <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{o.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{o.user?.email}</div>
                    </td>
                    <td className="px-4 py-3 capitalize">{o.paymentStatus}</td>
                    <td className="px-4 py-3 text-right font-semibold">${Number(o.total || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        disabled={savingId === o._id}
                        className="h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-gray-600" colSpan={5}>
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
