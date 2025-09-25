// SliceSuggestions.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSearchSuggestions = createAsyncThunk(
  'search/fetchSuggestions',
  async (query, { rejectWithValue }) => {
    try {
      const response = await fetch(`/getSearch-suggestions?q=${query}`);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      localStorage.setItem('searchSuggestions', JSON.stringify(data)); // Cache in local storage
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    suggestions: JSON.parse(localStorage.getItem('searchSuggestions')) || [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchSuggestions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.suggestions = action.payload;
        localStorage.setItem('searchSuggestions', JSON.stringify(action.payload)); // Update cache
      })
      .addCase(fetchSearchSuggestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default searchSlice.reducer;
