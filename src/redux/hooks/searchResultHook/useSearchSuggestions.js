// useSearchSuggestions.js
import { useEffect } from 'react';
import { fetchSearchSuggestions } from '../../slices/Search/SliceSuggestions';
import { useDispatch, useSelector } from 'react-redux';

const useSearchSuggestions = (query) => {
  const dispatch = useDispatch();
  const { suggestions = [], status, error } = useSelector((state) => state.search || {});

  useEffect(() => {
    if (query) {
      dispatch(fetchSearchSuggestions(query));
    }
  }, [query, dispatch]);

  return { suggestions, status, error };
};

export default useSearchSuggestions;
