import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderAPI } from '@/services/api';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await orderAPI.getOrderById(id);
        setOrder(res.data);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) run();
  }, [id]);

  return (
    <div className="min-h-screen bg-background-subtle py-8" data-testid="order-detail-page">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Order Details</h1>
            <p className="text-gray-600 mt-1">View items and status.</p>
          </div>
          <Link to="/orders" className="text-primary font-semibold hover:underline">
            Back to orders
          </Link>
        </div>

        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6">{error}</div>}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !order ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-600">
            Order not found.
          </div>
        ) : (
          <div className="space-y-6">
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="font-semibold text-lg">{order.orderNumber}</div>
                  <div className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm px-3 py-1 rounded-full bg-gray-100">{order.orderStatus}</span>
                  <span className="text-sm px-3 py-1 rounded-full bg-green-50 text-green-700">{order.paymentStatus}</span>
                  <span className="font-semibold">${Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-heading font-semibold mb-4">Items</h2>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item._id} className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-gray-50" />
                    <div className="flex-1">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-semibold">${Number(item.price).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-heading font-semibold mb-4">Shipping</h2>
              <div className="text-sm text-gray-700 space-y-1">
                <div>{order.shippingAddress?.fullName}</div>
                <div>{order.shippingAddress?.phone}</div>
                <div>
                  {order.shippingAddress?.addressLine1}
                  {order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                </div>
                <div>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
                </div>
                <div>{order.shippingAddress?.country}</div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
