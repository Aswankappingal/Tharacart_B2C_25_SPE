import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchQna = createAsyncThunk(
  'qna/fetchQna', 
  async (productId) => {
    const response = await fetch(`${baseUrl}/get-qstn-answr?productId=${productId}`);
    return response.json();
  }
);

const QnaSlice = createSlice({
  name: 'qna',
  initialState: {
    data: null, 
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
      .addCase(fetchQna.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQna.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchQna.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
  
});

export default QnaSlice.reducer;
export const { fetchSuccess } = QnaSlice.actions;
