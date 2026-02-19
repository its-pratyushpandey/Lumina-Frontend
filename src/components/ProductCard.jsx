import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { motion } from 'framer-motion';

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

const getDiscountPercent = (price, compareAtPrice) => {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
};

const RatingStars = ({ rating }) => {
  const safeRating = Number.isFinite(Number(rating)) ? Number(rating) : 0;
  const full = Math.max(0, Math.min(5, Math.floor(safeRating)));
  const hasHalf = safeRating - full >= 0.5 && full < 5;

  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${safeRating} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, idx) => {
        const isFull = idx < full;
        const isHalf = idx === full && hasHalf;
        return (
          <span key={idx} className="relative inline-flex w-4 h-4">
            <Star className="w-4 h-4 text-gray-200" />
            {(isFull || isHalf) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: isHalf ? '50%' : '100%' }}
              >
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
      data-testid="product-card"
    >
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-square overflow-hidden bg-gray-50 relative">
          {product.stock === 0 && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center rounded-full bg-gray-900/85 text-white text-xs font-semibold px-3 py-1">
                Out of Stock
              </span>
            </div>
          )}

          {getDiscountPercent(product.price, product.compareAtPrice) > 0 && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center rounded-full bg-primary text-white text-xs font-semibold px-3 py-1">
                -{getDiscountPercent(product.price, product.compareAtPrice)}%
              </span>
            </div>
          )}

          <img
            src={product.images?.[0]?.url || FALLBACK_IMAGE}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors" data-testid="product-name">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.shortDescription}</p>
          
          <div className="flex items-center gap-2 mt-2">
            <RatingStars rating={product.rating} />
            <span className="text-sm font-medium">{Number(product.rating || 0).toFixed(1)}</span>
            <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-xl font-bold text-gray-900" data-testid="product-price">${product.price}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">${product.compareAtPrice}</span>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              type="button"
              disabled={product.stock === 0}
              className="h-10 px-4 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              data-testid="add-to-cart-button"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm font-semibold">Add to Cart</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;