import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../../slices/myAccountSlice/fetchUserSlice';

const useFetchUser = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);

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
      dispatch(fetchUser())
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

  return { user, status, error, refetch };
};

export default useFetchUser;
