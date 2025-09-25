import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchBanners} from '../../slices/HomePageSlice/bannerSlice';


const useFetchBanners = () =>{

    const dispatch = useDispatch();
    const banners = useSelector((state)=> state.banners.banners);
    const loading = useSelector((state)=> state.banners.loading);
    const error = useSelector((state)=> state.banners.error);


    useEffect(() => {
        dispatch(fetchBanners());
      }, [dispatch]);

      return { banners, loading, error };

}

export default useFetchBanners;