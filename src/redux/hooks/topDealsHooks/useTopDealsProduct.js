import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTopDealsProducts } from '../../slices/topDealsSlice/topDealsProductSlice';

const useTopDealsProduct = () => {
  const dispatch = useDispatch();
  const topDealsProducts = useSelector((state) => state.topDealsProducts.data);
  const status = useSelector((state) => state.topDealsProducts.status);
  const error = useSelector((state) => state.topDealsProducts.error);

  useEffect(() => {
    const cachedtopDealsProduct = localStorage.getItem('topDealsProducts');

    if (cachedtopDealsProduct) {
      dispatch({
        type: 'topDealsProducts/fetchSuccess',
        payload: JSON.parse(cachedtopDealsProduct),
      });
    } else if (status === 'idle') {
      dispatch(fetchTopDealsProducts())
        .unwrap()
        .then((data) => {
          localStorage.setItem('topDealsProducts', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Failed to fetch topDealsProducts:', err);
        });
    }
  }, [status, dispatch]);

  return { topDealsProducts, status, error };
};

export default useTopDealsProduct;
