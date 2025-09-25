import './HomePage.scss'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState, useMemo } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { FaArrowRight } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa6";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import useCategories from '../../redux/hooks/HomePageHooks/useCategories';
import useTopDeals from '../../redux/hooks/HomePageHooks/useTopDeals';
import useLimitedTimeDeal from '../../redux/hooks/HomePageHooks/useLimitedTimeDeal';
import useFeacturedBrand from '../../redux/hooks/HomePageHooks/useFeacturedBrand';
import useTopStores from '../../redux/hooks/HomePageHooks/useTopStores';
import useNewArrival from '../../redux/hooks/HomePageHooks/useNewArrival';
import useFeaturedProducts from '../../redux/hooks/HomePageHooks/useFeaturedProducts';
import useTopBrand from '../../redux/hooks/HomePageHooks/useTopBrand';
import useFetchDiscount from '../../redux/hooks/HomePageHooks/useFetchDiscount';
import useFetchBanners from '../../redux/hooks/HomePageHooks/useHomeBanner.js';
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import BottomBar from '../BottomBar/BottomBar';
import useAllProducts from '../../redux/hooks/allProductsHook/useAllProducts.js';



const HomePage = () => {
  // const dispatch = useDispatch();




  const sliderRef = useRef(null);
  const topBrandSlideRef = useRef(null);
  const limtedSlideRef = useRef(null);
  const visitedProdSlidRef = useRef(null);
  const [timers, setTimers] = useState({});
  const [hotCategory, setHotCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const { categories, status: categoriesStatus, error: categoriesError } = useCategories();
  const { topDeals, status: topDealsStatus, error: topDealsError } = useTopDeals();
  const { limitedTimeDeals, status: limitedTimeDealsStatus, error: limitedTimeDealsError } = useLimitedTimeDeal();
  const { featuredBrands, status: featuredBrandsStatus, error: featuredBrandsError } = useFeacturedBrand();
  const { topStores, status: topStoresStatus, error: topStoresError } = useTopStores();
  const { newArrivals, status: newArrivalsStatus, error: newArrivalsError } = useNewArrival();
  const { featuredProducts, status: featuredProductsStatus, error: featuredProductsError } = useFeaturedProducts();
  const { topBrand, status: topBrandStatus, error: topBrandError } = useTopBrand();

  useEffect(() => {

    console.log("this is the top brands", topBrand);

  }, [])


  const { AllProducts: allProducts, status: allProductsStatus, error: allProductsError } = useAllProducts();


  // const { AllProducts: allProducts, status: allProductsStatus, error: allProductsError } = allProducts();


  const { discounts, status: discountStatus } = useFetchDiscount();

  useEffect(() => {
    console.log("dissooosososo", discounts);

  }, [])


  ///my
  const navigate = useNavigate();
  const { banners, bannerSloading, bannerror } = useFetchBanners();

  // useEffect(() => {
  //   console.log("Feautred", featuredProducts);
  // }, [])

  // useEffect(() => {
  //   console.log("newarrivalsssss", newArrivals);
  // }, [newArrivals])


  // const handleBannerClick = (banner) => {
  //   if (banner.dealType === 'Category' && banner.selectedValue?.length > 0) {
  //     navigate(`/banner/${banner.selectedValue[0]}`);
  //   } else if (banner.dealType === 'Products' && banner.selectedValue?.length > 0) {
  //     navigate(`/products/${banner.selectedValue[0]}`);
  //   }
  // };





  const filteredCategories = categories.filter((data) => data.id === data.parentCategory);

  useEffect(() => {
    setHotCategory(filteredCategories);
    console.log(filteredCategories, "thiss is fltred");

  }, [categories]);

  const filteredTopBrands = topBrand.filter(brand =>
    allProducts.some(product => product.brandId === brand.brandId)
  );

  useEffect(() => {

    console.log("the filtered top brands ", filteredTopBrands);

  }, [])



  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true, // Allow free scrolling     
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
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
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };
  const hotCatSlidesToShow = (length) => {
    if (length === 1) return 1;
    if (length === 2) return 2;
    if (length === 3) return 3;
    if (length === 4) return 4;
    if (length === 5) return 5;
    if (length === 6) return 6;
    if (length === 7) return 7;
    return 8; // Default for lengths greater than 4
  };
  const hotCatSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: hotCatSlidesToShow(filteredCategories.length),
    slidesToScroll: 1,
    swipeToSlide: true, // Allow free scrolling     
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: hotCatSlidesToShow(filteredCategories.length),
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: hotCatSlidesToShow(filteredCategories.length),
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }
    ]
  };


  const topDealsSlidesToShow = (length) => {
    if (length === 1) return 1;
    if (length === 2) return 2;
    if (length === 3) return 3;
    if (length === 4) return 4;
    return 4; // Default for lengths greater than 4
  };
  const topDealsSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: topDealsSlidesToShow(topDeals.length),
    slidesToScroll: 1,
    swipeToSlide: true, // Allow free scrolling     
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        }
      },
      {
        breakpoint: 981,
        settings: {

          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
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





  const discountSlidesToShow = (length) => {
    // Show 1 slide if there's only 1 item, otherwise 2 slides
    return length === 1 ? 1 : 2;
  };

  const discountSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: discountSlidesToShow(discounts.length), // Determine slides based on discounts length
    slidesToScroll: 1,
    responsive: [
      // {
      //   breakpoint: 1499,
      //   settings: {
      //     slidesToShow: discountSlidesToShow(discounts.length), // Adjust based on discounts length
      //     slidesToScroll: 1,
      //     infinite: true,
      //   },
      // },
      // {
      //   breakpoint: 991,
      //   settings: {
      //     slidesToShow: discountSlidesToShow(discounts.length), // Adjust for medium screens
      //     slidesToScroll: 4,
      //     infinite: true,
      //   },
      // },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1, // Always show 1 slide on small screens
          slidesToScroll: 1,
        },
      },
    ],
  };

  ///discount-end

  const featuredBrandsSlidesToShow = (length) => {
    if (length === 1) return 1;
    if (length === 2) return 2;
    if (length === 3) return 3;
    if (length === 4) return 4;
    return 5; // Default for lengths greater than 4
  };

  const featuredBrandsSettigs = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: featuredBrandsSlidesToShow(featuredBrands.length),
    slidesToScroll: 2,
    swipeToSlide: true, // Allow free scrolling     
    responsive: [
      {
        breakpoint: 1499,
        settings: {
          slidesToShow: featuredBrandsSlidesToShow(featuredBrands.length),
          slidesToScroll: 2,
          infinite: true,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: featuredBrandsSlidesToShow(featuredBrands.length),
          slidesToScroll: 2,
          infinite: true,
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







  // const newArrivalSlidesToShow = (length) => {
  //   if (length === 1) return 1;
  //   if (length === 2) return 2;
  //   if (length === 3) return 3;
  //   return 4; // Default for lengths greater than 4
  // };

  const getNewArrivalSettings = {
    dots: false,
    infinite: newArrivals?.data?.length > 1,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    swipeToSlide: true,
    arrows: newArrivals?.data?.length > 1,
    responsive: [
      {
        breakpoint: 1499,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: newArrivals?.data?.length > 1,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
          infinite: newArrivals?.data?.length > 1,
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



  // const newArrivalSettings = {
  //   dots: false,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 3,
  //   slidesToScroll: 2,
  //   swipeToSlide: true, // Allow free scrolling     
  //   responsive: [
  //     {
  //       breakpoint: 1499,
  //       settings: {
  //         slidesToShow: 1,
  //         slidesToScroll: 1,
  //         infinite: true,
  //       }
  //     },
  //     {
  //       breakpoint: 991,
  //       settings: {
  //         slidesToShow: 1,
  //         slidesToScroll: 2,
  //         infinite: true,
  //       }
  //     },
  //     {
  //       breakpoint: 576,
  //       settings: {
  //         slidesToShow: 1,
  //         slidesToScroll: 1
  //       }
  //     }
  //   ]
  // };

  const topBrandsSlidesToShow = (length) => {
    if (length === 1) return 1;
    if (length === 2) return 2;
    if (length === 3) return 3;
    if (length === 4) return 4;
    return 5; // Default for lengths greater than 4
  };

  const topBrandsSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true, // Allow free scrolling     
    responsive: [
      {
        breakpoint: 1499,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
          infinite: true,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]

  };


  // useEffect(() => {
  //   const carouselElement = document.getElementById('carouselExampleIndicators');
  //   const carousel = new window.bootstrap.Carousel(carouselElement, {
  //     interval: 3000,
  //     ride: 'carousel',
  //   });
  //   return () => {
  //     carousel.dispose();
  //   };
  // }, [banners]);


  useEffect(() => {
    const clearLocalStorageExceptKeys = (keysToKeep) => {
      const itemsToKeep = keysToKeep.reduce((acc, key) => {
        const value = localStorage.getItem(key);
        if (value) acc[key] = value; // Store value if it exists
        return acc;
      }, {});

      // Clear all local storage
      localStorage.clear();

      // Restore the keys to keep
      Object.entries(itemsToKeep).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    };

    clearLocalStorageExceptKeys(['authToken', 'visitedProducts']); // Call the function with keys to keep
  }, []);

  const calculateAverageRating = (ratings) => {
    const { oneRating, twoRating, threeRating, fourRating, fiveRating } = ratings;

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
  const calculateAverageRatingVisited = (ratings) => {
    const { oneRating, twoRating, threeRating, fourRating, fiveRating } = ratings;

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


  // Memoize the deals to avoid unnecessary recalculations
  const memoizedDeals = useMemo(() => {
    return limitedTimeDeals.map(deal => ({
      ...deal,
      startDate: deal.startDate, // Assuming startDate is already a Firestore timestamp
      endDate: deal.endDate,     // Assuming endDate is already a Firestore timestamp
    }));
  }, [limitedTimeDeals]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newTimers = {};
      memoizedDeals.forEach(product => {
        const startDate = new Date(product.startDate._seconds * 1000 + product.startDate._nanoseconds / 1000000);
        const endDate = new Date(product.endDate._seconds * 1000 + product.endDate._nanoseconds / 1000000);
        const now = new Date().getTime();

        if (!isNaN(startDate) && !isNaN(endDate)) {
          if (now >= startDate && now <= endDate) {
            const distance = endDate - now;
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            newTimers[product.id] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          } else if (now < startDate) {
            newTimers[product.id] = 'Starts soon';
          } else {
            newTimers[product.id] = '00:00:00';
          }
        } else {
          newTimers[product.id] = 'Invalid date';
        }
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [memoizedDeals]);

  const getVisitedProducts = () => {
    // Retrieve the 'visitedProducts' from localStorage
    const visitedProductsJson = localStorage.getItem('visitedProducts');

    // Parse the JSON string into an array of objects
    let visitedProducts = [];
    if (visitedProductsJson) {
      visitedProducts = JSON.parse(visitedProductsJson);
    }

    return visitedProducts;
  };

  useEffect(() => {

    console.log("VistedProducts", visitedProducts);


  }, [])
  const visitedProducts = getVisitedProducts();

  const vistedProdgetSlidesToShow = (length) => {
    if (length === 1) return 1;
    if (length === 2) return 2;
    if (length === 3) return 3;

    return 4; // Default for lengths greater than 4
  };

  const visitedProdSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: vistedProdgetSlidesToShow(visitedProducts.length), // Dynamically set slidesToShow
    slidesToScroll: 1,
    swipeToSlide: true, // Allow free scrolling
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: vistedProdgetSlidesToShow(visitedProducts.length), // Dynamically set for breakpoint
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: vistedProdgetSlidesToShow(visitedProducts.length), // Dynamically set for breakpoint
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: vistedProdgetSlidesToShow(visitedProducts.length), // Dynamically set for breakpoint
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(vistedProdgetSlidesToShow(visitedProducts.length), 3), // Max 3 for smaller screens
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: Math.min(vistedProdgetSlidesToShow(visitedProducts.length), 2), // Max 2 for smallest screens
          slidesToScroll: 1,
        },
      },
    ],
  };


  useEffect(() => {

    console.log(topStores, "topppppsstores");


  }, [])



  if (categoriesStatus === 'loading' || topDealsStatus === 'loading' || limitedTimeDealsStatus === 'loading' || featuredBrandsStatus === 'loading' || topStoresStatus === 'loading' || newArrivalsStatus === 'loading' || featuredProductsStatus === 'loading' || topBrandStatus === 'loading') {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw'
      }}>
        <CircularProgress />
      </Box>
    );
  }
  // if(featuredBrands){
  //   useEffect(()=>{
  //     console.log("feeeturedbarndss",featuredBrands[0]);
  //   },[])
  // }


  if (categoriesStatus === 'failed') {
    return <div>{`Error Fetching Category Data ${categoriesError}`}</div>;
  }

  if (topDealsStatus === 'failed') {
    return <div>Error Fetching Top deals {`Error Fetcing Top Deals${topDealsError}`}</div>;
  }
  if (limitedTimeDealsStatus === 'failed') {
    return <div>Error Fetching featured Brands limited time deals {limitedTimeDealsError}</div>;
  }
  if (featuredBrandsStatus === 'failed') {
    return <div>Error Fetching featured Brands {featuredBrandsError.message}</div>;
  }
  if (topStoresStatus === 'failed') {
    return <div>Error Fetching Top Stores</div>;
  }
  if (newArrivalsStatus === 'failed') {
    return <div>Error Fetching New Arrivals</div>;
  }
  if (featuredProductsStatus === 'failed') {
    return <div>Error: {featuredProductsError}</div>;
  }
  if (topBrandStatus === 'failed') {
    return <div>Error: {topBrandError}</div>;
  }
  if (bannerSloading) return <div>Loading banners...</div>;
  if (bannerror) return <div>Error loading banners: {bannerror}</div>;


  const handlePrevTopBrand = () => {
    if (topBrandSlideRef.current) {
      topBrandSlideRef.current.slickPrev();
    }
  };



  // Function to go to the next slide
  const handleNextTopBrand = () => {
    if (topBrandSlideRef.current) {
      topBrandSlideRef.current.slickNext();
    }
  };
  const handlePrevVisitedProd = () => {
    if (visitedProdSlidRef.current) {
      visitedProdSlidRef.current.slickPrev();
    }
  };

  // Function to go to the next slide
  const handleNextVisitedProd = () => {
    if (visitedProdSlidRef.current) {
      visitedProdSlidRef.current.slickNext();
    }
  };








  return (
    <div className='HomePageMailWrapper'>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress style={{ color: "#5D1CAA" }} />
        </Box>
      ) : (
        <>
          <Navbar />
          <div className="HomePageHero">
            <div id="carouselExampleIndicators" className="carousel slide">
              <div className="carousel-indicators">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={index}
                    className={index === 0 ? 'active' : ''}
                    aria-current={index === 0 ? 'true' : 'false'}
                    aria-label={`Slide ${index + 1}`}
                  ></button>
                ))}
              </div>

              <div className="carousel-inner">
                {banners.map((banner, index) => (
                  <Link
                    key={banner.id || index} // Use a unique identifier from the banner or fallback to index if needed
                    to={banner.dealType === 'Category' ? `/categories-page/${banner.selectedValue[0]}/${banner?.categoryDetails[0]?.categoryName}` : `/product-page/${banner.selectedValue[0]}`}
                    state={{ selectedValue: banner.selectedValue }}
                    className={`carousel-item ${index === 0 ? 'active' : ''}`} // Dynamically assign active class
                  >
                    <div className='bannerMainImage'>
                      <img src={banner.image} className="bannerBackImg d-block w-100" alt="Banner" />
                    </div>
                  </Link>
                ))}

                {/* shi*/}


                {/* {banners.map((banner, index) => (
                  <Link
                    key={banner.id || index} // Use a unique identifier from the banner or fallback to index if needed
                    to={banner.dealType === 'Category' ? `/categories-page/${banner.selectedValue[0]} /${banner?.categoryDetails[0]?.categoryName}` : `/product-page/${banner.selectedValue[0]}`}
                    state={{ selectedValue: banner.selectedValue }}
                    className={`carousel - item ${index === 0 ? 'active' : ''}`} // Dynamically assign active class
                  >
                    <div className='bannerMainImag  e'>
                      <img src={banner.image} className="bannerBackImg d-block w-100" alt="Banner" />
                    </div>
                  </Link>
                ))} */}

                {/* shi-end */}


              </div>

            </div>
          </div>


          {/* =================================product-banner-section========================== */}
          {/* <div className="product-banner-wrapper">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-4">
                  <div className="product-banner"><img src="/Images/product-banner1.svg" alt="" /></div>
                </div>
                <div className="col-lg-4">
                  <div className="product-banner"><img src="/Images/product-banner2.svg" alt="" /></div>
                </div>
                <div className="col-lg-4">
                  <div className="product-banner"><img src="/Images/product-banner3.svg" alt="" /></div>
                </div>
              </div>
            </div>
          </div> */}
          {/* =====================================Hot-categories================================ */}
          {
            filteredCategories.length > 0 ? (
              <div className="hot-categories-wrapper">
                <h2>Hot Categories</h2>

                {/* <Slider {...hotCatSettings}> */}
                {hotCategory.map(product => (
                  product.products.length > 0 && (

                    <div className="category-main" key={product.id}>
                      <Link className='link' to={`/categories-page/${product.id}/${product.name}`}>
                        <div className="category-hot-card">
                          <div className="category-img">
                            <img src={product.categoryIcon} alt="" />
                          </div>
                          <div className="category-head">
                            <p>{product.name}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
                ))}
                {/* </Slider> */}
              </div>

            ) : ""
          }


          <div className="hot-categories-mobile-wrapper">
            <h2>Hot Categories</h2>

            {/* <Slider {...hotCatSettings}> */}

            {hotCategory.map(product => (
              product.products.length > 0 && (

                <div className="category-main" key={product.id}>
                  <Link className='link' to={`/categories-page/${product.id}/${product.name}`}>
                    <div className="category-hot-card">
                      <div className="category-img">
                        <img src={product.categoryIcon} alt="" />
                      </div>
                      <div className="category-head">
                        <p>{product.name}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            ))}
            {/* </Slider> */}

          </div>


          {/* =====================================Hot-categories================================ */}
          {/* ========================================top-deals-section============================== */}


          {
            topDeals.length > 0 ? (<section id="top-deals">
              <div className="top-deals">
                <div className="deals-headng-wrapper">
                  <h2 className="top-deals-heading">Top Deals</h2>
                  <Link to='/top-deals'><span className="viewAll">View All <FaArrowRight className='viewAllBtn' /></span></Link>
                </div>
                {topDeals.length === 0 ? (<p>No top Deals</p>) : (
                  // <div className="topdealsMainCarouselWrapper">
                  <Slider {...topDealsSettings}>
                    {topDeals.map(product => (
                      <div key={product.id}>
                        <Link className='link' to={`${product.multipleProduct === false ? `/product-page/${product.productIds[0]}` : `/all-products/top-deals/${product.dealId}`}`}>
                          <div className="top-deal-card">
                            <img src={product.bannerUrl} alt={product.id} />
                          </div></Link>
                      </div>

                    ))}
                  </Slider>

                  // </div>
                )}

              </div>
              {/* <div className="caro-btn-recently-top">

                <div className="left" onClick={handlePrevVisitedProd}>
                  <FaAngleLeft />
                </div>

                <div className="right" onClick={handleNextVisitedProd}>
                  <FaAngleRight />
                </div>


              </div> */}
            </section>) : ""
          }
          {/* ========================================top-deals-section============================== */}
          {/* ===========================================limited-time-offer================================ */}
          {
            limitedTimeDeals.length == 0 ? '' : (
              <section id="limited-time-deals-section">
                <div className="top-deals">


                  <div className="deals-headng-wrapper">


                    <h2 className="top-deals-heading">Limited Time Offer</h2>
                    <Link to='/limited-time-deals'>
                      <span className="viewAll">View All <FaArrowRight className='viewAllBtn' /></span>

                    </Link>
                  </div>
                  <Slider ref={sliderRef} {...featuredBrandsSettigs}>
                    {limitedTimeDeals.map(product => (
                      <div key={product.id}>
                        <Link
                          className='link'
                          to={
                            product.productIds?.length === 1
                              ? `/product-page/${product.productIds[0]}`  // Navigate if length is 1
                              : `/all-products/limited-time-offer/${product.id}`  // Navigate to a different page if length is not 1
                          }
                        >
                          <div className="top-deal-card limited-time-deals-card">
                            <div className="limited-time-deal-img-container">
                              <img src={product.image} alt={product.id} />
                              <div className="timer">
                                <span>Ends in {timers[product.id]}</span>
                              </div>
                            </div>


                          </div>
                        </Link>
                      </div>
                    ))}

                  </Slider>
                </div>
              </section>
            )
          }
          {/* ===========================================limited-time-offer================================ */}
          {/* ===============================================featured-brands================================= */}
          {
            featuredBrands.length == 0 ? '' : (
              <section id="featuredBrands">
                <div className="top-deals">



                  <div className="deals-headng-wrapper">
                    <h2 className="top-deals-heading">Featured Brands</h2>
                    <Link to='/featured-brands'>
                      <span className="viewAll">View All <FaArrowRight className='viewAllBtn' /></span>
                    </Link>
                  </div>
                  <Slider ref={sliderRef} {...featuredBrandsSettigs}>
                    {featuredBrands.map(product => (
                      <div key={product.id}>
                        <Link to={
                          product.featuredType === 'Brand Product'
                            ? `/featured-products-page/${product.selectedBrands[0]}`  // Navigate if length is 1
                            : `/brand-page/${product?.selectedBrandDetails[0]?.brandId}`  // Navigate to a different page if length is not 1
                        }>
                          <div className="top-deal-card featuredBrandsCard">
                            <div className="featuredBrandImage">
                              <img src={product.image} alt={product.id} />
                              {product.selectedBrandDetails.length > 0 && (
                                <div className="indomei-container">
                                  <div className="ad">AD</div>
                                  <div className="indomie-image">
                                    <img src={product.selectedBrandDetails[0].brandLogo} alt={product.selectedBrandDetails[0].brandName} />
                                  </div>
                                  <div className="indomie-text">
                                    {product.selectedBrandDetails[0].brandName}
                                    <FaAngleRight className='rightAngle' />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </Slider>
                </div>
              </section>
            )
          }
          {/* ===============================================featured-brands================================= */}
          {/* ==================================================top-stores-section================================ */}
          {
            Array.isArray(topStores.data) && topStores.data.length > 0 ? (
              <section id="top-stores">
                <div className="top-deals">



                  <div className="deals-headng-wrapper">
                    <h2 className="top-deals-heading">Top Stores</h2>
                    <Link to={`/topStore-Page/${topStores.data[0]?.sellerId}`}>
                      <span className="viewAll">View All <FaArrowRight className='viewAllBtn' /></span>
                    </Link>
                  </div>
                  <Slider ref={sliderRef} {...getNewArrivalSettings}>

                    {topStores?.data.map(product => (
                      <div key={product.id}>
                        <Link className='link' to={`/topStore-Page/${product.sellerId}`}>
                          <div className="top-deal-card limited-time-deals-card">
                            <div className="limited-time-deal-img-container">
                              <img src={product.image} alt={product.id} />
                              <div className="timer tharaonline">
                                <span>{product.sellerData?.storedetails?.storename || 'Store Name Unavailable'}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </Slider>
                </div>
              </section>
            ) : null
          }

          {/* ==================================================top-stores-section================================ */}
          {/* ====================================new-arrivals========================== */}

          {
            newArrivals?.data && Array.isArray(newArrivals.data) && newArrivals.data.length > 0 ? (
              <section id="newArrivals">
                <div className="top-deals">
                  <div className="deals-headng-wrapper">
                    <h2 className="top-deals-heading">New Arrivals</h2>

                    <Link to={'/new-arrival'}>
                      <span className="viewAll">View All <FaArrowRight className='viewAllBtn' /></span>
                    </Link>

                  </div>
                  <Slider {...getNewArrivalSettings}>
                    {newArrivals.data.map(product => (
                      <div key={product.id} >
                        <Link className='link'
                          to={
                            product.newArrivalType === 'Banner Type'
                              ? `/product-page/${product.selectedProducts[0]}`  // Navigate if length is 1
                              : `/new-arrivals-product/${product.id}`  // Navigate to a different page if length is not 1
                          }>
                          <div className="newArrivals-card">
                            <img src={product.image} alt={product.id} />
                          </div>
                        </Link>
                      </div>
                    ))}
                  </Slider>
                </div>
              </section>
            ) : null
          }


          {/* ====================================new-arrivals========================== */}
          {/* ================================featured prod========================== */}
          {
            featuredProducts.length == 0 ? '' : (<div className="trending-products featured-products">
              <div className="deals-headng-wrapper">
                <h2 className="top-deals-heading">Featured Products</h2>
                {/* <span className="viewAll">View All <FaArrowRight className='viewAllBtn' /></span> */}
              </div>
              <div className="trending-product-card-wrapper">
                <div className="featuredProdCardWrapper">
                  {featuredProducts.map(product => {
                    const averageRating = calculateAverageRating(product);
                    const originalPrice = parseFloat(product.price).toFixed(2);

                    return (
                      <div key={product.id}>
                        <Link className='link' to={`/product-page/${product.productId}`}>
                          <div className="trending-card">
                            <div className="featuredProdImage">
                              <img src={product.imageUrls} alt={product.name} />
                            </div>
                            <div className="rating-box">
                              <FaRegStar className='ratingStar' />
                              <span>{averageRating}</span>
                            </div>
                            <div className="best-seller-box">
                              Best Seller
                            </div>
                            <h6>
                              Sold By <strong>{product.sellerDetails.storedetails.storename}</strong>
                            </h6>
                            <p>{product.name}</p>
                            <span className='price'>₹ {product.offerPrice.toFixed(2)}</span>
                            <span className='crossed-price'>
                              <strike>₹ {originalPrice}</strike>
                            </span>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>)
          }
          {/* ================================Top Brands========================== */}
          {/* ===================================top-brands-section========================== */}
          {
            topBrand?.length == 0 ? '' : (
              <section id="top-brands-section">
                <div className="top-deals">

                  <div className="deals-headng-wrapper">
                    <h2 className="top-deals-heading">Top Brands</h2>
                    <Link to={`/brand-page/${topBrand[0]?.brandId}`} className="viewAll">View All <FaArrowRight className='viewAllBtn' /></Link>
                  </div>

                  <div className='topbrandCarousel'>

                    {/* <div className="carousel-arrowss">
                      <MdOutlineKeyboardArrowLeft className='MdOutlineKeyboardArrowLeft' onClick={handlePrevTopBrand} style={{ cursor: 'pointer' }} />
                      <MdOutlineKeyboardArrowRight className='MdOutlineKeyboardArrowright' onClick={handleNextTopBrand} />
                    </div> */}
                    <div className="caro-btn-brands">

                      <div className="left" onClick={handlePrevTopBrand}>
                        <FaAngleLeft />
                      </div>

                      <div className="right" onClick={handleNextTopBrand}>
                        <FaAngleRight />
                      </div>

                    </div>

                    {filteredTopBrands.length > 1 ? (
                      <Slider ref={topBrandSlideRef} {...topBrandsSettings}>
                        {filteredTopBrands.map(brand => (
                          <div key={brand.id}>
                            <Link to={`/topbrand-products-page/${brand?.brandId}`}>
                              <div className="top-brand-card">
                                <div className="top-brand-image">
                                  <img src={brand.brandLogo} alt={brand.id} />
                                </div>
                                <h6>{brand.brandName}</h6>
                                <p>Upto 20% OFF </p>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      filteredTopBrands.map(brand => (
                        <div key={brand.id}>
                          <Link to={`/topbrand-products-page/${brand?.brandId}`}>
                            <div className="top-brand-card">
                              <div className="top-brand-image">
                                <img src={brand.brandLogo} alt={brand.id} />
                              </div>
                              <h6>{brand.brandName}</h6>
                              <p>Upto 20% OFF </p>
                            </div>
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            )
          }
          {/* ===================================top-brands-section========================== */}
          <div>
            {/* =======================================discount-for-you-section========================= */}
            {discounts.length > 0 ? (
              <section id="discount-for-you-section">
                <div className="top-deals">
                  <div className="deals-headng-wrapper">
                    <h2 className="top-deals-heading">Discounts For You</h2>
                    {/* <span className="viewAll">View All <FaArrowRight className='viewAllBtn' /></span> */}
                  </div>
                  <Slider ref={sliderRef} {...discountSettings}>
                    {discounts.map((data, index) => (
                      <div key={index}>
                        <Link to={`/discout-for-you/${data.id}`}>
                          <div
                            className="recoment-card rcmnt-card1"
                            style={{
                              backgroundImage: `url(${data?.imgUrl})`,
                              backgroundSize: 'cover',
                            }}
                          >
                            <h3>{data.parentCategoryName}</h3>
                            <span>Up to {data.discount}% OFF</span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </Slider>
                </div>
              </section>
            ) : (
              ''
            )}
            {/* =======================================discount-for-you-section========================= */}
          </div>

          {/* ===========================================recently-viwed================================ */}
          {
            visitedProducts.length == 0 ? "" : (
              <div className="trending-products visited-products">
                <div className="deals-headng-wrapper">
                  <h2>Recently Viewed</h2>
                  <Link to='/recently-viewed'> <span className="viewAll">View All <FaArrowRight className='viewAllBtn' /></span></Link>
                </div>
                <div className="trending-product-card-wrapper">


                  {/* <div className="carousel-arrowss">
                    <MdOutlineKeyboardArrowLeft className='MdOutlineKeyboardArrowLeft' onClick={handlePrevVisitedProd} style={{ cursor: 'pointer' }} />
                    <MdOutlineKeyboardArrowRight className='MdOutlineKeyboardArrowright
                    ' onClick={handleNextVisitedProd} />
                  </div> */}
                  <div className="caro-btn-recently">

                    <div className="left" onClick={handlePrevVisitedProd}>
                      <FaAngleLeft />
                    </div>

                    <div className="right" onClick={handleNextVisitedProd}>
                      <FaAngleRight />
                    </div>


                  </div>


                  <div className="recently">
                    <Slider ref={visitedProdSlidRef} {...visitedProdSettings}>

                      {visitedProducts.map(product => {
                        const averageRating = calculateAverageRating(product.details);
                        const sellingPrice = parseFloat(product.details.sellingPrice).toFixed(2);
                        const originalPrice = parseFloat(product.details.price).toFixed(2);



                        return (
                          <div key={product.details.id} >
                            <Link className='link' to={`/product-page/${product.details.id}`}>
                              <div className="trending-card">
                                <div className="featuredProdImage">
                                  <img src={product.details.imageUrls} alt={product.details.name} />
                                </div>
                                <div className="rating-box">
                                  <FaRegStar className='ratingStar' />
                                  <span>{averageRating}</span>
                                </div>
                                <div className="best-seller-box">
                                  Best Seller
                                </div>
                                <h6>


                                  {/* Sold By
                                  <strong>
                                    Thara Trading Pvt
                                  </strong> */}


                                  <h6>
                                    {product?.details?.name?.length > 35
                                      ? `${product.details.name.slice(0, 68)}...`
                                      : product?.details?.name || ''}
                                  </h6>


                                  {/* <strong>{product.details.sellerDetails.storedetails.storename}</strong>// */}
                                </h6>




                                <span className='price'>₹ {sellingPrice}</span>
                                <span className='crossed-price'>
                                  <strike>₹ {originalPrice}</strike>
                                </span>
                              </div>
                            </Link>
                          </div>

                        );
                      })}
                    </Slider>

                  </div>
                </div>
              </div>
            )
          }
          {/* ===========================================recently-viwed================================ */}

          {/* ===========================================Buy Again================================ */}
          {/* <div className="trending-products">
            <div className="deals-headng-wrapper">
              <h2 className="top-deals-heading">Buy Again</h2>
              <span className="viewAll">View All <FaArrowRight className='viewAllBtn' /></span>
            </div>
            <div className="trending-product-card-wrapper">
              <div className="carousel-next-btn-wrapp">
                <img src="/Images/carousel-next.svg" alt="" className='carousel-next-button' onClick={CarouseNext} />
              </div>
              <Slider ref={sliderRef} {...settings}>
                {products.map(product => (
                  <div key={product.id}>
                    <Link className='link'>
                      <div className="trending-card">
                        <img src={product.image} alt={product.name} />
                        <div className="rating-box">
                          <FaRegStar className='ratingStar' />
                          <span>4.3</span>
                        </div>
                        <div className="best-seller-box">
                          Best Seller
                        </div>
                        <h6>Sold By <strong>Thara Tading Pvt Ltd</strong></h6>
                        <p>{product.name}</p>
                        <span className='price'>{product.regularPrice}</span>
                        <span className='crossed-price'><strike>{product.price}</strike></span>
                      </div></Link>
                  </div>
                ))}
              </Slider>
            </div>
          </div> */}
          {/* ===========================================Buy Again================================ */}
          {/* ===========================================Recommend================================ */}
          {/* <div className="trending-products">
            <div className="deals-headng-wrapper">
              <h2 className="top-deals-heading">Recommend</h2>
              <span className="viewAll">View All <FaArrowRight className='viewAllBtn' /></span>
            </div>
            <div className="trending-product-card-wrapper">
              <div className="carousel-next-btn-wrapp">
                <img src="/Images/carousel-next.svg" alt="" className='carousel-next-button' onClick={CarouseNext} />
              </div>
              <Slider ref={sliderRef} {...settings}>
                {products.map(product => (
                  <div key={product.id}>
                    <Link className='link'>
                      <div className="trending-card">
                        <img src={product.image} alt={product.name} />
                        <div className="rating-box">
                          <FaRegStar className='ratingStar' />
                          <span>4.3</span>
                        </div>
                        <div className="best-seller-box">
                          Best Seller
                        </div>
                        <h6>Sold By <strong>Thara Tading Pvt Ltd</strong></h6>
                        <p>{product.name}</p>
                        <span className='price'>{product.regularPrice}</span>
                        <span className='crossed-price'><strike>{product.price}</strike></span>
                      </div></Link>
                  </div>
                ))}
              </Slider>
            </div>
          </div> */}
          {/* ===========================================Recommend================================ */}
          <BottomBar />
          <Footer />
        </>
      )
      }

    </div >
  )
}

export default HomePage
