import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchNewArrivalsProd  } from '../../slices/NewArrivalsProd/NewArrivalsProdSlice';

const useNewArrivalsProdSlice = () => {
  const dispatch = useDispatch();
  const newArrivalsProduct = useSelector((state) => state.newArrivalsProduct.data);
  const status = useSelector((state) => state.newArrivalsProduct.status);
  const error = useSelector((state) => state.newArrivalsProduct.error);

  useEffect(() => {
    // Check if data is already in localStorage
    const cachednewArrivalsProduct = localStorage.getItem('newArrivalsProduct');

    if (cachednewArrivalsProduct) {

      

      dispatch({
        type: 'newArrivalsProduct/fetchSuccess',
        payload: JSON.parse(cachednewArrivalsProduct),
      });
    } else if (status === 'idle') {

      dispatch(fetchNewArrivalsProd())
        .unwrap()
        .then((data) => {
          localStorage.setItem('newArrivalsProduct', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Failed to fetch featured newArrivalsProduct:', err);
        });
    }
  }, [status, dispatch]);

  return { newArrivalsProduct, status, error };
};

export default useNewArrivalsProdSlice;
