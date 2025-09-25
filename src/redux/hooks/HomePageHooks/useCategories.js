import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../slices/HomePageSlice/categorySlice';

const useCategories = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.data);
  const status = useSelector((state) => state.category.status);
  const error = useSelector((state) => state.category.error);

  useEffect(() => {
    const cachedCategories = localStorage.getItem('categories');

    if (cachedCategories) {
      dispatch({
        type: 'category/fetchSuccess',
        payload: JSON.parse(cachedCategories),
      });
    } else if (status === 'idle') {
      dispatch(fetchCategories())
        .unwrap()
        .then((data) => {
          localStorage.setItem('categories', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Failed to fetch categories:', err);
        });
    }
  }, [status, dispatch]);

  return { categories, status, error };
};

export default useCategories;
