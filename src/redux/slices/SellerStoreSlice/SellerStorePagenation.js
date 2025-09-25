import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

// Define the initial state with pagination information
const initialState = {
  data: [],              // Array to hold paginated data
  status: 'idle',        // Status of the async request
  error: null,           // Error message
  page: 1,               // Current page number
  totalPages: 0,         // Total number of pages
  limit: 10              // Number of items per page (set to 10)
};

// Async thunk to fetch paginated data
export const fetchSellerStorePagenation = createAsyncThunk(
  'SellerStorePagenation/fetchSellerStorePagenation',
  async ({ page = 1, limit = 10 }) => {
    const response = await fetch(`${baseUrl}/sellerRatingsPagenation?page=${page}&limit=${limit}`);
    const data = await response.json();
    return data;
  }
);

const SellerStorePagenationSlice = createSlice({
  name: 'SellerStorePagenation',
  initialState,
  reducers: {
    // Action to set the current page
    setPage: (state, action) => {
      state.page = action.payload;
    },
    // Action to set the number of items per page
    setLimit: (state, action) => {
      state.limit = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerStorePagenation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSellerStorePagenation.fulfilled, (state, action) => {
        state.data = action.payload.ratings;
        state.totalPages = Math.ceil(action.payload.total / state.limit); // Calculate total pages
        state.status = 'succeeded';
      })
      .addCase(fetchSellerStorePagenation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default SellerStorePagenationSlice.reducer;
export const { setPage, setLimit } = SellerStorePagenationSlice.actions;
