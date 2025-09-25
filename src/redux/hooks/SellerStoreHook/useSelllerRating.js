import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSellerRating } from '../../slices/SellerStoreSlice/SellerStoreRatingSlice';

const useSelllerRating = () => {
  const dispatch = useDispatch();
  
  // Move selectors outside of any conditional logic
  const SellerRating = useSelector((state) => state.SellerRating.data);
  const status = useSelector((state) => state.SellerRating.status);
  const error = useSelector((state) => state.SellerRating.error);

  useEffect(() => {
    const cachedSellerRating = localStorage.getItem('SellerRating');
    
    // The hook is always called, logic inside effect can be conditional
    if (cachedSellerRating) {
      dispatch({
        type: 'SellerRating/fetchSuccess',
        payload: JSON.parse(cachedSellerRating),
      });
    }
  }, [dispatch]); // Effect depends on dispatch

  // Function to add a new seller rating
  const addRating = (ratingData) => {
    dispatch(addSellerRating(ratingData))
      .unwrap()
      .then((data) => {
        const updatedRatings = [...(SellerRating || []), data];
        localStorage.setItem('SellerRating', JSON.stringify(updatedRatings));
      })
      .catch((err) => {
        console.error('Failed to add SellerRating:', err);
      });
  };

  // Return values outside the conditional block
  return { SellerRating, status, error, addRating };
};

export default useSelllerRating;
