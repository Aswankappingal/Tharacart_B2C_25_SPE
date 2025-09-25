import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderInnerDetails } from '../../slices/orderCompletedPageSlice/ftechOrdeInnerrSlice';

export const useFetchOrder = (orderId) => {
  const dispatch = useDispatch();

  // Access the discount product state from Redux
  const orderInnerDetails = useSelector((state) => state.orderInnerDetails.data);
  const status = useSelector((state) => state.orderInnerDetails.status);
  const error = useSelector((state) => state.orderInnerDetails.error);

  // Dispatch the fetchDiscountProducts thunk when discountId changes
  useEffect(() => {
    console.log('orrfdgfgfg',orderId);
    if (orderId) {
      dispatch(fetchOrderInnerDetails(orderId));
    }
  }, [dispatch, orderId]); // Add discountId as a dependency here
console.log(orderInnerDetails,'from hook');
  return { orderInnerDetails, status, error };
};
