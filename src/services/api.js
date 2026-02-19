import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
  addAddress: (data) => api.post('/api/auth/addresses', data),
  updateAddress: (id, data) => api.put(`/api/auth/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/api/auth/addresses/${id}`),
};

export const productAPI = {
  getProducts: (params) => api.get('/api/products', { params }),
  getProductBySlug: (slug) => api.get(`/api/products/${slug}`),
  semanticSearch: (query) => api.get('/api/products/search/semantic', { params: { query } }),
  createProduct: (data) => api.post('/api/products', data),
  updateProduct: (id, data) => api.put(`/api/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/api/products/${id}`),
};

export const categoryAPI = {
  getCategories: () => api.get('/api/categories'),
  getCategoryBySlug: (slug) => api.get(`/api/categories/${slug}`),
  createCategory: (data) => api.post('/api/categories', data),
  updateCategory: (id, data) => api.put(`/api/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/api/categories/${id}`),
};

export const cartAPI = {
  getCart: () => api.get('/api/cart'),
  addToCart: (data) => api.post('/api/cart', data),
  updateCartItem: (data) => api.put('/api/cart', data),
  applyCoupon: (data) => api.post('/api/cart/coupon', data),
  removeCoupon: () => api.delete('/api/cart/coupon'),
  removeFromCart: (productId) => api.delete(`/api/cart/${productId}`),
  clearCart: () => api.delete('/api/cart'),
};

export const orderAPI = {
  createOrder: (data) => api.post('/api/orders', data),
  getMyOrders: () => api.get('/api/orders/my-orders'),
  getOrderById: (id) => api.get(`/api/orders/${id}`),
  getAllOrders: (params) => api.get('/api/orders/all', { params }),
  updateOrderStatus: (id, data) => api.put(`/api/orders/${id}/status`, data),
  getOrderStats: () => api.get('/api/orders/stats'),
};

export const aiAPI = {
  chat: (data) => api.post('/api/ai/chat', data),
  generateDescription: (data) => api.post('/api/ai/generate-description', data),
  getChatHistory: (sessionId) => api.get(`/api/ai/chat-history/${sessionId}`),
};

export const cloudinaryAPI = {
  getUploadSignature: (params) => api.get('/api/cloudinary/signature', { params }),
  deleteImage: (data) => api.delete('/api/cloudinary/delete', { data }),
};

export const paymentAPI = {
  createStripePaymentIntent: () => api.post('/api/payments/stripe/payment-intent'),
  confirmStripeOrder: (data) => api.post('/api/payments/stripe/confirm', data),
};

export const reviewAPI = {
  getReviewsForProduct: (productId) => api.get(`/api/reviews/product/${productId}`),
  upsertMyReview: (productId, data) => api.post(`/api/reviews/product/${productId}`, data),
};

export const adminAPI = {
  getInsights: () => api.get('/api/admin/insights'),
  listUsers: (params) => api.get('/api/admin/users', { params }),
  updateUserRole: (userId, data) => api.put(`/api/admin/users/${userId}/role`, data),
};

export default api;