// hooks/useOrders.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../slices/OrderProductSlice/OrdersProducSlice';

const useOrders = () => {
  const dispatch = useDispatch();

  const { orders, status, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOrders()); // Fetch orders only if not already fetched
    }
  }, [status, dispatch]);

  return { orders, status, error };
};

export default useOrders;
