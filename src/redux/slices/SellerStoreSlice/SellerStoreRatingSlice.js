import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchSellerRating = createAsyncThunk(
  'SellerRating/fetchSellerRating',
  async () => {
    const response = await fetch(`${baseUrl}/addRatingSeller`);
    return response.json();
  }
);

const SellerRatingSlice = createSlice({
  name: 'SellerRating',
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
      .addCase(fetchSellerRating.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSellerRating.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchSellerRating.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default SellerRatingSlice.reducer;
export const { fetchSuccess } = SellerRatingSlice.actions;
