import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrandWiseProducts } from '../../slices/BrandWiseProducts/fetchBrandWiseProducts';

export const useBrandWiseProducts = (brandId) => {
  const dispatch = useDispatch();

  // Access the brand product state from Redux
  const brandWiseProducts = useSelector((state) => state.brandWiseProducts.data);
  const status = useSelector((state) => state.brandWiseProducts.status);
  const error = useSelector((state) => state.brandWiseProducts.error);

  // Dispatch the fetchbrandWiseProducts thunk when brandId changes
  useEffect(() => {
    dispatch(fetchBrandWiseProducts(brandId));
  }, [dispatch, brandId]); // Add brandId as a dependency here

  return { brandWiseProducts, status, error };
};