import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDiscounts } from '../../slices/HomePageSlice/fetchDiscountSlice';

const useFetchDiscount = () => {
  const dispatch = useDispatch();
  const discounts = useSelector((state) => state.discounts.data);
  const status = useSelector((state) => state.discounts.status);
  const error = useSelector((state) => state.discounts.error);

  useEffect(() => {
    const cachedDiscounts = localStorage.getItem('discounts');

    if (cachedDiscounts) {
      dispatch({
        type: 'discounts/fetchSuccess',
        payload: JSON.parse(cachedDiscounts),
      });
    } else if (status === 'idle') {
      dispatch(fetchDiscounts())
        .unwrap()
        .then((data) => {
          localStorage.setItem('discounts', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Failed to fetch discounts:', err);
        });
    }
  }, [status, dispatch]);

  return { discounts, status, error };
};

export default useFetchDiscount;
