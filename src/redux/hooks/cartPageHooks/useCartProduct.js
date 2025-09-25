import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartProduct } from '../../slices/cartSlices/cartProductSlice';

const useCartProduct = () => {
  const dispatch = useDispatch();
  const cartProduct = useSelector((state) => state.cartProduct.data);
  const status = useSelector((state) => state.cartProduct.status);
  const error = useSelector((state) => state.cartProduct.error);

  const [isAuthTokenPresent, setIsAuthTokenPresent] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    
    if (authToken) {
      setIsAuthTokenPresent(true); 
    } else {
      setIsAuthTokenPresent(false); 
    }
  }, []);

  const refetch = useCallback(() => {
    if (isAuthTokenPresent) {
      dispatch(fetchCartProduct())
        .unwrap()
        .catch((err) => {
          console.error('Failed to fetch Data:', err);
        });
    }
  }, [isAuthTokenPresent, dispatch]);

  useEffect(() => {
    if (status === 'idle' && isAuthTokenPresent) {
      refetch();
    }
  }, [status, isAuthTokenPresent, refetch]);

  return { cartProduct, status, error, refetch };
};

export default useCartProduct;
