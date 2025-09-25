import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../baseUrl';

// Async thunk to fetch new arrival products
export const fetchNewArrivalProducts = createAsyncThunk(
    'newArrivalss/fetchProducts',
    async (newArrivalId, { rejectWithValue }) => {
        console.log(newArrivalId);
        
        try {
            const response = await axios.get(`${baseUrl}/fetch-all-new-arrival-products/${newArrivalId}`);
            console.log(response.data);

            return response.data.products;
            
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch products');
        }
    }
);

const newArrivalSlice = createSlice({
    name: 'newArrivalss',
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNewArrivalProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNewArrivalProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchNewArrivalProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default newArrivalSlice.reducer;
