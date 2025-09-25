import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDiscountProducts } from '../../slices/DiscountPageSlice/fetchDiscountProductsSlice';

export const useFetchDiscountProducts = (discountId) => {
  const dispatch = useDispatch();

  // Access the discount product state from Redux
  const discountProducts = useSelector((state) => state.discountProducts.data);
  const status = useSelector((state) => state.discountProducts.status);
  const error = useSelector((state) => state.discountProducts.error);

  // Dispatch the fetchDiscountProducts thunk when discountId changes
  useEffect(() => {
    dispatch(fetchDiscountProducts(discountId));
  }, [dispatch, discountId]); // Add discountId as a dependency here

  return { discountProducts, status, error };
};