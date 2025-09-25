// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import baseUrl from '../../../baseUrl';

// // Async thunk for fetching a single category
// export const fetchSingleCategory = createAsyncThunk(
//   'singleCategory/fetchSingleCategory',
//   async (categoryId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${baseUrl}/fetch-single-category/${categoryId}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response ? error.response.data : error.message);
//     }
//   }
// );

// const singleCategorySlice = createSlice({
//   name: 'singleCategory',
//   initialState: {
//     singleCategory: null,
//     status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
//     error: null,
//   },
//   reducers: {
//     clearCategory: (state) => {
//       state.singleCategory = null;
//       state.status = 'idle';
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSingleCategory.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchSingleCategory.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.singleCategory = action.payload;
//       })
//       .addCase(fetchSingleCategory.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload || 'Something went wrong';
//       });
//   },
// });

// export const { clearCategory } = singleCategorySlice.actions;
// export default singleCategorySlice.reducer;




import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../baseUrl';

// Async thunk for fetching a single category
export const fetchSingleCategory = createAsyncThunk(
  'singleCategory/fetchSingleCategory',
  async (categoryId, name, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/fetch-single-category/${categoryId}/${ name }`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const singleCategorySlice = createSlice({
  name: 'singleCategory',
  initialState: {
    singleCategory: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearCategory: (state) => {
      state.singleCategory = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSingleCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.singleCategory = action.payload;
      })
      .addCase(fetchSingleCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { clearCategory } = singleCategorySlice.actions;
export default singleCategorySlice.reducer;
