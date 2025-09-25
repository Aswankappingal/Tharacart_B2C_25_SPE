import { useEffect, useState } from 'react';
import './CategoriesPage.scss';
import { MdOutlineKeyboardArrowDown, MdOutlineFavoriteBorder } from "react-icons/md";
import { HiOutlineStar } from "react-icons/hi2";
import Navbar from '../Navbar/Navbar';
import useCategories from '../../redux/hooks/HomePageHooks/useCategories';
import useAllProducts from '../../redux/hooks/allProductsHook/useAllProducts';
import { Link, useParams } from 'react-router-dom';
import useGetBrand from '../../redux/hooks/topDealsHooks/useGetBrand';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useFetchCategory from '../../redux/hooks/FetchSingleCategoryHook/useFetchSinglecategory';
import BottomBar from '../BottomBar/BottomBar';
import useWishListProducts from '../../redux/hooks/cartPageHooks/useWishListProducts';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import { FaAngleLeft } from 'react-icons/fa6';
import baseUrl from '../../baseUrl';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishList } from '../../redux/slices/cartSlices/removeWishlistProdSlice';
import { CircularProgress } from '@mui/material';
import ScrollToTopOnMount from '../ScrollToTopOnMount';
import Breadcrumb from '../BreadCrumb/BreadCrumb';



