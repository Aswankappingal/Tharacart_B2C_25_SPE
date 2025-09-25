import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchProductInnerDetails = createAsyncThunk(
  'productInnerDetails/fetchProductInnerDetails',
  async (pId) => {
    const response = await fetch(`${baseUrl}/getProductInnerDetails?pId=${pId}`);
    const data = await response.json();
    // Save to localStorage as soon as we get the data
    localStorage.setItem(`productInnerDetails_${pId}`, JSON.stringify(data));
    return data;
  }
);

const productInnerDetailsSlice = createSlice({
  name: 'productInnerDetails',
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
    resetStatus: (state) => {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductInnerDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductInnerDetails.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchProductInnerDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { fetchSuccess, resetStatus } = productInnerDetailsSlice.actions;
export default productInnerDetailsSlice.reducer;
