import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWishListProduct } from '../../slices/cartSlices/wishListProdSlice';

const useWishListProducts = () => {
  const dispatch = useDispatch();
  const wishListProduct = useSelector((state) => state.wishListProduct.data);
  const status = useSelector((state) => state.wishListProduct.status);
  const error = useSelector((state) => state.wishListProduct.error);

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
      dispatch(fetchWishListProduct())
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

  return { wishListProduct, status, error, refetch };
};

export default useWishListProducts;
