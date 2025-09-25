import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchTopStores = createAsyncThunk(
  'topStores/fetchTopStores',
  async () => {
    const response = await fetch(`${baseUrl}/topStoreGetting`);
    return response.json();
  }
);

const topStoresSlice = createSlice({
  name: 'topStores',
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
      .addCase(fetchTopStores.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTopStores.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchTopStores.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default topStoresSlice.reducer;
export const { fetchSuccess } = topStoresSlice.actions;
