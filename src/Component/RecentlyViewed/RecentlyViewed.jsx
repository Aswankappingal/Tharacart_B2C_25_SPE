import './RecentlyViewed.scss';
import SearchresultSidebar from '../LeftMenuBar/SearchresultSidebar';
import { IoIosArrowDropleftCircle } from "react-icons/io";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { HiOutlineStar } from "react-icons/hi2";
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useGetBrand from '../../redux/hooks/topDealsHooks/useGetBrand';
import ScrollToTopOnMount from '../ScrollToTopOnMount';
import BottomBar from '../BottomBar/BottomBar';

const RecentlyViewed = () => {
    const [priceSort, setPriceSort] = useState('Low to High');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [availabilityFilter, setAvailabilityFilter] = useState({ inStock: false, outOfStock: false });
    const [ratingFilter, setRatingFilter] = useState([]);


    const getVisitedProducts = () => {
        const visitedProductsJson = localStorage.getItem('visitedProducts');
        let visitedProducts = [];
        if (visitedProductsJson) {
            visitedProducts = JSON.parse(visitedProductsJson);
        }
        return visitedProducts;
    };

    let visitedProducts = getVisitedProducts();

    // Handle brand selection
    const handleBrandChange = (brandId) => {
        if (selectedBrands.includes(brandId)) {
            setSelectedBrands(selectedBrands.filter((id) => id !== brandId));
        } else {
            setSelectedBrands([...selectedBrands, brandId]);
        }
    };

    // Handle availability filter change
    const handleAvailabilityChange = (e) => {
        const { name, checked } = e.target;
        setAvailabilityFilter({
            ...availabilityFilter,
            [name]: checked,
        });
    };

    const handleRatingChange = (e) => {
        const rating = parseInt(e.target.value, 10);
        setRatingFilter(prevRatings =>
            prevRatings.includes(rating)
                ? prevRatings.filter(r => r !== rating)
                : [...prevRatings, rating]
        );
    };


    // Filter visited products by selected brands
    let filteredProducts = visitedProducts;
    if (selectedBrands.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
            selectedBrands.includes(product.details.brandId)
        );
    }

    // Filter products based on availability (In Stock and Out Of Stock)
    if (availabilityFilter.inStock && availabilityFilter.outOfStock) {
        // If both are selected, show all products
        filteredProducts = visitedProducts;
    } else if (availabilityFilter.inStock) {
        // Show only in-stock products
        filteredProducts = filteredProducts.filter(product => product.details.stock > 5);
    } else if (availabilityFilter.outOfStock) {
        // Show only out-of-stock products
        filteredProducts = filteredProducts.filter(product => product.details.stock <= 0);
    }

    if (ratingFilter.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            const totalRatings = product.details.oneRating +
                product.details.twoRating +
                product.details.threeRating +
                product.details.fourRating +
                product.details.fiveRating;
            const averageRating = totalRatings > 0 ? (
                (1 * product.details.oneRating +
                    2 * product.details.twoRating +
                    3 * product.details.threeRating +
                    4 * product.details.fourRating +
                    5 * product.details.fiveRating) / totalRatings
            ) : 0;

            return ratingFilter.some(filterRating => averageRating >= filterRating);
        });
    }

    // Sorting Logic based on priceSort state
    if (priceSort === 'Low to High') {
        filteredProducts = filteredProducts.sort((a, b) => a.details.sellingPrice - b.details.sellingPrice);
    } else if (priceSort === 'High to Low') {
        filteredProducts = filteredProducts.sort((a, b) => b.details.sellingPrice - a.details.sellingPrice);
    }

    const handleSortChange = (e) => {
        setPriceSort(e.target.value);
    };

    const { brands, status, error } = useGetBrand();

    return (
        <div className='viewed-main-wrapper'>
            <ScrollToTopOnMount />
            <Navbar />
            <div className="viewed-sub-wrapper">
                {/* <div className="viewed-left">
                    <SearchresultSidebar />
                </div> */}
                <div className="viewed-right">
                    <div className="recently-viewed-heading-container">
                        <Link to='/'>
                            <div className="left-arrow">
                                <IoIosArrowDropleftCircle className='BsArrowLeftCircleFill' />
                            </div>
                        </Link>
                        <h1>Recently Viewed</h1>
                    </div>

                    <div className="filter-dropdowns">
                        <div className="selecter-filter">

                            <div className="two-side-filters">


                                <div className="filter-1">
                                    <div className="dropdown">
                                        <div className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                            Sort: {priceSort}
                                        </div>
                                        <ul className="dropdown-menu">
                                            <li className="dropdown-item">
                                                <input
                                                    type="radio"
                                                    name="sort"
                                                    id="low-to-high"
                                                    value="Low to High"
                                                    checked={priceSort === 'Low to High'}
                                                    onChange={handleSortChange}
                                                />
                                                <label htmlFor="low-to-high">Price: Low to High</label>
                                            </li>
                                            <li className="dropdown-item">
                                                <input
                                                    type="radio"
                                                    name="sort"
                                                    id="high-to-low"
                                                    value="High to Low"
                                                    checked={priceSort === 'High to Low'}
                                                    onChange={handleSortChange}
                                                />
                                                <label htmlFor="high-to-low">Price: High to Low</label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>


                                <div className="filter-1">
                                    <div className="dropdown">
                                        <div className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                            Brand
                                        </div>
                                        <ul className="dropdown-menu">
                                            {brands.map((brand, index) => (
                                                <li className="dropdown-item" key={index}>
                                                    <input
                                                        type="checkbox"
                                                        id={`brand-${brand.brandId}`}
                                                        value={brand.brandId}
                                                        checked={selectedBrands.includes(brand.brandId)}
                                                        onChange={() => handleBrandChange(brand.brandId)}
                                                    />
                                                    <label htmlFor={`brand-${brand.brandId}`}>{brand.brandName}</label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>


                            </div>

                            <div className="two-side-filters">

                                <div className="filter-1 stock-filter">
                                    <div className="dropdown">
                                        <div className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                            Availability
                                        </div>
                                        <ul className="dropdown-menu">
                                            <li className="dropdown-item">
                                                <input
                                                    type="checkbox"
                                                    name="inStock"
                                                    checked={availabilityFilter.inStock}
                                                    onChange={handleAvailabilityChange}
                                                />
                                                <label>In Stock</label>
                                            </li>
                                            <li className="dropdown-item">
                                                <input
                                                    type="checkbox"
                                                    name="outOfStock"
                                                    checked={availabilityFilter.outOfStock}
                                                    onChange={handleAvailabilityChange}
                                                />
                                                <label>Out Of Stock</label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>


                                <div className="filter-1">
                                    <div className="dropdown">
                                        <div className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                            Rating
                                        </div>
                                        <ul className="dropdown-menu">
                                            {[1, 2, 3, 4, 5].map(rating => (
                                                <li className="dropdown-item" key={rating}>
                                                    <input
                                                        type="checkbox"
                                                        value={rating}
                                                        checked={ratingFilter.includes(rating)}
                                                        onChange={handleRatingChange}
                                                    />
                                                    <label>{rating} Stars & Up</label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>





                            </div>



                        </div>
                    </div>

                    <div className="Products-main-body">
                        <div className="container-fluid">
                            <div className="row">
                                {filteredProducts.map((data, index) => (
                                    <div className="col-md-3 col-sm-12" key={index} style={{ marginBottom: "10px" }}>
                                        <Link to={`/product-page/${data.details.productId}`}>
                                            <div className="product-card">
                                                <div className="best-seller">
                                                    <h5>Best Seller</h5>
                                                </div>
                                                <div className="favourate-icon">
                                                    <MdOutlineFavoriteBorder />
                                                </div>
                                                <div className="product-image">
                                                    <img src={data.details.imageUrls} alt="" />
                                                </div>

                                                <div className="product-details">
                                                    <div className="product-title">
                                                        <p>
                                                            {data.details.name.length > 20
                                                                ? `${data.details.name.slice(0, 20)}...` // Truncate to 20 characters and add "..."
                                                                : data.details.name                      // Display full name if <= 20 characters
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="product-price">
                                                        <div className="exact-price">
                                                            <h1>₹ {data.details.sellingPrice.toFixed(2)}</h1>
                                                        </div>
                                                        <div className="before-price">
                                                            <h3><strike>₹ {data.details.price.toFixed(2)}</strike></h3>
                                                        </div>
                                                        <div className="offer">
                                                            <h3>
                                                                {((data.details.price - data.details.sellingPrice) / data.details.price * 100).toFixed(2)}% OFF
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    <div className="product-rating">
                                                        <HiOutlineStar className='HiOutlineStar-icon' />
                                                        <span>
                                                            {(
                                                                (data.details.oneRating +
                                                                    data.details.twoRating +
                                                                    data.details.threeRating +
                                                                    data.details.fourRating +
                                                                    data.details.fiveRating) > 0 ?
                                                                    (
                                                                        (1 * data.details.oneRating +
                                                                            2 * data.details.twoRating +
                                                                            3 * data.details.threeRating +
                                                                            4 * data.details.fourRating +
                                                                            5 * data.details.fiveRating) /
                                                                        (data.details.oneRating +
                                                                            data.details.twoRating +
                                                                            data.details.threeRating +
                                                                            data.details.fourRating +
                                                                            data.details.fiveRating)
                                                                    ).toFixed(1) : "0"
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="sponsered">
                                                        <h4>Sponsored</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BottomBar/>
            <Footer />
        </div>
    );
};

export default RecentlyViewed;
