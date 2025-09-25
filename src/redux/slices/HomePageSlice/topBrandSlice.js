import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchTopBrand = createAsyncThunk(
  'topBrand/fetchTopBrand',
  async () => {
    const response = await fetch(`${baseUrl}/getTopBrand`);
    return response.json();
  }
);

const topBrandSlice = createSlice({
  name: 'topBrand',
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
      .addCase(fetchTopBrand.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTopBrand.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchTopBrand.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default topBrandSlice.reducer;
export const { fetchSuccess } = topBrandSlice.actions;
