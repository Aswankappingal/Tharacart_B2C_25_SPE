import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSeller } from '../../slices/SellerStoreSlice/sellerSlice';

const useSellers = () => {
  const dispatch = useDispatch();
  const sellers = useSelector((state) => state.sellers.data);
  const status = useSelector((state) => state.sellers.status);
  const error = useSelector((state) => state.sellers.error);

  useEffect(() => {
    const cachedsellers = localStorage.getItem('sellers');

    if (cachedsellers) {
      dispatch({
        type: 'sellers/fetchSuccess',
        payload: JSON.parse(cachedsellers),
      });
    } else if (status === 'idle') {
      dispatch(fetchSeller())
        .unwrap()
        .then((data) => {
          localStorage.setItem('sellers', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Failed to fetch sellers:', err);
        });
    }
  }, [status, dispatch]);

  return { sellers, status, error };
};

export default useSellers;

