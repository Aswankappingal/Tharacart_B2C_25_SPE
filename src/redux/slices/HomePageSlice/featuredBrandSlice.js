import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchFeaturedBrands = createAsyncThunk(
  'featuredBrands/fetchFeaturedBrands',
  async () => {
    const response = await fetch(`${baseUrl}/fetchFeaturedBrands`);
    return response.json();
  }
);

const featuredBrandSlice = createSlice({
  name: 'featuredBrands',
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
      .addCase(fetchFeaturedBrands.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFeaturedBrands.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchFeaturedBrands.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default featuredBrandSlice.reducer;
export const { fetchSuccess } = featuredBrandSlice.actions;
