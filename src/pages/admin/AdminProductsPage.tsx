import { useEffect, useMemo, useState } from 'react';

import { aiAPI, categoryAPI, cloudinaryAPI, productAPI } from '@/services/api';

type ProductImage = { url: string; publicId: string };

type ProductDraft = {
  name: string;
  sku: string;
  price: string;
  stock: string;
  category: string;
  description: string;
  shortDescription: string;
  isFeatured: boolean;
  tags: string;
  images: ProductImage[];
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [draft, setDraft] = useState<ProductDraft>({
    name: '',
    sku: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    shortDescription: '',
    isFeatured: false,
    tags: '',
    images: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const tagsArray = useMemo(
    () =>
      draft.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    [draft.tags]
  );

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cats, prods] = await Promise.all([categoryAPI.getCategories(), productAPI.getProducts({ limit: 50 })]);
      setCategories(cats.data.categories || cats.data || []);
      setProducts(prods.data.products || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const sig = await cloudinaryAPI.getUploadSignature({ folder: 'products', resourceType: 'image' });
      const { signature, timestamp, cloudName, apiKey, folder } = sig.data;

      const form = new FormData();
      form.append('file', file);
      form.append('api_key', apiKey);
      form.append('timestamp', String(timestamp));
      form.append('signature', signature);
      form.append('folder', folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Cloudinary upload failed');
      }

      const json = await res.json();
      const img: ProductImage = { url: json.secure_url, publicId: json.public_id };
      setDraft((p) => ({ ...p, images: [...p.images, img] }));
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const generateDescription = async () => {
    setAiLoading(true);
    setError(null);
    try {
      const res = await aiAPI.generateDescription({
        name: draft.name,
        category: categories.find((c) => c._id === draft.category)?.name,
        features: tagsArray,
        priceRange: draft.price ? `$${Number(draft.price).toFixed(2)}` : undefined,
      });

      const text = res.data?.description;
      if (typeof text === 'string' && text.trim()) {
        setDraft((p) => ({ ...p, description: text }));
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to generate description');
    } finally {
      setAiLoading(false);
    }
  };

  const createProduct = async () => {
    setCreating(true);
    setError(null);

    try {
      const payload = {
        name: draft.name,
        sku: draft.sku,
        price: Number(draft.price),
        stock: Number(draft.stock),
        category: draft.category,
        description: draft.description,
        shortDescription: draft.shortDescription || undefined,
        isFeatured: draft.isFeatured,
        tags: tagsArray,
        images: draft.images,
      };

      const res = await productAPI.createProduct(payload);
      setProducts((prev) => [res.data, ...prev]);
      setDraft({
        name: '',
        sku: '',
        price: '',
        stock: '',
        category: '',
        description: '',
        shortDescription: '',
        isFeatured: false,
        tags: '',
        images: [],
      });
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create product');
    } finally {
      setCreating(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await productAPI.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8" data-testid="admin-products">
      <div>
        <h2 className="text-2xl font-heading font-bold">Products</h2>
        <p className="text-gray-600 mt-1">Create, upload images, and manage inventory.</p>
      </div>

      {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl">{error}</div>}

      <div className="border border-gray-100 rounded-2xl p-5">
        <h3 className="font-semibold mb-4">Create product</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
            <input
              value={draft.sku}
              onChange={(e) => setDraft((p) => ({ ...p, sku: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input
              type="number"
              value={draft.price}
              onChange={(e) => setDraft((p) => ({ ...p, price: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
            <input
              type="number"
              value={draft.stock}
              onChange={(e) => setDraft((p) => ({ ...p, stock: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={draft.category}
              onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select...</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
            <input
              value={draft.tags}
              onChange={(e) => setDraft((p) => ({ ...p, tags: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Short description</label>
          <input
            value={draft.shortDescription}
            onChange={(e) => setDraft((p) => ({ ...p, shortDescription: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <button
              type="button"
              onClick={generateDescription}
              disabled={aiLoading || !draft.name.trim()}
              className="text-sm px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
            >
              {aiLoading ? 'Generating…' : 'Generate with Grok'}
            </button>
          </div>
          <textarea
            value={draft.description}
            onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
            rows={6}
            className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-4">
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <label className="text-sm px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
              {uploading ? 'Uploading…' : 'Upload'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f);
                  e.currentTarget.value = '';
                }}
              />
            </label>
          </div>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {draft.images.map((img) => (
              <div key={img.publicId} className="border border-gray-100 rounded-xl overflow-hidden">
                <img src={img.url} alt="" className="w-full h-28 object-cover" />
              </div>
            ))}
            {draft.images.length === 0 && <div className="text-sm text-gray-600">No images yet.</div>}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            id="isFeatured"
            type="checkbox"
            checked={draft.isFeatured}
            onChange={(e) => setDraft((p) => ({ ...p, isFeatured: e.target.checked }))}
            className="w-4 h-4"
          />
          <label htmlFor="isFeatured" className="text-sm text-gray-700">
            Featured product
          </label>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={createProduct}
            disabled={creating}
            className="px-5 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {creating ? 'Creating…' : 'Create product'}
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h3 className="font-semibold">Existing products</h3>
          <button type="button" onClick={load} className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="mt-3 border border-gray-100 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3">SKU</th>
                  <th className="text-right px-4 py-3">Price</th>
                  <th className="text-right px-4 py-3">Stock</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.category?.name}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.sku}</td>
                    <td className="px-4 py-3 text-right font-semibold">${Number(p.price || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-semibold">{p.stock}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => deleteProduct(p._id)}
                        disabled={deletingId === p._id}
                        className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                      >
                        {deletingId === p._id ? 'Deleting…' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-gray-600" colSpan={5}>
                      No products yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
