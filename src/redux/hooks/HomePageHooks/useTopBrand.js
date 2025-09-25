import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTopBrand } from '../../slices/HomePageSlice/topBrandSlice';

const useTopBrand = () => {
  const dispatch = useDispatch();
  const topBrand = useSelector((state) => state.topBrand.data);
  const status = useSelector((state) => state.topBrand.status);
  const error = useSelector((state) => state.topBrand.error);

  useEffect(() => {
    const cachedBrands = localStorage.getItem('topBrand');

    if (cachedBrands) {
      dispatch({
        type: 'topBrand/fetchSuccess',
        payload: JSON.parse(cachedBrands),
      });
    } else if (status === 'idle') {
      dispatch(fetchTopBrand())
        .unwrap()
        .then((data) => {
          localStorage.setItem('topBrand', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Failed to fetch :', err);
        });
    }
  }, [status, dispatch]);

  return { topBrand, status, error };
};

export default useTopBrand;
