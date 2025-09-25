import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchBrandWiseProducts = createAsyncThunk(
  'brandWiseProducts/fetchBrandWiseProducts',
  async (brandId) => {
    const response = await fetch(`${baseUrl}/getBrandWiseProducts/${brandId}`);
    return response.json();
  }
);

const brandWiseProductsSlice = createSlice({
    name: 'brandWiseProducts', 
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
        .addCase(fetchBrandWiseProducts.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchBrandWiseProducts.fulfilled, (state, action) => {
          state.data = action.payload;
          state.status = 'succeeded';
        })
        .addCase(fetchBrandWiseProducts.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
  
  export default brandWiseProductsSlice.reducer;
  export const { fetchSuccess, clearData } = brandWiseProductsSlice.actions;
