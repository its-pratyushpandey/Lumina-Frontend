import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI } from '@/services/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await categoryAPI.getCategories();
        setCategories(res.data);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="min-h-screen bg-background-subtle py-8" data-testid="categories-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-heading font-bold">Categories</h1>
          <p className="text-gray-600 mt-2">Browse products by category.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-600">No categories found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-heading font-semibold">{cat.name}</h3>
                    {cat.description && <p className="text-gray-600 text-sm mt-1">{cat.description}</p>}
                  </div>
                  <span className="text-primary font-semibold">View</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
