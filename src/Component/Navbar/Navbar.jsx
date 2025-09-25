import './Navbar.scss';
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
import useFetchUser from '../../redux/hooks/myAccountHooks/useFetchUser';
import ConfirmAlerbox from '../ConfirmAlertboxLogout/ConfirmAlerbox';

const Navbar = () => {
    const navigate = useNavigate();
    const [isCategoriesMenuVisible, setIsCategoriesMenuVisible] = useState(false);
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [key, setKey] = useState(0);

    //loader
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        // Check if the current route is the home page
        if (location.pathname !== '/') {
            // If not on the home page, hide the mega menu
            setIsCategoriesMenuVisible(false);
        }
    }, [location.pathname]);

    const toggleCategoriesMenu = () => {
        setIsCategoriesMenuVisible(!isCategoriesMenuVisible);
    };

    const { loginedUser, status: loginedStatus, isAuthTokenPresent } = UseLoginedUser();

    // const handleLogout = () => {
    //     localStorage.clear();
    //     navigate('/login');
    // };

    const handleLogout = () => {
        setShowAlert(true);
    };


    const handleConfirmLogout = () => {
        localStorage.clear();
        setShowAlert(false);
        navigate('/login');
        window.location.reload()
    };

    const handleCancelLogout = () => {
        setShowAlert(false);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const queryParam = params.get('query');
        if (queryParam) {
            setSearchQuery(decodeURIComponent(queryParam));
        }
    }, [location.search]);


    const { categories, status, error } = useCategories();
    
    const { address, status: addressStatus, error: addressError, refetch: addressRefetch } = useFetchAddress()
    const { refetch, cartProduct, status: cartStatus, error: cartError } = useCartProduct();
    const { user, status: userStatus, error: userError } = useFetchUser();



    const mainCategories = categories?.filter(cat => cat.parentCategory === cat.id);

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


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const queryParam = urlParams.get('query');
        if (queryParam) {
            setSearchQuery(queryParam);
        }
    }, []);

    const handleSuggestionClick = (suggestion) => {
        // 1. Set the search input to the selected suggestion's name
        setSearchQuery(suggestion.name);
        setShowSuggestions(false)

        // 2. Clear the suggestions list
        setSearchSuggestions('');

        // 3. Navigate to the search results page
        navigate(`/search-result-page?query=${encodeURIComponent(suggestion.name)}`);
    }

    return (
        <div className="All-navbar">
            {isCategoriesMenuVisible && <CategoriesMegaMenu />}
            <div className='NavbarMainWrapper'>
                {showAlert && (
                    <ConfirmAlerbox
                        onConfirm={handleConfirmLogout}
                        onCancel={handleCancelLogout}
                    />

                )}
                <div className="top-navbar">
                    <div className="top-left">
                        <Link to='/'><img src="/Images/tharacart-nav-logo.svg" alt="Logo" className="nav-logo" /></Link>
                    </div>
                    <div className="top-center">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setShowSuggestions(true)}
                            />
                            <img src="/Images/nav-search.svg" alt="Search" />
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
                        <div className="whishList">
                            <Link to={'/shopping-cart#whishlist-cart'}>
                                <IoHeartOutline className='nav-icon' />
                                <span className='wish-nav'>My Wishlist</span>
                            </Link>
                        </div>
                        <div className="sign-in" data-bs-toggle="dropdown" aria-expanded="false">
                            {/* <Link>
                           
                                <AiOutlineUser className='nav-icon' />
                                
                                {loginedStatus === 'loading' ? (
                                    <span>Loading...</span>
                                ) : isAuthTokenPresent || user ? (
                                    <span>{user?.name || user?.phone} </span>
                                ) : (
                                    <span className='sign-main'>Sign In</span>
                                )}
                            </Link> */}
                            <Link>
                                <AiOutlineUser className='nav-icon' />
                                {loginedStatus === 'loading' ? (
                                    <span>Loading...</span>
                                ) : isAuthTokenPresent && user ? (
                                    <span id='name-mobile'>{user.name}</span>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </Link>

                        </div>
                        {loginedUser ? (
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
                                    <div className="sign-in-drop-item B2C"><a href='https://b2b.tharacart.com/login'>Sign In B2B</a></div>
                                </li>
                                <li>
                                    <div className="sign-in-drop-item signUp"><Link to='/sign-up-with-email'>Sign Up</Link></div>
                                </li>

                            </ul>
                        )}
                        <div className="cart">
                            <Link to='/shopping-cart'><GrCart className='nav-icon' /></Link>
                           {loginedUser ? (
                             <div className="count">{cartProduct?.length}</div>
                           ):(
                            ""
                           )}
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
                                category.products.length > 0 && (
                                    <div className="navlink" key={category.id}>
                                        <Link to={`/categories-page/${category.id}/${category.name}`} className='link'>
                                            {category.name || 'Unnamed Category'}
                                        </Link>
                                    </div>
                                )

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
                            ) :
                                (<></>)
                        }

                    </div>
                </div>
            </div>

            <div className="mobile-navbar-main">
                {showAlert && (
                    <ConfirmAlerbox
                        onConfirm={handleConfirmLogout}
                        onCancel={handleCancelLogout}
                    />

                )}
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
                                ) : isAuthTokenPresent && user ? (
                                    <span id='name-mobile'>{user.name}</span>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </Link>
                        </div>
                        {loginedUser ? (
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
                                    <div className="sign-in-drop-item B2C"><a href='https://shop.tharacart.com/login'>Sign In B2B</a></div>
                                </li>
                                <li>
                                    <div className="sign-in-drop-item signUp" ><Link to='/sign-up-with-email' className='signUp-link' style={{ color: "pink" }} > Sign Up </Link></div>
                                </li>
                            </ul>
                        )}

                        <Link to='/shopping-cart'><GrCart className='cart-icon' /></Link>
                        {loginedUser ? (
                            <div className="count">{cartProduct?.length}</div>
                        ):(
                            ""
                        )}


                    </div>
                    {loginedUser ? (
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
                                <div className="sign-in-drop-item B2B" ><a href='https://b2b.tharacart.com/login'>Sign In B2B</a></div>
                            </li>
                            <li>
                                <div className="sign-in-drop-item signUp"  ><Link to='/sign-up-with-email' style={{ color: "pink" }} >Sign Up </Link></div>
                            </li>
                        </ul>
                    )}

                </div>
                {/* <div className="nav-bottom">
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
                </div> */}
            </div>
        </div>
    );
};

export default Navbar;
