import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { openCart } from '../store/slices/cartSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

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
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors" data-testid="nav-home">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-primary transition-colors" data-testid="nav-products">Products</Link>
            <Link to="/categories" className="text-gray-700 hover:text-primary transition-colors" data-testid="nav-categories">Categories</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => {
                const onProductsPage = location.pathname === '/products';
                navigate(onProductsPage ? '/products?focusSearch=1' : '/products?focusSearch=1');
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              data-testid="search-button"
              aria-label="Search products"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            
            <button
              onClick={() => dispatch(openCart())}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              data-testid="cart-button"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" data-testid="cart-count">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" data-testid="profile-button">
                <User className="w-5 h-5 text-gray-700" />
              </Link>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors" data-testid="login-button">
                Login
              </Link>
            )}

            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors" data-testid="mobile-menu-button">
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;