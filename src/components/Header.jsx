import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { openCart } from '../store/slices/cartSlice';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { to: '/', label: 'Home', testId: 'nav-home' },
    { to: '/products', label: 'Products', testId: 'nav-products' },
    { to: '/categories', label: 'Categories', testId: 'nav-categories' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-2xl font-heading font-bold text-gray-900">Lumina</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-gray-700 hover:text-primary transition-colors"
                data-testid={item.testId}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => {
                const onProductsPage = location.pathname === '/products';
                navigate(onProductsPage ? '/products?focusSearch=1' : '/products?focusSearch=1');
              }}
              className="h-11 w-11 inline-flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"
              data-testid="search-button"
              aria-label="Search products"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            
            <button
              onClick={() => dispatch(openCart())}
              className="relative h-11 w-11 inline-flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"
              data-testid="cart-button"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" data-testid="cart-count">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin' : '/profile'}
                className="h-11 w-11 inline-flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"
                data-testid="profile-button"
                aria-label="Account"
              >
                <User className="w-5 h-5 text-gray-700" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="h-11 px-5 inline-flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary-hover transition-colors"
                data-testid="login-button"
              >
                Login
              </Link>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="md:hidden h-11 w-11 inline-flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"
                  data-testid="mobile-menu-button"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5 text-gray-700" />
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[85vw] max-w-sm p-0">
                <div className="p-6 border-b border-gray-100">
                  <SheetTitle className="text-lg font-heading font-semibold">Menu</SheetTitle>
                </div>

                <div className="p-4">
                  <nav className="space-y-1">
                    {navItems.map((item) => (
                      <SheetClose asChild key={item.to}>
                        <Link
                          to={item.to}
                          className="flex items-center justify-between rounded-2xl px-4 py-3 text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    {user ? (
                      <SheetClose asChild>
                        <Link
                          to={user.role === 'admin' ? '/admin/overview' : '/profile'}
                          className="flex items-center justify-between rounded-2xl px-4 py-3 text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium">{user.role === 'admin' ? 'Admin Dashboard' : 'My Account'}</span>
                        </Link>
                      </SheetClose>
                    ) : (
                      <SheetClose asChild>
                        <Link
                          to="/login"
                          className="flex items-center justify-center rounded-2xl px-4 py-3 bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
                        >
                          Login
                        </Link>
                      </SheetClose>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;