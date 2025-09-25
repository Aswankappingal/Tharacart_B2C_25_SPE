import { useEffect, useState } from 'react'
import { CiSearch, CiStar } from "react-icons/ci";
import { FaAngleLeft, FaRegStar } from "react-icons/fa6";
import { RiShareForwardLine } from "react-icons/ri";
import './WhishList.scss'
import axios from 'axios';
import baseUrl from '../../../baseUrl';
import AddToCartAlert from '../../AddToCartAlert/AddToCartAlert';
import { useDispatch } from 'react-redux';
import { removeFromWishList } from '../../../redux/slices/cartSlices/removeWishlistProdSlice';
import ScrollToTopOnMount from '../../ScrollToTopOnMount';
import useCartProduct from '../../../redux/hooks/cartPageHooks/useCartProduct';
import { Link, useNavigate } from 'react-router-dom';
import useWishListProducts from '../../../redux/hooks/cartPageHooks/useWishListProducts';
import useSharableList from '../../../redux/hooks/cartPageHooks/useShareblelistProduct';



const WhishList = ({ wishList, refetch }) => {
    const [selectedList, setSelectedList] = useState('yourList');
    const [cartAlertVisible, setCartAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('Item Added to Cart');
    const [searchTerm, setSearchTerm] = useState(''); // New state for search term
    const [removingWishItem, setRemovingWishItem] = useState(false)
    const quantity = 1;
    const dispatch = useDispatch();
    const { refetch: cartRefetch, cartProduct } = useCartProduct();
    const { wishListProduct, status: wishlisStatus, error: wishlistError, refetch: wishListRefetch } = useWishListProducts();// Include refetch

    const { sharableList, handleListSelect, selectedListProducts, refetch: sharablerefetch } = useSharableList();
    const [selectedListId, setSelectedListId] = useState(null);



    const [deleteError, setDeleteError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);




    const selectedListDetails = selectedListId &&
        sharableList?.sharableLists?.find(list => list.id === selectedListId);



    const addToCart = async (productId, quantity) => {
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
                `${baseUrl}/move-to-cart`,
                { productId, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            setAlertMessage('Item Added to Cart');
            setCartAlertVisible(true);
            refetch();
            wishListRefetch();
            setTimeout(() => setCartAlertVisible(false), 4000);
        } catch (error) {
            console.log(error);
            setAlertMessage('Failed to add item to cart. Please try again.');
            setCartAlertVisible(true);
            setTimeout(() => setCartAlertVisible(false), 4000);
        }
    };


    const handleRemoveList = async (listId, itemId) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found');
                return;
            }

            const response = await axios.delete(
                `${baseUrl}/delete-item-sharable-list/${listId}/items/${itemId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (response.status === 200) {
                // Refresh the sharable list data after successful removal

                await sharablerefetch();
            }
        } catch (error) {
            console.error("Error removing item:", error);
            alert(error.response?.data?.message || "Failed to remove item from list");
        }
    };



    const handleDeleteList = async (id, e) => {
        // Prevent event bubbling to parent div
        e.stopPropagation();

        try {
            setIsDeleting(true);
            setDeleteError('');

            const token = localStorage.getItem('authToken');

            const response = await axios.delete(`${baseUrl}/delete-sharable-list/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                await sharablerefetch();
            }
        } catch (error) {
            console.error('Error deleting list:', error);
            setDeleteError(error.response?.data?.message || 'Failed to delete list');
        } finally {
            setIsDeleting(false);
        }
    };


    const removeWishListProd = async (productId) => {
        setRemovingWishItem(true)
        try {
            await dispatch(removeFromWishList(productId));
            refetch();
        } catch (error) {
            console.log(error);
        } finally {
            setRemovingWishItem(false)
        }
    };

    // Filter the wishlist based on the search term
    const filteredWishList = wishListProduct ? wishListProduct.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];



    // Automatically select the first list when component mounts or sharableList changes
    useEffect(() => {
        if (sharableList?.sharableLists?.length > 0 && !selectedListId) {
            const firstListId = sharableList.sharableLists[0].id;
            setSelectedListId(firstListId);
            // handleListSelect(firstListId);
        }
    }, [sharableList, selectedListId]);




    // console.log("itemsss", item)

    // const selectedListDetails = selectedListId &&
    //     sharableList?.sharableLists?.find(list => list.id === selectedListId);

    const onListItemClick = (listId) => {
        setSelectedListId(listId);
        // handleListSelect(listId);
    };

  

    const handleShare = (id, listName) => {  // Changed listId to id to match your data structure
        // Get the current base URL
        const currentUrl = `${window.location.origin}${window.location.pathname}`;
        // Add the list ID as a parameter
        const shareUrl = `${currentUrl}?listId=${id}`;  // Using id instead of listId

        if (navigator.share) {
            navigator.share({
                title: `Shared List: ${listName}`,
                text: `Check out this list: ${listName}`,
                url: encodeURI(shareUrl),
            })
                .then(() => console.log('Successfully shared'))
                .catch((error) => console.error('Error sharing:', error));
        } else {
            // Fallback for browsers that don't support Web Share API
            alert(`Your browser does not support the Web Share API.
          You can copy the link to share: ${shareUrl}`);
        }
    };


    return (
        <div className='WhisListMainWrapper'>
            <AddToCartAlert
                visible={cartAlertVisible}
                onClose={() => setCartAlertVisible(false)}
                message={alertMessage}
            />
            <ScrollToTopOnMount />
            <div className="whislistSection">
                <div className="welcome-head">
                    <Link className='back' onClick={() => window.location.reload()}>
                        <div className="arrow-icon">
                            <FaAngleLeft style={{ color: 'white' }} />
                        </div>
                    </Link>

                </div>
                <div className="whishlist-main-card">
                    <div className="whishListHeader">
                        <div className={`lists ${selectedList === 'yourList' ? "active-list" : ""}`} onClick={() => setSelectedList('yourList')}>Your List</div>
                        <div className={`lists ${selectedList === 'sharedList' ? "active-list" : ""}`} onClick={() => setSelectedList('sharedList')}>Shared List</div>
                    </div>
                    {
                        selectedList === 'yourList' && (
                            <>
                                <div className="your-list-wrapper">
                                    <div className="your-list-left">
                                        <div className="list-item">
                                            <h4>Your Wishlist</h4>
                                            <button className='Default'>Default</button>
                                            <button>Private</button>
                                        </div>
                                        {/* <div className="list-item">
                                            <h4>Wishlist 2</h4>
                                            <button>Private</button>
                                        </div> */}
                                    </div>
                                    <div className="your-list-right">
                                        <div className="your-list-right-header">
                                            <div className='wishlist-header'>
                                                <h1>Your Wishlist</h1>
                                                <p>{filteredWishList.length} Products</p>
                                            </div>
                                            <div className='search-input'>
                                                <div className="searc-bar">
                                                    <CiSearch className='search-icon' />
                                                    <input
                                                        type="text"
                                                        placeholder='Search Product Name, TCIN'
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
                                                    />
                                                </div>
                                                {/* <button>Search</button> */}
                                            </div>
                                        </div>
                                        <div className="whish-list-item-wrapper">
                                            {
                                                filteredWishList.map((data, index) => {
                                                    const totalRatings = data.oneRating + data.twoRating + data.threeRating + data.fourRating + data.fiveRating;
                                                    const averageRating = totalRatings > 0
                                                        ? ((1 * data.oneRating) + (2 * data.twoRating) + (3 * data.threeRating) + (4 * data.fourRating) + (5 * data.fiveRating)) / totalRatings
                                                        : 0;

                                                    const isInCart = cartProduct.some((cartItem) => cartItem.productId === data.productId);

                                                    const handleAddToCart = async (productId, quantity) => {
                                                        await addToCart(productId, quantity);
                                                        cartRefetch();
                                                    };

                                                    return (
                                                        <div className="whish-list-item row" key={index}>
                                                            <div className="col-lg-8 col-sm-12 wish-list-item-left">
                                                                <div className="prod-image">
                                                                    <img src={data.imageUrls} alt={data.name} />
                                                                </div>
                                                                <div className="prod-details">
                                                                    <p className="prod-description">{data.name}</p>
                                                                    <div className="price-details">
                                                                        <span className="offer-price">₹{data.offerPrice.toFixed(2)}</span>
                                                                        <span className="og-price">
                                                                            <strike>₹{data.price.toFixed(2)}</strike>
                                                                        </span>
                                                                        <div className="offer-rating">
                                                                            <div>
                                                                                <span className="offer-ratio">
                                                                                    {Math.round(((data.price - data.offerPrice) / data.price) * 100)}% OFF
                                                                                </span>
                                                                            </div>
                                                                            <div className="rating-box">
                                                                                <FaRegStar className="star" />
                                                                                <span>{averageRating.toFixed(1)}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-4 col-sm-12 wish-list-item-right">
                                                                <div>
                                                                    {isInCart ? (
                                                                        <button className="go-to-cart">
                                                                            Go to Cart
                                                                        </button>
                                                                    ) : (
                                                                        <button className="add-two-cart" onClick={() => handleAddToCart(data.productId, 1)}>
                                                                            Add To Cart
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <button disabled={removingWishItem} onClick={() => removeWishListProd(data.productId)}>{removingWishItem ? 'Removing' : 'Remove'}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })

                                            }
                                        </div>

                                    </div>
                                </div>
                            </>
                        )
                    }


                    {

                        selectedList == 'sharedList' && (
                            <>
                                <div className="your-list-wrapper">

                                    <div className="your-list-left">
                                        {sharableList?.sharableLists?.map(({ id, listName }) => (
                                            <div
                                                key={id}
                                                className={`list-item ${id === selectedListId ? 'selected' : ''}`}
                                                onClick={() => onListItemClick(id)}
                                            >
                                                <h4>{listName}</h4>
                                                <button className="Default"

                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent triggering the parent div's onClick
                                                        handleShare(id, listName);
                                                    }}


                                                >Share</button>
                                                <button onClick={(e) => {
                                                    handleDeleteList(id, e)
                                                    disabled = { isDeleting }
                                                }}>

                                                    {isDeleting ? 'Deleting...' : 'Remove'}

                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="your-list-right">
                                        {selectedListDetails ? (
                                            <>
                                                <div className="your-list-right-header">
                                                    <div>
                                                        <h1>{selectedListDetails.listName}</h1>
                                                        <p>{selectedListDetails.products?.length || 0} Products</p>
                                                    </div>
                                                </div>

                                                <div className="products-container">
                                                    {status === 'loading' ? (
                                                        <div className="loading">Loading...</div>
                                                    ) : selectedListDetails.products?.length > 0 ? (
                                                        selectedListDetails.products.map((product) => (
                                                            <div key={product.productId} className="your-list-header-m">
                                                                <div className="list-header-image">
                                                                    <img
                                                                        src={product.imageUrls?.[0]}
                                                                        alt={product.name}
                                                                        loading="lazy"
                                                                    />
                                                                </div>
                                                                <div className="list-header-texts">
                                                                    <p>{product.name}</p>
                                                                    <div className="offer-rating-full">
                                                                        <div>
                                                                            <p>₹ {product.sellingPrice}.00</p>
                                                                        </div>
                                                                        {product.price && (
                                                                            <div>
                                                                                <strike>₹{product.price}.00</strike>
                                                                            </div>
                                                                        )}
                                                                        <div className="texts-offer-rating">
                                                                            {product.discountPercentage && (
                                                                                <div>
                                                                                    <span>{product.discountPercentage.toFixed(1)}% OFF</span>
                                                                                </div>
                                                                            )}
                                                                            {(product.fiveRating || product.fourRating) && (
                                                                                <div className="star-m">
                                                                                    <span>
                                                                                        <CiStar id='starsssss' />
                                                                                        {((product.fiveRating * 5 + product.fourRating * 4) /
                                                                                            (product.fiveRating + product.fourRating)).toFixed(1)}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    {/* <div className="product-details">
                                                                        <p className="description">{product.description}</p>
                                                                        <p className="stock">Stock: {product.stock}</p>
                                                                    </div> */}

                                                                    <div className="product-buttons">
                                                                        <Link className="view-product-button" to={`/product-page/${product.productId}`} >
                                                                            View Product
                                                                        </Link>
                                                                        <button className="remove-product-button" onClick={() => handleRemoveList(selectedListDetails.id, product.productId)}>
                                                                            Remove

                                                                        </button>

                                                                    </div>



                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="no-products">No products found</div>
                                                    )}
                                                </div>
                                            </>
                                        ) : null}




                                    </div>

                                </div>
                            </>
                        )

                    }

                </div>
            </div>
        </div>
    )
}

export default WhishList;