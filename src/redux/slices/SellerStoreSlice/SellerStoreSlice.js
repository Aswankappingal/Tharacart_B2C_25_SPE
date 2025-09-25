import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchSellerStoreProd = createAsyncThunk(
  'SellerStoreProducts/fetchSellerStoreProd',
  async () => {
    const response = await fetch(`${baseUrl}/getsellersProducts`);
    return response.json();
  }
);

const SellerStoreProductsSlice = createSlice({
  name: 'SellerStoreProducts',
  initialState: {
    data: [],
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
      .addCase(fetchSellerStoreProd.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSellerStoreProd.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchSellerStoreProd.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default SellerStoreProductsSlice.reducer;
export const { fetchSuccess } = SellerStoreProductsSlice.actions;
