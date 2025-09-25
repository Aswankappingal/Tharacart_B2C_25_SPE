import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLimitedTimeProducts, fetchSuccess } from '../../slices/LimitedTimeOfferSlice/LimitedOfferProductSlice';

const useLimitedOfferProducts = () => {
  const dispatch = useDispatch();
  const limitedTimeDealProducts = useSelector((state) => state.limitedTimeDealProducts.data);
  const status = useSelector((state) => state.limitedTimeDealProducts.status);
  const error = useSelector((state) => state.limitedTimeDealProducts.error);

  useEffect(() => {
    const cachedLimitedTimeDealProducts = localStorage.getItem('limitedTimeProducts');

    if (cachedLimitedTimeDealProducts) {
      // Dispatch the cached products to the Redux store
      dispatch(fetchSuccess(JSON.parse(cachedLimitedTimeDealProducts)));
    } else if (status === 'idle') {
      // Fetch from API if no cached data
      dispatch(fetchLimitedTimeProducts())
        .unwrap()
        .then((data) => {
          localStorage.setItem('limitedTimeProducts', JSON.stringify(data));

          
        })
        .catch((err) => {
          console.error('Failed to fetch limited time products:', err);
        });
    }
  }, [status, dispatch]);

  return { limitedTimeDealProducts, status, error };
};

export default useLimitedOfferProducts;
