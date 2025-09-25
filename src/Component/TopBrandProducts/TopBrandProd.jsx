import React, { useEffect, useState } from 'react';
import './TopBrandProd.scss';
import Navbar from '../Navbar/Navbar';
import { MdOutlineFavoriteBorder } from 'react-icons/md';
import { HiOutlineStar } from 'react-icons/hi2';
import Footer from '../Footer/Footer';
import SearchresultSidebar from '../LeftMenuBar/SearchresultSidebar';
import { FaAngleLeft } from "react-icons/fa6";
import { Link, useParams } from 'react-router-dom';
import { useBrandWiseProducts } from '../../redux/hooks/brandWiseProducts/useBrandWiseProducts';
import BottomBar from '../BottomBar/BottomBar';
import useGetBrand from '../../redux/hooks/topDealsHooks/useGetBrand';
import ScrollToTopOnMount from '../ScrollToTopOnMount';

const TopbrandProducts = () => {
  const { brandId } = useParams();
  const { brandWiseProducts, status, error } = useBrandWiseProducts(brandId);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [availability, setAvailability] = useState('');

  const { brands, status: brandStatus, error: brandError } = useGetBrand();

  const selectedBrandss = brands ? brands.find((brand) => brand.brandId === brandId) : null;



  useEffect(() => {
    setFilteredProducts(brandWiseProducts);
  }, [brandWiseProducts]);



  useEffect(() => {
    let filtered = [...brandWiseProducts];

    // Filter by brand
    if (selectedBrand) {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Filter by availability
    if (availability === 'in-stock') {
      filtered = filtered.filter(product => product.stock > 0);
    } else if (availability === 'out-of-stock') {
      filtered = filtered.filter(product => product.stock === 0);
    }

    // Sort by price
    if (sortOption === 'low-to-high') {
      filtered.sort((a, b) => a.offerPrice - b.offerPrice);
    } else if (sortOption === 'high-to-low') {
      filtered.sort((a, b) => b.offerPrice - a.offerPrice);
    }

    setFilteredProducts(filtered);
  }, [sortOption, selectedBrand, availability, brandWiseProducts]);




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
      
         <ScrollToTopOnMount />

      <Navbar />
      <div className="discount-main">
        <div className="discount-left">
          <SearchresultSidebar />
        </div>

        <div className="discount-right">
          <div className="discount-text-m">
            <Link to='/' className='Arroww-main'>
              <div className="arrow-icon">
                <FaAngleLeft style={{ color: 'white' }} />
              </div>
            </Link>
            <div className="discount-text">
              <p>{selectedBrandss?.brandName}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="selecter-filter">
            <div className="filter-1">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Sort by</option>
                <option value="low-to-high">Price - Low to High</option>
                <option value="high-to-low">Price - High to Low</option>
              </select>
            </div>


            {/* <div className="filter-2">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}>
                <option value="">Brand</option>
                <option value="brand1">Brand 1</option>
                <option value="brand2">Brand 2</option>
              </select>
            </div> */}



            <div className="filter-3">
              <select
                name="availability"
                id="availability"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
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
                {Array.isArray(filteredProducts) && filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center w-full min-h-[400px] p-8">
                    <div className="text-center">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                        No Products Found
                      </h3>
                    </div>
                  </div>
                ) : (
                  Array.isArray(filteredProducts) && filteredProducts.map((data, index) => {
                    const sellingPrice = data.offerPrice;
                    const originalPrice = data.price;

                    return (
                      <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={index}>
                        <Link to={`/product-page/${data.productId}`}>
                          <div className="product-card">
                            <div className="new">
                              <h5>New</h5>
                            </div>
                            <div className="product-image">
                              <img src={data.imageUrls[0]} alt={data.name} />
                            </div>
                            <div className="product-details">
                              <div className="product-title">
                                {/* <h6>sold by <span id='thara'>Thara Trading Pvt Ltd</span></h6> */}
                                <p>
                                  {data.name.length > 20 ? `${data.name.slice(0, 105)}...` : data.name}
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

export default TopbrandProducts;
