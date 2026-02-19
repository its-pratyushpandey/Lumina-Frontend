import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AIChatBot from '@/components/AIChatBot';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Toaster } from '@/components/ui/toaster';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCart } from '@/store/slices/cartSlice';

export default function MainLayout() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s) => s.auth);
  const location = useLocation();

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [dispatch, token]);

  // Close cart drawer on route change (prevents broken UI states)
  useEffect(() => {
    // no-op placeholder: CartDrawer manages its own state via Redux
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pb-24 md:pb-0">
        <Outlet />
      </main>
      <Footer />

      <CartDrawer />
      <AIChatBot />
      <MobileBottomNav />

      <Toaster />
    </div>
  );
}
