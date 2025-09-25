import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTopStoresProduct,fetchSuccess } from '../../slices/topStoresProductSlice/topStoresProductSlice';

const useTopStoresProducts = () => {
  const dispatch = useDispatch();
  const topStoresProduct = useSelector((state) => state.topStoresProduct.data);
  const status = useSelector((state) => state.topStoresProduct.status);
  const error = useSelector((state) => state.topStoresProduct.error);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const cachedtopStoresProduct = localStorage.getItem('topStoresProduct');

    if (cachedtopStoresProduct) {
      // Dispatch the cached products to the Redux store
      dispatch(fetchSuccess(JSON.parse(cachedtopStoresProduct)));
    } else if (status === 'idle') {
      // Fetch from API if no cached data
      dispatch(fetchTopStoresProduct())
        .unwrap()
        .then((data) => {
          localStorage.setItem('topStoresProduct', JSON.stringify(data));
        })
        .catch((err) => {
          setLocalError('Failed to fetchtopStoresProduct');
        });
    }
  }, [status, dispatch]);

  return { topStoresProduct, status, error: localError || error };
};

export default useTopStoresProducts;
