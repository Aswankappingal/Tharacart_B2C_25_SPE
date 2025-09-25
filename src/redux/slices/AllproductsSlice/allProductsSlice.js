import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchAllProducts = createAsyncThunk(
  'AllProducts/fetchAllProducts',
  async () => {
    const response = await fetch(`${baseUrl}/getAllProducts`);
    return response.json();
  }
);

const AllProductsSlice = createSlice({
  name: 'AllProducts',
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
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default AllProductsSlice.reducer;
export const { fetchSuccess } = AllProductsSlice.actions;
