import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../baseUrl';

export const fetchOrderCancel = createAsyncThunk(
    'orderCancel/fetchOrderCancelDetails',
    async (orderId) => {
        try {
            const response = await axios.get(`${baseUrl}/order-cancellation/${orderId}`);
            console.log(response.data,'from slicess');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch order cancellation details';
        }
    }
);

const orderCancelSlice = createSlice({
    name: 'orderCancel',
    initialState: {
        data: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        clearOrderCancelData: (state) => {
            state.data = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderCancel.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrderCancel.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchOrderCancel.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default orderCancelSlice.reducer;
export const { clearOrderCancelData } = orderCancelSlice.actions;
