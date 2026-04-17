import { Link, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, Menu, Package, ShoppingBag, Users } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

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
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage products, orders, users, and AI tools.</p>
          </div>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="h-11 w-11 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
                  aria-label="Open admin menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>

              <SheetContent side="left" className="p-0">
                <div className="p-6 border-b border-gray-100">
                  <SheetTitle className="text-lg font-heading font-semibold">Admin Menu</SheetTitle>
                </div>
                <div className="p-4">
                  <nav className="space-y-1">
                    {nav.map((item) => {
                      const active = location.pathname === item.to;
                      const Icon = item.icon;
                      return (
                        <SheetClose asChild key={item.to}>
                          <Link
                            to={item.to}
                            className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors ${
                              active ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <nav className="hidden lg:flex items-center gap-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
            {nav.map((item) => {
              const active = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
                    active ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}
