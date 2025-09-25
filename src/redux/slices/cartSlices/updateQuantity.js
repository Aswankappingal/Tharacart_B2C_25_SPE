import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../baseUrl';

// Async thunk for updating an item's quantity in the cart
export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      // Get the authToken from local storage
      const authToken = localStorage.getItem('authToken');

      // Send the PUT request with the authToken in the headers
      const response = await axios.put(
        `${baseUrl}/update-cart-quantity`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );

      return response.data; // The data returned here is the cart
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const updateCartQuantitySlice = createSlice({
  name: 'updateCartQuantity',
  initialState: {
    cart: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateCartQuantity.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload.cart; // Update cart with new data
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default updateCartQuantitySlice.reducer;
