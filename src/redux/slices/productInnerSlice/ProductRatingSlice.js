import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

// Async thunk to fetch product ratings
export const fetchProductRatings = createAsyncThunk(
  'productRatings/fetchProductRatings',
  async (productId) => {
    const response = await fetch(`${baseUrl}/get-product-reviews?productId=${productId}`);
    return response.json();
  }
);

// Slice for product ratings
const productRatingsSlice = createSlice({
  name: 'productRatings',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    fetchSuccess: (state, action) => {
      state.data = action.payload;
      state.status = 'succeeded';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductRatings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductRatings.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchProductRatings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productRatingsSlice.reducer;
export const { fetchSuccess } = productRatingsSlice.actions;
