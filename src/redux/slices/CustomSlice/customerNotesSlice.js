import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../baseUrl';

// Async thunk to add a delivery note
export const addCustomerNote = createAsyncThunk(
  'customerNotes/addCustomerNote',
  async ({ orderId, orderedProductId, customerNotes, token }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/update-customer-notes`,
        { orderId, orderedProductId, customerNotes },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const customerNotesSlice = createSlice({
  name: 'customerNotes',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCustomerNote.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addCustomerNote.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addCustomerNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = customerNotesSlice.actions;
export default customerNotesSlice.reducer;
