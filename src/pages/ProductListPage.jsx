import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { productAPI, categoryAPI } from '../services/api';
import { Search, Filter } from 'lucide-react';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: Number(searchParams.get('page') || 1),
    totalPages: 1,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    order: searchParams.get('order') || 'desc',
    page: searchParams.get('page') || '1',
  });

  const buildSearchParamsFromFilters = (nextFilters) => {
    const params = {};
    Object.keys(nextFilters).forEach((k) => {
      const value = nextFilters[k];
      if (value === undefined || value === null || value === '') return;
      if (k === 'page' && String(value) === '1') return;
      params[k] = value;
    });
    return params;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchParams.get('focusSearch') === '1') {
      // Defer to ensure the input is in the DOM.
      setTimeout(() => {
        searchInputRef.current?.focus?.();
      }, 0);
    }
  }, [searchParams]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      order: searchParams.get('order') || 'desc',
      page: searchParams.get('page') || '1',
    }));
    fetchProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      const keys = ['search', 'category', 'minPrice', 'maxPrice', 'sortBy', 'order', 'page'];
      keys.forEach((k) => {
        const value = searchParams.get(k);
        if (value) params[k] = value;
      });

      const response = await productAPI.getProducts(params);
      setProducts(response.data.products);
      setPagination({
        currentPage: Number(response.data.currentPage || 1),
        totalPages: Number(response.data.totalPages || 1),
        total: Number(response.data.total || 0),
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error?.response?.data?.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: '1' };
    setFilters(newFilters);

    setSearchParams(buildSearchParamsFromFilters(newFilters));
  };

  const handleSortChange = (value) => {
    const [sortBy, order] = value.split(':');
    const newFilters = { ...filters, sortBy, order, page: '1' };
    setFilters(newFilters);

    setSearchParams(buildSearchParamsFromFilters(newFilters));
  };

  const handlePageChange = (nextPage) => {
    const safePage = Math.max(1, Math.min(pagination.totalPages || 1, nextPage));
    const newFilters = { ...filters, page: String(safePage) };
    setFilters(newFilters);
    setSearchParams(buildSearchParamsFromFilters(newFilters));
  };

  const SkeletonCard = ({ idx }) => (
    <div
      key={idx}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse"
      data-testid="product-skeleton"
    >
      <div className="aspect-square bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-gray-100 rounded w-24" />
          <div className="h-10 bg-gray-100 rounded-full w-32" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-subtle py-8" data-testid="product-list-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-4" data-testid="page-title">All Products</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                ref={searchInputRef}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="search-input"
              />
            </div>
            
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              data-testid="category-filter"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            
            <select
              value={`${filters.sortBy}:${filters.order}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              data-testid="sort-filter"
            >
              <option value="createdAt:desc">Newest</option>
              <option value="price:asc">Price: Low to High</option>
              <option value="price:desc">Price: High to Low</option>
              <option value="rating:desc">Top Rated</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="loading-state">
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} idx={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12" data-testid="error-state">
            <p className="text-gray-900 font-medium">{error}</p>
            <button
              type="button"
              onClick={fetchProducts}
              className="mt-4 h-10 px-8 rounded-full bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
              data-testid="retry-button"
            >
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-state">
            <p className="text-gray-600">No products found</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>

            {pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3" data-testid="pagination">
                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                  className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="pagination-prev"
                >
                  Prev
                </button>

                <div className="text-sm text-gray-700" data-testid="pagination-status">
                  Page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="pagination-next"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;