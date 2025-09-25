import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNewArrivals } from '../../slices/HomePageSlice/newArrivalSlice';

const useNewArrival = () => {
  const dispatch = useDispatch();
  const newArrivals = useSelector((state) => state.newArrivals.data);
  const status = useSelector((state) => state.newArrivals.status);
  const error = useSelector((state) => state.newArrivals.error);

  useEffect(() => {
    // console.log(newArrivals);
    
    const cachedBrands = localStorage.getItem('newArrivals');

    

    if (cachedBrands) {
      dispatch({
        type: 'newArrivals/fetchSuccess',
        payload: JSON.parse(cachedBrands),
      });
    } else if (status === 'idle') {
      dispatch(fetchNewArrivals())
        .unwrap()
        .then((data) => {
          localStorage.setItem('newArrivals', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Failed to fetch featured brands:', err);
        });
    }
  }, [status, dispatch]);

  return { newArrivals, status, error };
};

export default useNewArrival;
