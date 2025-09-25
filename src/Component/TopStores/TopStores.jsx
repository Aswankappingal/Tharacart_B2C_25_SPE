import { useState, useEffect } from 'react';
import './TopStores.scss';
import SearchresultSidebar from '../LeftMenuBar/SearchresultSidebar';
import { IoIosArrowDropleftCircle } from "react-icons/io";
import "slick-carousel/slick/slick.css";
import Slider from "react-slick";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import "slick-carousel/slick/slick-theme.css";
import { HiOutlineStar } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';
import useTopStores from '../../redux/hooks/HomePageHooks/useTopStores';
import useTopStoresProducts from '../../redux/hooks/topStoreProducts/useTopStoresProducts';
import useGetBrand from '../../redux/hooks/topDealsHooks/useGetBrand';
import ScrollToTopOnMount from '../ScrollToTopOnMount';

const TopStores = () => {
    const [sortOption, setSortOption] = useState('Price: Low to High');
    const [brandId, setBrandId] = useState('');
    const [availability, setAvailability] = useState('');
    const [rating, setRating] = useState('');

    const { brands, status: brandStatus, error: brandError } = useGetBrand();
    const { topStores: topstoreBanner, status: topstoreBannerStatus, error: topstoreBannerError } = useTopStores();
    const { topStoresProduct: topstoresproduct, status: topstoresproductStatus, error: topstoresproductError } = useTopStoresProducts();

    useEffect(() => {
        console.log('topStores: ', topstoreBanner);
        console.log('filter-products',);

    }, [topstoreBanner]);

    if (topstoreBannerStatus === 'loading' || topstoresproductStatus === 'loading') {
        return <div>Loading...</div>;
    }

    if (topstoreBannerStatus === 'failed') {
        return <div>Error: {topstoreBannerError}</div>;
    }
    if (topstoresproductStatus === 'failed') {
        return <div>Error: {topstoresproductError}</div>;
    }

    const handleSort = (option) => {
        setSortOption(option);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'brand':
                setBrandId(value);
                break;
            case 'availability':
                setAvailability(value);
                break;
            case 'rating':
                setRating(value);
                break;
            default:
                break;
        }
    };

    const calculateAverageRating = (ratings = {}) => {
        const { oneRating = 0, twoRating = 0, threeRating = 0, fourRating = 0, fiveRating = 0 } = ratings;
        const totalRatings = oneRating + twoRating + threeRating + fourRating + fiveRating;

        if (totalRatings === 0) return 0;

        const averageRating = (
            (oneRating * 1) +
            (twoRating * 2) +
            (threeRating * 3) +
            (fourRating * 4) +
            (fiveRating * 5)
        ) / totalRatings;

        return averageRating.toFixed(1);
    };

    const filteredProducts = topstoresproduct
        .filter(product => {
            const stockCondition = availability === 'InStock'
                ? product.stock > 0
                : availability === 'OutOfStock'
                    ? product.stock <= 0
                    : true;

            const ratingCondition = rating === ''
                ? true
                : parseFloat(rating) === parseFloat(calculateAverageRating(product));

            return (
                (brandId === '' || product.brandId === brandId) &&
                stockCondition &&
                ratingCondition
            );
        })
        .sort((a, b) => {
            switch (sortOption) {
                case 'Price: Low to High':
                    return a.sellingPrice - b.sellingPrice;
                case 'Price: High to Low':
                    return b.sellingPrice - a.sellingPrice;
                case 'Discounts':
                    return b.discount - a.discount;
                case 'Recommended':
                    return b.rating - a.rating;
                default:
                    return 0;
            }
        });

    const getSliderSettings = (itemslength) => {
        if (itemslength <= 1) {
            return null;
        }
        return {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: Math.min(itemslength, 3.3),
            slidesToScroll: Math.min(itemslength, 3.3),
            arrows: false,
            autoplay: true,

            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: Math.min(itemslength, 2.5),
                        slidesToScroll: Math.min(itemslength, 2.5),
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: Math.min(itemslength, 2),
                        slidesToScroll: Math.min(itemslength, 1.5),
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: Math.min(itemslength, 1),
                        slidesToScroll: 1,
                    }
                }
            ]
        }
    }


    // const settings = {
    //     dots: false,
    //     infinite: true,
    //     speed: 500,
    //     slidesToShow: 3.3,
    //     arrows: false,
    //     autoplay: true,
    //     slidesToScroll: 3.3,
    //     responsive: [
    //         {
    //             breakpoint: 1024,
    //             settings: {
    //                 slidesToShow: 2.5,
    //                 slidesToScroll: 2.5,
    //             }
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 2,
    //                 slidesToScroll: 1.5,
    //             }
    //         },
    //         {
    //             breakpoint: 480,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             }
    //         }
    //     ]
    // };

    const settings2 = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        arrows: false,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1.5,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };
    const stores = Array.isArray(topstoreBanner) ? topstoreBanner :
        (topstoreBanner.data && Array.isArray(topstoreBanner.data) ? topstoreBanner.data : []);

    // const TopStores = ({ topstoreBanner }) => {
    //     const stores = Array.isArray(topstoreBanner?.data) ? topstoreBanner.data :
    //         (Array.isArray(topstoreBanner) ? topstoreBanner : []);


    return (
        <div className='TopStores-main-wrapper'>
            <Navbar />
            <ScrollToTopOnMount />
            <div className="Topstores-body">
                <div className="topstore-left">
                    <SearchresultSidebar />
                </div>
                <div className="topstore-right">
                    <div className="topstores-heading-container">
                        <div className="left-arrow">
                            <IoIosArrowDropleftCircle className='BsArrowLeftCircleFill' />
                        </div>
                        <h1>Top Stores</h1>
                    </div>
                    <div className="top-stores-cards-container">
                        {stores.length > 0 ? (
                            getSliderSettings(stores.length) ? (
                                <Slider {...getSliderSettings(stores.length)}>
                                    {stores.map((data, index) => (
                                        <div key={index}>
                                            <div className="top-stores-card">
                                                <div className="card-image">
                                                    <img src={data.image} alt="Store" />
                                                </div>
                                                <div className="card-description">
                                                    <h1>{data.sellerData?.storedetails?.storename || "No Store Name"}</h1>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            ) : (
                                <div className="single-store">
                                    <div className="top-stores-card">
                                        <div className="card-image">
                                            <img src={stores[0].image} alt="Store" />
                                        </div>
                                        <div className="card-description">
                                            <h1>{stores[0].sellerData?.storedetails?.storename || "No Store Name"}</h1>
                                        </div>
                                    </div>
                                </div>
                            )
                        ) : (
                            <p>No stores available</p>
                        )}
                    </div>
                    <div>
                        <div className="filter-dropdowns">
                            <div className="selecter-filter">
                                <div className="filter-1">
                                    <div className="dropdown">
                                        <div className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                            Sort: {sortOption}
                                        </div>
                                        <ul className="dropdown-menu">
                                            <li className="dropdown-item">
                                                <input type="radio" name="sort" id="low-to-high" value="Price: Low to High" checked={sortOption === 'Price: Low to High'} onChange={() => handleSort('Price: Low to High')} />
                                                <label htmlFor="low-to-high">Price: Low to High</label>
                                            </li>
                                            <li className="dropdown-item">
                                                <input type="radio" name="sort" id="high-to-low" value="Price: High to Low" checked={sortOption === 'Price: High to Low'} onChange={() => handleSort('Price: High to Low')} />
                                                <label htmlFor="high-to-low">Price: High to Low</label>
                                            </li>

                                        </ul>
                                    </div>
                                </div>
                                <div className="filter-2">
                                    <select name="brand" onChange={handleFilterChange}>
                                        <option value="">Brand</option>
                                        {brands.map((brand, index) => (
                                            <option key={index} value={brand.brandId}>{brand.brandName}</option>
                                            // <button className='ApplyFilter'>Apply</button>
                                        ))}
                                    </select>

                                </div>
                                <div className="filter-3">
                                    <select name="availability" onChange={handleFilterChange}>
                                        <option value="">Availability</option>
                                        <option value="InStock">In Stock</option>
                                        <option value="OutOfStock">Out Of Stock</option>

                                    </select>
                                </div>
                                <div className="filter-4">
                                    <select name="rating" onChange={handleFilterChange}>
                                        <option value="">Rating</option>
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <option key={num} value={num}>{num} Rating</option>
                                        ))}

                                    </select>
                                </div>
                            </div>
                        </div>

                        {
                            stores?.map((data, index) => {
                                // Filter the products for the current store
                                const storeProducts = filteredProducts.filter(product => product.sellerId === data.sellerData.sellerId);

                                return (
                                    <div className="ad-main-container" key={index}>
                                        <div className="tharacart-ad-container">
                                            <div className="tharacart-ad-left">
                                                <div className="star-logo">
                                                    <img src="/Images/Vector.png" alt="" />
                                                </div>
                                                <div className="thara-title">
                                                    <h2>{data.sellerData.storedetails.storename}</h2>
                                                </div>
                                            </div>
                                            <div className="tharacart-ad-right">
                                                {/* <Link className="visit-stores" to={`/seller-store/${data.sellerData.sellerId}`}>Visit Store</Link> */}
                                                {/* <IoIosArrowForward className="IoIosArrowForward" /> */}
                                            </div>
                                        </div>
                                        <div className="product-card-wrapper">
                                            <div className="Products-main-body">
                                                {storeProducts.length === 0 ? (
                                                    <div className="no-products-message">
                                                        <p>No products available</p>
                                                    </div>
                                                ) : (
                                                    <Slider {...settings2}>
                                                        {storeProducts.map((product, productIndex) => {
                                                            const averageRating = calculateAverageRating(product);

                                                            return (
                                                                <div key={productIndex}>
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
                                                                                    <h1>₹{product.sellingPrice}</h1>
                                                                                </div>
                                                                                <div className="before-price">
                                                                                    <h3><strike>₹{product.price}</strike></h3>
                                                                                </div>
                                                                                <div className="offer">
                                                                                    <h3>{Math.round(((product.price - product.sellingPrice) / product.price) * 100)}% OFF</h3>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="product-rating">
                                                                            <HiOutlineStar className="HiOutlineStar-icon" /><span>{averageRating}</span>
                                                                        </div>
                                                                        <div className="sponsered">
                                                                            <h4>Sponsored</h4>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </Slider>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopStores;
