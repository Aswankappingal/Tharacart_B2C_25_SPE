import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

// Async thunk to fetch product ratings
export const fetchOneSeller = createAsyncThunk(
  'oneSeller/fetchOneSeller', 
  async (sellerId) => {
    const response = await fetch(`${baseUrl}/getOneSeller?sellerId=${sellerId}`);
    return response.json();
  }
);

// Slice for product ratings
const fetchOneSellerSlice = createSlice({
  name: 'oneSeller',
  initialState: {
    data: null, 
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
      .addCase(fetchOneSeller.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOneSeller.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchOneSeller.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default fetchOneSellerSlice.reducer;
export const { fetchSuccess } = fetchOneSellerSlice.actions;
