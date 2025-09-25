import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTopStores } from '../../slices/HomePageSlice/topStoreSlice';

const useTopStores = () => {
  const dispatch = useDispatch();
  const topStores = useSelector((state) => state.topStores.data);
  const status = useSelector((state) => state.topStores.status);
  const error = useSelector((state) => state.topStores.error);

  useEffect(() => {
    // Check if data is already in localStorage
    const cachedBrands = localStorage.getItem('topStores');

    if (cachedBrands) {
      // If data exists in localStorage, do not dispatch the action
      dispatch({
        type: 'topStores/fetchSuccess',
        payload: JSON.parse(cachedBrands),
      });
    } else if (status === 'idle') {
      // Fetch the data if not already fetched and store it in localStorage
      dispatch(fetchTopStores())
        .unwrap()
        .then((data) => {
          localStorage.setItem('topStores', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Failed to fetch featured brands:', err);
        });
    }
  }, [status, dispatch]);

  return { topStores, status, error };
};

export default useTopStores;
