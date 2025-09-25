import { useEffect, useRef, useState } from 'react';
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { FaRegStar } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import './ProductInnerPage.scss';
import AddedFavAlert from '../AddedFavAlert/AddedFavAlert';
import AddToCartAlert from '../AddToCartAlert/AddToCartAlert';
import { FaStar } from "react-icons/fa";
import { FaAngleLeft, FaChevronDown } from "react-icons/fa6";
import { BsStar, BsStarHalf } from "react-icons/bs";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import Navbar from '../Navbar/Navbar';
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Box, CircularProgress, LinearProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Footer from '../Footer/Footer';
import { BsStarFill } from "react-icons/bs";
import useProductInnerDetails from '../../redux/hooks/ProductInnerPageHooks/useProductInnerDetails';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import UseLoginedUser from '../../redux/hooks/NavbarHook/UseLoginedUser';
import baseUrl from '../../baseUrl';
import useProductRating from '../../redux/hooks/ProductInnerPageHooks/useProductRating';
import useQna from '../../redux/hooks/ProductInnerPageHooks/useQna';
import Modal from '../ImageModal/ImageModal';
import useFetchAddress from '../../redux/hooks/checkoutPageHooks/useFetchAddress';
import useWishListProducts from '../../redux/hooks/cartPageHooks/useWishListProducts';
import useCartProduct from '../../redux/hooks/cartPageHooks/useCartProduct';
import { removeFromWishList } from '../../redux/slices/cartSlices/removeWishlistProdSlice';

import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../../redux/slices/cartSlices/removeCartItemSlice';
import CustomAlert from '../ConfirmAlert/ConfirmAlert';
import SucessAlertHanna from '../addressAdded/SucessAlert';
import NotPurchasedAlert from '../NotPurchasedAlert/NotPurchasedAlert';
import BottomBar from '../BottomBar/BottomBar';
import Breadcrumb from '../BreadCrumb/BreadCrumb';

import { useNavigate } from 'react-router-dom';
import useSharableList from '../../redux/hooks/cartPageHooks/useShareblelistProduct';

