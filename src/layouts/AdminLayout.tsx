import { Link, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, Package, ShoppingBag, Users } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  const nav = [
    { to: '/admin/overview', label: 'Overview', icon: BarChart3 },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage products, orders, users, and AI tools.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-fit">
            <nav className="space-y-1">
              {nav.map((item) => {
                const active = location.pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                      active ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}
