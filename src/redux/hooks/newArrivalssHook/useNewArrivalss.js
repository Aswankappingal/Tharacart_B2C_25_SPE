import { useDispatch, useSelector } from 'react-redux';
import { fetchNewArrivalProducts } from '../../slices/NewArrivalsSlicess/newArrivalsSlice';
import { useEffect } from 'react';

const useNewArrivals = (newArrivalId) => {
    console.log(newArrivalId);
    
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.newArrivalss);

    console.log(products);
    

    useEffect(() => {
        if (newArrivalId) {
            dispatch(fetchNewArrivalProducts(newArrivalId));
        }
    }, [dispatch, newArrivalId]);

    return { products, loading, error };
};

export default useNewArrivals;
