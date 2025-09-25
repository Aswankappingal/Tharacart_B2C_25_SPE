import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../../../baseUrl';

export const fetchNewArrivalsProd = createAsyncThunk(
  'newArrivalsProduct/fetchNewArrivalsProd',
  async () => {
    const response = await fetch(`${baseUrl}/getNewArrivalProd`);
    console.log("responsess",response);
    return response.json();

   
    
  }
);


// Initialize state with local storage cache if available
const initialState = {
  data: JSON.parse(localStorage.getItem('newArrivalsProduct')) || [],
  status: 'idle',
  error: null,
};

const newArrivalsProductSlice = createSlice({
  name: 'newArrivalsProduct',
  initialState,
  reducers: {
    fetchSuccess: (state, action) => {
      state.data = action.payload;
      state.status = 'succeeded';
      // Cache the fetched data in local storage
      localStorage.setItem('newArrivalsProduct', JSON.stringify(action.payload));
      
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewArrivalsProd.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNewArrivalsProd.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
        // Cache the fetched data in local storage
        localStorage.setItem('newArrivalsProduct', JSON.stringify(action.payload));
      })
      .addCase(fetchNewArrivalsProd.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default newArrivalsProductSlice.reducer;
export const { fetchSuccess } = newArrivalsProductSlice.actions;
