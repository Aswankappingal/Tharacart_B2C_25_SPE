import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchSeller = createAsyncThunk(
  'Seller/fetchSeller',
  async () => {
    const response = await fetch(`${baseUrl}/getSellersBrand`);
    return response.json();
  }
);

const SellerSlice = createSlice({
  name: 'Seller',
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
      .addCase(fetchSeller.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSeller.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchSeller.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default SellerSlice.reducer;
export const { fetchSuccess } = SellerSlice.actions;
