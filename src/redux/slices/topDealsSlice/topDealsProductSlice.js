import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchTopDealsProducts = createAsyncThunk(
  'topDealsProducts/fetchTopDealsProducts',
  async () => {
    const response = await fetch(`${baseUrl}/getTopDealProduct`);
    return response.json();
  }
);

const topDealsProductsSlice = createSlice({
  name: 'topDealsProducts',
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
      .addCase(fetchTopDealsProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTopDealsProducts.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchTopDealsProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default topDealsProductsSlice.reducer;
export const { fetchSuccess } = topDealsProductsSlice.actions;
