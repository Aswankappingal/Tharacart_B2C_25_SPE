import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBrands } from '../../slices/topDealsSlice/getBrandSlice';

const useGetBrand = () => {
  const dispatch = useDispatch();
  const brands = useSelector((state) => state.brands.data);
  const status = useSelector((state) => state.brands.status);
  const error = useSelector((state) => state.brands.error);

  useEffect(() => {
    const cachedBrands = localStorage.getItem('brands');

    if (cachedBrands) {
      dispatch({
        type: 'brands/fetchSuccess',
        payload: JSON.parse(cachedBrands),
      });
    } else if (status === 'idle') {
      dispatch(fetchBrands())
        .unwrap()
        .then((data) => {
          localStorage.setItem('brands', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Failed to fetch topDealsProducts:', err);
        });
    }
  }, [status, dispatch]);

  return { brands, status, error };
};

export default useGetBrand;
