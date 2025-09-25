import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchOrder = createAsyncThunk(
  'fetchOrder/fetchOrderDetails',
  async (parentOrderId) => {
    try {
      const response = await fetch(`${baseUrl}/get-order-summery/${parentOrderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      return await response.json();
    } catch (error) {
      console.error(error); // Log errors for debugging
      throw error; // Re-throw error for Redux Toolkit to handle
    }
  }
);

const fetchOrderSlice = createSlice({
  name: 'fetchOrder',
  initialState: {
    data: null, // Better default for an object response
    status: 'idle',
    error: null,
  },
  reducers: {
    clearData: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default fetchOrderSlice.reducer;
export const { clearData } = fetchOrderSlice.actions;
