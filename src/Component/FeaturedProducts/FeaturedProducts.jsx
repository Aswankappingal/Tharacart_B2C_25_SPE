import React, { useEffect } from 'react';
import './FeaturedProducts.scss';
import Navbar from '../Navbar/Navbar';
import { MdOutlineFavoriteBorder } from 'react-icons/md';
import { HiOutlineStar } from 'react-icons/hi2';
import Footer from '../Footer/Footer';
import SearchresultSidebar from '../LeftMenuBar/SearchresultSidebar';
import { FaAngleLeft } from "react-icons/fa6";
import { Link, useParams } from 'react-router-dom';
import { useBrandWiseProducts } from '../../redux/hooks/brandWiseProducts/useBrandWiseProducts';
import BottomBar from '../BottomBar/BottomBar';
import ScrollToTopOnMount from '../ScrollToTopOnMount';

const FeaturedProducts = () => {
  const { brandId } = useParams();
  const { brandWiseProducts, status, error } = useBrandWiseProducts(brandId);

  useEffect(() => {
    console.log('Fetched brand-wise products:', brandWiseProducts);
  }, [brandWiseProducts]);

  return (
    <div className='whole-data'>

      <Navbar />
      <ScrollToTopOnMount />
      <div className="discount-main">
        <div className="discount-left">
          <SearchresultSidebar />
        </div>

        <div className="discount-right">
          <div className="discount-text-m">
            <Link to='/' className='Arrow-head-main'>
              <div className="arrow-icon">
                <FaAngleLeft style={{ color: 'white' }} />
              </div>
            </Link>
            <div className="discount-text">
              <p>Brand Products</p>
            </div>
          </div>

          {/* Filters */}
          <div className="selecter-filter">
            <div className="filter-1">
              <select>
                <option value="">Sort by</option>
                <option value="low-to-high">Price - Low to High</option>
                <option value="high-to-low">Price - High to Low</option>
              </select>
            </div>
            
            {/* <div className="filter-2">
              <select>
                <option value="">Brand</option>
                <option value="brand1">Brand 1</option>
                <option value="brand2">Brand 2</option>
              </select>
            </div> */}

            <div className="filter-3">
              <select name="availability" id="availability">
                <option value="">Availability</option>
                <option value="in-stock">In stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Display Products */}
          <div className="all-cards">
            <div className="container-fluid">
              <div className="row card-row">
                {status === 'loading' && <p>Loading...</p>}
                {status === 'failed' && <p>Error: {error}</p>}
                {Array.isArray(brandWiseProducts) && brandWiseProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center w-full min-h-[400px] p-8">
                    <div className="text-center">
                      <img
                        src="/Images/no-products.svg"
                        alt="No products found"
                        className="w-24 h-24 mx-auto mb-4 opacity-50"
                      />
                      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                        No Products Found
                      </h3>
                      <p className="text-gray-500">
                        Try adjusting your filters or search terms
                      </p>
                    </div>
                  </div>
                ) : (
                  Array.isArray(brandWiseProducts) && brandWiseProducts.map((data, index) => {
                    const sellingPrice = data.offerPrice;
                    const originalPrice = data.price;
                    const offerPercentage = originalPrice
                      ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
                      : 0;

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
                                {/* <h6>sold by <span id='thara'>Thara Trading Pvt Ltd</span></h6> */}
                                <p>
                                  {data.name.length > 20 ? `${data.name.slice(0, 75)}...` : data.name}
                                </p>

                              </div>
                              <div className="product-price">
                                <div className="exact-price">
                                  <h1>₹ {sellingPrice.toFixed(2)}</h1>
                                </div>
                                <div className="before-price">
                                  {/* <p>MOQ : 15 Pieces</p> */}
                                </div>
                                <div className="product-rating">
                                  <HiOutlineStar className="HiOutlineStar-icon" />
                                  <span>4.3</span>
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

export default FeaturedProducts;