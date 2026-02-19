import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '@/services/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await orderAPI.getMyOrders();
        setOrders(res.data);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="min-h-screen bg-background-subtle py-8" data-testid="orders-page">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold">My Orders</h1>
          <p className="text-gray-600 mt-2">Track your purchases and delivery status.</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6">{error}</div>}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-600">
            No orders yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-gray-200 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="font-semibold">{order.orderNumber}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm px-3 py-1 rounded-full bg-gray-100">{order.orderStatus}</span>
                    <span className="text-sm px-3 py-1 rounded-full bg-green-50 text-green-700">{order.paymentStatus}</span>
                    <span className="font-semibold">${Number(order.total).toFixed(2)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
