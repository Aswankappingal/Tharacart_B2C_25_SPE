import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchTopStoresProduct = createAsyncThunk(
  'topStoresProduct/fetchTopStoresProduct',
  async () => {
    const response = await fetch(`${baseUrl}/topStoreProducts`);
    return response.json();
  }
);

// Initialize state with local storage cache if available
const initialState = {
  data: JSON.parse(localStorage.getItem('topStoresProduct')) || [],
  status: 'idle',
  error: null,
};

const topStoresProductsSlice = createSlice({
  name: 'topStoresProduct',
  initialState,
  reducers: {
    fetchSuccess: (state, action) => {
      state.data = action.payload;
      state.status = 'succeeded';
      // Cache the fetched data in local storage
      localStorage.setItem('topStoresProduct', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopStoresProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTopStoresProduct.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
        // Cache the fetched data in local storage
        localStorage.setItem('topStoresProduct', JSON.stringify(action.payload));
      })
      .addCase(fetchTopStoresProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default topStoresProductsSlice.reducer;
export const { fetchSuccess } = topStoresProductsSlice.actions;
