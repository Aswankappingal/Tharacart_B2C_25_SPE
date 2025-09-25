import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFeaturedBrands } from '../../slices/HomePageSlice/featuredBrandSlice';

const useFeacturedBrand = () => {
  const dispatch = useDispatch();
  const featuredBrands = useSelector((state) => state.featuredBrands.data);
  const status = useSelector((state) => state.featuredBrands.status);
  const error = useSelector((state) => state.featuredBrands.error);

  useEffect(() => {
    const cachedBrands = localStorage.getItem('featuredBrands');

    if (cachedBrands) {
      dispatch({
        type: 'featuredBrands/fetchSuccess',
        payload: JSON.parse(cachedBrands),
      });
    } else if (status === 'idle') {
      dispatch(fetchFeaturedBrands())
        .unwrap()
        .then((data) => {
          localStorage.setItem('featuredBrands', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Failed to fetch featured brands:', err);
        });
    }
  }, [status, dispatch]);

  if (status === 'failed' && !featuredBrands.length) {
    console.warn(error || 'No featured brands available.');
  }

  return { featuredBrands, status, error };
};

export default useFeacturedBrand;
