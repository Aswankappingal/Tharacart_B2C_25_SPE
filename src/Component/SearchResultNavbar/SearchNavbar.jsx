import './SearchNavbar.scss';
import { FiDownload } from 'react-icons/fi';
import { IoHeartOutline, IoLocationOutline, IoSearchOutline } from 'react-icons/io5';
import { AiOutlineUser } from 'react-icons/ai';
import { GrCart } from 'react-icons/gr';
import { FaChevronDown } from 'react-icons/fa6';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CategoriesMegaMenu from '../CategoriesMegaMenu/CategoriesMegaMenu';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useCategories from '../../redux/hooks/HomePageHooks/useCategories';
import UseLoginedUser from '../../redux/hooks/NavbarHook/UseLoginedUser';
import useFetchAddress from '../../redux/hooks/checkoutPageHooks/useFetchAddress';
import baseUrl from '../../baseUrl';
import { FaBars } from "react-icons/fa6";
import { FaUserAlt } from 'react-icons/fa';
import useCartProduct from '../../redux/hooks/cartPageHooks/useCartProduct';
// import ConfirmationModal from '../AlertboxLogout/Alertlogout';
import ConfirmAlerbox from '../ConfirmAlertboxLogout/ConfirmAlerbox';
import useFetchUser from '../../redux/hooks/myAccountHooks/useFetchUser';
import ScrollToTopOnMount from '../ScrollToTopOnMount';

