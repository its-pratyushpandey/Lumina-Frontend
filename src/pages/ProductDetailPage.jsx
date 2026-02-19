import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { productAPI } from '../services/api';
import { addToCart, openCart } from '../store/slices/cartSlice';

const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <rect width="800" height="800" fill="#F3F4F6"/>
      <rect x="120" y="160" width="560" height="480" rx="48" fill="#FFFFFF"/>
      <path d="M240 520l120-140 110 130 70-80 120 150H240z" fill="#E5E7EB"/>
      <circle cx="330" cy="330" r="44" fill="#E5E7EB"/>
      <text x="400" y="700" text-anchor="middle" font-family="Inter,Arial" font-size="28" fill="#9CA3AF">Image unavailable</text>
    </svg>`
  );

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getProductBySlug(slug);
      setProduct(response.data.product);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity }));
    dispatch(openCart());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-state">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="not-found">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background-subtle py-8"
      data-testid="product-detail-page"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-square bg-white rounded-2xl overflow-hidden mb-4">
              <img
                src={product.images?.[selectedImage]?.url || FALLBACK_IMAGE}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="product-main-image"
                loading="eager"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-primary' : 'border-gray-200'
                    }`}
                    data-testid="product-thumbnail"
                  >
                    <img
                      src={img.url}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-heading font-bold mb-4" data-testid="product-title">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold" data-testid="product-rating">{product.rating}</span>
                <span className="text-gray-600">({product.reviewCount} reviews)</span>
              </div>
              
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium" data-testid="in-stock">In Stock</span>
              ) : (
                <span className="text-red-600 font-medium" data-testid="out-of-stock">Out of Stock</span>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-gray-900" data-testid="product-price">${product.price}</span>
                {product.compareAtPrice && (
                  <span className="text-xl text-gray-500 line-through">${product.compareAtPrice}</span>
                )}
              </div>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed" data-testid="product-description">{product.description}</p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-200 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-50 transition-colors"
                  data-testid="decrease-quantity"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x border-gray-200" data-testid="quantity-display">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-50 transition-colors"
                  data-testid="increase-quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                data-testid="add-to-cart-button"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              <button className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors" data-testid="wishlist-button">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.category?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-heading font-semibold mb-6">Customer Reviews</h2>
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review) => (
                <div key={review._id} className="bg-white p-6 rounded-xl" data-testid="review-item">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-semibold">{review.user?.name}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;