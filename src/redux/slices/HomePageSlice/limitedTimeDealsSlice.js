import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchLimitedTimeDeals = createAsyncThunk(
  'limitedTimeDeals/fetchLimitedTimeDeals',
  async () => {
    const response = await fetch(`${baseUrl}/fetchLimitedTimeDeals`);
    return response.json();
  }
);

const limitedTimeDealsSlice = createSlice({
  name: 'limitedTimeDeals',
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
      .addCase(fetchLimitedTimeDeals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLimitedTimeDeals.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchLimitedTimeDeals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default limitedTimeDealsSlice.reducer;
export const { fetchSuccess } = limitedTimeDealsSlice.actions;
