import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchTopDeals = createAsyncThunk(
  'topDeals/fetchTopDeals',
  async () => {
    const response = await fetch(`${baseUrl}/fetchDeals`);
    return response.json();
  }
);

const topDealsSlice = createSlice({
  name: 'topDeals',
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
      .addCase(fetchTopDeals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTopDeals.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchTopDeals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default topDealsSlice.reducer;
export const { fetchSuccess } = topDealsSlice.actions;
