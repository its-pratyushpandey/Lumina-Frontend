import type { ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';

import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
import ProductListPage from '@/pages/ProductListPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CategoriesPage from '@/pages/CategoriesPage';
import ProfilePage from '@/pages/ProfilePage';
import OrdersPage from '@/pages/OrdersPage';
import OrderDetailPage from '@/pages/OrderDetailPage';
import CheckoutPage from '@/pages/CheckoutPage';

import HelpCenter from '@/pages/HelpCenter';
import ContactUs from '@/pages/ContactUs';

import AdminOverviewPage from '@/pages/admin/AdminOverviewPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';

import RequireAuth from '@/routes/RequireAuth';
import RequireAdmin from '@/routes/RequireAdmin';

const Page = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.18, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}
        >
          <Route
            path="/"
            element={
              <Page>
                <HomePage />
              </Page>
            }
          />
          <Route
            path="/products"
            element={
              <Page>
                <ProductListPage />
              </Page>
            }
          />
          <Route
            path="/products/:slug"
            element={
              <Page>
                <ProductDetailPage />
              </Page>
            }
          />
          <Route
            path="/categories"
            element={
              <Page>
                <CategoriesPage />
              </Page>
            }
          />

          <Route
            path="/help"
            element={
              <Page>
                <HelpCenter />
              </Page>
            }
          />
          <Route
            path="/contact"
            element={
              <Page>
                <ContactUs />
              </Page>
            }
          />

          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          <Route element={<RequireAuth />}
          >
            <Route
              path="/profile"
              element={
                <Page>
                  <ProfilePage />
                </Page>
              }
            />
            <Route
              path="/orders"
              element={
                <Page>
                  <OrdersPage />
                </Page>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <Page>
                  <OrderDetailPage />
                </Page>
              }
            />
            <Route
              path="/checkout"
              element={
                <Page>
                  <CheckoutPage />
                </Page>
              }
            />
          </Route>
        </Route>

        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<AdminOverviewPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

