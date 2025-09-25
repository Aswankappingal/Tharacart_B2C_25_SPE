import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../baseUrl';

// Define initial state
const initialState = {
  brandPageData: null, // Holds the fetched brand page data
  loading: false, // Indicates whether the data is being loaded
  error: null, // Holds error messages if any
};

// Async thunk to fetch brand page data
export const fetchBrandPage = createAsyncThunk(
  'brandPage/fetchBrandPage',
  async (brandId, { rejectWithValue }) => {
    try {
      // Make an API call to fetch brand page data
      const response = await axios.get(`${baseUrl}/getBrandPage/${brandId}`);
      return response.data; // Return the fetched data
    } catch (error) {
      // Handle 404 error specifically
      if (error.response && error.response.status === 404) {
        return rejectWithValue('Brand page not found.'); // Custom message for 404
      }
      // Handle other errors
      return rejectWithValue(error.message || 'An error occurred while fetching the brand page.');
    }
  }
);

// Create the slice
const brandPageSlice = createSlice({
  name: 'brandPage', // Slice name
  initialState, // Initial state
  reducers: {}, // No synchronous reducers defined in this case
  extraReducers: (builder) => {
    builder
      // Handle the pending state
      .addCase(fetchBrandPage.pending, (state) => {
        state.loading = true; // Set loading to true
        state.error = null; // Clear previous errors
      })
      // Handle the fulfilled state
      .addCase(fetchBrandPage.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false
        state.brandPageData = action.payload; // Set fetched data
      })
      // Handle the rejected state
      .addCase(fetchBrandPage.rejected, (state, action) => {
        state.loading = false; // Set loading to false
        state.error = action.payload || action.error.message; // Set the error message
      });
  },
});

// Export the reducer to be added to the store
export default brandPageSlice.reducer;