const CategoriesPage = () => {
  const [showMore, setShowMore] = useState(false);
  // const { prodId } = useParams()
  const dispatch = useDispatch()
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // New state for selected category
  const [selectedCategoryName, setSelectedCategoryName] = useState(''); // For selected category name
  const { categoryId } = useParams();
  const [sortOrder, setSortOrder] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [availability, setAvailability] = useState('');
  const { categories, status: categoriesStatus, error: categoriesError } = useCategories();
  const { AllProducts: allProducts, status: allProductsStatus, error: allProductsError } = useAllProducts();
  const { singleCategory, status, error } = useFetchCategory(categoryId);
  const [favAlertVisible, setFavAlertVisible] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [faveAlertMessage, setFavAlertMessage] = useState('Product Moved to Wishlist');
  const { status: removeWishListItemStatus, error: removeWishListItemError } = useSelector(state => state.removeWishListItem);
  const [loadingProductId, setLoadingProductId] = useState(null);
  //test
  const [parentCategory, setparent] = useState('');


  // const basePath = [
  //   { label: 'Home', link: '/' },
  //   { label: 'Shop', link: '/shop' },
  // ];
  // useEffect (()=>{
  //   console.log("parent",parentCategory);
  // },[])



  useEffect(() => {

    console.log('products', allProducts);

    if (categories && categoryId) {
      // Filter subcategories where parentCategory matches the current categoryId
      const filtered = categories.filter(category => category.parentCategory === categoryId && category.id !== categoryId
      );
      setFilteredCategories(filtered);
    } else if (categories) {
      // For cases where no parentCategory is provided, show top-level categories
      const topLevelCategories = categories.filter(category => !category.parentCategory);
      setFilteredCategories(topLevelCategories);
    }
  }, [categories, categoryId]);



  // const filteredSubCategories = categories.filter(
  //   (sub) => sub.parentCategory === selectedCategory && sub.id !== selectedCategory
  // );
  // useEffect(()=>{
  //   console.log('====================================');
  //   console.log(filteredSubCategories);
  //   console.log('====================================');
  // })



  const CategorySlidesToShow = (length) => {
    if (length === 1) return 1;
    if (length === 2) return 2;
    if (length === 3) return 3;
    if (length === 4) return 4;
    if (length === 5) return 5;
    if (length === 6) return 6;
    return 7; // Default for lengths greater than 4
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 900,
    slidesToShow: CategorySlidesToShow(filteredCategories.length),
    slidesToScroll: 7,
    autoplay: true,
    autoplaySpeed: 3000,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 400,
        settings: {
          dots: false,
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };
  useEffect(() => {
    // console.log(singleCategory);
  }, [singleCategory])

  // useEffect(() => {
  //   if (categories && categoryId) {
  //     // Filter categories based on the current categoryId
  //     const filtered = categories.filter(category => category.parentCategory === categoryId);
  //     setFilteredCategories(filtered);
  //   } else if (categories) {
  //     // Filter top-level categories
  //     const topLevelCategories = categories.filter(category => !category.parentCategory);
  //     setFilteredCategories(topLevelCategories);
  //   }
  // }, [categories, categoryId]);

  useEffect(() => {
    if (allProducts) {
      let productsInCategory;

      if (selectedCategory) {
        // Filter products based on the selected category
        productsInCategory = allProducts?.filter(product => product.categoryIds.includes(selectedCategory));
      } else if (categoryId) {
        // If a parent category is selected but no specific child category, show products for the parent category
        productsInCategory = allProducts?.filter(product => product.categoryIds.includes(categoryId));
      } else {
        // If no categoryId, show all products
        productsInCategory = allProducts;
      }

      // Apply sorting
      const sortedProducts = sortProducts(productsInCategory, sortOrder);
      setFilteredProducts(sortedProducts);
    }
  }, [allProducts, selectedCategory, categoryId, sortOrder]);

  // useEffect (()=>{
  //   console.log("products",allProducts);

  // },[])

  const toggleShowMore = () => {
    setShowMore(prevShowMore => !prevShowMore);
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    setSelectedCategory(categoryId);
    setSelectedCategoryName(categoryName);
  };

  const sortProducts = (products, sortOrder) => {
    switch (sortOrder) {
      case 'low-to-high':
        return [...products].sort((a, b) => a.sellingPrice - b.sellingPrice);
      case 'high-to-low':
        return [...products].sort((a, b) => b.sellingPrice - a.sellingPrice);
      default:
        return products;
    }
  };

  const handleSortChange = (event) => {
    const selectedSortOrder = event.target.value;
    setSortOrder(selectedSortOrder); // Update sortOrder state
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);



  const calculateAverageRating = (ratings) => {
    const { oneRating, twoRating, threeRating, fourRating, fiveRating } = ratings;
    const totalRatings = oneRating + twoRating + threeRating + fourRating + fiveRating;
    if (totalRatings === 0) return 0;
    const averageRating = (
      (oneRating * 1) + (twoRating * 2) + (threeRating * 3) + (fourRating * 4) + (fiveRating * 5)
    ) / totalRatings;
    return averageRating.toFixed(1);
  };

  const { brands, status: brandStatus, error: brandError } = useGetBrand();

  const handleAvailabilityChange = (e) => {
    setAvailability(e.target.value);
  };

  const getFilteredProducts = () => {
    return filteredProducts
      .filter(product => !selectedBrand || product.brandId === selectedBrand)
      .filter(product => {
        if (availability === 'in-stock') {
          return product.stock > 0;
        } else if (availability === 'out-of-stock') {
          return product.stock <= 0;
        }
        return true;
      })
      .filter(product => {
        if (selectedRating) {
          const averageRating = calculateAverageRating(product);
          return averageRating === parseFloat(selectedRating).toFixed(1);
        }
        return true;
      })

  };





  const { wishListProduct, status: wishlisStatus, error: wishlistError, refetch: wishListRefetch } = useWishListProducts();

  const handleRatingChange = (e) => {
    setSelectedRating(e.target.value);
  }

  const addToWishList = async (productId) => {
    try {
      setLoadingProductId(productId);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setFavAlertMessage('Authentication error. Please log in.');
        setFavAlertVisible(true);
        setTimeout(() => setFavAlertVisible(false), 4000);
        return;
      }

      const res = await axios.post(
        `${baseUrl}/add-to-wishlist`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        console.log(res.data);

        setFavAlertMessage('Product Moved to Wishlist');
        setIsInWishlist(true); // Update state to show filled heart icon
        wishListRefetch(); // Optionally refetch the wishlist to sync the state
      } else if (res.status === 400) {
        setFavAlertMessage('Product already in wishlist');
        setIsInWishlist(true); // Assuming product is already in wishlist, set filled heart
      }
      setFavAlertVisible(true);
      setTimeout(() => setFavAlertVisible(false), 4000);
    } catch (error) {
      setFavAlertMessage('Failed to move item to wishlist. Please try again.');
      setFavAlertVisible(true);
      setTimeout(() => setFavAlertVisible(false), 4000);
    } finally {
      setLoadingProductId(null);
    }
  };

  // remove wishlist
  const removeWishListProd = async (productId) => {
    try {
      setLoadingProductId(productId)
      await dispatch(removeFromWishList(productId));
      wishListRefetch();
    } catch (error) {
      console.log(error);

    }
    finally {
      setLoadingProductId(null); // Remove loader after operation
    }
  }

  const [hotCategory, setHotCategory] = useState([]);

  // useEffect(() => {
  //   setHotCategory(filteredCategories);
  // }, [categories]);


  // useEffect(
  //   () => {
  //     console.log(filteredCategories,"Filtered-Categories");
  //   },[])




  // useEffect(() => {
  //   if (wishlisStatus === 'succeeded' && wishListProduct) {
  //     const isProductInWishlist = wishListProduct.some(item => item.productId === prodId);
  //     setIsInWishlist(isProductInWishlist); // Update the state based on wishlist data
  //   }
  // }, [wishlisStatus, wishListProduct, prodId]);
  if (categoriesStatus === 'loading' || allProductsStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (categoriesStatus === 'failed' || allProductsStatus === 'failed') {
    return <div>Error: {categoriesError?.message || allProductsError?.message}</div>;
  }






  return (
    <div className='categories-main-page'>
      <ScrollToTopOnMount />
      <Navbar />

      <div className="breadCrumb">
        <Breadcrumb
          basePath={[{ label: 'Home', link: '/' }]}
          replacements={{ "Cooking%20Essentials": 'Cooking Essentials', "Packaged%20Food": 'Packaged Food', "Tea%20&%20Beverages": 'Tea and Beverges', "Oil%20&%20Ghee": 'Oil and Ghee', "Spices%20&%20Masalas": 'Spice Masalas', "Noodles%20&%20Pasta": 'Noodles & Pasta', "Chocolates%20&%20Sweets": 'Chocolates and Sweet', "Snacks%20&%20Biscuits": 'snacks & Biscuits' }}
        />
      </div>

      <div style={{ width: '100%' }}>
        <div className="category-homepage">
          <div className="category-list">
            <div className="category-head">
              <Link className='back' to='/'>
                <div className="arrow-icon">
                  <FaAngleLeft style={{ color: 'white' }} />
                </div>
              </Link>
              <div className="category-title" id='title'>
                <h1>Shop By Popular Categories</h1>
                {/* {filteredCategories.length > 7 && (
                <div className="seemore" onClick={toggleShowMore}>
                  <h1>See More <span><MdOutlineKeyboardArrowDown className={`uparrow ${showMore ? "downarrow" : ""}`} /></span></h1>
                </div>
              )} */}
              </div>

            </div>

            <div className="category-container">
              <Slider {...settings}>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => {
                    const hasInnerCategories = categories.some(
                      (cat) => cat.parentCategory === category.id
                    );
                    return hasInnerCategories ? (
                      <Link
                        to={`/categories-page/${category.id}/${category.name}`}

                      >
                        <div key={category.id}
                          className={`category-items ${selectedCategory === category.id ? 'selected' : ''}`}
                          onClick={() => handleCategoryClick(category.id, category.name)}
                        >

                          <div className="cat-img">
                            <img src={category.categoryIcon} alt={category.name} />
                          </div>


                        </div>
                        <div className="category-name">
                          <p>{category.name}</p>
                        </div>
                      </Link>
                    ) : (
                      <Link>
                        <div key={category.id}
                          className={`category-items ${selectedCategory === category.id ? 'selected' : ''}`}
                          onClick={() => handleCategoryClick(category.id, category.name)} >

                          <div className="cat-img">
                            <img src={category.categoryIcon}
                              alt={category.name} />
                          </div>


                        </div>
                        <div className="category-name">
                          <p>
                            {category.name}
                          </p>
                        </div>
                      </Link>

                    )

                  })
                ) : (
                  ""
                )}
              </Slider>
            </div>

            {/* {showMore && (
              <div className="category-container">
                {filteredCategories.slice(7).map((category) => (
                  <div key={category.id} className={`category-items ${selectedCategory === category.id ? 'selected' : ''}`} onClick={() => handleCategoryClick(category.id, category.name)}>
                    <div className="cat-img">
                    <img src={category.categoryIcon} alt={category.name} />
                    </div>
                    <p>{category.name}</p>
                  </div>
                ))}
              </div>
            )} */}
            {/* url("/Images/brand page .png") */}
          </div>
        </div>
        {singleCategory?.categoryBanner ? (<div
          className="category-banner"
          style={{
            backgroundImage: singleCategory?.categoryBanner
              ? `url(${singleCategory?.categoryBanner})`
              : `url("/Images/brand page banner.png")`,
            backgroundSize: "cover",
            backgroundPosition: "center", // Ensures proper centering of the image
            backgroundRepeat: "no-repeat", // Prevents tiling of the image
          }}
        >
          {/* Optionally, add a fallback message or content */}
        </div>) : ""}
      </div>

      <div className="categories-main-body">
        <div className='SearchResultPage-wrapper'>
          <div className="search-result-body">
            <div className="search-home">
              <div className="show-result">
                <h4><span>Showing 1-{filteredProducts.length} of {filteredProducts.length} results</span><span></span>{selectedCategoryName}</h4>
              </div>

              <div className="selecter-filter">
                <div className="filter-row1">
                  <div className="filter-1">
                    <select
                      value={sortOrder}
                      onChange={handleSortChange}
                    >
                      <option id='optionHeading' value="">Sort by</option>
                      <option value="low-to-high">Price - Low to High</option>
                      <option value="high-to-low">Price - High to Low</option>
                    </select>
                  </div>
                  <div className="filter-2">
                    <select name="brand" id="brand" onChange={(e) => setSelectedBrand(e.target.value)} value={selectedBrand}>
                      <option value="">Brand</option>
                      {brands?.map(brand => (
                        <option key={brand.brandId} value={brand.brandId}>{brand.brandName}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="filter-row2">
                  <div className="filter-3">
                    <select name="availability" id="availability" onChange={handleAvailabilityChange} value={availability}>
                      <option value="">Availability</option>
                      <option value="in-stock">In stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </div>
                  <div className="filter-4">
                    <select name="rating" id="rating" onChange={handleRatingChange} value={selectedRating}>
                      <option value="">Rating</option>
                      <option value="1">Rating ★</option>
                      <option value="2">Rating ★★</option>
                      <option value="3">Rating ★★★</option>
                      <option value="4">Rating ★★★★</option>
                      <option value="5">Rating ★★★★★</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="Products-main-body">
                <div className="container-fluid">
                  <div className="row">
                    {getFilteredProducts().length === 0 ? (
                      <div className="no-products">
                        <p style={{ textAlign: "center", padding: "3rem", fontSize: "20px" }}>No products available in {selectedCategoryName} category</p>
                      </div>
                    ) : (
                      getFilteredProducts()?.map((data, index) => {
                        // console.log("Displaying product:", data);
                        const averageRating = calculateAverageRating(data);
                        const sellingPrice = data.offerPrice;
                        const originalPrice = data.price;
                        const offerPercentage = originalPrice
                          ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
                          : 0;
                        // Check if the current product is in the wishlist
                        const isInWishlist = wishListProduct?.some(item => item.productId === data.productId);

                        // console.log(getFilteredProducts);









                        return (
                          <div className="col-6 col-lg-3" key={index} style={{ marginBottom: "10px" }}>
                            <Link >
                              <div className="product-card">
                                <div className="card-upper">
                                  <div>
                                    {loadingProductId === data.productId ? ( // Check if wishlist status is 'loading'
                                      <span className="loader"></span> // Show loader while fetching wishlist
                                    ) : isInWishlist ? (
                                      <IoIosHeart
                                        className="fav-icon filled"
                                        style={{ color: 'red' }}
                                        onClick={() => removeWishListProd(data.productId)}
                                      />
                                    ) : (
                                      <IoIosHeartEmpty
                                        className="fav-icon"
                                        onClick={() => addToWishList(data.productId)}
                                      />
                                    )}
                                    {/* <div className="best-seller">
                                      <h5>Best Seller</h5>
                                    </div> */}
                                  </div>
                                  <div className="best-seller">
                                    <h5>Best Seller</h5>
                                  </div>

                                </div>
                                <Link to={`/product-page/${data.productId}`}>
                                  <div className="prod-card-inner">
                                    <div className="product-image">
                                      <img src={data.imageUrls[0]} alt={data.name} />
                                    </div>
                                    <div className="product-details">
                                      <div className="product-title">
                                        <p>{data.name.length > 20 ? `${data.name.slice(0, 65)}...` : data.name}</p>
                                      </div>
                                      <div className="product-price">
                                        <div className="exact-price">
                                          <h1>₹{sellingPrice.toFixed(2)}</h1>
                                        </div>
                                        <div className="before-price">
                                          {originalPrice && (
                                            <h3><strike>₹{originalPrice.toFixed(2)}</strike></h3>
                                          )}
                                        </div>
                                        <div className="offer">
                                          {offerPercentage > 0 && (
                                            <h3>{offerPercentage}% OFF</h3>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="product-rating">
                                      <HiOutlineStar className='HiOutlineStar-icon' /><span>{averageRating}</span>
                                    </div>
                                    <div className="product-card-bottom">
                                      <div className="sponsered">
                                        <h4>Sponsored</h4>
                                      </div>
                                      {data.stock <= 0 && (
                                        <div className="out-of-stock-overlay">
                                          <span>Out of Stock</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </Link>




                              </div>
                            </Link>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <BottomBar />
    </div>

  );
};

export default CategoriesPage;
