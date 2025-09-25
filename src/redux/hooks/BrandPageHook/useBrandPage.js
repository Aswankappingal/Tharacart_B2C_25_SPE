import { useDispatch, useSelector } from 'react-redux';
import { fetchBrandPage } from '../../slices/BrandPageSlice/BrandPageSlice';
import { useEffect } from 'react';

// Custom hook to fetch brand page data
const useBrandPage = (brandId) => {
  const dispatch = useDispatch();
  const { brandPageData, loading, error } = useSelector((state) => state.brandPage);

  useEffect(() => {
    if (brandId) {
      dispatch(fetchBrandPage(brandId)); 
    }
  }, [brandId, dispatch]);

  return { brandPageData, loading, error };
};

export default useBrandPage;
