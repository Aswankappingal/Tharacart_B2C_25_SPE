import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderCancel } from '../../slices/OrderCancelPagesSlice/orderCancelSlice';

export const useOrderCancel = (orderId) => {
  const dispatch = useDispatch();
  const orderCancelData = useSelector((state) => state?.cancelOrder?.data);
  const status = useSelector((state) => state?.cancelOrder?.status);
  const error = useSelector((state) => state?.cancelOrder?.error);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderCancel(orderId));
    }
  }, [dispatch, orderId]);
  
  console.log(orderCancelData, 'from hook');
    
  return { orderCancelData, status, error };
};