import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineHome } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { AiOutlineUser } from 'react-icons/ai';
import './BottomBar.scss';
import useCartProduct from '../../redux/hooks/cartPageHooks/useCartProduct';
import baseUrl from '../../baseUrl';
import axios from 'axios';
import UseLoginedUser from '../../redux/hooks/NavbarHook/UseLoginedUser';
import useFetchUser from '../../redux/hooks/myAccountHooks/useFetchUser';

const BottomBar = () => {
    const { cartProduct } = useCartProduct();
    const navigate = useNavigate();

    const [searchIsVisible, setSearchIsVisible] = useState(false);
    const [searchAnimation, setSearchAnimation] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showBar, setShowBar] = useState(false);

    const { loginedUser, status: loginedStatus, isAuthTokenPresent } = UseLoginedUser();
    const { user, status: userStatus, error: userError } = useFetchUser();


    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) { // Show bar after scrolling 50px
                setShowBar(true);
            } else {
                setShowBar(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearchOpen = () => {
        setSearchAnimation('fade-in');
        setSearchIsVisible(true); // Show the layer
    };

    const handleSearchClose = () => {
        setSearchAnimation('fade-out');
        setTimeout(() => setSearchIsVisible(false), 300); // Wait for fade-out to complete
    };

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

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const queryParam = urlParams.get('query');
        if (queryParam) {
            setSearchQuery(queryParam);
        }
    }, []);

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.name); // This line already sets the product name in search bar
        setShowSuggestions(false);
        setSearchQuery(''); // Remove this line if it exists
        navigate(`/search-result-page?query=${encodeURIComponent(suggestion.name)}`);
    };

    return (
        <div className={`bottom-barMain ${showBar ? 'visible' : ''}`}>
            <div className="bottom-bar">
                {searchIsVisible && (
                    <div className={`searhLayer ${searchAnimation}`}>
                        <div className="upper-head">
                            <div className="heading"><p>Search Our Store</p></div>
                            <div onClick={handleSearchClose}><IoClose style={{ fontSize: "18px" }} /></div>
                        </div>
                        <div className="searchMain">
                            <div className="search-bar">
                                <input
                                    type="text"
                                    placeholder='Search Products'
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => setShowSuggestions(true)}
                                />
                                <div className="mob-right">
                                    <IoSearchOutline className='lense-icon' />
                                </div>

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
                )}
                <div className="bottom-bar-item">
                    <Link to="/"><span className="home"><HiOutlineHome className="home-icon" /></span></Link>
                </div>
                <div className="part-bar"></div>
                <div className="bottom-bar-item" onClick={handleSearchOpen}>
                    <Link><span className="home"><CiSearch className="home-icon" /></span></Link>
                </div>
                <div className="part-bar"></div>
                <div className="bottom-bar-item">
                    <div className={`cart ${cartProduct?.length > 0 ? 'has-items' : ''}`}>
                        <Link to="/shopping-cart">
                            <span className="home">
                                <IoCartOutline className="home-icon" />
                            </span>
                        </Link>
                        {(user || loginedUser) && cartProduct?.length > 0 && (
                            <p className="count">{cartProduct.length}</p>
                        )}
                    </div>
                </div>
                <div className="part-bar"></div>
                <div className="bottom-bar-item">
                    <Link to='/my-account'><span className="home"><AiOutlineUser className="home-icon" /></span></Link>
                </div>
            </div>
        </div>
    );
};

export default BottomBar;
