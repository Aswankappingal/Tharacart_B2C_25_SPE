import './FeaturedBrands.scss';
import SearchresultSidebar from '../LeftMenuBar/SearchresultSidebar';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import Slider from "react-slick";
import Navbar from '../Navbar/Navbar';
import { useEffect, useState } from 'react';
import Footer from '../Footer/Footer';
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { HiOutlineStar } from "react-icons/hi2";
import useFeacturedBrand from '../../redux/hooks/HomePageHooks/useFeacturedBrand';
import useFeaturedBrandProduct from '../../redux/hooks/FeaturedBrandProductsHook/useFeaturedBrandProduct';
import { Link } from 'react-router-dom';
import BottomBar from '../BottomBar/BottomBar';

const FeaturedBrands = () => {
    const [sort, setSort] = useState('Low to High');
    const [sortOption, setSortOption] = useState('Low to High');
    // const [sortedProducts, setSortedProducts] = useState([...featuredBrandProduct]); // State for sorted products
    const [brandFilter, setBrandFilter] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');

    const Feautredsettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        swipeToSlide: true,
        responsive: [
            { breakpoint: 1500, settings: { slidesToShow: 1.9, slidesToScroll: 1 } },
            { breakpoint: 1200, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } }
        ]
    };

    const settings2 = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        arrows: false,
        slidesToScroll: 3,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1.5 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
        ]
    };

    const { featuredBrands, status: featuredBrandsStatus, error: featuredBrandsError } = useFeacturedBrand();
    const { featuredBrandProduct, status: featuredBrandProductsStatus, error: featuredBrandProductsError } = useFeaturedBrandProduct();

    // useEffect(() => {
    //     console.log('feature', featuredBrands);

    // })



    if (featuredBrandsStatus === 'loading' || featuredBrandProductsStatus === 'loading') {
        return <div>Loading...</div>;
    }

    if (featuredBrandsStatus === 'failed') {
        return <div>Error: {featuredBrandsError}</div>;
    }

    if (featuredBrandProductsStatus === 'failed') {
        return <div>Error: {featuredBrandProductsError}</div>;
    }




    // Group products by brandId
    const groupProductsByBrand = (products) => {
        if (!Array.isArray(products)) {
            console.log("jjdkjkdk", products);
            // return{};
        }



        return products.reduce((acc, product) => {
            (acc[product.brandId] = acc[product.brandId] || []).push(product);
            return acc;
        }, {});
    };







    const groupedProducts = groupProductsByBrand(featuredBrandProduct);


    const calculateAverageRating = (ratings = {}) => {
        const { oneRating = 0, twoRating = 0, threeRating = 0, fourRating = 0, fiveRating = 0 } = ratings;

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

        return averageRating.toFixed(1); // Rounded to 1 decimal place
    };


    const filterProducts = (products, minRating, minPrice, maxPrice) => {
        return products.filter(product => {
            const averageRating = calculateAverageRating(product.ratings || {});
            return (
                averageRating >= minRating &&
                product.sellingPrice >= minPrice &&
                product.sellingPrice <= maxPrice
            );
        });
    };

    // useEffect(() => {
    //     console.log("feautred-brands", featuredBrands)
    // }, [])



    const minRating = 4; // Minimum rating to filter by
    const minPrice = 100; // Minimum price to filter by
    const maxPrice = 5000; // Maximum price to filter by

    return (
        <div className='FeaturedBrandsMailWrapper'>
            <div className="FeaturedBrands">
                <Navbar />
                {/* <div className="TopDeals-left"><SearchresultSidebar /></div> */}
                <div className="TopDeals-right">
                    <h2 className='top-deals-heading'>
                        <img src="/Images/chevron-down.png" alt="Chevron Down" />
                        Featured Brands</h2>
                    <div className="carousel-section">
                        <Slider {...Feautredsettings}>
                            {featuredBrands.map((data, index) => {
                                const brandDetails = data.selectedBrandDetails?.[0]; // Access the first item if it exists
                                return (
                                    <div key={index}>
                                        <div className="top-deals-image">
                                            <img src={data.image} alt={brandDetails?.brandName || 'Brand Image'} />
                                            <div className="indomeBox">
                                                <div className="ad">AD</div>
                                                {brandDetails && (
                                                    <div className="indomie-image">
                                                        <img src={brandDetails.brandLogo} alt={brandDetails.brandName} />
                                                    </div>
                                                )}
                                                <Link to={`/brand-page/${brandDetails?.brandId || ''}`}>
                                                    <div className="indomie-text">
                                                        {brandDetails?.brandName || 'Brand Name'}
                                                        <FaAngleRight />
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </Slider>

                    </div>

                    <div className="selectBox-section">
                        <div className="sort-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <span>Sort by : {sortOption}</span>
                            <FaAngleDown className='downAngle' />
                        </div>
                        <ul className="dropdown-menu sort-dropdown-result">
                            {/* <li><a className="dropdown-item" onClick={() => setSortOption('Low to High')}>Sort by</a></li> */}
                            <li><a className="dropdown-item" onClick={() => setSortOption('Low to High')}>Low to High</a></li>
                            <li><a className="dropdown-item" onClick={() => setSortOption('High to Low')}>High to Low</a></li>
                        </ul>
                        {/* <div className="sort-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <span>Brand</span>
                            <FaAngleDown className='downAngle' />
                        </div>
                        <ul className="dropdown-menu sort-dropdown-result">
                            {featuredBrands.map(brand => {
                                const brandDetails = brand.selectedBrandDetails?.[0]; // Safely access the first item if it exists
                                return brandDetails ? ( // Only render if brandDetails exists
                                    <li key={brandDetails.brandId}>
                                        <a
                                            className="dropdown-item"
                                            onClick={() => setBrandFilter(brandDetails.brandId)}
                                        >
                                            {brandDetails.brandName}
                                        </a>
                                    </li>
                                ) : null; // Render nothing if brandDetails is undefined
                            })}
                        </ul> */}

                        <div className="sort-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <span>Availability</span>
                            {/* <div className="count">4</div> */}
                            <FaAngleDown className='downAngle' />
                        </div>
                        <ul className="dropdown-menu sort-dropdown-result">
                            <li><a className="dropdown-item" onClick={() => setAvailabilityFilter('In Stock')}>In Stock</a></li>
                            <li><a className="dropdown-item" onClick={() => setAvailabilityFilter('Out of Stock')}>Out of Stock</a></li>
                        </ul>
                        <div className="sort-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <span>Rating</span>
                            {/* <div className="count">2</div> */}
                            <FaAngleDown className='downAngle' />
                        </div>
                        <ul className="dropdown-menu sort-dropdown-result">

                            <li><a className="dropdown-item" onClick={() => setRatingFilter(3)}>1 and above</a></li>
                            <li><a className="dropdown-item" onClick={() => setRatingFilter(3)}>2 and above</a></li>
                            <li><a className="dropdown-item" onClick={() => setRatingFilter(3)}>3 and above</a></li>
                            <li><a className="dropdown-item" onClick={() => setRatingFilter(4)}>4 and above</a></li>
                        </ul>
                    </div>


                    {featuredBrands.map((brand, index) => {
                        const brandDetails = brand.selectedBrandDetails?.[0]; // Safely get the first item of selectedBrandDetails
                        const productsForBrand = brandDetails ? groupedProducts[brandDetails.brandId] || [] : []; // Fetch products if brandDetails exists

                        return brandDetails && productsForBrand.length > 0 ? ( // Render only if brandDetails and products exist
                            <div className="products-list-wrapper" key={index}>
                                <div className="product-heading-wrapper">
                                    <div className="product-heading-left">
                                        <div className="brandLogo">
                                            <div className="brandImage">
                                                <img src={brandDetails.brandLogo} alt={brandDetails.brandName} />
                                            </div>
                                            <span>{brandDetails.brandName}</span>
                                        </div>
                                    </div>
                                    {/* Hide 'Visit Brand Page' if there are no products */}
                                    {productsForBrand.length > 0 && (
                                        <div className="product-heading-right">
                                            <Link to={`/brand-page/${brandDetails.brandId}`}>
                                                Visit Brand Page <FaAngleRight />
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <div className="product-card-wrapper">
                                    <div className="Products-main-body">
                                        <Slider {...settings2}>
                                            {productsForBrand.map((product, index) => {
                                                const averageRating = calculateAverageRating(product);

                                                return (
                                                    <div key={index}>
                                                        <Link to={`/product-page/${product.productId}`}>
                                                            <div className="product-card">
                                                                <div className="best-seller">
                                                                    <h5>Best Seller</h5>
                                                                </div>
                                                                <div className="favourate-icon">
                                                                    <MdOutlineFavoriteBorder />
                                                                </div>
                                                                <div className="product-image">
                                                                    <img src={product.imageUrls} alt={product.name} />
                                                                </div>
                                                                <div className="product-details">
                                                                    <div className="product-title">
                                                                        <p>{product.name}</p>
                                                                    </div>
                                                                    <div className="product-price">
                                                                        <div className="exact-price">
                                                                            <h1>₹{product?.offerPrice.toFixed(2)}</h1>
                                                                        </div>
                                                                        <div className="before-price">
                                                                            <h3><strike>{product.price.toFixed(2)}</strike></h3>
                                                                        </div>
                                                                        <div className="offer">
                                                                            <h3>{Math.round(((product.price - product.sellingPrice) / product.price) * 100)}% OFF</h3>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="product-rating">
                                                                    <HiOutlineStar className='HiOutlineStar-icon' />
                                                                    <span>{averageRating}</span>
                                                                </div>
                                                                <div className="sponsored">
                                                                    <h4>Sponsored</h4>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                );
                                            })}
                                        </Slider>
                                    </div>
                                </div>
                            </div>
                        ) : null; // Render nothing if brandDetails is undefined or has no products
                    })}



                </div>
            </div>
            <BottomBar />
            <Footer />
        </div>
    );
};

export default FeaturedBrands;
