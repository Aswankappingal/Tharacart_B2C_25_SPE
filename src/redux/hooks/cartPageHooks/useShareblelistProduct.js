import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSharableLists } from '../../slices/cartSlices/sharableListSlice';

const useSharableList = () => {
  const dispatch = useDispatch();
  const sharableList = useSelector((state) => state.sharableList.lists); // Corrected the path
  const status = useSelector((state) => state.sharableList.status); // Corrected the path
  const error = useSelector((state) => state.sharableList.error); // Corrected the path

  const [isAuthTokenPresent, setIsAuthTokenPresent] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    setIsAuthTokenPresent(!!authToken); // Check if auth token is present
  }, []);

  const refetch = useCallback(() => {
    if (isAuthTokenPresent) {
      dispatch(fetchSharableLists())
        .unwrap()
        .catch((err) => {
          console.error('Failed to fetch sharable list:', err);
        });
    }
  }, [isAuthTokenPresent, dispatch]);

  useEffect(() => {
    if (status === 'idle' && isAuthTokenPresent) {
      refetch();
    }
  }, [status, isAuthTokenPresent, refetch]);

  console.log(sharableList, 'from hook');

  return { sharableList, status, error, refetch };
};

export default useSharableList;
