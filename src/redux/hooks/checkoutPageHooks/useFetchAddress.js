import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAddress } from '../../slices/checkoutPageSlice/fetchAddressSlice';

const useFetchAddress = () => {
  const dispatch = useDispatch();
  const address = useSelector((state) => state.address.data);
  const status = useSelector((state) => state.address.status);
  const error = useSelector((state) => state.address.error);

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
      dispatch(fetchAddress())
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

  return { address, status, error, refetch };
};

export default useFetchAddress;
