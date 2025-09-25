import './SellerStore.scss'
import { FaStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";
import { IoIosHeartEmpty } from "react-icons/io";
import { FaRegStar } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
// import trendPtod1 from '/Images/trend prod1.svg'
// import trendPtod2 from '/Images/trend prod2.svg'
// import trendPtod3 from '/Images/trend prod3.svg'
// import trendPtod4 from '/Images/trend prod4.svg'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import useSellerStore from '../../redux/hooks/SellerStoreHook/useSellerStore';
import useSellersBrand from '../../redux/hooks/SellerStoreHook/useSellersBrand';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerStorePagenation, setPage, setLimit } from '../../redux/slices/SellerStoreSlice/SellerStorePagenation';
import useSellers from '../../redux/hooks/SellerStoreHook/useSellers';
import ReactStars from "react-rating-stars-component";
import axios from 'axios';
import UseLoginedUser from '../../redux/hooks/NavbarHook/UseLoginedUser';
import useFetchSeller from '../../redux/hooks/SellerStoreHook/useFetchSeller';
import baseUrl from '../../baseUrl';

// import useSelllerRating from '../../redux/hooks/SellerStoreHook/useSelllerRating';
// import { fetchSellerStorePagenation,  } from './path-to-SellerStorePagenationSlice'; 

