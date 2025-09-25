import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchLimitedTimeProducts = createAsyncThunk(
  'limitedTimeProducts/fetchLimitedTimeProducts',
  async () => {
    const response = await fetch(`${baseUrl}/getlimitedTimeProducts`);

    
    


    return response.json();
  }
);

// Initialize state with local storage cache if available
const initialState = {
  data: JSON.parse(localStorage.getItem('limitedTimeProducts')) || [],
  status: 'idle',
  error: null,
};

const limitedTimeProductsSlice = createSlice({
  name: 'limitedTimeProducts',
  initialState,
  reducers: {
    fetchSuccess: (state, action) => {
      state.data = action.payload;
      state.status = 'succeeded';
      // Cache the fetched data in local storage
      localStorage.setItem('limitedTimeProducts', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLimitedTimeProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLimitedTimeProducts.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
        // Cache the fetched data in local storage
        localStorage.setItem('limitedTimeProducts', JSON.stringify(action.payload));
      })
      .addCase(fetchLimitedTimeProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default limitedTimeProductsSlice.reducer;
export const { fetchSuccess } = limitedTimeProductsSlice.actions;
