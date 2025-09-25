import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchNewArrivals = createAsyncThunk(
  'newArrivals/fetchNewArrivals',
  async () => {
    const response = await fetch(`${baseUrl}/getNewArrivalData`);
    return response.json();
  }
);

const newArrivalsSlice = createSlice({
  name: 'newArrivals',
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
      .addCase(fetchNewArrivals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
      
  },
});

export default newArrivalsSlice.reducer;
export const { fetchSuccess } = newArrivalsSlice.actions;
