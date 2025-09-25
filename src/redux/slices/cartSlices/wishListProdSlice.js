import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../baseUrl';

// Async thunk for fetching the logged-in user's details
export const fetchWishListProduct = createAsyncThunk(
  'WishListProduct/fetchWishListProduct',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${baseUrl}/get-wishList-products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// User slice definition
const wishListProductSlice = createSlice({
  name: 'WishListProduct',
  initialState: {
    data: [], 
    status: 'idle', 
    error: null, 
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishListProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishListProduct.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchWishListProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch user';
      });
  },
});

export default wishListProductSlice.reducer;
export const { fetchSuccess } = wishListProductSlice.actions;
