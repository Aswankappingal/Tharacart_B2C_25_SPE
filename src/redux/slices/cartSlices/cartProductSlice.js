import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../baseUrl';

// Async thunk for fetching the logged-in user's details
export const fetchCartProduct = createAsyncThunk(
  'cartProduct/fetchCartProduct',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${baseUrl}/get-cart-products`, {
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
const cartProductSlice = createSlice({
  name: 'cartProduct',
  initialState: {
    data: null, 
    status: 'idle', 
    error: null, 
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartProduct.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchCartProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch user';
      });
  },
});

export default cartProductSlice.reducer;
export const { fetchSuccess } = cartProductSlice.actions;
