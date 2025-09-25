import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOneSeller } from '../../slices/SellerStoreSlice/fetchOneSellerSlice';
import { useParams } from 'react-router-dom';

const useFetchSeller = () => {
    const dispatch = useDispatch();
    const { sellerId } = useParams();
    const oneSeller = useSelector((state) => state.oneSeller.data);
    const status = useSelector((state) => state.oneSeller.status);
    const error = useSelector((state) => state.oneSeller.error);

    useEffect(() => {
        if (!sellerId) return;

        try {
            // Check local storage for cached seller data
            const cachedOneSeller = localStorage.getItem(`oneSeller_${sellerId}`);
            
            if (cachedOneSeller) {
                const parsedData = JSON.parse(cachedOneSeller);

                // Dispatch the cached data to Redux state
                dispatch({
                    type: 'seller/fetchSeller/fulfilled',
                    payload: parsedData
                });
            }

            // Fetch fresh data only if the status is 'idle' or no data in local storage
            if (!cachedOneSeller || status === 'idle') {
                dispatch(fetchOneSeller(sellerId))
                    .unwrap()
                    .then((data) => {
                        // Store fetched data in local storage
                        localStorage.setItem(`oneSeller_${sellerId}`, JSON.stringify(data));
                    })
                    .catch((err) => {
                        console.error('Failed to fetch:', err);
                    });
            }
        } catch (error) {
            console.error('Error parsing cached data:', error);
            localStorage.removeItem(`oneSeller_${sellerId}`);
        }
    }, [sellerId, status, dispatch]);

    return { oneSeller, status, error };
};

export default useFetchSeller;
