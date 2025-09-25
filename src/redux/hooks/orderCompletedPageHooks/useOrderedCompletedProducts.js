import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrder } from '../../slices/orderCompletedPageSlice/orderCompletedSlice';

export const useOrderedCompletedProducts = (orderId) => {
  const dispatch = useDispatch();

  // Access the order data from Redux - fix the selector to get the orders array
  const orderData = useSelector((state) => state.orderCompleted.data);
  const status = useSelector((state) => state.orderCompleted.status);
  const error = useSelector((state) => state.orderCompleted.error);

  // Extract orders array from the API response, with fallback to empty array
  const orders = orderData?.orders || [];

  // Dispatch the fetchOrder thunk when orderId changes
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrder(orderId));
    }
  }, [dispatch, orderId]);

  return { orders, status, error };
};