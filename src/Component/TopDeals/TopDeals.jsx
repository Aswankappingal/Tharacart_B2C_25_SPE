import './TopDeals.scss'
import SearchresultSidebar from '../LeftMenuBar/SearchresultSidebar'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Navbar from '../Navbar/Navbar'
import { useEffect, useRef, useState } from 'react';
import { FaAngleDown } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";
import Footer from '../Footer/Footer';
import useTopDeals from '../../redux/hooks/HomePageHooks/useTopDeals';
import useTopDealsProduct from '../../redux/hooks/topDealsHooks/useTopDealsProduct';
import { Link } from 'react-router-dom';
import ScrollToTopOnMount from '../ScrollToTopOnMount';
import useGetBrand from '../../redux/hooks/topDealsHooks/useGetBrand';
import BottomBar from '../BottomBar/BottomBar';

const TopDeals = () => {
    const [sort, setSort] = useState('Low to High');

    const [selectedBrands, setSelectedBrands] = useState([]);
    const [tempSelectedBrands, setTempSelectedBrands] = useState([]); // Temporary state for brand filter
    const [showInStock, setShowInStock] = useState(false); // State for In Stock filter
    const [showOutOfStock, setShowOutOfStock] = useState(false); // State for Out of Stock filter
    const [selectedRatings, setSelectedRatings] = useState([]);

    const [openDropdown, setOpenDropdown] = useState(null);



    const toggleDropdown = (dropdownName) => {
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };


    const [appliedFilters, setAppliedFilters] = useState({
        brands: [],
        inStock: false,
        outOfStock: false,
        ratings: []
    });

    const getSliderSettings = (itemslength) => {
        if (itemslength <= 1) {
            return null;
        }
        return {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: Math.min(itemslength, 4),
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
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    }
                }
            ]
        }
    }



    const { topDeals: topDealsBanner, status: bannerStatus, error: bannererror } = useTopDeals();

    // const sliderSettings = {
    //     dots: false,
    //     infinite: topDealsBanner.length > 1,  // Disable infinite scrolling if only one image
    //     speed: 500,
    //     slidesToShow: Math.min(3, topDealsBanner.length),  // Show at most 3 slides or less if fewer images
    //     slidesToScroll: 1,
    //     swipeToSlide: topDealsBanner.length > 1,  // Allow swiping only if more than one image
    //     draggable: topDealsBanner.length > 1,  // Disable dragging if only one image
    //     responsive: [
    //         {
    //             breakpoint: 1500,
    //             settings: {
    //                 slidesToShow: Math.min(3, topDealsBanner.length),
    //                 slidesToScroll: 1,
    //                 infinite: topDealsBanner.length > 1,
    //                 dots: false
    //             }
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: Math.min(5, topDealsBanner.length),
    //                 slidesToScroll: 1,
    //                 infinite: topDealsBanner.length > 1,
    //                 dots: false
    //             }
    //         },
    //         {
    //             breakpoint: 1024,
    //             settings: {
    //                 slidesToShow: Math.min(3, topDealsBanner.length),
    //                 slidesToScroll: 1,
    //                 infinite: topDealsBanner.length > 1,
    //                 dots: false
    //             }
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //                 infinite: topDealsBanner.length > 1,
    //                 dots: false
    //             }
    //         },
    //         {
    //             breakpoint: 576,
    //             settings: {
    //                 slidesToShow: 0,
    //                 slidesToScroll: 3,
    //                 // infinite: topDealsBanner.length > 1
    //             }
    //         }
    //     ]
    // };



    const { topDealsProducts, status: topDealsProdStatus, error: topDealsProdError } = useTopDealsProduct();
    const { brands: brands, status: brandStatus, error: brandError } = useGetBrand();

    useEffect(() => {
        console.log('brands:', topDealsProducts);
    }, [topDealsProducts]);

    const handleBrandSelection = (brandId) => {
        setTempSelectedBrands((prevSelected) =>
            prevSelected.includes(brandId)
                ? prevSelected.filter((id) => id !== brandId) // Remove brand if already selected
                : [...prevSelected, brandId] // Add brand if not selected
        );
    };



    const handleRatingSelection = (rating) => {
        setSelectedRatings((prevSelected) =>
            prevSelected.includes(rating)
                ? prevSelected.filter((r) => r !== rating) // Remove rating if already selected
                : [...prevSelected, rating] // Add rating if not selected
        );
    };

    // const toggleInStock = () => {
    //     setShowInStock((prev) => !prev); // Toggle in-stock filter
    // };

    // const toggleOutOfStock = () => {
    //     setShowOutOfStock((prev) => !prev); // Toggle out-of-stock filter
    // };


    const applyFilters = () => {
        setAppliedFilters({
            brands: tempSelectedBrands,
            inStock: showInStock,
            outOfStock: showOutOfStock,
            ratings: selectedRatings
        });
    };

    const handleSortChange = (selectedSort) => {
        setSort(selectedSort); // Update sort state
        // Automatically apply filters after changing the sort option
        setAppliedFilters((prevFilters) => ({
            ...prevFilters,
            sort: selectedSort
        }));
    };
    // Example action to reset filters
    const resetFilters = () => {
        setTempSelectedBrands([]);
        setSelectedRatings([]);
        setShowInStock(false);
        setShowOutOfStock(false);
        setSort(null); // Clear sorting
        setAppliedFilters({}); // Clear applied filters
    };

    // Function to use all filters in combination
    useEffect(() => {
        // This can be triggered whenever applied filters change
        const fetchFilteredProducts = async () => {
            // Add API or backend fetching logic here
            console.log("Applying Filters:", appliedFilters);
            // Fetch and update products based on appliedFilters
        };

        fetchFilteredProducts();
    }, [appliedFilters]);




    const filteredTopDealsProducts = topDealsProducts
        .filter(product => {
            // Filter by brand
            const brandFilter = !appliedFilters.brands.length || appliedFilters.brands.includes(product.brandId);

            // Filter by availability
            const availabilityFilter =
                (appliedFilters.inStock && product.stock > 0) ||
                (appliedFilters.outOfStock && product.stock <= 0) ||
                (!appliedFilters.inStock && !appliedFilters.outOfStock);

            // Filter by ratings
            const totalRatings = product.oneRating + product.twoRating + product.threeRating + product.fourRating + product.fiveRating;
            const weightedSum =
                (product.oneRating * 1) +
                (product.twoRating * 2) +
                (product.threeRating * 3) +
                (product.fourRating * 4) +
                (product.fiveRating * 5);
            const averageRating = totalRatings > 0 ? parseFloat((weightedSum / totalRatings).toFixed(1)) : 0;
            const ratingFilter = !appliedFilters.ratings.length || appliedFilters.ratings.some(rating => averageRating >= rating);

            return brandFilter && availabilityFilter && ratingFilter;
        })
        .sort((a, b) => {
            switch (sort) {
                case 'Low to High':
                    return a.sellingPrice - b.sellingPrice;
                case 'High to Low':
                    return b.sellingPrice - a.sellingPrice;
                default:
                    return 0;
            }
        });



    if (bannerStatus === 'loading' || topDealsProdStatus === 'loading' || brandStatus === 'loading') {
        return <div>Loading</div>;
    }
    if (bannerStatus === 'failed') {
        return <div>Failed with {bannererror}</div>;
    }
    if (topDealsProdError === 'failed') {
        return <div>Failed with {topDealsProdError}</div>;
    }
    if (brandStatus === 'failed') {
        return <div>Failed with {brandError}</div>;
    }

    if (!topDealsBanner || topDealsBanner.length === 0) {
        return <p>Loading...</p>;  // Display a fallback UI if no data is available
    }

    return (

        <div className='TopDealsMainwrapper'>
            <ScrollToTopOnMount />
            <Navbar />
            <div className="TopDelasWrapper">
                {/* <div className="TopDeals-left"><SearchresultSidebar /></div> */}
                <div className="TopDeals-right">
                    <Link to={'/'} className='Link-top-deals'>
                        <h2 className='top-deals-heading'>
                            <img src="/Images/chevron-down.png" alt="" /> Top Deals
                        </h2>
                    </Link>
                    <div className="carousel-section">
                        {topDealsBanner.length > 0 ? (
                            getSliderSettings(topDealsBanner.length) ? (
                                <Slider {...getSliderSettings(topDealsBanner.length)}>
                                    {topDealsBanner.map((data, index) => (
                                        <div key={index}>
                                            <div className="top-deals-card">
                                                <div className="top-deals-image">
                                                    <img src={data.bannerUrl} alt="Deal" />
                                                </div>
                                                {/* <div className="card-description">
                                                    <h1>{data.dealTitle || "No Deal Title"}</h1>
                                                </div> */}
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            ) : (

                                <div className="top-deals-card">
                                    <div className="top-deals-image">
                                        <img src={topDealsBanner[0].bannerUrl} alt="Deal" />
                                    </div>
                                    {/* <div className="card-description">
                                            <h1>{topDealsBanner[0].dealTitle || "No Deal Title"}</h1>
                                        </div> */}
                                </div>

                            )
                        ) : (
                            <p>No deals available</p>
                        )}
                    </div>
                    <div className="selectBox-section">

                        <div className="sort-main-box-flexer">

                            <div className="sort-dropdwn-main-2">
                                <div className="sort-dropdown" data-bs-toggle="dropdown" aria-expanded="false" onClick={() => toggleDropdown('sort')}>
                                    <span>Sort : Price - {sort}</span>
                                    <FaAngleDown className="downAngle" />
                                </div>
                                {openDropdown === 'sort' && (
                                    <ul className="dropdown-menu sort-dropdown-result show">
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => {
                                                    handleSortChange('Low to High');
                                                    setOpenDropdown(null);
                                                }}
                                            >
                                                Low to High
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => {
                                                    handleSortChange('High to Low');
                                                    setOpenDropdown(null);
                                                }}
                                            >
                                                High to Low
                                            </a>
                                        </li>
                                    </ul>
                                )}
                            </div>


                            <div className="sort-brand-main-2">

                                <div
                                    className="sort-dropdown"
                                    onClick={() => toggleDropdown('brand')}
                                >
                                    <span>Brand</span>
                                    <FaAngleDown className='downAngle' />
                                </div>


                                {openDropdown === 'brand' && (
                                    <ul className="dropdown-menu sort-dropdown-result show">
                                        {brands.map((brand, index) => (
                                            <li key={index} className="dropdown-item">
                                                <input
                                                    type="checkbox"
                                                    id={`brand-${brand.brandId}`}
                                                    value={brand.brandId}
                                                    onChange={() => handleBrandSelection(brand.brandId)}
                                                    checked={tempSelectedBrands.includes(brand.brandId)}
                                                />
                                                <label htmlFor={`brand-${brand.brandId}`}>{brand.brandName}</label>
                                            </li>
                                        ))}
                                        <button
                                            className="apply-button"
                                            onClick={() => {
                                                applyFilters();
                                                setOpenDropdown(null);
                                            }}
                                        >
                                            Apply
                                        </button>
                                    </ul>
                                )}


                            </div>

                        </div>

                        <div className="sort-main-box-flexer">

                            <div className="sort-dropdwn-main-1">

                                <div className="sort-dropdown" data-bs-toggle="dropdown" aria-expanded="false" onClick={() => toggleDropdown('availability')}>
                                    <span>Availability</span>
                                    <FaAngleDown className='downAngle' />
                                </div>
                                {openDropdown === 'availability' && (
                                    <ul className="dropdown-menu sort-dropdown-result show">
                                        <li className="dropdown-item">
                                            <input
                                                type="checkbox"
                                                id="inStock"
                                                onChange={() => setShowInStock(!showInStock)}
                                                checked={showInStock}
                                            />
                                            <label htmlFor="inStock">In Stock</label>
                                        </li>
                                        <li className="dropdown-item">
                                            <input
                                                type="checkbox"
                                                id="outOfStock"
                                                onChange={() => setShowOutOfStock(!showOutOfStock)}
                                                checked={showOutOfStock}
                                            />
                                            <label htmlFor="outOfStock">Out Of Stock</label>
                                        </li>
                                        <button
                                            className="apply-button"
                                            onClick={() => {
                                                applyFilters();
                                                setOpenDropdown(null);
                                            }}
                                        >
                                            Apply
                                        </button>
                                    </ul>
                                )}
                            </div>

                            <div className="sort-brand-main-1">

                                <div className="sort-dropdown" data-bs-toggle="dropdown" aria-expanded="false" onClick={() => {
                                    toggleDropdown('rating')
                                }}>
                                    <span>Rating</span>
                                    <FaAngleDown className='downAngle' />
                                </div>
                                {openDropdown === 'rating' && (
                                    <ul className="dropdown-menu sort-dropdown-result show">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <li key={rating} className='dropdown-item'>
                                                <input
                                                    type="checkbox"
                                                    id={`rating-${rating}`}
                                                    onChange={() => handleRatingSelection(rating)}
                                                    checked={selectedRatings.includes(rating)}
                                                />
                                                <label htmlFor={`rating-${rating}`}>{rating} Stars & Up</label>
                                            </li>
                                        ))}
                                        <button
                                            className="apply-button"
                                            onClick={() => {
                                                applyFilters();
                                                setOpenDropdown(null);
                                            }}
                                        >
                                            Apply
                                        </button>
                                    </ul>
                                )}

                            </div>

                        </div>



                    </div>
                    <div className="products-list-wrapper">
                        <div className="container-fluid">
                            <div className="row">
                                {filteredTopDealsProducts.map((data, index) => {
                                    const percentageOff = Math.round(((data.price - data.sellingPrice) / data.price) * 100);
                                    const totalRatings = data.oneRating + data.twoRating + data.threeRating + data.fourRating + data.fiveRating;
                                    const weightedSum =
                                        (data.oneRating * 1) +
                                        (data.twoRating * 2) +
                                        (data.threeRating * 3) +
                                        (data.fourRating * 4) +
                                        (data.fiveRating * 5);
                                    const averageRating = totalRatings > 0 ? (weightedSum / totalRatings).toFixed(1) : 'N/A';

                                    return (
                                        <div className="col-lg-3 col-md-6 col-12" key={index} style={{ marginBottom: "10px" }}>
                                            <Link to={`/product-page/${data.productId}`}>
                                                <div className="prod-card">
                                                    <div className="prod-image">
                                                        <img src={data.imageUrls} alt="" />
                                                    </div>
                                                    <div className="offer-box">
                                                        {percentageOff}% OFF
                                                    </div>
                                                    <h5 className="prodDiscription">
                                                        {data.name.length > 20 ? `${data.name.slice(0, 55)}...` : data.name}
                                                    </h5>
                                                    <span className='offerPrice'>₹{data.sellingPrice.toFixed(2)}</span>
                                                    <span className="ogPrice">
                                                        <strike>₹{data.price.toFixed(2)}</strike>
                                                    </span>
                                                    <span className="offer-text">{percentageOff}% OFF</span>
                                                    <div className="stock">
                                                        {data.stock > 4 && data.stock < 10 && "Only few left"}
                                                        {data.stock <= 4 && data.stock > 0 && `Only ${data.stock} left`}
                                                        {data.stock <= 0 && "Out of Stock"}
                                                    </div>
                                                    <div className="ratingBox">
                                                        <FaRegStar className='star' /><span>{averageRating}</span>
                                                    </div>
                                                    <span className="sponserd">Sponsored</span>
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <BottomBar />
        </div>
    )
}

export default TopDeals;
