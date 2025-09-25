import { useState, useEffect } from 'react';
import axios from 'axios';

const useSellerRatingsPagination = (page) => {
  const [ratings, setRatings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/sellerRatingsPagenation', {
          params: {
            page: page,
            pageSize: 1 // Fixed to 1 item per page
          }
        });
        setRatings(response.data.ratings);
        setTotal(response.data.total);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [page]);

  return { ratings, total, loading, error };
};

export default useSellerRatingsPagination;
