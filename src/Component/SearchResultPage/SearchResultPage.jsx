import React, { useState, useEffect } from 'react';
import './SearchResultPage.scss';
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { HiOutlineStar } from "react-icons/hi2";
import SearchresultSidebar from '../LeftMenuBar/SearchresultSidebar';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { MdKeyboardArrowDown } from "react-icons/md";
import useGetBrand from '../../redux/hooks/topDealsHooks/useGetBrand';
import baseUrl from '../../baseUrl';
import SearchNavbar from '../SearchResultNavbar/SearchNavbar';
import { FaAngleLeft } from 'react-icons/fa6';

const SearchResultPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedSort, setSelectedSort] = useState('Price: Low to High');
    const [availability, setAvailability] = useState([]);
    const [selectedBrandId, setSelectedBrandId] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isBrandOpen, setisBrandOpen] = useState(false);
    const [isOpenStock, setIsOpenStock] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');

    const { brands, status: brandsStatus, error: brandsError } = useGetBrand();

    const [hasRatingSelection, setHasRatingSelection] = useState(false);
    const [hasStockSelection, setHasStockSelection] = useState(false);
    const [hasSelection, setHasSelection] = useState(false);

    // Debug function to check product data
    const logProductData = (data) => {
        console.log("Product data received:", data);
        if (data && data.length > 0) {
            console.log("First product sample:", data[0]);
            console.log("Total products:", data.length);
        } else {
            console.log("No products found in response");
        }
    };

    // Fetch products from the backend
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log("Fetching products with query:", query);
                const response = await axios.get(`${baseUrl}/getSearchProd`, {
                    params: { q: query }
                });
                
                logProductData(response.data);
                
                if (response.data && Array.isArray(response.data)) {
                    setProducts(response.data);
                    setFilteredProducts(response.data);
                } else {
                    console.error('Invalid response format:', response.data);
                    setError('Invalid data format received from server');
                    setProducts([]);
                    setFilteredProducts([]);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to fetch products. Please try again.');
                setProducts([]);
                setFilteredProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchProducts();
        }
    }, [query]);

    // Handle brands change
    const handleBrandsChange = (event) => {
        const brandId = event.target.value;

        setSelectedBrandId((prev) => {
            let updated;
            if (event.target.checked) {
                updated = [...prev, brandId];
            } else {
                updated = prev.filter((id) => id !== brandId);
            }

            setHasSelection(updated.length > 0);
            return updated;
        });
    };

    // Apply all filters together
    useEffect(() => {
        if (!products || products.length === 0) return;
        
        let result = [...products];
        
        // Apply brand filter if any selected
        if (selectedBrandId.length > 0) {
            result = result.filter(product => 
                selectedBrandId.includes(product.brandId)
            );
        }
        
        // Apply availability filter
        if (availability.length > 0) {
            const hasInStock = availability.includes('in-stock');
            const hasOutOfStock = availability.includes('out-of-stock');
            
            if (hasInStock && !hasOutOfStock) {
                result = result.filter(product => product.stock > 0);
            } else if (!hasInStock && hasOutOfStock) {
                result = result.filter(product => product.stock <= 0);
            }
        }
        
        // Apply rating filter
        if (selectedRatings.length > 0) {
            result = result.filter(product => 
                selectedRatings.some(rating => 
                    Math.round(calculateAverageRating(product)) >= parseInt(rating)
                )
            );
        }
        
        // Apply sorting
        if (selectedSort === 'Price: Low to High') {
            result.sort((a, b) => a.sellingPrice - b.sellingPrice);
        } else if (selectedSort === 'Price: High to Low') {
            result.sort((a, b) => b.sellingPrice - a.sellingPrice);
        }
        
        setFilteredProducts(result);
    }, [products, selectedBrandId, availability, selectedRatings, selectedSort]);

    // Stock filter handlers
    const handleStockChange = (event) => {
        const value = event.target.value;

        setAvailability((prev) => {
            let updatedAvailability;

            if (event.target.checked) {
                updatedAvailability = [...prev, value];
            } else {
                updatedAvailability = prev.filter((item) => item !== value);
            }

            setHasStockSelection(updatedAvailability.length > 0);
            return updatedAvailability;
        });
    };

    // Calculate average rating
    const calculateAverageRating = (product) => {
        if (!product.oneRating && !product.twoRating && !product.threeRating && 
            !product.fourRating && !product.fiveRating) {
            return 0;
        }
        
        const { oneRating = 0, twoRating = 0, threeRating = 0, fourRating = 0, fiveRating = 0 } = product;
        const totalRatings = oneRating + twoRating + threeRating + fourRating + fiveRating;
        
        if (totalRatings === 0) return 0;
        
        const averageRating = (
            (oneRating * 1) + (twoRating * 2) + (threeRating * 3) + (fourRating * 4) + (fiveRating * 5)
        ) / totalRatings;
        
        return averageRating.toFixed(1);
    };

    // Handle sorting
    const handleSortChange = (e) => {
        setSelectedSort(e.target.value);
    };

    // Rating filter handlers
    const handleCheckboxChange = (event) => {
        const value = event.target.value;

        setSelectedRatings((prev) => {
            let updatedRatings;

            if (event.target.checked) {
                updatedRatings = [...prev, value];
            } else {
                updatedRatings = prev.filter((item) => item !== value);
            }

            setHasRatingSelection(updatedRatings.length > 0);
            return updatedRatings;
        });
    };

    // UI toggle handlers
    const toggleDropdown = () => setIsOpen(!isOpen);
    const toggleBrandDropdown = () => setisBrandOpen(!isBrandOpen);
    const toggleStockDropdown = () => setIsOpenStock(!isOpenStock);

    // Render product card
    const renderProductCard = (product) => {
        const averageRating = calculateAverageRating(product);
        
        return (
            <div className="col-lg-3 demo" key={product.id || product.productId} style={{ marginBottom: "10px" }}>
                <Link to={`/product-page/${product.productId}`}>
                    <div className="product-card">
                        {product.bestSeller && (
                            <div className="best-seller">
                                <h5>Best Seller</h5>
                            </div>
                        )}
                        <div className="favourate-icon">
                            <MdOutlineFavoriteBorder />
                        </div>
                        <div className="product-image">
                            <img 
                                src={product.imageUrls || product.image || product.images?.[0] || ''}
                                alt={product.name} 
                            />
                        </div>
                        <div className="product-details">
                            <div className="product-title">
                                <p>{product.name}</p>
                            </div>
                            <div className="product-price">
                                <div className="exact-price">
                                    <h1>₹ {product.sellingPrice}</h1>
                                </div>
                                <div className="before-price">
                                    <h3><strike>₹ {product.price}</strike></h3>
                                </div>
                                {product.price > product.sellingPrice && (
                                    <div className="offer">
                                        <h3>
                                            {Math.round(((product.price - product.sellingPrice) / product.price) * 100)}% OFF
                                        </h3>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="product-rating">
                            <HiOutlineStar className="HiOutlineStar-icon" />
                            <span>{averageRating}</span>
                        </div>

                        {(product.stock !== undefined && product.stock <= 0) && (
                            <div className="out-of-stock-label">
                                Out of Stock
                            </div>
                        )}
                        {product.sponsored && (
                            <div className="sponsered">
                                <h4>Sponsored</h4>
                            </div>
                        )}
                    </div>
                </Link>
            </div>
        );
    };

    if (brandsStatus === 'loading') return <p>Loading brands...</p>;
    if (brandsStatus === 'error') return <p>Error loading brands: {brandsError}</p>;

    return (
        <div className='SearchResultPage-wrapper'>
            <SearchNavbar />

            <div className="search-result-body">
                <div className="slide-bar-left">
                    <SearchresultSidebar />
                </div>
                <div className="search-home">
                    <div className="show-result">
                        <Link to={'/'} className='Show-result-linker'>
                            <div className="arrow-icon">
                                <FaAngleLeft style={{ color: 'white' }} />
                            </div>
                        </Link>

                        <h4>
                            <span>Showing {filteredProducts.length} results</span> for "{query}"
                        </h4>
                    </div>

                    <div className="selecter-filter">
                        {/* Sorting */}
                        <div className="brand-sort-m">
                            <div className="filter-1">
                                <div className="dropdown">
                                    <div className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                        Sort:
                                    </div>
                                    <ul className="dropdown-menu">
                                        <li className="dropdown-item">
                                            <input
                                                type="radio"
                                                name="sort"
                                                id="low-to-high"
                                                value="Price: Low to High"
                                                checked={selectedSort === 'Price: Low to High'}
                                                onChange={handleSortChange}
                                            />
                                            <label htmlFor="low-to-high">Price: Low to High</label>
                                        </li>
                                        <li className="dropdown-item">
                                            <input
                                                type="radio"
                                                name="sort"
                                                id="high-to-low"
                                                value="Price: High to Low"
                                                checked={selectedSort === 'Price: High to Low'}
                                                onChange={handleSortChange}
                                            />
                                            <label htmlFor="high-to-low">Price: High to Low</label>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className={`filter-2 ${hasSelection ? "has-selection" : ""}`}>
                                <button
                                    onClick={toggleBrandDropdown}
                                    className={`dropdown-btn ${selectedBrandId.length > 0 ? "selected" : ""}`}
                                >
                                    <label>Brand</label>
                                    <span className={`rating-arrow ${isBrandOpen ? "open" : ""}`}>
                                        <MdKeyboardArrowDown />
                                    </span>
                                </button>

                                {isBrandOpen && (
                                    <div className="dropdown">
                                        {brands.map((brand) => (
                                            <div key={`brand-${brand.brandId}`} className="checkbox-item">
                                                <input
                                                    type="checkbox"
                                                    id={`brand-${brand.brandId}`}
                                                    value={brand.brandId}
                                                    checked={selectedBrandId.includes(brand.brandId)}
                                                    onChange={handleBrandsChange}
                                                />
                                                <label htmlFor={`brand-${brand.brandId}`}>{brand.brandName}</label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="demo-two-drop">
                            <div
                                className={`filter-3 ${hasStockSelection ? "has-selection" : ""}`}
                                style={{
                                    border: hasStockSelection ? "2px solid #571089" : "1px solid  #7f7f7f",
                                }}
                            >
                                <button
                                    onClick={toggleStockDropdown}
                                    className={`dropdown-btn ${availability.includes('in-stock') ? 'selected' : ''}`}
                                >
                                    <label>Availability</label>
                                    <span className={`rating-arrow ${isOpenStock ? 'open' : ''}`}>
                                        <MdKeyboardArrowDown />
                                    </span>
                                </button>

                                {isOpenStock && (
                                    <div className="dropdown">
                                        <div
                                            className={`checkbox-item ${availability.includes('in-stock') ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                id="in-stock"
                                                value="in-stock"
                                                checked={availability.includes('in-stock')}
                                                onChange={handleStockChange}
                                            />
                                            <label htmlFor="in-stock">In Stock</label>
                                        </div>
                                        <div
                                            className={`checkbox-item ${availability.includes('out-of-stock') ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                id="out-of-stock"
                                                value="out-of-stock"
                                                checked={availability.includes('out-of-stock')}
                                                onChange={handleStockChange}
                                            />
                                            <label htmlFor="out-of-stock">Out of Stock</label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div
                                className={`filter-4 ${hasRatingSelection ? "has-selection" : ""}`}
                                style={{
                                    border: hasRatingSelection ? "1px solid #571089" : "1px solid #7f7f7f",
                                }}
                            >
                                <div className="rating-dropdown">
                                    <button onClick={toggleDropdown} className="rating-dropdown-btn">
                                        {selectedRatings.length > 0
                                            ? `${selectedRatings.join(', ')} Rating`
                                            : 'Ratings'}
                                        <span className={`rating-arrow ${isOpen ? 'open' : ''}`}>
                                            <MdKeyboardArrowDown />
                                        </span>
                                    </button>

                                    {isOpen && (
                                        <div className="rating-dropdown-content">
                                            <label className="rating-option">
                                                <input
                                                    type="checkbox"
                                                    value="1"
                                                    onChange={handleCheckboxChange}
                                                    checked={selectedRatings.includes('1')}
                                                />
                                                1 & Up Rating
                                            </label>
                                            <label className="rating-option">
                                                <input
                                                    type="checkbox"
                                                    value="2"
                                                    onChange={handleCheckboxChange}
                                                    checked={selectedRatings.includes('2')}
                                                />
                                                2 & Up Rating
                                            </label>
                                            <label className="rating-option">
                                                <input
                                                    type="checkbox"
                                                    value="3"
                                                    onChange={handleCheckboxChange}
                                                    checked={selectedRatings.includes('3')}
                                                />
                                                3 & Up Rating
                                            </label>
                                            <label className="rating-option">
                                                <input
                                                    type="checkbox"
                                                    value="4"
                                                    onChange={handleCheckboxChange}
                                                    checked={selectedRatings.includes('4')}
                                                />
                                                4 & Up Rating
                                            </label>
                                            <label className="rating-option">
                                                <input
                                                    type="checkbox"
                                                    value="5"
                                                    onChange={handleCheckboxChange}
                                                    checked={selectedRatings.includes('5')}
                                                />
                                                5 & Up Rating
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="Products-main-body">
                        <div className="container-fluid">
                            {loading ? (
                                <div className="text-center my-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2">Loading products...</p>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            ) : (
                                <div className="row">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map(product => renderProductCard(product))
                                    ) : (
                                        <div className="col-12 text-center my-5">
                                            <p>No products found matching your search criteria.</p>
                                            <p>Try adjusting your filters or search with different keywords.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SearchResultPage;