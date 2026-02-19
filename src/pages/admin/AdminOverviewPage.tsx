import { useEffect, useState } from 'react';

import { adminAPI } from '@/services/api';

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await adminAPI.getInsights();
        setData(res.data);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load insights');
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl">{error}</div>;
  }

  return (
    <div className="space-y-8" data-testid="admin-overview">
      <div>
        <h2 className="text-2xl font-heading font-bold">Overview</h2>
        <p className="text-gray-600 mt-1">High level store health and recent activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
          <div className="text-sm text-gray-600">Total Revenue</div>
          <div className="text-2xl font-bold mt-1">${Number(data?.totalRevenue || 0).toFixed(2)}</div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-2xl font-bold mt-1">{Number(data?.totalOrders || 0)}</div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
          <div className="text-sm text-gray-600">Total Users</div>
          <div className="text-2xl font-bold mt-1">{Number(data?.totalUsers || 0)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold">Low stock products</h3>
          <p className="text-sm text-gray-600 mt-1">Threshold: {data?.lowStockThreshold}</p>

          <div className="mt-3 border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[520px] w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3">Product</th>
                    <th className="text-left px-4 py-3">SKU</th>
                    <th className="text-right px-4 py-3">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.lowStockProducts || []).map((p: any) => (
                    <tr key={p._id} className="border-t border-gray-100">
                      <td className="px-4 py-3">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600">{p.sku}</td>
                      <td className="px-4 py-3 text-right font-semibold">{p.stock}</td>
                    </tr>
                  ))}
                  {(data?.lowStockProducts || []).length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-gray-600" colSpan={3}>
                        No low stock products.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Recent orders</h3>
          <p className="text-sm text-gray-600 mt-1">Last 10 orders</p>

          <div className="mt-3 border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[520px] w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3">Customer</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.recentOrders || []).map((o: any) => (
                    <tr key={o._id} className="border-t border-gray-100">
                      <td className="px-4 py-3">
                        <div className="font-medium">{o.user?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{o.user?.email}</div>
                      </td>
                      <td className="px-4 py-3 capitalize">{o.orderStatus}</td>
                      <td className="px-4 py-3 text-right font-semibold">${Number(o.total || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                  {(data?.recentOrders || []).length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-gray-600" colSpan={3}>
                        No recent orders.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
