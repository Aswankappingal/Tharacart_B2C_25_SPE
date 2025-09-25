import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchDiscounts = createAsyncThunk(
  'discounts/fetchDiscounts',
  async () => {
    const response = await fetch(`${baseUrl}/getDiscountForYouDetails`);
    return response.json();
  }
);

const discountSlice = createSlice({
  name: 'discounts',
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
      .addCase(fetchDiscounts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDiscounts.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default discountSlice.reducer;
export const { fetchSuccess } = discountSlice.actions;
