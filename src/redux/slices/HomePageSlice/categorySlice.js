import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async () => {
    const response = await fetch(`${baseUrl}/fetchCategory`);
    return response.json();
  }
);

const categorySlice = createSlice({
  name: 'category',
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
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
export const { fetchSuccess } = categorySlice.actions;
