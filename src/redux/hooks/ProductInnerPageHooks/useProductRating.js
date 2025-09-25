import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductRatings } from '../../slices/productInnerSlice/ProductRatingSlice';
import { useParams } from 'react-router-dom';

const useProductRating = () => {
  const dispatch = useDispatch();
  const { prodId } = useParams();
  const productRatings = useSelector((state) => state.productRatings.data);
  const status = useSelector((state) => state.productRatings.status);
  const error = useSelector((state) => state.productRatings.error);

  useEffect(() => {
    if (!prodId) return;
    console.log('useRatingPage', prodId);

    try {
      const cachedProductRatings = localStorage.getItem(`productRatings_${prodId}`);

      if (cachedProductRatings) {
        const parsedData = JSON.parse(cachedProductRatings);
        // console.log('Using Cached Data:', parsedData);
        dispatch({
          type: 'productRatings/fetchSuccess',
          payload: parsedData,
        });
      } else if (status === 'idle') {
        dispatch(fetchProductRatings(prodId))
          .unwrap()
          .then((data) => {
            localStorage.setItem(`productRatings_${prodId}`, JSON.stringify(data));
          })
          .catch((err) => {
            console.error('Failed to fetch:', err);
          });
      }
    } catch (error) {
      console.error('Error parsing cached data:', error);
      localStorage.removeItem(`productRatings_${prodId}`);
    }
  }, [prodId, status, dispatch]);


  return { productRatings, status, error };
};

export default useProductRating;
