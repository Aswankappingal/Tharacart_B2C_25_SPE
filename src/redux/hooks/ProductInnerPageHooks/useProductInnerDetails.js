import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductInnerDetails, resetStatus } from '../../slices/productInnerSlice/productInnerSlice';
import { useParams } from 'react-router-dom';

const  useProductInnerDetails = () => {
  const dispatch = useDispatch();
  const { prodId } = useParams();
  const productInnerDetails = useSelector((state) => state.productInnerDetails.data);
  const status = useSelector((state) => state.productInnerDetails.status);
  const error = useSelector((state) => state.productInnerDetails.error);

  useEffect(() => {
    if (!prodId) return;

    const loadProductDetails = async () => {
      try {
        // Try to get data from localStorage
        const cachedData = localStorage.getItem(`productInnerDetails_${prodId}`);
        
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          dispatch(fetchSuccess(parsedData));
        } else {
          // If no cached data, fetch from API
          dispatch(fetchProductInnerDetails(prodId));
        }
      } catch (error) {
        console.error('Error loading product details:', error);
        localStorage.removeItem(`productInnerDetails_${prodId}`);
        dispatch(fetchProductInnerDetails(prodId));
      }
    };

    loadProductDetails();

    // Cleanup function
    return () => {
      dispatch(resetStatus()); // Reset status when component unmounts
    };
  }, [prodId, dispatch]);

  return { productInnerDetails, status, error };
};

export default useProductInnerDetails;
