import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openCart } from '@/store/slices/cartSlice';

const Item = ({
  to,
  label,
  active,
  icon,
}: {
  to: string;
  label: string;
  active: boolean;
  icon: React.ReactNode;
}) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors ${
      active ? 'text-primary' : 'text-gray-600'
    }`}
  >
    <div className="w-6 h-6">{icon}</div>
    <span>{label}</span>
  </Link>
);

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { items } = useAppSelector((s) => s.cart);
  const cartCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/90 backdrop-blur-xl md:hidden">
      <div className="max-w-md mx-auto grid grid-cols-4">
        <Item to="/" label="Home" active={isActive('/')} icon={<Home className="w-6 h-6" />} />
        <Item
          to="/products"
          label="Shop"
          active={location.pathname.startsWith('/products')}
          icon={<ShoppingBag className="w-6 h-6" />}
        />

        <button
          type="button"
          onClick={() => dispatch(openCart())}
          className="relative flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs text-gray-600"
        >
          <ShoppingCart className="w-6 h-6" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-5 bg-primary text-white text-[10px] rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate(user ? (user.role === 'admin' ? '/admin/overview' : '/profile') : '/login')}
          className={`flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors ${
            location.pathname.startsWith('/profile') || location.pathname.startsWith('/admin')
              ? 'text-primary'
              : 'text-gray-600'
          }`}
        >
          <User className="w-6 h-6" />
          <span>{user ? 'Account' : 'Login'}</span>
        </button>
      </div>
    </nav>
  );
}
