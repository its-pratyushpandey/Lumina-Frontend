import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { authAPI, cartAPI, paymentAPI } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCart } from '@/store/slices/cartSlice';

type Address = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

function CheckoutInner({
  clientSecret,
  paymentIntentId,
  shippingAddress,
}: {
  clientSecret: string;
  paymentIntentId: string;
  shippingAddress: Address;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError('Payments are still loading. Please wait.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // No redirect for SPA flows in test mode.
          return_url: window.location.origin + '/orders',
        },
        redirect: 'if_required',
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
        return;
      }

      const confirmRes = await paymentAPI.confirmStripeOrder({
        paymentIntentId,
        shippingAddress,
      });

      await dispatch(fetchCart());

      const orderId = confirmRes.data?.order?._id;
      if (orderId) {
        navigate(`/orders/${orderId}`);
      } else {
        navigate('/orders');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" data-testid="checkout-form">
      {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl">{error}</div>}

      <div className="border border-gray-200 rounded-2xl p-4">
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !stripe || !elements}
        className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Processing...' : 'Pay & Place Order'}
      </button>

      <p className="text-xs text-gray-500">
        Payments run in Stripe test mode.
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart);

  const stripeConfigured = Boolean(STRIPE_PUBLISHABLE_KEY);

  const [profile, setProfile] = useState<any>(null);
  const [shipping, setShipping] = useState<Address>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultAddress = useMemo(() => {
    const list = profile?.addresses || [];
    return list.find((a: any) => a.isDefault) || list[0] || null;
  }, [profile]);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await dispatch(fetchCart());
        const prof = await authAPI.getProfile();
        setProfile(prof.data);

        const da = (prof.data.addresses || []).find((a: any) => a.isDefault) || (prof.data.addresses || [])[0];
        if (da) {
          setShipping({
            fullName: da.fullName || prof.data.name || '',
            phone: da.phone || prof.data.phone || '',
            addressLine1: da.addressLine1 || '',
            addressLine2: da.addressLine2 || '',
            city: da.city || '',
            state: da.state || '',
            pincode: da.pincode || '',
            country: da.country || 'India',
          });
        }

        if (!stripeConfigured) {
          return;
        }

        const pi = await paymentAPI.createStripePaymentIntent();
        setClientSecret(pi.data.clientSecret);
        setPaymentIntentId(pi.data.paymentIntentId);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to start checkout');
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && cart.items.length === 0) {
      navigate('/products');
    }
  }, [cart.items.length, isLoading, navigate]);

  const applyCoupon = async () => {
    setCouponError(null);
    try {
      await cartAPI.applyCoupon({ code: couponCode });
      await dispatch(fetchCart());
      setCouponCode('');
    } catch (e: any) {
      setCouponError(e?.response?.data?.message || 'Failed to apply coupon');
    }
  };

  const removeCoupon = async () => {
    setCouponError(null);
    try {
      await cartAPI.removeCoupon();
      await dispatch(fetchCart());
    } catch (e: any) {
      setCouponError(e?.response?.data?.message || 'Failed to remove coupon');
    }
  };

  return (
    <div className="min-h-screen bg-background-subtle py-6 sm:py-8" data-testid="checkout-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-heading font-bold">Checkout</h1>
          <p className="text-gray-600 mt-2">Secure payment with Stripe.</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6">{error}</div>}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-heading font-semibold mb-4">Shipping Address</h2>

              {defaultAddress && (
                <button
                  type="button"
                  onClick={() =>
                    setShipping({
                      fullName: defaultAddress.fullName || profile?.name || '',
                      phone: defaultAddress.phone || profile?.phone || '',
                      addressLine1: defaultAddress.addressLine1 || '',
                      addressLine2: defaultAddress.addressLine2 || '',
                      city: defaultAddress.city || '',
                      state: defaultAddress.state || '',
                      pincode: defaultAddress.pincode || '',
                      country: defaultAddress.country || 'India',
                    })
                  }
                  className="mb-4 text-sm text-primary font-semibold hover:underline"
                >
                  Use default address
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                  <input
                    value={shipping.fullName}
                    onChange={(e) => setShipping((p) => ({ ...p, fullName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    value={shipping.phone}
                    onChange={(e) => setShipping((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address line 1</label>
                <input
                  value={shipping.addressLine1}
                  onChange={(e) => setShipping((p) => ({ ...p, addressLine1: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address line 2</label>
                <input
                  value={shipping.addressLine2}
                  onChange={(e) => setShipping((p) => ({ ...p, addressLine2: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    value={shipping.city}
                    onChange={(e) => setShipping((p) => ({ ...p, city: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    value={shipping.state}
                    onChange={(e) => setShipping((p) => ({ ...p, state: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    value={shipping.pincode}
                    onChange={(e) => setShipping((p) => ({ ...p, pincode: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  value={shipping.country}
                  onChange={(e) => setShipping((p) => ({ ...p, country: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="mt-8">
                <h3 className="font-semibold mb-3">Coupon</h3>
                {couponError && <div className="text-sm text-red-600 mb-2">{couponError}</div>}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="w-full sm:w-auto px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors"
                    disabled={!couponCode.trim()}
                  >
                    Apply
                  </button>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="mt-2 text-sm text-gray-600 hover:underline"
                >
                  Remove coupon
                </button>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-heading font-semibold mb-4">Payment</h2>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${Number(cart.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Discount</span>
                  <span>-${Number(cart.discount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold mt-3">
                  <span>Total</span>
                  <span>${Number(cart.total).toFixed(2)}</span>
                </div>
              </div>

              {clientSecret && paymentIntentId ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                    },
                  }}
                >
                  <CheckoutInner clientSecret={clientSecret} paymentIntentId={paymentIntentId} shippingAddress={shipping} />
                </Elements>
              ) : (
                <div className="text-sm text-gray-600">
                  {stripeConfigured ? 'Payments are not ready. Please refresh.' : 'Payments are currently unavailable.'}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
