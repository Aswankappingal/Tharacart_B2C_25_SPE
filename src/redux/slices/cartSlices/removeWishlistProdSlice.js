// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../baseUrl';

export const removeFromWishList = createAsyncThunk(
  'wishList/removeFromWishList',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/remove-from-wishList`, { productId }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data.wishList; 
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const removeWishListSlice = createSlice({
  name: 'wishList',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(removeFromWishList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromWishList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(removeFromWishList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default removeWishListSlice.reducer;
