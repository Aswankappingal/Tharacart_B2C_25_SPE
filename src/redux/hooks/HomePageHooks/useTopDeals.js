import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTopDeals } from '../../slices/HomePageSlice/topDealsSlice';

const useTopDeals = () => {
  const dispatch = useDispatch();
  const topDeals = useSelector((state) => state.topDeals.data);
  const status = useSelector((state) => state.topDeals.status);
  const error = useSelector((state) => state.topDeals.error);

  useEffect(() => {
    // Check if data is already in localStorage
    const cachedBrands = localStorage.getItem('topDeals');

    if (cachedBrands) {
      // If data exists in localStorage, do not dispatch the action
      dispatch({
        type: 'topDeals/fetchSuccess',
        payload: JSON.parse(cachedBrands),
      });
    } else if (status === 'idle') {
      // Fetch the data if not already fetched and store it in localStorage
      dispatch(fetchTopDeals())
        .unwrap()
        .then((data) => {
          localStorage.setItem('topDeals', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Failed to fetch featured brands:', err);
        });
    }
  }, [status, dispatch]);

  return { topDeals, status, error };
};

export default useTopDeals;
