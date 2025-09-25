import './LimitedTimeDeals.scss';
import SearchresultSidebar from '../LeftMenuBar/SearchresultSidebar';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Navbar from '../Navbar/Navbar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaAngleDown } from "react-icons/fa6";
import Footer from '../Footer/Footer';
import useLimitedTimeDeals from '../../redux/hooks/HomePageHooks/useLimitedTimeDeal';
import useLimitedOfferProducts from '../../redux/hooks/LimitedTimeHook/useLimitedOfferProducts';
import useGetBrand from '../../redux/hooks/topDealsHooks/useGetBrand';
import baseUrl from '../../baseUrl';
import axios from 'axios';
import useCartProduct from '../../redux/hooks/cartPageHooks/useCartProduct';
import AddToCartAlert from '../AddToCartAlert/AddToCartAlert';
import BottomBar from '../BottomBar/BottomBar';
import { Link } from 'react-router-dom';

const LimitedTimeDeals = () => {
    const [sortOrder, setSortOrder] = useState('lowToHigh');
    const [alertMessage, setAlertMessage] = useState('Item Added to Cart');
    const [cartAlertVisible, setCartAlertVisible] = useState(false);
    const { brands, status, error } = useGetBrand()
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [stockFilter, setStockFilter] = useState({
        inStock: false,
        outOfStock: false
    });


    const sliderRef = useRef(null);
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 1500,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
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
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const { limitedTimeDeals: limitedTimeDealsBanner, status: limitedTimeDealsBannerStatus, error: limitedTimeDealsBannerError } = useLimitedTimeDeals();
    const { limitedTimeDealProducts: limitedTimeDealsProducts, status: limitedTimeDealsProductsStatus, error: limitedTimeDealsProductsError } = useLimitedOfferProducts();

    // useEffect(() => {
    //     console.log('limitedTimeDealssssss :', limitedTimeDealsProducts);
    //     console.log('limibanner', limitedTimeDealsBanner);


    // }, [limitedTimeDealsProducts, limitedTimeDealsBanner]);



    const calculateTimeRemaining = (date) => {
        if (!date) return { hours: 0, minutes: 0, seconds: 0 };

        const now = new Date();
        let end;

        // Handle the timestamp format we see in the console
        if (date._seconds) {
            end = new Date(date._seconds * 1000);
        } else {
            return { hours: 0, minutes: 0, seconds: 0 };
        }

        const timeDiff = end - now;

        if (timeDiff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

        const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
        const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        return { hours, minutes, seconds };
    };



    useEffect(() => {
        if (!limitedTimeDealsProducts?.length && !limitedTimeDealsBanner?.length) return;

        const updateTimer = () => {
            const updatedTimes = {};

            // Update timers for products
            limitedTimeDealsProducts?.forEach(product => {
                updatedTimes[product.id] = calculateTimeRemaining(product.limitedTimeEndDate);
            });

            // Update timers for banner items
            limitedTimeDealsBanner?.forEach(banner => {
                // Using endDate which we can see in the console
                const timeLeft = calculateTimeRemaining(banner.endDate);
                updatedTimes[banner.id] = timeLeft;
                // console.log(`Time remaining for banner ${banner.id}:`, timeLeft);
            });

            setTimeRemaining(updatedTimes);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [limitedTimeDealsProducts, limitedTimeDealsBanner]);





    const [timeRemaining, setTimeRemaining] = useState({});


    const { refetch, cartProduct, status: cartStatus, error: cartError } = useCartProduct();

    const quantity = 1;
    const addToCart = async (productId, quantity) => {
        // Check if the product is already in the cart
        const productInCart = cartProduct?.find(item => item.productId === productId);

        if (productInCart) {
            setAlertMessage('Product is already in your cart.');
            setCartAlertVisible(true);
            setTimeout(() => setCartAlertVisible(false), 4000);
            return; // Prevent adding the product again
        }

        try {
            const token = localStorage.getItem('authToken');

            if (!token) {
                console.error('No token found');
                setAlertMessage('Authentication error. Please log in.');
                setCartAlertVisible(true);
                setTimeout(() => setCartAlertVisible(false), 3000);
                return;
            }

            const res = await axios.post(
                `${baseUrl}/add-to-cart`,
                { productId, quantity },
                {
                    headers: {
                        Authorization: `Bearer${token}`,
                    },
                }
            );

            setAlertMessage('Item Added to Cart');
            setCartAlertVisible(true);
            refetch(); // Refetch cart data to update the UI
            setTimeout(() => setCartAlertVisible(false), 4000);
        } catch (error) {
            console.log(error);
            setAlertMessage('Failed to add item to cart. Please try again.');
            setCartAlertVisible(true);
            setTimeout(() => setCartAlertVisible(false), 4000);
        }
    };







    const handleSortChange = (order) => {
        setSortOrder(order);
    };

    const filteredProducts = useMemo(() => {
        let filtered = [...limitedTimeDealsProducts];

        // Apply stock filter
        if (stockFilter.inStock && stockFilter.outOfStock) {
            // Show all products if both are selected
        } else if (stockFilter.inStock) {
            filtered = filtered.filter(product => product.stock > 0);
        } else if (stockFilter.outOfStock) {
            filtered = filtered.filter(product => product.stock <= 0);
        }

        // Apply brand filter
        if (selectedBrands.length > 0) {
            filtered = filtered.filter(product => selectedBrands.includes(product.brandId));
        }

        return filtered;
    }, [limitedTimeDealsProducts, stockFilter, selectedBrands]);

    // Sort products based on the selected order
    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            if (sortOrder === 'lowToHigh') {
                return a.sellingPrice - b.sellingPrice;
            } else {
                return b.sellingPrice - a.sellingPrice;
            }
        });
    }, [filteredProducts, sortOrder]);





    // console.log("sssss",sortedProducts);

    // ==================brand Sort=========================


    const handleBrandChange = (brandId) => {
        setSelectedBrands(prev => {
            if (prev.includes(brandId)) {
                return prev.filter(id => id !== brandId);
            } else {
                return [...prev, brandId];
            }
        });
    };

    if (limitedTimeDealsBannerStatus === 'loading' || limitedTimeDealsProductsStatus === 'loading') {
        return <div>Loading...</div>;
    }

    if (limitedTimeDealsBannerStatus === 'failed') {
        return <div>Error: {limitedTimeDealsBannerError}</div>;
    }
    if (limitedTimeDealsProductsStatus === 'failed') {
        return <div>Error: {limitedTimeDealsProductsError}</div>;
    }

    // Check if no products are found
    // const noProductsFound = processProducts.length === 0;
    return (
        <div className='LimitedTimeDealsMainWrapper'>
            <AddToCartAlert
                visible={cartAlertVisible}
                onClose={() => setCartAlertVisible(false)}
                message={alertMessage}
            />
            <div className="LimitedTimeDealsWrapper">
                <Navbar />
                {/* <div className="TopDeals-left"><SearchresultSidebar /></div> */}
                <div className="TopDeals-right">
                    <h2 className='top-deals-heading'>
                        <img src="/Images/chevron-down.png" alt="" /> Limited Time Deals</h2>
                    <div className="carousel-section">
                        <Slider {...settings}>
                            {limitedTimeDealsBanner.map((data, index) => (
                                <div key={index}>
                                    <div className="top-deals-image">
                                        <img src={data.image[0]} alt="" />
                                        <div className="time-count">
                                            Ends in {String(timeRemaining[data.id]?.hours || 0).padStart(2, '0')}:
                                            {String(timeRemaining[data.id]?.minutes || 0).padStart(2, '0')}:
                                            {String(timeRemaining[data.id]?.seconds || 0).padStart(2, '0')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <div className="selectBox-section">
                        <div className="sort-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <span>Sort : Price - {sortOrder === 'lowToHigh' ? 'Low to High' : 'High to Low'}</span>
                            <FaAngleDown className='downAngle' />
                        </div>
                        <ul className="dropdown-menu sort-dropdown-result">
                            <li>
                                <a className="dropdown-item" onClick={() => handleSortChange('lowToHigh')}>Low to High</a>
                            </li>
                            <li>
                                <a className="dropdown-item" onClick={() => handleSortChange('highToLow')}>High to Low</a>
                            </li>
                        </ul>
                        <div className="sort-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <span>Brand</span>
                            <FaAngleDown className='downAngle' />
                        </div>
                        <ul className="dropdown-menu sort-dropdown-result ">
                            {brands.map(brand => (
                                <li key={brand.id} className='brandFilter'>
                                    <input
                                        type="checkbox"
                                        id={`brand-${brand.brandId}`}
                                        checked={selectedBrands.includes(brand.brandId)}
                                        onChange={() => handleBrandChange(brand.brandId)} />
                                    <label htmlFor={`brand-${brand.brandId}`}>{brand.brandName}</label>
                                </li>
                            ))}
                        </ul>
                        <div className="sort-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <span>Availability</span>
                            <div className="count">
                                2
                            </div>
                            <FaAngleDown className='downAngle' />
                        </div>
                        <ul className="dropdown-menu sort-dropdown-result">
                            <li className='brandFilter'>
                                <input
                                    type="checkbox"
                                    checked={stockFilter.inStock}
                                    onChange={() => setStockFilter(prev => ({
                                        ...prev,
                                        inStock: !prev.inStock
                                    }))}
                                />
                                <label>In Stock</label>
                            </li>
                            <li className='brandFilter'>
                                <input
                                    type="checkbox"
                                    checked={stockFilter.outOfStock}
                                    onChange={() => setStockFilter(prev => ({
                                        ...prev,
                                        outOfStock: !prev.outOfStock
                                    }))}
                                />
                                <label>Out Of Stock</label>
                            </li>

                        </ul>

                        <ul className="dropdown-menu sort-dropdown-result">
                            <li>
                                <input
                                    type="checkbox"
                                    checked={stockFilter === 'inStock'}
                                    onChange={() => setStockFilter(stockFilter === 'inStock' ? '' : 'inStock')}
                                />
                                <label>In Stock</label>
                            </li>
                            <li>
                                <input
                                    type="checkbox"
                                    checked={stockFilter === 'outOfStock'}
                                    onChange={() => setStockFilter(stockFilter === 'outOfStock' ? '' : 'outOfStock')}
                                />
                                <label>Out Of Stock</label>
                            </li>
                        </ul>

                        <ul className="dropdown-menu sort-dropdown-result">
                            <li>
                                <input
                                    type="checkbox"
                                    checked={stockFilter === 'inStock'}
                                    onChange={() => setStockFilter(stockFilter === 'inStock' ? '' : 'inStock')}
                                />
                                <label>In Stock</label>
                            </li>
                            <li>
                                <input
                                    type="checkbox"
                                    checked={stockFilter === 'outOfStock'}
                                    onChange={() => setStockFilter(stockFilter === 'outOfStock' ? '' : 'outOfStock')}
                                />
                                <label>Out Of Stock</label>
                            </li>
                        </ul>

                    </div>
                    <div className="products-list-wrapper">
                        <div className="container-fluid">
                            <div className="row">
                                {sortedProducts.map((data, index) =>
                                    <div className="col-lg-3" key={index}>
                                        <Link to={`/product-page/${data.productId}`} className='Link-way-only'>
                                            <div className="prod-card">
                                                <div className="prod-image">
                                                    <img src={data.imageUrls[0]} alt={data.name} />
                                                </div>
                                                <div className="card-time-count-down-box">
                                                    {String(timeRemaining[data.id]?.hours || 0).padStart(2, '0')}hr :
                                                    {String(timeRemaining[data.id]?.minutes || 0).padStart(2, '0')}min :
                                                    {String(timeRemaining[data.id]?.seconds || 0).padStart(2, '0')}sec
                                                </div>

                                                <h5 className="prodDiscription">{data.name}</h5>

                                                <span className='offerPrice'>₹{data.sellingPrice}</span>
                                                <span className="ogPrice"><strike>₹{data.price}.00</strike></span>
                                                <span className="offer-text">
                                                    {data.offerTitle} <br />
                                                    <p>{data.offerDesc}</p>
                                                </span>

                                                {/* <div className="add-to-cart-btn">
                                                <button>Add to 
                                                Cart</button>
                                            </div> */}
                                                <div><button onClick={() => addToCart(data.productId, quantity)}>Add to Cart</button></div>

                                            </div>
                                        </Link>
                                    </div>



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

export default LimitedTimeDeals;