const SearchNavbar = () => {
    const navigate = useNavigate();
    const [isCategoriesMenuVisible, setIsCategoriesMenuVisible] = useState(false);
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        // Check if the current route is the home page
        if (location.pathname !== '/') {
            // If not on the home page, hide the mega menu
            setIsCategoriesMenuVisible(false);
        }
    }, [location.pathname]); // Trigger the effect on route changes
    const toggleCategoriesMenu = () => {
        setIsCategoriesMenuVisible(!isCategoriesMenuVisible);
    };

    const { loginedUser, status: loginedStatus, isAuthTokenPresent } = UseLoginedUser();
    const { user, status: fetchUserStatus, error: fetchUsererros } = useFetchUser();


    const handleLogout = () => {
        setShowLogoutModal(true);
    };
    const handleLogoutconfirm = () => {
        localStorage.clear();
        setShowLogoutModal(false)
        navigate('/login')
        window.location.reload();
    }
    const handleLogoutcancel = () => {
        setShowLogoutModal(false)
    }
    const { categories, status, error } = useCategories();
    const { address, status: addressStatus, error: addressError, refetch: addressRefetch } = useFetchAddress()
    const { refetch, cartProduct, status: cartStatus, error: cartError } = useCartProduct(); // Include refetch




    const mainCategories = categories?.filter(cat => cat.parentCategory === cat.id);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const queryParam = params.get('query');
        if (queryParam) {
            setSearchQuery(decodeURIComponent(queryParam));
        }
    }, [location.search]);

    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setShowSuggestions(true);

        if (query.length > 0) {
            setLoading(true);
            try {
                const response = await axios.get(`${baseUrl}/getSearchProd`, {
                    params: { q: query }
                });
                setSearchSuggestions(response.data);
            } catch (error) {
                console.error('Error fetching search suggestions:', error);
                setSearchSuggestions([]);
            } finally {
                setLoading(false);
            }
        } else {
            setSearchSuggestions([]);
        }
    };

    // useEffect(() => {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const queryParam = urlParams.get('query');
    //     if (queryParam) {
    //         setSearchQuery(queryParam);
    //     }
    // }, []);



    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.name); // This line already sets the product name in search bar
        setShowSuggestions(false);
        setSearchQuery(''); // Remove this line if it exists
        navigate(`/search-result-page?query=${encodeURIComponent(suggestion.name)}`);
    };

    return (
        <div className="All-navbar">

            {showLogoutModal && (
                <ConfirmAlerbox
                    message='Do you want to logout !'
                    onConfirm={handleLogoutconfirm}
                    onCancel={handleLogoutcancel}
                />
            )}
            {isCategoriesMenuVisible && <CategoriesMegaMenu />}
            <div className='NavbarMainWrapper'>
                <ScrollToTopOnMount />

                <div className="top-navbar">
                    <div className="top-left">
                        <Link to='/'><img src="/Images/tharacart-nav-logo.svg" alt="Logo" className="nav-logo" /></Link>
                    </div>
                    <div className="top-center">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder='Search...'
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setShowSuggestions(true)}
                            />
                            {/* <img src="/Images/nav-search.svg" alt="Search" /> */}
                        </div>
                        {showSuggestions && searchQuery.length > 0 && (
                            <div className="search-suggestions">
                                {loading ? (
                                    <div className="loading-text" style={{ textAlign: 'center', padding: "10px" }}>Loading....</div>
                                ) : (
                                    searchSuggestions.length > 0 ? (
                                        <ul>
                                            {searchSuggestions.map((suggestion, index) => (
                                                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                                    {suggestion.name}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="no-products-found" style={{ textAlign: "center", padding: "10px" }}>No Result Found</div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    <div className="top-right">
                        <div className="download-app" data-bs-toggle="dropdown" aria-expanded="false">
                            <Link><FiDownload className='nav-icon' /><span>Download App</span></Link>
                        </div>
                        <ul className="dropdown-menu dowlLoadDropDown">
                            <li><div className="downLoadText">Download Our Mobile App</div></li>
                            <li><a href=""><img src="/Images/appstore.svg" alt="" /></a></li>
                            <li><a href=""><img src="/Images/googleplay.svg" alt="" /></a></li>
                        </ul>
                        {/* <Link> */}
                        <div className="whishList">
                            <Link to='/shopping-cart/#whishlist-cart'><IoHeartOutline className='nav-icon' /><span>My Wishlist</span></Link>
                        </div>
                        <div className="sign-in" data-bs-toggle="dropdown" aria-expanded="false">
                            <Link>
                                <AiOutlineUser className="nav-icon" />
                                {loginedStatus === 'loading' ? (
                                    <span>Loading...</span>
                                ) : isAuthTokenPresent && (loginedUser || user) ? (
                                    <span>{user?.name}</span>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </Link>

                        </div>
                        {user || loginedUser ? (
                            <ul className="dropdown-menu">
                                <li>
                                    <div className="sign-in-drop-item logoutBtn" onClick={handleLogout}><Link>Logout</Link></div>
                                </li>
                                <li>
                                    <Link to='/my-account'><div className="sign-in-drop-item">My Profile</div></Link>
                                </li>

                            </ul>
                        ) : (
                            <ul className="dropdown-menu">
                                <li>
                                    <div className="sign-in-drop-item"><Link to='/login'>Sign In</Link></div>
                                </li>
                                <li>
                                    <div className="sign-in-drop-item B2C"><a href='http://shop.tharacart.com/login'>Sign In B2C</a></div>
                                </li>
                                <li>
                                    <div className="sign-in-drop-item signUp"><Link to='/sign-up-with-email'>Sign Up</Link></div>
                                </li>
                            </ul>
                        )}
                        <div className="cart">
                            <Link to='/shopping-cart'><GrCart className='nav-icon' /></Link>
                            <div className="count">{cartProduct?.length}</div>
                        </div>
                    </div>
                </div>
                <div className="bottom-navbar">
                    <div className="bottom-nav-left">

                        <div className="category-dropdown" onClick={toggleCategoriesMenu}>
                            All Categories <FaChevronDown className={`down-icon ${isCategoriesMenuVisible ? "rotate" : ""}`} />
                        </div>

                    </div>
                    <div className="bottom-nav-center">

                        <div className="nav-main">
                            {mainCategories?.map(category => (
                                <div className="navlink" key={category.id}>
                                    <Link to={`/categories-page/${category.id}`} className='link'>
                                        {category.name || 'Unnamed Category'}
                                    </Link>
                                </div>
                            ))}
                        </div>

                    </div>
                    <div className="bottom-nav-right">
                        {
                            loginedUser?.length > 0 ? (
                                <>
                                    <IoLocationOutline className='location' />
                                    <select name="" id="">
                                        {
                                            address?.map((data, index) =>
                                                <option value="" key={index}>{data.localArea} {data.pincode}</option>
                                            )
                                        }
                                    </select>
                                </>
                            ) : (<></>)
                        }

                    </div>
                </div>
            </div>

            <div className="mobile-navbar-main">
                <div className="mobile-nav">
                    <div className="mob-nav-left">
                        {/* <FaBars className='bars' /> */}
                        <Link to='/'><img src="/Images/tharacart-nav-logo.svg" alt="Logo" className="nav-logo" /></Link>
                    </div>


                    <div className="mob-nav-right">
                        <div className="sign-in" data-bs-toggle="dropdown" aria-expanded="false">
                            <Link>
                                <AiOutlineUser className='nav-icon' />
                                {loginedStatus === 'loading' ? (
                                    <span>Loading...</span>
                                ) : isAuthTokenPresent && loginedUser ? (
                                    <span>{loginedUser.name}</span>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </Link>
                        </div>
                        {loginedUser ? (
                            <ul className="dropdown-menu">
                                <li>
                                    <div className="sign-in-drop-item logoutBtn" onClick={handleLogout}>Logout</div>
                                </li>
                                <li>
                                    <Link to='/my-account'><div className="sign-in-drop-item">My Profile</div></Link>
                                </li>

                            </ul>
                        ) : (
                            <ul className="dropdown-menu">
                                <li>
                                    <div className="sign-in-drop-item"><Link to='/login'>Sign In</Link></div>
                                </li>
                                <li>
                                    <div className="sign-in-drop-item B2C"><a href='https://shop.tharacart.com/login'>Sign In B2C</a></div>
                                </li>
                                <li>
                                    <div className="sign-in-drop-item signUp"><Link to='/sign-up-with-email'>Sign Up</Link></div>
                                </li>
                            </ul>
                        )}

                        <Link to='/shopping-cart'><GrCart className='cart-icon' /></Link>

                    </div>


                </div>
                <div className="nav-bottom">
                    <div className="search-bar">
                        <div className="mob-left">
                            <input
                                type="text"
                                placeholder='Search...'
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setShowSuggestions(true)}
                            />                        </div>
                        <div className="mob-right">
                            <IoSearchOutline className='lense-icon' />
                        </div>
                        {showSuggestions && searchQuery.length > 0 && (
                            <div className="search-suggestions">
                                {loading ? (
                                    <div className="loading-text" style={{ textAlign: 'center', padding: "10px" }}>Loading....</div>
                                ) : (
                                    searchSuggestions.length > 0 ? (
                                        <ul>
                                            {searchSuggestions.map((suggestion, index) => (
                                                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                                    {suggestion.name}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="no-products-found" style={{ textAlign: "center", padding: "10px" }}>No Result Found</div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchNavbar;