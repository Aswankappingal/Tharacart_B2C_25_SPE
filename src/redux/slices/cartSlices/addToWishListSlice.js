// src/features/wishlist/wishlistSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../baseUrl';
import useCartProduct from '../../hooks/cartPageHooks/useCartProduct';
import useWishListProducts from '../../hooks/cartPageHooks/useWishListProducts';

// Define the async thunk for adding an item to the wishlist

export const addToWishList = createAsyncThunk(
  
  'wishlist/addToWishList',
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return rejectWithValue('Authentication error. Please log in.');
      }

      const response = await axios.post(
        `${baseUrl}/move-to-wishlist`,

        { productId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // refetch();
        // wishListRefetch();
        return response.data; // Return data if successful
      } else if (response.status === 400) {
        return rejectWithValue('Product already in wishlist');
      }
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Create the slice
const addWishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [], // Manage wishlist items if needed
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    message: '',
    visible: false,
  },
  reducers: {
    hideAlert: (state) => {
      state.visible = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToWishList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToWishList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = 'Product Moved to Wishlist';
        state.visible = true;
        // You can also update the items array if needed
        // state.items = action.payload;
      })
      .addCase(addToWishList.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload;
        state.visible = true;
      });
  },
});

export const { hideAlert } = addWishlistSlice.actions;
export default addWishlistSlice.reducer;
