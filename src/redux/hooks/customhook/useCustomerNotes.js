// import { addCustomerNote, resetState } from '../customhook/customerNotes';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomerNote } from '../../slices/CustomSlice/customerNotesSlice';

export const useCustomerNotes = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.customerNotes);

  const submitCustomerNote = async (orderId, orderedProductId, customerNotes) => {
    const token = localStorage.getItem('token');
    if (token) {
      await dispatch(addCustomerNote({ orderId, orderedProductId, customerNotes, token }));
    }
  };

  const reset = () => {
    dispatch(resetState());
  };

  return { loading, success, error, submitCustomerNote, reset };
};
