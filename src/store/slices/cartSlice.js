import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/api';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (data, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateCartItem(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.removeFromCart(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  items: [],
  subtotal: 0,
  discount: 0,
  total: 0,
  isLoading: false,
  error: null,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.discount = action.payload.discount || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.discount = action.payload.discount || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.discount = action.payload.discount || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.discount = action.payload.discount || 0;
        state.total = action.payload.total || 0;
      });
  },
});

export const { openCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;