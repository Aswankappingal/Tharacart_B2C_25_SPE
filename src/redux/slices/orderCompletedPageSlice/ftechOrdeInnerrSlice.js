import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../baseUrl';

export const fetchOrderInnerDetails = createAsyncThunk(
  'discountProducts/fetchProductInnerDetails',
  async (orderId) => {
    console.log('oooooorder',orderId);
    const response = await axios.get(`${baseUrl}/order-inner-details/${orderId}`);
    console.log(response.data,"from slice");

    return response.data;
  }
);

const fetchOrderInnerdetaisSlice = createSlice({
  name: 'fetchOrder',
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
    clearData: (state) => {
      state.data = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderInnerDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderInnerDetails.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchOrderInnerDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default fetchOrderInnerdetaisSlice.reducer;
export const { fetchSuccess, clearData } = fetchOrderInnerdetaisSlice.actions;
