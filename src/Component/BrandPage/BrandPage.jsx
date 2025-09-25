import React from 'react';
import './BrandPage.scss';
import { FaRegCircleCheck, FaRegStar } from "react-icons/fa6";
import { IoArrowRedoOutline } from "react-icons/io5";
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import ReactPlayer from 'react-player';
import { Link, useParams } from 'react-router-dom';
import useBrandPage from '../../redux/hooks/BrandPageHook/useBrandPage';
import BottomBar from '../BottomBar/BottomBar';

const BrandPage = () => {
  const { brandId } = useParams();
  const { brandPageData, loading, error } = useBrandPage(brandId);

  const calculateAverageRating = (ratings) => {
    if (!ratings) return 0;
    const { oneRating, twoRating, threeRating, fourRating, fiveRating } = ratings;
    const totalRatings = oneRating + twoRating + threeRating + fourRating + fiveRating;
    if (totalRatings === 0) return 0;
    const averageRating = (
      (oneRating * 1) + (twoRating * 2) + (threeRating * 3) + (fourRating * 4) + (fiveRating * 5)
    ) / totalRatings;
    return averageRating.toFixed(1);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!brandPageData) return <div>No data found</div>;

  // Find sections by type
  const findSection = (sectionType) =>
    brandPageData.sections.find(section => section.section === sectionType)?.data || [];

  const productSection = findSection('productSection');
  const gallerySection = findSection('gallerySection');
  const bannerSection = findSection('bannerSection');
  const videoSection = findSection('videoSection');
  const brandDetails = brandPageData.brandDetails;

  return (
    <div className='brandpage-wrapper'>
      <Navbar />

      <div className="brandpage-body">
        {/* Banner Section */}
        {bannerSection.length > 0 && (
          <div className="hero-section">
            <div className="container-fluid">
              <div className="row banner-row">
                <div className="col-lg-9 col-md-12">
                  <div className="banner-left-card">
                    <img src={bannerSection[0]?.imageUrl || bannerSection[1]?.imageUrl} alt="Brand Banner" />
                  </div>
                </div>
                <div className="col-lg-3 col-md-12">
                  <div className="banner-right-card">
                    <div className="card-right">
                      <div className="card-image">
                        <img src={brandDetails?.brandLogo || bannerSection[0]?.brandLogo} alt="Brand Logo" />
                      </div>
                      <div className="card-title-container">
                        <h1>{brandDetails?.brandName || bannerSection[0]?.brandName}</h1>
                        {brandDetails?.isVerified && <FaRegCircleCheck className='FaRegCircleCheck' />}
                        {brandDetails?.isBestSeller && (
                          <div className="bestseller-container">
                            <span>Best Seller</span>
                          </div>
                        )}
                      </div>
                      <div className="description">
                        <span>Joined on {brandDetails?.joinedDate}</span>
                      </div>
                      <div className="button-container">
                        <button className='report'>Report</button>
                        <div className="whishlist-container">
                          <IoArrowRedoOutline className='IoArrowRedoOutline' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Section */}
        {productSection.length > 0 && (
          <div className="products-card-wrapper">
            <h1>Featured Products</h1>
            <div className="container-fluid">
              <div className="row">

                {productSection.map((product, index) => {
                  const productDetails = product.productDetails || {};
                  const averageRating = calculateAverageRating(productDetails.ratings);
                  const sellingPrice = parseFloat(productDetails.sellingPrice || product.rate);
                  const originalPrice = parseFloat(productDetails.price || product.originalPrice);
                  const discountPercentage = originalPrice > 0
                    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
                    : 0;

                  return (

                    <div className="col-lg-4" key={index}>
                      <Link style={{ textDecoration: "none", color: "black" }} to={`/product-page/${product.productId}`}>
                        <div className="featured-pro-card">
                          {productDetails.isBestSeller && (
                            <div className="best-seller-in-card">
                              <span>Best Seller</span>
                            </div>
                          )}
                          <div className="featured-card-image">
                            <img src={product.url || productDetails.imageUrl} alt={product.name} />
                          </div>
                          <div className="feature-card-pro-description">
                            <p>{product.name || productDetails.name}</p>
                          </div>
                          <div className="price-deatils">
                            <h2>₹{sellingPrice.toFixed(2)}</h2>
                            <h3><strike>₹{originalPrice.toFixed(2)}</strike></h3>
                            <span>{discountPercentage}% OFF</span>
                          </div>
                          <div className="add-tocart-btn-container">
                            <div className="rating">
                              <FaRegStar className='FaRegStar' /><span>{averageRating}</span>
                            </div>
                            <div className="add-tocart-btn">
                              <button className='add-cart'>Add to Cart</button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>

                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Gallery Section */}
        {gallerySection.length > 0 && (
          <div className="product-ad-wrapper">
            <div className="container-fluid">
              <div className="row product-ad-row">
                <div className="col-lg-4">
                  <div className="product-ad-left">
                    <div className="ad-description-box">
                      <div className="ad-title">
                        <h1>{gallerySection[0]?.Title}</h1>
                      </div>
                      <p>{gallerySection[0]?.Description}</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="product-ad-right">
                    <div className="row">
                      {gallerySection.map((item, index) => (
                        <div className="col-lg-6" key={index}>
                          <div className="product-ad-card-right">
                            <img src={item.imageUrl} alt={`Gallery Image ${index + 1}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Section */}
        {videoSection.length > 0 && (
          <div className="video-main-container">
            <h1>Featured Video</h1>
            {videoSection.map((video, index) => (
              <div className="video-container" key={index}>
                <ReactPlayer
                  url={video.link}
                  controls
                  width="100%"
                  height="100%"
                  style={{ aspectRatio: '16 / 9' }}
                  config={{
                    file: {
                      attributes: {
                        controlsList: 'nodownload'
                      }
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomBar />
      <Footer />

    </div>
  );
};

export default BrandPage;