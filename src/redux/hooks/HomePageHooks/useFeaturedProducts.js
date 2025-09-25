import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFeaturedProducts } from '../../slices/HomePageSlice/featuresProductSlice';

const useFeaturedProducts = () => {
  const dispatch = useDispatch();
  const featuredProducts = useSelector((state) => state.featuredProducts.data);
  const status = useSelector((state) => state.featuredProducts.status);
  const error = useSelector((state) => state.featuredProducts.error);

  useEffect(() => {
    const cachedBrands = localStorage.getItem('featuredProducts');

    if (cachedBrands) {
      dispatch({
        type: 'featuredProducts/fetchSuccess',
        payload: JSON.parse(cachedBrands),
      });
    } else if (status === 'idle') {
      dispatch(fetchFeaturedProducts())
        .unwrap()
        .then((data) => {
          localStorage.setItem('featuredProducts',JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Failed to fetch', err);
        });
    }
  }, [status, dispatch]);

  return { featuredProducts, status, error };
};

export default useFeaturedProducts;
