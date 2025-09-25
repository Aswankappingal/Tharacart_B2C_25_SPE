import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSellerStoreBrand } from '../../slices/SellerStoreSlice/sellersBrandSlice';

const useSellersBrand = () => {
  const dispatch = useDispatch();
  const SellerStoreBrands = useSelector((state) => state.SellerStoreBrands.data);
  const status = useSelector((state) => state.SellerStoreBrands.status);
  const error = useSelector((state) => state.SellerStoreBrands.error);

  useEffect(() => {
    const cachedSellerStoreBrands = localStorage.getItem('SellerStoreBrands');

    if (cachedSellerStoreBrands) {
      dispatch({
        type: 'SellerStoreBrands/fetchSuccess',
        payload: JSON.parse(cachedSellerStoreBrands),
      });
    } else if (status === 'idle') {
      dispatch(fetchSellerStoreBrand())
        .unwrap()
        .then((data) => {
          localStorage.setItem('SellerStoreBrands', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Failed to fetch SellerStoreBrands:', err);
        });
    }
  }, [status, dispatch]);

  return { SellerStoreBrands, status, error };
};

export default useSellersBrand;

