import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleCategory, clearCategory } from '../../slices/FetchSingleCategorySlice/FetchSingleCategorySlice';
import { useEffect } from 'react';

const useFetchCategory = (categoryId) => {
  const dispatch = useDispatch();
  const { singleCategory, status, error } = useSelector((state) => state.singleCategory);

  useEffect(() => {
    console.log(categoryId);
    if (categoryId) {
      dispatch(fetchSingleCategory(categoryId));
    }

    return () => {
      // Clear category data when the component unmounts
      dispatch(clearCategory());
    };
  }, [categoryId, dispatch]);
// console.log(singleCategory);
  return { singleCategory, status, error };
};

export default useFetchCategory;
