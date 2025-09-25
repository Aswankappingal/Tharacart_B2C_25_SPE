// sharableListSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../baseUrl';

// Async thunk for fetching sharable lists
export const fetchSharableLists = createAsyncThunk(
  'sharableLists/fetchSharableLists',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${baseUrl}/getsharable-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data, 'shareSlice');

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const sharableListSlice = createSlice({
  name: 'sharableLists',
  initialState: {
    lists: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSharableLists.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSharableLists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lists = action.payload;
      })
      .addCase(fetchSharableLists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default sharableListSlice.reducer;
