import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchSellerStoreBrand = createAsyncThunk(
  'SellerStoreBrands/fetchSellerStoreBrand',
  async () => {
    const response = await fetch(`${baseUrl}/getSellersBrand`);
    return response.json();
  }
);

const SellerStoreBrandsSlice = createSlice({
  name: 'SellerStoreBrands',
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
      .addCase(fetchSellerStoreBrand.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSellerStoreBrand.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchSellerStoreBrand.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default SellerStoreBrandsSlice.reducer;
export const { fetchSuccess } = SellerStoreBrandsSlice.actions;