const ProductInnerPage = () => {
  // const [purchased, setPurchased] = useState(null);
  const [purchased, setPurchased] = useState(false);

  const [isValid, setIsValid] = useState(true);

  const [showAlert, setShowAlert] = useState(false);
  const [pincode, setPincode] = useState(""); // State for storing the input pincode
  const [result, setResult] = useState("");   // State for displaying the result (valid/invalid)
  const [pinCodeChecking, setPincodeChecking] = useState(false)
  const { prodId } = useParams()
  const dispatch = useDispatch()
  const [selectedImage, setSelectedImage] = useState(0);
  const [cartAlertVisible, setCartAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('Item Added to Cart');
  const [favAlertVisible, setFavAlertVisible] = useState(false);
  const [faveAlertMessage, setFavAlertMessage] = useState('Product Moved to Wishlist');
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const { status: removeWishListItemStatus, error: removeWishListItemError } = useSelector(state => state.removeWishListItem);

  const ratingSectionRef = useRef(null); // Step 1: Create a ref


  const scrollToRatings = () => {
    if (ratingSectionRef.current) {
      ratingSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {

    console.log("prrrr", productDetails);

  }, [])

  const navigate = useNavigate(); // Initialize navigate function

  const [userReview, setUserReview] = useState({
    review: '',
    comment: ''
  }); // Updated state

  const handleImageClick = (url) => {
    setModalImage(url);
    setIsModalOpen(true);
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value;

  }


  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  const NotPurchased = () => {
    setShowAlert(true); // Show the alert when the button is clicked
  };
  // Function to handle form submission
  const handleCheckPincode = async (e) => {
    setPincodeChecking(true)
    e.preventDefault(); // Prevent form from refreshing the page

    if (!pincode) {
      setResult("Please enter a pincode.");
      return;
    }
    try {
      // Call the backend API
      const response = await axios.get(`${baseUrl}/check-pincode/${pincode}`);

      // Update result state based on response
      setResult(response.data.message); // e.g., "Pincode is valid"
    } catch (error) {
      // Handle errors
      setResult(error.response?.data.message || "Something went wrong.");
    } finally {
      setPincodeChecking(false)
    }
  };


  const [reportFormData, setReportFormData] = useState({
    selectedIssue: "",
    comments: "",
  })



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setReportFormData({ selectedIssue: "", comments: "" });

  };


  const getProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const authToken = localStorage.getItem('authToken');
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

      const res = await axios.get(
        `${baseUrl}/getProductInnerDetails`, {
        params: {
          pId: prodId,
          customerId: loginedUser?.customDocId // Send customerId if user is logged in
        },
        headers
      }
      );

      const { productDetails, purchased } = res.data;
      setProductDetails(productDetails);
      setPurchased(purchased);



      // Handle recently visited products
      updateRecentlyVisited(productDetails);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError(error?.response?.data || 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("productdetails", productDetails);

  }, [])

  const updateRecentlyVisited = (details) => {
    try {
      const visitedProducts = JSON.parse(localStorage.getItem('visitedProducts')) || [];

      if (!visitedProducts.find(product => product.prodId === prodId)) {
        if (visitedProducts.length >= 10) {
          visitedProducts.shift();
        }

        visitedProducts.push({
          prodId,
          details
        });

        localStorage.setItem('visitedProducts', JSON.stringify(visitedProducts));
      }
    } catch (error) {
      console.error('Error updating visited products:', error);
    }
  };


  const { loginedUser, status, error: loginedUserError } = UseLoginedUser();
  const { productRatings, status: productRatingStatus, error: productRatingError } = useProductRating();
  const { qna, status: qnaStatus, error: qnaError } = useQna();
  const { address, status: addressStatus, error: addressError, refetch: addressRefetch } = useFetchAddress()


  // sharablelist
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [loader, setLoader] = useState(false);
  const { sharableList, status: sharableliststatus, error: sharablelisterror, refetch: sharablerefetch } = useSharableList();
  useEffect(() => {
    console.log(sharableList, 'this is sharable lis');

  }, [])

  const [selectedListId, setSelectedListId] = useState('');
  const [showModal, setShowModal] = useState(false);  // Add this state
  const [listError, setlistError] = useState('');  // Add this state
  const [selectionType, setSelectionType] = useState('');

  //////28-01

  const [existingListWithProduct, setExistingListWithProduct] = useState(null);
  const [listloading, setlistLoading] = useState(false);
  const [addlisterror, setaddlistError] = useState('');

  const [wishlistSelected, setWishlistSelected] = useState(false);




  const handleListClose = () => {
    // Reset states
    setShowModal(false);
    setSelectedListId('');
    setNewListName('');
    setlistError('');
    setaddlistError('');
    setWishlistSelected('');

    // Close Bootstrap modal
    const modal = document.getElementById('AddtoListModal');
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }

    // Clean up modal artifacts and restore scrolling
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
    document.body.style.overflow = '';

    // Remove modal backdrop
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  };

  const checkProductInLists = async (productId) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${baseUrl}/check-product-in-lists/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Get all lists containing the product
      const listsWithProduct = response.data.lists || [];
      return listsWithProduct;
    } catch (error) {
      console.error('Error checking product in lists:', error);
      throw error;
    }
  };


  // Call this when modal opens
  const [listsWithProduct, setListsWithProduct] = useState([]);

  // Update the useEffect to fetch all lists containing the product
  useEffect(() => {
    const checkProduct = async () => {
      const lists = await checkProductInLists(prodId);
      setListsWithProduct(lists);
    };
    checkProduct();
  }, [prodId]);



  const handleBuyNowClick = () => {
    // Get token from localStorage or your auth management system
    const token = localStorage.getItem('token'); // Adjust based on where you store the token

    if (!token) {
      // If no token, redirect to login page with return URL
      navigate('/login', {
        state: {
          returnUrl: `/product-checkout/${productDetails.productId}`
        }
      });
    } else {
      // If token exists, go directly to checkout
      navigate(`/product-checkout/${productDetails.productId}`);
    }
  };



  useEffect(() => {
    console.log(sharableList, 'sharablelistsashvy');

  }, [])

  const createNewList = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found in localStorage');
      }

      setLoading(true);
      const res = await axios.post(
        `${baseUrl}/create-sharable-list`,
        {
          listName: newListName,
          items: [prodId],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token here
          },
        }
      );
      setNewListName('');
      console.log('Sharable lists:', sharableList);
      handleListClose();

    } catch (error) {
      console.error('Error creating list:', error.message || error);
    } finally {
      setLoading(false);
    }
  };


  const addToExistingList = async () => {
    try {
      setaddlistError('');
      const token = localStorage.getItem('authToken');
      if (!token) {
        setFavAlertMessage('Authentication error. Please log in.');
        setFavAlertVisible(true);
        setTimeout(() => setFavAlertVisible(false), 4000); return;
      }

      if (!selectedListId) {
        setFavAlertMessage('Please select a list');
        setFavAlertVisible(true);
        setTimeout(() => setFavAlertVisible(false), 4000);
        return;
      }

      setlistLoading(true);

      // Check if the product is already in the selected list
      const isInList = listsWithProduct.some(list => list.id === selectedListId);
      const selectedList = sharableList.sharableLists.find(list => list.id === selectedListId);
      const listName = selectedList?.listName;


      if (isInList) {
        // Remove the product
        const response = await axios.delete(
          `${baseUrl}/delete-item-sharable-list/${selectedListId}/items/${prodId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update listsWithProduct state
        setListsWithProduct(prev => prev.filter(list => list.id !== selectedListId));
        handleListClose();
        setFavAlertMessage(`Removed from ${listName}`);
        setFavAlertVisible(true);
        setTimeout(() => setFavAlertVisible(false), 4000);
      } else {
        // Add the product
        const response = await axios.post(
          `${baseUrl}/add-product-to-list`,
          {
            listId: selectedListId,
            itemId: prodId
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );



        // Add to listsWithProduct state
        const newList = sharableList.sharableLists.find(list => list.id === selectedListId);
        if (newList) {
          setListsWithProduct(prev => [...prev, { id: selectedListId, listName: newList.listName }]);
        }
        handleListClose();
        setFavAlertMessage(`Added to ${listName}`);
        setFavAlertVisible(true);
        setTimeout(() => setFavAlertVisible(false), 4000);

      }
      const modal = bootstrap.Modal.getInstance(document.getElementById('AddtoListModal'));
      modal?.hide();
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      backdrop?.remove();

    } catch (error) {
      console.error('Error processing list action:', error);
      setError(error.response?.data?.message || 'Error processing list action');
    } finally {
      //  window.location.reload();
      setLoading(false);
      setSelectedListId(null);
    }
  };



  const handleCloseAlert = () => {
    setShowAlert(false); // Close the alert
  };




  useEffect(() => {
    if (prodId) {
      getProduct();

      if (loginedUser) {
        console.log(loginedUser.customDocId);
      } else {
        console.log("loginedUser is undefined or null");
      }
    }
  }, [prodId, loginedUser]);

  const quantity = 1;


  useEffect(() => {
    console.log('productdetails', productDetails);

  }, [productDetails])




  const { wishListProduct, status: wishlisStatus, error: wishlistError, refetch: wishListRefetch } = useWishListProducts();
  const { refetch, cartProduct, status: cartProdStatus, error: cartProderror } = useCartProduct(); // Include refetch
  // Check if the product is in the cart //
  useEffect(() => {
    if (cartProduct && cartProdStatus === 'succeeded') {
      const productInCart = cartProduct.some(item => item.productId === prodId);
      setIsInCart(productInCart); // Update the state based on cart data
    }
  }, [cartProduct, cartProdStatus, prodId]);


  const addToCart = async (productId, quantity) => {
    try {
      setCartLoading(true);
      const token = localStorage.getItem('authToken');

      if (!token) {
        console.error('No token found');
        setAlertMessage('Authentication error. Please log in.');
        setCartAlertVisible(true);
        setTimeout(() => setCartAlertVisible(false), 3000);
        return;
      }

      // Post request to add the product to the cart
      const res = await axios.post(
        `${baseUrl}/add-to-cart`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setAlertMessage('Item Added to Cart');
        refetch();
      } else {
        setAlertMessage('Unexpected response. Please try again.');
      }

      setCartAlertVisible(true);
      setTimeout(() => setCartAlertVisible(false), 4000);

      // Optionally, refetch the cart data or update local cart state here
      // refetchCart(); // if you have a refetch function for cart data
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setAlertMessage('Failed to add item to cart. Please try again.');
      setCartAlertVisible(true);
      setTimeout(() => setCartAlertVisible(false), 4000);
    } finally {
      setTimeout(() => setCartLoading(false), 5000) // Hide the spinner after completion
    }
  };

  useEffect(() => {
    if (wishlisStatus === 'succeeded' && wishListProduct) {
      const isProductInWishlist = wishListProduct.some(item => item.productId === prodId);
      setIsInWishlist(isProductInWishlist); // Update the state based on wishlist data
    }
  }, [wishlisStatus, wishListProduct, prodId]);




  const addToWishList = async (productId) => {
    try {
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
    }
  };



  // const handleShare = () => {
  //   // Define the product details
  //   const productUrl = window.location.href;  // The URL of the product page
  //   const productTitle = productDetails.name;  // Product title
  //   const productDescription = " productDetails.description";  // Product description

  //   // Check if the Web Share API is available
  //   if (navigator.share) {
  //     navigator.share({
  //       title: productTitle,
  //       text: productDescription,
  //       url: productUrl,
  //     })
  //     .then(() => console.log("Product shared successfully"))
  //     .catch((error) => console.error("Error sharing:", error));
  //   } else {
  //     // Fallback for browsers that do not support Web Share API
  //     alert('Sharing is not supported on this platform.');
  //   }
  // };

  const currentUrl = `${window.location.origin}${window.location.pathname}`; // Base URL without encoding

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: productDetails.name,
        text: `Check out this product: ${productDetails.name}\n\n${productDetails.description}`,
        url: encodeURI(currentUrl),
      })
        .then(() => console.log('Successfully shared'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      // Display fallback options
      alert(`Your browser does not support the Web Share API.
      You can copy the link to share: ${currentUrl}`);
    }
  };


  if (loading) {
    return <div>
      <Box sx={{ width: '100%' }}>
        <LinearProgress
          className="loading"
          sx={{
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#02400C',
            }
          }}
        />
      </Box>
    </div>;
  }

  if (error) {
    return <div>Error fetching product

      \: {error.message}</div>;
  }
  const getAverageRating = (details) => {
    const { oneRating, twoRating, threeRating, fourRating, fiveRating } = details;

    const totalRatings = oneRating + twoRating + threeRating + fourRating + fiveRating;
    const weightedSum = (1 * oneRating) + (2 * twoRating) + (3 * threeRating) + (4 * fourRating) + (5 * fiveRating);

    const averageRating = totalRatings === 0 ? 0 : (weightedSum / totalRatings).toFixed(1);

    return averageRating;
  };
  const currentDate = new Date();
  const deliveryDate = new Date();
  deliveryDate.setDate(currentDate.getDate() + 7);

  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const formattedDate = deliveryDate.toLocaleDateString('en-US', options);
  const averageRating = getAverageRating(productDetails);
  const totalReviews = productDetails.oneRating + productDetails.twoRating + productDetails.threeRating + productDetails.fourRating + productDetails.fiveRating;
  const {
    oneRating,
    twoRating,
    threeRating,
    fourRating,
    fiveRating
  } = productDetails;
  const totalVotes = oneRating + twoRating + threeRating + fourRating + fiveRating;
  const weightedTotal =
    oneRating * 1 +
    twoRating * 2 +
    threeRating * 3 +
    fourRating * 4 +
    fiveRating * 5;

  const avgScore = totalVotes ? (weightedTotal / totalVotes).toFixed(1) : 0;








  // Function to calculate progress bar width
  const getProgressBarWidth = (ratingCount) => {
    return totalVotes ? `${(ratingCount / totalVotes) * 100}%` : '0%';
  };
  const selectImage = (imageIndex) => {
    setSelectedImage(imageIndex);
  };
  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      try {
        const response = await axios.post(`${baseUrl}/upload-images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const imageUrls = response.data.imageUrls;
        setSelectedImages(imageUrls);
      } catch (error) {
        console.error('Error uploading images:', error);
      }
    }
  };
  const handleRatingChange = (newRating) => {
    setSelectedRating(newRating); // Updated to use selectedRating
  };
  console.log(loginedUser, 'hannaprod');

  const reference = `/${productDetails.reference._path.segments[0]}/${productDetails.reference._path.segments[1]}/${productDetails.reference._path.segments[2]}/${productDetails.reference._path.segments[3]}`
  const handleSubmit = async (e) => {
    e.preventDefault();

    const authToken = localStorage.getItem('authToken');
    if (!authToken || !loginedUser) {
      alert('Please log in to submit a rating');
      return;
    }

    if (!productDetails) {
      alert('Product details not available');
      return;
    }

    try {
      const payload = {
        productId: prodId,
        customerId: loginedUser.customDocId,
        rating: selectedRating,
        comment: userReview.comment,
        mediaUrl: selectedImages.map(url => ({ type: 'image', url })),
        reference: `/products/${prodId}/variants/`,
        review: userReview.review,
        sellerId: productDetails.sellerId,
        brandId: productDetails.brandId,
        category: productDetails.category
      };

      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      };

      await axios.post(`${baseUrl}/add-rating`, payload, config);

      // Reset form
      setUserReview({ review: '', comment: '' });
      setSelectedImages([]);
      setSelectedRating(0);

      alert('Rating added successfully!');
    } catch (error) {
      handleRatingError(error);
    }
  };

  const handleRatingError = (error) => {
    const errorMessage = error.response?.data?.error || error.response?.data;

    switch (error.response?.status) {
      case 400:
        alert(typeof errorMessage === 'string' ? errorMessage : 'Please check your input and try again');
        break;
      case 401:
      case 403:
        alert('Please log in again to continue');
        localStorage.removeItem('authToken');
        break;
      case 404:
        alert(errorMessage === 'Settings document not found.'
          ? 'System configuration error. Please try again later.'
          : 'The requested resource was not found.');
        break;
      case 500:
        alert('A server error occurred. Please try again later.');
        break;
      default:
        alert('An unexpected error occurred. Please try again.');
    }
  };


  const removeWishListProd = async (productId) => {
    try {
      await dispatch(removeFromWishList(productId));
      wishListRefetch();
    } catch (error) {
      console.log(error);

    }
  }
  const { oneRating: oneRatingSeller, twoRating: twoRatingSeller, threeRating: threeRatingSeller, fourRating: fourRatingSeller, fiveRating: fiveRatingSeller } =
    productDetails.sellerDetails;

  // Calculate total ratings and average rating
  const totalRatings =
    oneRatingSeller + twoRatingSeller + threeRatingSeller + fourRatingSeller + fourRatingSeller;
  const averageSellerRating = totalRatings
    ? (
      (1 * oneRatingSeller +
        2 * twoRatingSeller +
        3 * threeRatingSeller +
        4 * fourRatingSeller +
        5 * fourRatingSeller) /
      totalRatings
    ).toFixed(1)
    : 0;

  // Render stars dynamically based on the averageRating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<BsStarFill key={i} />);
      } else if (rating > i - 1) {
        stars.push(<BsStarHalf key={i} />);
      } else {
        stars.push(<BsStar key={i} />);
      }
    }
    return stars;
  };



  return (
    <div className='ProductInnerPageMailWrapper'>

      <Navbar />


      <div className="breadCrumb" style={{ color: 'black' }}>
        <div
          className="back-btn">
          <Link to='/'>
            <div className="arrow-icon">
              <FaAngleLeft style={{ color: 'white' }} />
            </div>
          </Link>
        </div>

        <Breadcrumb basePath={[{ label: 'Home', link: '/' }]} />
      </div>



      <div className="product-inner-page">
        <AddedFavAlert
          visible={favAlertVisible}
          onClose={() => setFavAlertVisible(false)}
          message={faveAlertMessage}

        />


        <AddToCartAlert
          visible={cartAlertVisible}
          onClose={() => setCartAlertVisible(false)}
          message={alertMessage}
        />

        <div className="product-page-left">

          <div className="product-sub-images-container">



            {productDetails.imageUrls.map((data, index) => (
              <div
                key={index}
                className={`product-sub-image ${selectedImage === index ? "activeImg" : ''}`}
                onClick={() => selectImage(index)}
              >
                <img src={data} alt="" />
              </div>
            ))}
          </div>
          <div className="selected-image-container">
            <img src={productDetails.imageUrls[selectedImage]} alt="" />

            {isInWishlist ? (
              <IoIosHeart
                className='fav-icon filled'
                style={{ color: "red" }}
                data-bs-toggle="modal" data-bs-target="#AddtoListModal"
              // onClick={() => removeWishListProd(prodId)}
              />

            ) : (
              <IoIosHeartEmpty className='fav-icon' data-bs-toggle="modal" data-bs-target="#AddtoListModal" />

            )}




            <RiShareForwardLine className='share-icon' onClick={handleShare} />
          </div>

        </div>
        <div className="product-page-right">
          <p className="product-discription">
            {productDetails.name}
          </p>
          <div className="brand">
            <p>Brand</p>
            <Link
              to={
                productDetails?.brandDetails?.brandPage === ''
                  ? `/topbrand-products-page/${productDetails?.brandDetails?.brandId}`
                  : `/brand-page/${productDetails?.brandDetails?.brandId}`
              }
              className="brand-value"
            >
              {productDetails?.brandDetails?.brandName || "Brand Name"}
            </Link>
          </div>

          <div className="rating-wrapper">
            <div className="rating-container" >
              <FaRegStar className='star-icon' />
              <span>{averageRating}</span>
            </div>
            <span className='rating-count' onClick={scrollToRatings} >({totalReviews} Ratings)</span>
          </div>
          <div className="price-wrapper">
            <h2 className="price">₹{productDetails.offerPrice.toFixed(2)}</h2>

            <p className='crossed-price'><strike>₹{productDetails.price.toFixed(2)}</strike></p>
            <p className="gst">Incl. GST</p>
            <p className="offer-text">{Math.round(productDetails.discountPercentage)}% OFF</p>
            <p className='saved-perc'>You Save ₹{productDetails.price - productDetails.offerPrice}</p>
          </div>
          {/* <div className="special-offer-price">
            <h6>Special Offer Price</h6>
          </div> */}

          <div className="quantity-container">
            {
              productDetails.tirePrice.map((data, index) =>
                <div className="quantity-sub-container" key={index}>
                  <div className="container-price">
                    <span>₹{data.discountPrice}</span>
                  </div>
                  <div className="container-quantity">
                    <span>Min {data.range}</span>
                  </div>
                </div>
              )
            }


          </div>
          <div className="delivery-details-card">
            <div className="delivery-right">
              <p className="order-time">Order Before 5PM, Today</p>
              <p className="del-date">Expect Delivery by {formattedDate}</p>

              {/* Conditionally render the button based on whether the product is in the cart */}


              {productDetails.stock > 0 ? (
                <div className="button-container">
                  {isInCart ? (
                    <Link to="/shopping-cart">
                      <button className="addTocartBtn">Go to Cart</button>
                    </Link>
                  ) : (
                    <button className="addTocartBtn" onClick={() => addToCart(prodId, quantity)} disabled={cartLoading}>
                      {cartLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <CircularProgress className='spinner' />
                        </Box>
                      ) : (
                        'Add to Cart'
                      )}
                    </button>
                  )}
                  <div><Link to={`/product-checkout/${productDetails.productId}`}><button onClick={handleBuyNowClick} className='buy-btn'>Buy Now</button></Link></div>
                </div>
              ) : (<p style={{ textAlign: 'center', color: "red", fontWeight: '600', padding: '1rem', backgroundColor: '#dfdfdf' }}>Out Of Stock</p>)}

              <div className='sold-section'>

                <p>
                  Sold By : <span>
                    {productDetails?.sellerDetails?.name}
                  </span>
                </p>

                <p>
                  Ship By  :  <span>
                    Thara Cart
                  </span>
                </p>


              </div>

            </div>



            <div className="delivery-left">
              <p>Deliver To</p>
              {address && address.length > 0 && (
                <select name="" id="">
                  {address?.map((data, index) =>
                    <option value="" key={index}>{data.localArea} {data.pincode}</option>
                  )}
                </select>
              )}

              {/* <div style={{ marginTop: "1rem" }}>
                <span>Sold By :</span> <Link to={`/seller-store/${productDetails.sellerDetails.sellerId}`} style={{ textDecoration: "none" }}><span style={{ color: "#02400C" }}>{productDetails.sellerDetails.name}</span></Link>
              </div> */}
              <div>
                {/* <span>Ship by :</span> <span style={{ color: "#02400C" }}>Thara Cart</span> */}
              </div>
            </div>

            <form onSubmit={handleCheckPincode} id='form-full' >
              <div className="pincode-checking" style={{ marginBottom: "1rem" }}>
                <input
                  style={{ paddingLeft: "10px" }}
                  type="text"
                  className='inputs'
                  placeholder="Enter Pincode"
                  value={pincode}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 6) {
                      // Allow only numeric values and restrict length to 6
                      setPincode(value);
                    }
                  }}
                />
                <button type="submit" disabled={pincode.length !== 6} className='btn'>
                  {pinCodeChecking ? "Checking" : "Check"}
                </button>
              </div>
              {/* Display warning if the pincode is not exactly 6 digits */}
              {pincode.length > 0 && pincode.length !== 6 && (
                <p style={{ color: "red", fontSize: "0.9rem", marginTop: "-0.5rem" }}>
                  Pincode must be 6 digits.
                </p>
              )}
              {result && (
                result === "This Pincode Is Deliverable" ? (
                  <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    Great! We deliver to this location.
                  </Alert>
                ) : (
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    Sorry, delivery is not available in this pincode.
                  </Alert>
                )
              )}
            </form>



          </div>
          {/* <div className="register-now-card">

            <div className="reg-left">
              <div className="star-img">
                <img src="/Images/star-deals.svg" className='star-logo' alt="" />
              </div>
              <div className='discoumt-container'><span style={{ fontWeight: "700" }}>Get Discount Upto <span style={{ color: "#28AF35" }}>₹200</span></span> <span> 10+ Coupons & Bank offers</span></div>

            </div>
            <div className="reg-right">
              <Link to='' style={{ color: "#111111" }}><FaChevronDown /></Link>
            </div>
          </div> */}

          {/* <div className="thara-online-store-container">
            <div className="store-container-left">
              <div><h3>Thara Online Store</h3></div>
              <div><h6>Thara Online Store</h6></div>
            </div>
            <div className="store-container-right">
              <img src="/Images/verified-star.svg" alt="" />
              <p>Verified Seller</p>
            </div>
          </div> */}


          {/* <div className="store-rating-container">
            <div className="store-rating">
              <p>Store Rating</p>
              <div className="store-rating-star">
                <h5>{averageSellerRating}</h5>
                {renderStars(averageSellerRating)}
              </div>
            </div>
            <div className="store-rating">
              <p>On-time Delivery Rate</p>
              <div className='store-rating-star' >
                <h5>98.68%</h5>

              </div>
            </div>
            <div className="store-rating">
              <p>Offer Response Time</p>
              <div className='store-rating-star' >
                <h5> {'<'}2.30 Hours</h5>

              </div>
            </div>

          </div> */}
          {/* <div className="store-rating">
            <p>Business type</p>
            <div className='store-rating-star' >
              <h5>Manufacturer & Trading</h5>

            </div>
          </div> */}


          {/* <div className="sellers-available-conatiner">
            <div className="sellers-available-left">
              <p>3 Other sellers available from</p>
              <span>₹200.50</span>
            </div>
            <div className="sellers-available-right">
              <Link to=''>View Options<MdOutlineKeyboardArrowRight className='MdOutlineKeyboardArrowRight' />
              </Link>
            </div>
          </div> */}

          <div className="register-card">
            <div className="reg-card-left">
              <img src="/Images/Vector (1).png" alt="" />
              <p className="save-text">Save up to 15% with Business Account</p>
              <span>You’ll get Wholesale Price & GST Input tax credit</span>
            </div>
            <div className="reg-card-right">
              <a href='https://b2b.tharacart.com/login'>Register Now</a>
            </div>

          </div>

          <div className="highlights">
            <h1>Highlights</h1>
            <div className="highlight-body">
              {/* keyFeatures */}
              <ul>
                {
                  productDetails.keyFeatures.map((data, index) =>
                    <li key={index}>
                      {data}
                    </li>
                  )
                }
              </ul>
            </div>
          </div>

          <div className="about-products">
            <h1>About Product</h1>
            <p>
              {productDetails.description}
            </p>
          </div>

          <div className="delivery-detail-card-wrapper">
            {
              productDetails.purchaseLimit && productDetails.purchaseLimit ? (
                <div className='delivery-card'>
                  <img src="/Images/Shopping.svg" alt="" />
                  <p>Purchase Limit</p>
                </div>
              ) : (
                ""
              )
            }
            {
              productDetails.tharaCartDelivery && productDetails.tharaCartDelivery ? (
                <div className='delivery-card'>
                  <img src="/Images/Delivery.svg" alt="" />
                  <p>Thara Cart
                    Delivery</p>
                </div>
              ) : (
                ""
              )
            }

            {
              productDetails.branded && productDetails.branded ? (
                <div className='delivery-card'>
                  <img src="/Images/GiftWrap.svg" alt="" />
                  <p>Gift Wrap</p>
                </div>
              ) : (
                ""
              )
            }

            {
              productDetails.cashOnDelivery && productDetails.cashOnDelivery ? (
                <div className='delivery-card'>
                  <img src="/Images/Group.svg" alt="" />
                  <p>Cash On Delivery</p>
                </div>
              ) : (
                ""
              )
            }

            {
              productDetails.minimumQuantity && productDetails.minimumQuantity ? (
                <div className='delivery-card'>
                  <img src="/Images/MOQ.svg" alt="" />
                  <p>Minimum
                    Qty</p>
                </div>
              ) : (
                ""
              )
            }

            {
              productDetails.branded && productDetails.branded ? (
                <div className='delivery-card'>
                  <img src="/Images/RegisterdBrand2.svg" alt="" />
                  <p>Registered Brand</p>
                </div>
              ) : (
                ""
              )
            }

            {
              productDetails.oneYearWarrenty && productDetails.oneYearWarrenty ? (
                <div className='delivery-card'>
                  <img src="/Images/1yearWarrety.svg" alt="" />
                  <p>1 Year
                    Warranty</p>
                </div>
              ) : (
                ""
              )
            }

            {
              productDetails.noWarrenty && productDetails.noWarrenty ? (
                <div className='delivery-card'>
                  <img src="/Images/nowarrenty.svg" alt="" />
                  <p>No
                    Warranty</p>
                </div>
              ) : (
                ""
              )
            }



            {
              productDetails.sevenDaysReplacement && productDetails.sevenDaysReplacement ? (
                <div className='delivery-card'>
                  <img src="/Images/7_day_.svg" alt="" />
                  <p>7 Days
                    Replacement</p>
                </div>
              ) : (
                ""
              )
            }

            {
              productDetails.nonReturnableItem && productDetails.nonReturnableItem ? (
                <div className='delivery-card'>
                  <img src="/Images/Frame%201261155094.svg" alt="" />
                  <p>Non
                    Returnable Item</p>
                </div>
              ) : (
                ""
              )
            }

            {
              productDetails.sevenDaysReturnable && productDetails.sevenDaysReturnable ? (
                <div className='delivery-card'>
                  <img src="/Images/7DayReturable.svg" alt="" />
                  <p>
                    7 Days
                    Returnable</p>
                </div>
              ) : (
                ""
              )
            }



          </div>

          <h2 className='more-details-heading'>More Details</h2>
          <div className="accordion" id="accordionExample">
            {/* <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                  In The Box
                </button>
              </h2>
              <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <span>1 Pack of Cardamom</span>
                </div>
              </div>
            </div> */}
            <div className="accordion-item gen-detail">
              <h2 className="accordion-header" id="headingTwo">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  General Details
                </button>
              </h2>
              <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <table>
                    <tr>
                      <td>Brand</td>
                      <th>{productDetails.brandDetails.brandName}</th>
                    </tr>
                    <tr>
                      <td>TCIN</td>
                      <th>{productDetails.tcin}</th>
                    </tr>

                    <tr>
                      <td>Made From</td>
                      <th>{productDetails.origin}</th>
                    </tr>
                    <tr>
                      <td>Weight  </td>
                      <th>{productDetails.weight}</th>
                    </tr>


                    {/* {productDetails.breadth && (
                      <tr>
                        <td>Breadth</td>
                        <th>{productDetails.breadth} cm</th>
                      </tr>
                    )} */}
                    {/* {productDetails.height && (
                      <tr>
                        <td>Height</td>
                        <th>{productDetails.height} cm</th>
                      </tr>
                    )} */}
                    {Object.keys(productDetails.features).map((key) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <th>{productDetails.features[key].value}</th>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            </div>
            {/* <div className="accordion-item">
              <h2 className="accordion-header" id="headingThree">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  Manufacturing, Packaging and Import Info
                </button>
              </h2>
              <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                </div>
              </div>
            </div> */}
            {/* <div className="accordion-item">
              <h2 className="accordion-header" id="headingFour">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseThree">
                  Cooking Instruction
                </button>
              </h2>
              <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                </div>
              </div>
            </div> */}
            {/* <div className="accordion-item">
              <h2 className="accordion-header" id="headingFive">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                  Legal Disclaimer
                </button>
              </h2>
              <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                </div>
              </div>
            </div> */}
          </div>
          <div className="rating-and-reviews-wrapper" >
            <div className="rating-section" ref={ratingSectionRef}>
              <h2>Ratings & Reviews</h2>
              <div className="rating-detail-wrapper" >
                <div className="rating-star-count" >
                  <div><p>{avgScore}</p></div>
                  <div className='rating-stars'>
                    {Array.from({ length: 5 }, (_, index) => {
                      const starValue = index + 1;
                      return (
                        <span key={index}>
                          {avgScore >= starValue
                            ? <FaStar className='fill-star-rated' />
                            : avgScore >= starValue - 0.5
                              ? <FaRegStarHalfStroke className='fill-star-rated' />
                              : <FaStar className='unfilled-star' />
                          }
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="rating-progress-bar">
                  <div className="individual-rate">
                    <span>5</span>
                    <FaStar className='fill-star-rated' />
                    <div className="progress-bar-main">
                      <div className="collapse-inner"
                        style={{
                          width: getProgressBarWidth(fiveRating),
                          height: '9px',
                          backgroundColor: '#5D1CAA',
                          borderRadius: '12px'
                        }}>
                      </div>
                    </div>
                  </div>
                  <div className="individual-rate">
                    <span>4</span>
                    <FaStar className='fill-star-rated' />
                    <div className="progress-bar-main">
                      <div className="collapse-inner"
                        style={{
                          width: getProgressBarWidth(fourRating),
                          height: '9px',
                          backgroundColor: '#5D1CAA',
                          borderRadius: '12px'
                        }}>
                      </div>
                    </div>
                  </div>
                  <div className="individual-rate">
                    <span>3</span>
                    <FaStar className='fill-star-rated' />
                    <div className="progress-bar-main">
                      <div className="collapse-inner"
                        style={{
                          width: getProgressBarWidth(threeRating),
                          height: '9px',
                          backgroundColor: '#5D1CAA',
                          borderRadius: '12px'
                        }}>
                      </div>
                    </div>
                  </div>
                  <div className="individual-rate">
                    <span>2</span>
                    <FaStar className='fill-star-rated' />
                    <div className="progress-bar-main">
                      <div className="collapse-inner"
                        style={{
                          width: getProgressBarWidth(twoRating),
                          height: '9px',
                          backgroundColor: '#5D1CAA',
                          borderRadius: '12px'
                        }}>
                      </div>
                    </div>
                  </div>
                  <div className="individual-rate">
                    <span>1</span>
                    <FaStar className='fill-star-rated' />
                    <div className="progress-bar-main">
                      <div className="collapse-inner"
                        style={{
                          width: getProgressBarWidth(oneRating),
                          height: '9px',
                          backgroundColor: '#5D1CAA',
                          borderRadius: '12px'
                        }}>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rating-buttons">
                  {
                    purchased ? (<div><button data-bs-toggle="modal" data-bs-target="#RateProductModal">Rate The Product</button></div>) : (<div>  <button onClick={NotPurchased}>Rate The Product</button></div>)
                  }
                  <button data-bs-toggle="modal" data-bs-target="#ReportProductModal">Report</button>
                </div>
                {showAlert && (
                  <NotPurchasedAlert
                    message="You cannot rate this product as it has not been purchased."
                    onClose={handleCloseAlert}
                  />
                )}
                {/* <!-- RateProductModal --> */}
                <div className="modal fade" id="RateProductModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content rating-modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Review Product</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                          <h3 className='rate-product-heading'>Product Details</h3>
                          <div className="rateproduct-prod-detail">
                            <div className="prod-image"><img src={productDetails.imageUrls} alt="" /></div>
                            <div className="prod-details">
                              <h4>{productDetails.name}</h4>
                              <p>{formattedDate}</p>
                              <span>TCIN : SFNM109898</span>
                            </div>
                          </div>
                          <div className="rating-stars">
                            {Array.from({ length: 5 }, (_, index) => {
                              const starValue = index + 1;
                              return (

                                <span key={index} onClick={() => handleRatingChange(starValue)}>
                                  {selectedRating >= starValue
                                    ? <FaStar className='fill-star-rated' />
                                    : selectedRating >= starValue - 0.5
                                      ? <FaRegStarHalfStroke className='fill-star-rated' />
                                      : <FaStar className='not-fill-star-rated' />
                                  }

                                </span>
                              );
                            })}
                          </div>
                          <div className="add-rating-image-section">
                            <h5>Add Photos or Videos</h5>
                            <div className="selected-image-wrapper">
                              <div className="file-upload">
                                <input
                                  type="file"
                                  id="file"
                                  className="file-input"
                                  multiple
                                  accept="image/*"
                                  onChange={handleFileChange}
                                />
                                <label htmlFor="file" className="file-label">
                                  <span className="plus-sign">+</span>
                                </label>
                              </div>
                              {selectedImages.length > 0 &&
                                selectedImages.map((image, index) => (
                                  <div className="selected-image" key={index}>
                                    <img src={image} alt={`Selected ${index + 1}`} />
                                  </div>
                                ))}
                            </div>
                          </div>
                          <h2 className="avg-prod-text">Why is it an average product?</h2>
                          <div className="prod-comment-wrapper">
                            <div><label htmlFor="review">Review</label></div>
                            <input
                              type="text"
                              id="review"
                              value={userReview.review} // Updated to use userReview.review
                              onChange={(e) => setUserReview(prevState => ({
                                ...prevState,
                                review: e.target.value
                              }))} // Updated to set review
                            />
                          </div>
                          <div className="prod-comment-wrapper">
                            <div><label htmlFor="comment">Write Comments (Optional)</label></div>
                            <textarea
                              id="comment"
                              value={userReview.comment} // Updated to use userReview.comment
                              onChange={(e) => setUserReview(prevState => ({
                                ...prevState,
                                comment: e.target.value
                              }))} // Updated to set comment
                            ></textarea>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button type="submit" className="btn btn-primary">Apply Ratings</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                {/* <!-- ReportProductModal --> */}
                <div
                  className="modal fade"
                  id="ReportProductModal"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          Report Product
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={handleClose}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <h4 className="what-is-issue-heading">What is the issue?</h4>
                        <div className="issue-list">
                          <div className="radio-group">
                            {[
                              "Incorrect Information",
                              "Counterfeit Products",
                              "Copyright & Trademarks Violation",
                              "Others",
                            ].map((issue, index) => (
                              <div
                                key={index}
                                style={{ display: "flex", alignItems: "center", gap: "12px" }}
                              >
                                <input
                                  type="radio"
                                  id={`option${index}`}
                                  name="selectedIssue"
                                  className="radio-input"
                                  value={issue}
                                  checked={reportFormData.selectedIssue === issue}
                                  onChange={handleInputChange}
                                />
                                <label htmlFor={`option${index}`} className="radio-label">
                                  {issue}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="comment-section">
                          <p>Any Comments</p>
                          <textarea
                            name="comments"
                            placeholder="Enter your comments here..."
                            value={reportFormData.comments}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-primary"
                          // onClick={handleSubmit}
                          data-bs-dismiss="modal"
                        >
                          Submit Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>


                {/* AddtoList Modal */}
                <div className="modal fade" id="AddtoListModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog" >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Add to List</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleListClose}></button>
                      </div>
                      <div className="modal-body">
                        <button
                          className='create-new-btn'
                          data-bs-toggle="modal"
                          data-bs-target="#createlistmodal"
                          onClick={handleListClose} >
                          + Create New List
                        </button>

                        <div className="list-options">
                          <label className='list-item' htmlFor="wishlist-checkbox">
                            <input
                              type="checkbox"
                              value="wishlist"
                              id="wishlist-checkbox"
                              className="list-checkbox"
                              checked={wishlistSelected}
                              onChange={() => {
                                setWishlistSelected(!wishlistSelected);
                                setSelectedListId(null); // Clear list selection
                              }}
                              disabled={loading}
                            />
                            {isInWishlist ? ' Remove from My wishlist' : ' Save to My wishlist'}
                          </label>
                        </div>

                        {Array.isArray(sharableList?.sharableLists) && sharableList.sharableLists.length > 0 ? (
                          sharableList.sharableLists.map((list) => {
                            const isInList = listsWithProduct.some(l => l.id === list.id);
                            return (
                              <div className="list-options" key={list.id}>
                                <label className="list-item" htmlFor={`list-${list.id}`}>
                                  <input
                                    type="checkbox"
                                    id={`list-${list.id}`}
                                    name="list"
                                    className="list-checkbox"
                                    onChange={() => {
                                      if (loading) return;
                                      setSelectedListId(selectedListId === list.id ? null : list.id);
                                      setWishlistSelected(false); // Clear wishlist selection
                                    }}
                                    checked={selectedListId === list.id}
                                    disabled={loading}
                                  />
                                  {isInList ? `Remove from ${list.listName}` : `Save to ${list.listName}`}
                                </label>
                              </div>
                            );
                          })
                        ) : (
                          <p>No List found!</p>
                        )}
                      </div>

                      <div className="modal-footer">
                        {wishlistSelected ? (
                          // Wishlist button
                          <button
                            type="button"
                            id='whishlist-modal-btn'
                            className="btn btn-primary"
                            disabled={loading}
                            onClick={async () => {
                              setLoading(true);
                              try {
                                if (isInWishlist) {
                                  await removeWishListProd(prodId); // Make sure you're passing any required parameters
                                  await wishListRefetch();
                                  setWishlistSelected(false);
                                } else {
                                  await addToWishList(prodId);
                                }
                                await wishListRefetch(); // Refresh wishlist data
                                handleListClose();
                                // alert(isInWishlist ? 'Removed from Wishlist' : 'Added to Wishlist');

                                const modal = bootstrap.Modal.getInstance(document.getElementById('AddtoListModal'));
                                modal?.hide();
                                document.body.classList.remove('modal-open');
                                const backdrop = document.querySelector('.modal-backdrop');
                                backdrop?.remove();

                              } catch (error) {
                                console.error('Error processing wishlist:', error);
                                setError(error.response?.data?.message || 'Error processing wishlist');
                              }
                              setLoading(false);
                              setWishlistSelected(false);
                            }}
                          >
                            {loading ? 'Processing...' : (isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist')}
                          </button>
                        ) : (
                          // Regular list button
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={!selectedListId || loading}
                            onClick={addToExistingList}
                          >
                            {loading ? 'Processing...' :
                              (listsWithProduct.some(list => list.id === selectedListId) ? 'Remove from List' : 'Add to List')}
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                </div>

                {/* create new list */}

                <div class="modal fade" id="createlistmodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Create New List</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <label htmlFor="listName">List Name *</label>
                        <div className="new-list">
                          <input
                            type="text"
                            id="listName"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            placeholder="Enter sharable list name"
                            className="styled-input"
                          />
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary"
                          onClick={() => createNewList()}
                          disabled={!newListName || loading}
                        >Save List</button>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>


            {productRatings?.message ? (
              // Display the message if there is no data
              <div className='noRevew'>{productRatings.message}</div>
            ) : (
              // Display the reviews if productRatings is an array
              productRatings?.map((data, index) => (
                <div className="review-section" key={index}>
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < data.rating ? 'fill-star-rated' : 'fill-star-rated not-fill'}
                      />
                    ))}
                  </div>
                  <p className='review-title'>{data.review}</p>
                  <div className="user-details">
                    <p>{data.userDetails.name}</p>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <img src="/Images/Icon.png" alt="" />
                      <p>Verified Purchase</p>
                    </div>
                  </div>
                  <p className="rate-discription">{data.comment}</p>
                  <div className="review-image-section">
                    {data.mediaUrl?.map((url, index) => (
                      <div className="review-image" key={index} onClick={() => handleImageClick(url.url)}>
                        <img src={url.url} alt="" />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
            <Modal isOpen={isModalOpen} onClose={closeModal} imageUrl={modalImage} />



            {/* <div className="seeMoreReviewBtn"><button>See More Reviews</button></div> */}
          </div>
          {qna?.length?.length > 0 ? (
            <div className="faq-section-wrapper">
              <div className="faq-head"><h2>Questions & Answers</h2></div>
              <div className="listOfQstns">
                {

                  qna?.map((data) =>
                    <>
                      <div className='qstn' style={{ display: "flex", gap: "5px" }}>
                        <span>Q :</span>
                        <span>{data.question}</span>
                      </div>
                      <div className='anser' style={{ display: "flex", gap: "5px" }}>

                        {data.answers.map((data) =>
                          <>
                            <span>A :</span>
                            <span>{data.ans}</span>
                          </>
                        )}
                      </div>
                      <p className="user">{data.customerDetails.name}</p>
                    </>
                  )

                }
                {/* <div className='qstn' style={{ display: "flex", gap: "5px" }}>
                <span>Q :</span>
                <span>From which coutry Indomie is imported</span>
              </div> */}
                {/* <p className="first-answer">
                Be the first one to asnswer
              </p> */}
              </div>
              {/* <div className="seemore-faq-btn">
              <button>See More Q&A</button>
            </div> */}
            </div>
          ) : ''}

        </div>
      </div>
      <BottomBar />
      <Footer />
    </div>
  );
};

export default ProductInnerPage;