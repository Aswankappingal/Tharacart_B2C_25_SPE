import React, { useState } from 'react';
import './Discount.scss';
import Navbar from '../Navbar/Navbar';
import { MdOutlineFavoriteBorder } from 'react-icons/md';
import { HiOutlineStar } from 'react-icons/hi2';
import Footer from '../Footer/Footer';
import SearchresultSidebar from '../LeftMenuBar/SearchresultSidebar';
import { FaAngleLeft } from "react-icons/fa6";
import { Link, useParams } from 'react-router-dom';
import { useFetchDiscountProducts } from "../../redux/hooks/DiscountPageHooks/useFetchDiscountProducts ";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import BottomBar from '../BottomBar/BottomBar';
import Breadcrumb from '../BreadCrumb/BreadCrumb';

const Discount = () => {
  const { discountId } = useParams();
  const { discountProducts, status, error } = useFetchDiscountProducts(discountId);

  const [sortOrder, setSortOrder] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [availability, setAvailability] = useState('');

  // Filter and sort products based on user selection
  const filteredProducts = discountProducts
    .filter((product) => {
      if (selectedBrand && product.brand !== selectedBrand) return false;
      if (availability === 'in-stock' && product.stock <= 0) return false;
      if (availability === 'out-of-stock' && product.stock > 0) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'low-to-high') {
        return a.offerPrice - b.offerPrice;
      } else if (sortOrder === 'high-to-low') {
        return b.offerPrice - a.offerPrice;
      }
      return 0; // No sorting
    });

  if (status === 'loading') {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress
          className="loading"
          sx={{
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#02400C',
            }
          }}
        />
      </Box>
    );
  }

  if (status === 'failed') return <p>Error: {error}</p>;



  const calculateAverageRating = (ratings) => {
    const { oneRating, twoRating, threeRating, fourRating, fiveRating } = ratings;

    const totalRatings = oneRating + twoRating + threeRating + fourRating + fiveRating;

    // If there are no ratings, return 0 or a default value
    if (totalRatings === 0) return 0;

    const averageRating = (
      (oneRating * 1) +
      (twoRating * 2) +
      (threeRating * 3) +
      (fourRating * 4) +
      (fiveRating * 5)
    ) / totalRatings;

    return averageRating.toFixed(1); // Rounded to 1 decimal place
  };

  return (
    <div className='whole-data'>
      <Navbar />



      <div className="discount-main">
        <div className="discount-left">
          <SearchresultSidebar />
        </div>

        <div className="discount-right">

          <div className="breadCrumb" style={{ color: 'black' }}>
            <Breadcrumb basePath={[{ label: 'Home', link: '/' }]} />
          </div>

          <div className="discount-text-m">
            <Link className='Arrow-icon-main' to='/'>
              <div className="arrow-icon">
                <FaAngleLeft style={{ color: 'white' }} />
              </div>
            </Link>
            <div className="discount-text">
              <p>Discounts For You</p>
            </div>
          </div>

          <div className="selecter-filter">
            <div className="filter-1">
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>dj
                <option value="">Sort by</option>
                <option value="low-to-high">Price - Low to High</option>
                <option value="high-to-low">Price - High to Low</option>
              </select>
            </div>

            <div className="filter-2">
              <select onChange={(e) => setSelectedBrand(e.target.value)} value={selectedBrand}>
                <option value="">Brand</option>
                <option value="brand1">Brand 1</option>
                <option value="brand2">Brand 2</option>
              </select>
            </div>


            <div className="filter-3">
              <select name="availability" id="availability" onChange={(e) => setAvailability(e.target.value)} value={availability}>
                <option value="">Availability</option>
                <option value="in-stock">In stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="all-cards">
            <div className="container-fluid">
              <div className="row card-row">
                {filteredProducts.length === 0 ? (
                  <div className="no-products">
                    <h3 className='no-prod-fount'>No Products Found</h3>
                  </div>
                ) : (
                  filteredProducts.map((data, index) => {
                    const sellingPrice = data.offerPrice;
                    const originalPrice = data.price;

                    return (
                      <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={index}>
                        <Link to={`/product-page/${data.productId}`}>
                          <div className="product-card">
                            <div className="new">
                              <h5>New</h5>
                            </div>
                            <div className="favourate-icon">
                              <MdOutlineFavoriteBorder />
                            </div>
                            <div className="product-image">
                              <img src={data.imageUrls[0]} alt={data.name} />
                            </div>
                            <div className="product-details">
                              <div className="product-title">
                                {/* <h6>sold by<span id='thara'>Thara Trading Pvt Ltd</span></h6> */}
                                <p>
                                  {data.name.length > 20 ? `${data.name.slice(0, 60)}...` : data.name}
                                </p>
                              </div>
                              <div className="product-price">
                                <div className="exact-price">
                                  <h1>₹ {sellingPrice.toFixed(2)}</h1>
                                </div>
                                {/* <div className="before-price">
                                  <p>MOQ : 15 Pieces</p>
                                </div> */}
                                <div className="product-rating">
                                  <HiOutlineStar className="HiOutlineStar-icon" />
                                  <span>{calculateAverageRating(data)}</span>
                                </div>
                                <div className="verified">
                                  <img src="/Images/violet star.svg" alt="" />
                                  <span>Verified</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomBar />
      <Footer />
    </div>
  );
};

export default Discount;
