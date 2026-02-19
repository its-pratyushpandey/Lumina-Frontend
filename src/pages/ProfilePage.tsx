import { useEffect, useMemo, useState } from 'react';
import { authAPI } from '@/services/api';

type Address = {
  _id?: string;
  label?: string;
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  isDefault?: boolean;
};

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ name: '', phone: '', password: '' });
  const [address, setAddress] = useState<Address>({
    label: 'Home',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: true,
  });

  const defaultAddress = useMemo(() => {
    const list: Address[] = profile?.addresses || [];
    return list.find((a) => a.isDefault) || list[0] || null;
  }, [profile]);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authAPI.getProfile();
      setProfile(res.data);
      setForm({ name: res.data.name || '', phone: res.data.phone || '', password: '' });
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authAPI.updateProfile({
        name: form.name,
        phone: form.phone,
        ...(form.password ? { password: form.password } : {}),
      });
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to update profile');
    }
  };

  const addAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authAPI.addAddress(address);
      setAddress({
        label: 'Home',
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        isDefault: true,
      });
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to add address');
    }
  };

  return (
    <div className="min-h-screen bg-background-subtle py-8" data-testid="profile-page">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-heading font-bold">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account and addresses.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6">{error}</div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-heading font-semibold mb-4">Account</h2>
              <form onSubmit={updateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    placeholder="Leave blank to keep current"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-hover transition-colors"
                >
                  Save Changes
                </button>
              </form>

              {defaultAddress && (
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <h3 className="font-semibold mb-2">Default Address</h3>
                  <p className="text-sm text-gray-600">
                    {defaultAddress.fullName} • {defaultAddress.phone}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {defaultAddress.addressLine1}
                    {defaultAddress.addressLine2 ? `, ${defaultAddress.addressLine2}` : ''}
                  </p>
                  <p className="text-sm text-gray-600">
                    {defaultAddress.city}, {defaultAddress.state} {defaultAddress.pincode}
                  </p>
                  <p className="text-sm text-gray-600">{defaultAddress.country}</p>
                </div>
              )}
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-heading font-semibold mb-4">Add Address</h2>
              <form onSubmit={addAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                    <input
                      value={address.fullName || ''}
                      onChange={(e) => setAddress((p) => ({ ...p, fullName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      value={address.phone || ''}
                      onChange={(e) => setAddress((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address line 1</label>
                  <input
                    value={address.addressLine1 || ''}
                    onChange={(e) => setAddress((p) => ({ ...p, addressLine1: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address line 2</label>
                  <input
                    value={address.addressLine2 || ''}
                    onChange={(e) => setAddress((p) => ({ ...p, addressLine2: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      value={address.city || ''}
                      onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      value={address.state || ''}
                      onChange={(e) => setAddress((p) => ({ ...p, state: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input
                      value={address.pincode || ''}
                      onChange={(e) => setAddress((p) => ({ ...p, pincode: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(address.isDefault)}
                    onChange={(e) => setAddress((p) => ({ ...p, isDefault: e.target.checked }))}
                  />
                  <span className="text-sm text-gray-700">Set as default</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-hover transition-colors"
                >
                  Add Address
                </button>
              </form>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
