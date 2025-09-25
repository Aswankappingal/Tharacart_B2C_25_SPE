import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFeaturedBrandProduct, fetchSuccess } from '../../slices/FeaturedBrandProductsSlice/featuredBrandProductSlice';

const useFeaturedBrandProduct = () => {
  const dispatch = useDispatch();
  const featuredBrandProduct = useSelector((state) => state.featuredBrandProduct.data);
  const status = useSelector((state) => state.featuredBrandProduct.status);
  const error = useSelector((state) => state.featuredBrandProduct.error);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const cachedFeaturedBrandProduct = localStorage.getItem('featuredBrandProduct');

    if (cachedFeaturedBrandProduct) {
      // Dispatch the cached products to the Redux store
      dispatch(fetchSuccess(JSON.parse(cachedFeaturedBrandProduct)));
    } else if (status === 'idle') {
      // Fetch from API if no cached data
      dispatch(fetchFeaturedBrandProduct())
        .unwrap()
        .then((data) => {
          localStorage.setItem('featuredBrandProduct', JSON.stringify(data));
        })
        .catch((error) => {
          setLocalError('Failed to fetch featuredBrandProduct');
        });
    }
  }, [status, dispatch]);

  return { featuredBrandProduct, status, error: localError || error };
};

export default useFeaturedBrandProduct;
