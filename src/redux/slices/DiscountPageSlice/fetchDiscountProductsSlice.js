import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchDiscountProducts = createAsyncThunk(
  'discountProducts/fetchProductInnerDetails',
  async (discountId) => {
    const response = await fetch(`${baseUrl}/get-discount-products/${discountId}`);
    return response.json();
  }
);

const discountProdSlice = createSlice({
    name: 'discountProducts', 
    initialState: {
      data: [],  // Set to an empty array
      status: 'idle',
      error: null,
    },
    reducers: {
      fetchSuccess: (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      },
      clearData: (state) => {
        state.data = [];
        state.status = 'idle';
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchDiscountProducts.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchDiscountProducts.fulfilled, (state, action) => {
          state.data = action.payload;
          state.status = 'succeeded';
        })
        .addCase(fetchDiscountProducts.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
  
  export default discountProdSlice.reducer;
  export const { fetchSuccess, clearData } = discountProdSlice.actions;
