import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { closeCart, updateCartItem, removeFromCart } from '../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, isOpen } = useSelector((state) => state.cart);

  const handleQuantityChange = (productId, newQuantity) => {
    const safeQuantity = Math.max(1, Number(newQuantity || 1));
    dispatch(updateCartItem({ productId, quantity: safeQuantity }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/50 z-50"
            data-testid="cart-overlay"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            data-testid="cart-drawer"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-heading font-semibold" data-testid="cart-title">Shopping Cart</h2>
              <button
                onClick={() => dispatch(closeCart())}
                className="h-11 w-11 inline-flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"
                data-testid="close-cart-button"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500" data-testid="empty-cart">
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product._id} className="flex gap-4 bg-gray-50 p-4 rounded-xl" data-testid="cart-item">
                      <img
                        src={item.product.images[0]?.url}
                        alt={item.product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{item.product.name}</h3>
                        <p className="text-primary font-semibold mt-1">${item.price}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                            className="h-10 w-10 inline-flex items-center justify-center hover:bg-white rounded-xl transition-colors"
                            data-testid="decrease-quantity"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="min-w-10 text-center font-medium" data-testid="item-quantity">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                            className="h-10 w-10 inline-flex items-center justify-center hover:bg-white rounded-xl transition-colors"
                            data-testid="increase-quantity"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRemove(item.product._id)}
                        className="h-11 w-11 inline-flex items-center justify-center hover:bg-red-50 text-red-600 rounded-xl transition-colors h-fit"
                        data-testid="remove-item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span data-testid="cart-total">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-hover transition-colors"
                  data-testid="checkout-button"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;