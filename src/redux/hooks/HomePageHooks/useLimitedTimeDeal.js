import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLimitedTimeDeals } from '../../slices/HomePageSlice/limitedTimeDealsSlice';

const useLimitedTimeDeals = () => {
  const dispatch = useDispatch();
  const limitedTimeDeals = useSelector((state) => state.limitedTimeDeals.data);
  const status = useSelector((state) => state.limitedTimeDeals.status);
  const error = useSelector((state) => state.limitedTimeDeals.error);

  useEffect(() => {
    // Check if data is already in localStorage
    const cachedBrands = localStorage.getItem('limitedTimeDeals');

    if (cachedBrands) {
      // If data exists in localStorage, do not dispatch the action
      dispatch({
        type: 'limitedTimeDeals/fetchSuccess',
        payload: JSON.parse(cachedBrands),
      });
    } else if (status === 'idle') {
      // Fetch the data if not already fetched and store it in localStorage
      dispatch(fetchLimitedTimeDeals())
        .unwrap()
        .then((data) => {
          localStorage.setItem('limitedTimeDeals', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Failed to fetch featured brands:', err);
        });
    }
  }, [status, dispatch]);

  return { limitedTimeDeals, status, error };
};

export default useLimitedTimeDeals;