const SellerStore = () => {
  const sliderRef = useRef(null);
  const [brandWeDealIsVisible, setBrandWeDealIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const { sellerId } = useParams(); // Extract sellerId from URL
  const reviewsPerPage = 6;
  const { loginedUser, status: loginedStatus, isAuthTokenPresent } = UseLoginedUser();
  const customerId = loginedUser ? loginedUser.customDocId : null;
  const [errorMessage, setErrorMessage] = useState(''); // State for error message







  const SeeMore = () => {
    setBrandWeDealIsVisible(!brandWeDealIsVisible);
  };
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true, // Allow free scrolling     
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  const trendingSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };

  const products = [
    { id: 1, name: "Pisang 8MM Bold Green Cardamom (Elaichi)Prem....", regularPrice: "₹150.50", price: "₹299.40" },
    { id: 2, name: "ndomie Special Chicken (Pack of 20 pics) Instant N...", regularPrice: "₹150.50", price: "₹299.40" },
    { id: 3, name: "Zpc Milanówek Cream Fudge Luxury, 800 g (Produ..", regularPrice: "₹150.50", price: "₹299.40" },
    { id: 4, name: "Pisang honey Squeezy| Buy one get one free| 100% pure...", regularPrice: "₹150.50", price: "₹299.40" },
    { id: 5, name: "Pisang 8MM Bold Green Cardamom (Elaichi)Prem....", regularPrice: "₹150.50", price: "₹299.40" },
    { id: 6, name: "Zpc Milanówek Cream Fudge Luxury, 800 g (Produ...", regularPrice: "₹150.50", price: "₹299.40" },
    { id: 7, name: "Indomie Special Chicken (Pack of 20 pics) Instant No...", regularPrice: "₹150.50", price: "₹299.40" },
    { id: 8, name: "Pisang 8MM Bold Green Cardamom (Elaichi)Prem....", regularPrice: "₹150.50", price: "₹299.40" },
    { id: 9, name: "ndomie Special Chicken (Pack of 20 pics) Instant N...", regularPrice: "₹150.50", price: "₹299.40" },
    { id: 10, name: "Pisang 8MM Bold Green Cardamom (Elaichi)Prem....", regularPrice: "₹150.50", price: "₹299.40" },
    { id: 11, name: "Indomie Special Chicken (Pack of 20 pics) Instant No...", regularPrice: "₹150.50", price: "₹299.40" },
    { id: 12, name: "ndomie Special Chicken (Pack of 20 pics) Instant N...", regularPrice: "₹150.50", price: "₹299.40" },
    { id: 13, name: "ndomie Special Chicken (Pack of 20 pics) Instant N...", regularPrice: "₹150.50", price: "₹299.40" },
    { id: 14, name: "ndomie Special Chicken (Pack of 20 pics) Instant N...", regularPrice: "₹150.50", price: "₹299.40" },
    { id: 15, name: "ndomie Special Chicken (Pack of 20 pics) Instant N...", regularPrice: "₹150.50", price: "₹299.40" },
  ];
  const CarouseNext = () => {
    sliderRef.current.slickNext();
  };


  const { SellerStoreProducts: sellerstoreproducts, status: sellerstoreproductsStatus, error: sellerstoreproductsError } = useSellerStore()
  const { SellerStoreBrands: sellerstorebrands, status: sellerstorebrandsStatus, error: sellerstorebrandsError } = useSellersBrand();
  const { oneSeller, status: fetchSellerStatus, error: fetchSellerError } = useFetchSeller()
  const dispatch = useDispatch();

  // useEffect(() => {
  //   console.log('seller : ', oneSeller.createdDate);
  // }, [oneSeller])


  const { data, status, page, totalPages, limit, error } = useSelector((state) => state.SellerStorePagenation);

  useEffect(() => {
    dispatch(fetchSellerStorePagenation({ page, limit }));
  }, [dispatch, page, limit]);

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    dispatch(setPage(newPage));  // Update the current page
    dispatch(fetchSellerStorePagenation({ page: newPage }));  // Fetch new data based on the updated page
  };

  if (status === 'loading' || fetchSellerStatus === "loading") {
    return <div>Loading reviews...</div>;
  }

  if (status === 'failed') {
    return <div>Error loading reviews: {error}</div>;
  }
  if (sellerstoreproductsStatus === 'failed') {
    return <div>Error: {sellerstoreproductsError}</div>;
  }
  if (sellerstorebrandsStatus === 'failed') {
    return <div>Error: {sellerstorebrandsError}</div>;
  }
  if (fetchSellerStatus === 'failed') {
    return <div>Error: {fetchSellerError}</div>;
  }
  const calculateAverageRating = (ratings) => {
    const { oneRating, twoRating, threeRating, fourRating, fiveRating } = ratings;
    const totalRatings = oneRating + twoRating + threeRating + fourRating + fiveRating;
    if (totalRatings === 0) return 0;
    const averageRating = (
      (oneRating * 1) + (twoRating * 2) + (threeRating * 3) + (fourRating * 4) + (fiveRating * 5)
    ) / totalRatings;
    return averageRating.toFixed(1);
  };


  const initialBrandCount = 7;
  const brandsToShow = brandWeDealIsVisible ? sellerstorebrands : sellerstorebrands.slice(0, initialBrandCount);


  const ratingChanged = (newRating) => {
    setRating(newRating);  // Update the state with the selected rating value
    // console.log(newRating); // You can also log the value or use it elsewhere
  };


  // const { SellerRating:sellerRatings, status:sellerRatingStatus, error:sellerRatingError } = useAddSellerRating();


  const handleSubmit = async () => {
    if (!customerId) {
      setErrorMessage('Customer ID is not available'); // Set error message
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/add-seller-rating`, {
        comment,
        customerId,
        rating,
        sellerId, // Use sellerId from URL
        review: additionalInfo
      });
      console.log('Rating added successfully:', response.data);
      setErrorMessage(''); // Clear error message if the request is successful
      // Close the modal or reset form if needed
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error); // Display error from the server
      } else {
        setErrorMessage('An error occurred while adding the rating.'); // Generic error
      }
      console.error('Error adding rating:', error);
    }
  };
  // Convert Firebase timestamp to JavaScript Date object
  const firebaseTimestampToDate = (timestamp) => {
    if (timestamp && timestamp._seconds) {
      return new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds
    }
    return null; // Return null if timestamp is not valid
  };

  // Helper function to format the timestamp
  const formatDate = (timestamp) => {
    const date = firebaseTimestampToDate(timestamp); // Convert Firebase timestamp
    if (date) {
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      return `${month} ${year}`;
    }
    return 'Invalid Date'; // Fallback in case of invalid date
  };

  // Helper function to calculate years since the seller joined
  const getYearsSince = (timestamp) => {
    const date = firebaseTimestampToDate(timestamp); // Convert Firebase timestamp
    if (date) {
      const joinDate = date;
      const currentDate = new Date();
      const years = currentDate.getFullYear() - joinDate.getFullYear();
      return years === 1 ? `${years} Year` : `${years} Years`;
    }
    return 'N/A'; // Fallback in case of invalid date
  };
  // Helper function to calculate duration in months or years
  const getDuration = (timestamp) => {
    const date = firebaseTimestampToDate(timestamp); // Convert Firebase timestamp
    if (date) {
      const joinDate = date;
      const currentDate = new Date();
      const yearsDifference = currentDate.getFullYear() - joinDate.getFullYear();
      const monthsDifference = currentDate.getMonth() - joinDate.getMonth() + (yearsDifference * 12);

      if (monthsDifference < 12) {
        return `${monthsDifference} Month${monthsDifference === 1 ? '' : 's'}`;
      } else {
        return `${yearsDifference} Year${yearsDifference === 1 ? '' : 's'}`;
      }
    }
    return 'N/A'; // Fallback in case of invalid date
  };

  const createdDate = oneSeller?.createdDate;

  return (
    <div className='brandStoreWrapper'>
      <Navbar />
      <div className="brand-store">
        <div className="brand-store-hero" style={{ backgroundImage: `url("/Images/brand page banner.png")` }}></div>
        <div className="about-thara-section">
          <div className="about-thara-left">
            <div className="about-thara-left-first-section">
              <h3>{oneSeller?.storedetails.storename}</h3>
              {createdDate && (
                <p>
                  Joined on {formatDate(createdDate)} (<strong>{getDuration(createdDate)}</strong>)
                </p>
              )}
              <div className="thara-best-seller">Thara Cart Best Seller</div>
            </div>
            <div className="about-thara-left-second-section">

              <p className='see-all-review'>See All Reviews</p>
            </div>
          </div>
          <div className="about-thara-right">
            <button data-bs-toggle="modal" data-bs-target="#LeaveSellerModal">Leave a Seller Feedback</button>
            <button data-bs-toggle="modal" data-bs-target="#ReportProductModal">Report</button>
          </div>
        </div>
        {/* <!-- LeaveSellerModal --> */}
        <div className="modal fade leave-seller-modal" id="LeaveSellerModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Leave a Seller Feedback</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <FaStar className='star' />
                <FaStar className='star' />
                <FaStar className='star' />
                <FaStar className='star white' />
                <FaStar className='star white' />
                <p>Is this seller average?</p>
                <label htmlFor="">Any Comments</label>
                <div>
                  <textarea name="" id=""></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button>Submit Feedback</button>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- ReportProductModal --> */}
        <div className="modal fade reportProductModal" id="ReportProductModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Report Product</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <h4 className="what-is-issue-heading">What is the issue?</h4>
                <div className="issue-list">
                  <div className="radio-group">
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}> <input type="radio" id="option1" name="radio" className="radio-input" />
                      <label htmlFor="option1" className="radio-label">Incorrect Informations</label> </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}> <input type="radio" id="option1" name="radio" className="radio-input" />
                      <label htmlFor="option1" className="radio-label">Counterfeit Products</label> </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}> <input type="radio" id="option1" name="radio" className="radio-input" />
                      <label htmlFor="option1" className="radio-label">Copyright & Trademarks violation</label> </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}> <input type="radio" id="option1" name="radio" className="radio-input" />
                      <label htmlFor="option1" className="radio-label">Others</label> </div>
                  </div>
                </div>
                <div className="comment-section">
                  <p>Any Comments</p>
                  <textarea name="" id=""></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button>Submit Report</button>
              </div>
            </div>
          </div>
        </div>
        {/* =================================top-selling-product-section============================ */}
        <div className="top-selling-product-section">
          <h2 className="top-selling-heading">Top Selling Products</h2>
          <div className="top-selling-product-wrapper">
            <Slider {...settings}>
              {
                sellerstoreproducts.map((data, index) => {
                  const averageRating = calculateAverageRating(data);

                  // Determine if the "Sponsored" text should be displayed
                  const isSponsored = data.limitedTimeOffer || data.topDeals || data.newArrivals;

                  return (
                    <div className="product-card-main" key={index}>
                      <Link to={`/product-page/${data.productId}`}>
                        <div className="trending-product-card">
                          <IoIosHeartEmpty className='heart-icon' />
                          <div className="top-sell-label">Best Seller</div>
                          <div className="prod-image">
                            <img src={data.imageUrls[0]} alt={data.name} />
                          </div>
                          <p className="prod-disc">{data.name}</p>
                          <div className="price-details">
                            <p className='offer-price'>₹{data.sellingPrice.toFixed(2)}</p>
                            <p className="og-price"><strike>₹{data.price.toFixed(2)}</strike></p>
                            <p className="offer-ratio">
                              {Math.round(((data.price - data.sellingPrice) / data.price) * 100)}% OFF
                            </p>
                          </div>
                          <div className="rating-square">
                            <FaRegStar className='star' />
                            <span>{averageRating}</span>
                          </div>
                          {isSponsored && <p className="Sponsored">Sponsored</p>}
                        </div>
                      </Link>
                    </div>
                  );
                })
              }

            </Slider>

          </div>
        </div>
        {/* =================================brands-we-deal=============================== */}
        <div className="brands-we-deal">
          <div className="brand-deal-head-section">
            <h2 className="brand-deal-heading">Brands We Deal</h2>
            <div className="seemore-container" onClick={SeeMore}>
              <span>{brandWeDealIsVisible ? 'Show Less' : 'See More'}</span>
              <FaAngleDown className={`down-arrow ${brandWeDealIsVisible ? 'opened' : ''}`} />
            </div>
          </div>
          <div className="brands-wrapper">
            {brandsToShow.map((brand, index) => (
              <div className="brand-card" key={index}>
                <div className="brand-image"><img src={brand.brandLogo} alt={brand.brandName} /></div>
                <p>{brand.brandName}</p>
              </div>
            ))}
          </div>
        </div>
        {/* ================================trending-products========================== */}
        <div className="trending-products">
          <h3>Trending Products</h3>
          <div className="trending-product-card-wrapper">
            <div className="carousel-next-btn-wrapp">
              <img src="/Images/carousel-next.svg" alt="" className='carousel-next-button' onClick={CarouseNext} />
            </div>
            <Slider ref={sliderRef}  {...trendingSettings}>
              {products.map(product => (
                <div key={product.id}>
                  <Link className='link'>
                    <div className="trending-card">
                      <img src={product.image} alt={product.name} />
                      <p>{product.name}</p>
                      <span className='price'>{product.regularPrice}</span>
                      <span className='crossed-price'><strike>{product.price}</strike></span>
                    </div></Link>
                </div>
              ))}
            </Slider>
          </div>
        </div>
        {/* ================================trending-products========================== */}
        {/* ====================================rating-and-review-wrapper============================ */}
        <div className="rating-and-review-section-main-section">
          <div className="rating-and-review-section-main row">
            <div className="col-lg-4 col-md-4 col-sm-12 rating-review-left">
              <p>Ratings & Reviews</p>
              <div className="rating-count-main row">
                <div className="col-lg-6 col-md-6 col-sm-6 rating-count-left">
                  <div>   <span>{rating}</span> {/* Display the selected rating */}</div>
                  <ReactStars
                    count={5}
                    onChange={ratingChanged}
                    size={24}
                    isHalf={true}
                    emptyIcon={<i className="far fa-star"></i>}
                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                    fullIcon={<i className="fa fa-star"></i>}
                    activeColor="#5D1CAA"   // Custom active (filled) star color
                    emptyColor="#5D1CAA"
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 rating-count-right">
                  <div className='ratingprogress'>
                    <span>5</span>
                    <FaStar className='star' />
                    <div className="progress-baar"><div className="inner-progress" style={{ width: "40%" }}></div></div>
                  </div>
                  <div className='ratingprogress'>
                    <span>4</span>
                    <FaStar className='star' />
                    <div className="progress-baar"><div className="inner-progress" style={{ width: "35%" }}></div></div>
                  </div>
                  <div className='ratingprogress'>
                    <span>3</span>
                    <FaStar className='star' />
                    <div className="progress-baar"><div className="inner-progress" style={{ width: "30%" }}></div></div>
                  </div>
                  <div className='ratingprogress'>
                    <span>2</span>
                    <FaStar className='star' />
                    <div className="progress-baar"><div className="inner-progress" style={{ width: "25%" }}></div></div>
                  </div>
                  <div className='ratingprogress'>
                    <span>1</span>
                    <FaStar className='star' />
                    <div className="progress-baar"><div className="inner-progress" style={{ width: "20%" }}></div></div>
                  </div>
                </div>

              </div>


              <button className='rate-seller-btn' type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Rate Seller</button>

            </div>
            {/* <!-- Modal --> */}
            <div className="modal fade modal-classs" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="staticBackdropLabel">Rate Seller</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="rating-stars">
                      <h5>Rating</h5>
                      <ReactStars
                        count={5}
                        size={24}
                        value={rating}
                        onChange={setRating}
                        isHalf={true}
                        emptyIcon={<i className="far fa-star"></i>}
                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                        fullIcon={<i className="fa fa-star"></i>}
                        activeColor="#5D1CAA"
                        emptyColor="#5D1CAA"
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label htmlFor="comment">Comment</label>
                      <input
                        type="text"
                        id="comment"
                        className="form-control"
                        placeholder="Add your comment here"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label htmlFor="additionalInfo">Additional Information</label>
                      <input
                        type="text"
                        id="additionalInfo"
                        className="form-control"
                        placeholder="Additional information"
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                    {errorMessage && (
                      <div style={{ color: 'red', marginTop: '10px' }}>
                        {errorMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>





            <div className="col-lg-8 col-md-8 col-sm-12 rating-review-right">
              {data.map((review, index) => (
                <div className="review-comments-container" key={index}>
                  {[...Array(5)].map((star, i) => (
                    <FaStar
                      key={i}
                      className={`star ${i < review.rating ? '' : 'white'}`}
                    />
                  ))}
                  <h5>{review.comment}</h5>
                  <span className="user">
                    {review.name}
                  </span>
                  <p>{review.review}</p>
                </div>
              ))}

              <ReactPaginate
                previousLabel={'< previous'}
                nextLabel={'next >'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
                forcePage={page - 1} // ReactPaginate uses 0-indexed pages
              />
            </div>
          </div>
        </div>

        {/* ====================================rating-and-review-wrapper============================ */}

      </div>
      <Footer />
    </div>
  )
}

export default SellerStore
