import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQna } from '../../slices/productInnerSlice/QnaSlice';
import { useParams } from 'react-router-dom';

const useQna = () => {
  const dispatch = useDispatch();
  const { prodId } = useParams();
  const qna = useSelector((state) => state.qna.data); 
  const status = useSelector((state) => state.qna.status);
  const error = useSelector((state) => state.qna.error);

  useEffect(() => {
    if (!prodId) return;
  
    try {
      const cachedQna = localStorage.getItem(`qna_${prodId}`);
  
      if (cachedQna) {
        const parsedData = JSON.parse(cachedQna);
        dispatch({
          type: 'qna/fetchSuccess',
          payload: parsedData,
        });
      } else if (status === 'idle') {
        dispatch(fetchQna(prodId))
          .unwrap()
          .then((data) => {
            localStorage.setItem(`qna_${prodId}`, JSON.stringify(data));
          })
          .catch((err) => {
            console.error('Failed to fetch:', err);
          });
      }
    } catch (error) {
      console.error('Error parsing cached data:', error);
      localStorage.removeItem(`qna_${prodId}`);
    }
  }, [prodId, status, dispatch]);
  

  return { qna, status, error };
};

export default useQna;
