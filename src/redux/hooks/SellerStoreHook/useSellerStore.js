import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSellerStoreProd } from '../../slices/SellerStoreSlice/SellerStoreSlice';

const useSellerStore = () => {
  const dispatch = useDispatch();
  const SellerStoreProducts = useSelector((state) => state.SellerStoreProducts.data);
  const status = useSelector((state) => state.SellerStoreProducts.status);
  const error = useSelector((state) => state.SellerStoreProducts.error);

  useEffect(() => {
    const cachedSellerStoreProducts = localStorage.getItem('SellerStoreProducts');

    if (cachedSellerStoreProducts) {
      dispatch({
        type: 'SellerStoreProducts/fetchSuccess',
        payload: JSON.parse(cachedSellerStoreProducts),
      });
    } else if (status === 'idle') {
      dispatch(fetchSellerStoreProd())
        .unwrap()
        .then((data) => {
          localStorage.setItem('SellerStoreProducts', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Failed to fetch SellerStoreProducts:', err);
        });
    }
  }, [status, dispatch]);

  return { SellerStoreProducts, status, error };
};

export default useSellerStore;
