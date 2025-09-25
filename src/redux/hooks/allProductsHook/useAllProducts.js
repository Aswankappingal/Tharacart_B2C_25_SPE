import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProducts ,fetchSuccess } from '../../slices/AllproductsSlice/allProductsSlice';
// import {  } from '../../slices/HomePageSlice/categorySlice';

const useAllProducts = () => {
  const dispatch = useDispatch();
  const AllProducts = useSelector((state) => state.AllProducts.data);
  const status = useSelector((state) => state.AllProducts.status);
  const error = useSelector((state) => state.AllProducts.error);

  useEffect(() => {
    const cachedAllProducts = localStorage.getItem('AllProducts');

    if (cachedAllProducts) {
      // Dispatch the cached products to the Redux store
      dispatch(fetchSuccess(JSON.parse(cachedAllProducts)));
    } else if (status === 'idle') {
      // Fetch from API if no cached data
      dispatch(fetchAllProducts())
        .unwrap()
        .then((data) => {
          localStorage.setItem('AllProducts', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Failed to fetch AllProducts:', err);
        });
    }
  }, [status, dispatch]);

  return { AllProducts, status, error };
};

export default useAllProducts;
