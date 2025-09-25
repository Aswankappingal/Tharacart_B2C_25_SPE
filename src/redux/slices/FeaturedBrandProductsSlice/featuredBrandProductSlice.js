import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchFeaturedBrandProduct = createAsyncThunk(
  'featuredBrandProduct/fetchFeaturedBrandProduct',
  async () => {
    const response = await fetch(`${baseUrl}/getfeaturedproductsWiseBrand`);
   
    return response.json();
  }
);

// Initialize state with local storage cache if available
const initialState = {
  data: JSON.parse(localStorage.getItem('featuredBrandProduct')) || [],
  status: 'idle',
  error: null,
};

const featuredBrandProductsSlice = createSlice({
  name: 'featuredBrandProduct',
  initialState,
  reducers: {
    fetchSuccess: (state, action) => {
      state.data = action.payload;
      state.status = 'succeeded';
      // Cache the fetched data in local storage
      localStorage.setItem('featuredBrandProduct', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedBrandProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFeaturedBrandProduct.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
        // Cache the fetched data in local storage
        localStorage.setItem('featuredBrandProduct', JSON.stringify(action.payload));
      })
      .addCase(fetchFeaturedBrandProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default featuredBrandProductsSlice.reducer;
export const { fetchSuccess } = featuredBrandProductsSlice.actions;
