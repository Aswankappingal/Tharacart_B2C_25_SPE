import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BottomBar from '../BottomBar/BottomBar';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import './OrderInnerPageCancellation.scss';
import { PiWarningCircleLight } from "react-icons/pi";
import { useOrderCancel } from '../../redux/hooks/OrderCancelPageHook/useOrdercancel.js';
import baseUrl from '../../baseUrl';

const OrderInnerPageCancellation = ({ rightSection, setRightSection }) => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState([]);
    const [cancellationReason, setCancellationReason] = useState('');
    const [refundMethod, setRefundMethod] = useState('original');
    const [localError, setLocalError] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleNavigateToMyorders = () => {
        setRightSection('my-orders'); // Update the right section to Wishlist
    };

    // Get data from Redux
    const { orderCancelData, status, error: reduxError } = useOrderCancel(orderId);

    // Use Redux data instead of separate state
    const orderDetails = orderCancelData || {}; // Ensure orderDetails is never undefined
    const isLoading = status === 'loading';
    const error = reduxError || localError;

    useEffect(() => {
        console.log(orderCancelData, 'orderCancelData from component');
        console.log(status, 'status from Redux');
    }, [orderCancelData, status]);

    // Handle item selection
    const handleItemSelection = (productId) => {
        setErrorMessage('');

        if (selectedItems.includes(productId)) {
            const updatedItems = selectedItems.filter(id => id !== productId);
            setSelectedItems(updatedItems);
            // If no items are selected anymore, reset the reason
            if (updatedItems.length === 0) {
                setCancellationReason('');
            }
        } else {
            setSelectedItems([...selectedItems, productId]);
        }
    };

    // Handle reason selection
    const handleReasonChange = (reason) => {
        setCancellationReason(reason);
        setErrorMessage('');
        setIsDropdownOpen(false);
    };

    // Handle refund method selection
    const handleRefundMethodChange = (method) => {
        setRefundMethod(method);
    };

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Modify your handleCancelOrder to use validation
    const handleCancelOrder = async () => {
        if (selectedItems.length === 0) {
            setErrorMessage('Please select at least one item to cancel');
            return;
        }

        if (!cancellationReason) {
            setErrorMessage('Please select a cancellation reason');
            return;
        }

        try {
            // Update to send all selected items as an array
            const response = await axios.post(`${baseUrl}/cancel-order`, {
                orderId,
                productIds: selectedItems, // Send all selected items as an array
                cancellationReason,
                refundMethod
            });

            if (response.data.success) {
                alert('Order cancelled successfully');
                if (setRightSection) {
                    setRightSection('my-orders');
                }
                navigate('/my-account'); // Redirect to orders page
                handleNavigateToMyorders();

            } else {
                setErrorMessage(response.data.message || 'Failed to cancel order');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            setLocalError('An error occurred while cancelling the order');
            setErrorMessage('An error occurred while cancelling the order');
        }
    };

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    const cancellationReasons = [
        "I found a better price elsewhere",
        "I entered wrong address",
        "I ordered the wrong product",
        "I changed my mind",
        "Delivery time is too long",
        "Other reason"
    ];

    // Helper function to safely format date
    const formatDate = (dateObj) => {
        if (!dateObj) return 'N/A';

        try {
            // Check if the date is a Firestore timestamp
            if (dateObj._seconds) {
                return new Date(dateObj._seconds * 1000).toLocaleDateString();
            }

            // Check if it's a regular date string
            if (typeof dateObj === 'string') {
                return new Date(dateObj).toLocaleDateString();
            }

            // If it's already a Date object
            if (dateObj instanceof Date) {
                return dateObj.toLocaleDateString();
            }

            return 'N/A';
        } catch (e) {
            console.error('Error formatting date:', e);
            return 'N/A';
        }
    };

    // Get product items safely
    const getProductItems = () => {
        if (!orderDetails?.product?.items) {
            // If items is not directly available, try to create it from product data
            return orderDetails?.product?.productName ?
                [{
                    productId: orderDetails.product.productId || 'unknown',
                    productName: orderDetails.product.productName,
                    productImage: orderDetails.product.productImage,
                    productPrice: orderDetails.product.totalAmount || orderDetails.product.amount || 0,
                    quantity: orderDetails.quantity || 1
                }] : [];
        }
        return orderDetails.product.items;
    };

    // Calculate order amount for selected items
    const calculateSelectedAmount = () => {
        const items = getProductItems();
        if (!selectedItems.length || !items.length) {
            return 0;
        }

        return items
            .filter(item => selectedItems.includes(item.productId))
            .reduce((sum, item) => sum + ((item.productPrice || 0) * (item.quantity || 1)), 0);
    };

    const productItems = getProductItems();

    return (
        <div className='order-cancellation-mainpage'>
            <Navbar />
            <div className="order-sub-body">
                <h1>Cancel & Support</h1>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-4">
                            <ul className="image-list">
                                <h1>Items in this order</h1>
                                {productItems?.length > 0 ? (
                                    productItems.map((item) => (
                                        <li key={item.productId}>
                                            <input
                                                type="checkbox"
                                                id={`product-${item.productId}`}
                                                checked={selectedItems.includes(item.productId)}
                                                onChange={() => handleItemSelection(item.productId)}
                                            />
                                            <label htmlFor={`product-${item.productId}`}>
                                                <img src={item.productImage || "/Images/trend prod2.svg"} alt={item.productName} />
                                            </label>
                                            <div className="product-description">
                                                <p>{item.productName || 'Unnamed Product'}</p>
                                                <div className="product-detail">
                                                    <span>Qty: {item.quantity || 1}</span>
                                                    <span>Price: ₹{item.productPrice || 0}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li>No items found in this order</li>
                                )}
                            </ul>
                        </div>
                        <div className="col-lg-4">
                            <div className="cancellation-card">
                                <div className="containeer-heading">
                                    <h1>Cancellation Reason</h1>
                                </div>

                                <div className="reason-container">
                                    <label>Reasons *</label>
                                    {/* Dropdown with radio buttons */}
                                    <div className="custom-dropdown">
                                        <div
                                            className="dropdown-header"
                                            onClick={toggleDropdown}
                                        >
                                            {cancellationReason || 'Select a reason'}
                                            <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
                                        </div>

                                        {isDropdownOpen && (
                                            <div className="dropdown-content">
                                                {cancellationReasons.map((reason, index) => (
                                                    <div key={index} className="dropdown-item">
                                                        <label className="radio-container">
                                                            <input
                                                                type="radio"
                                                                name="cancellation-reason"
                                                                checked={cancellationReason === reason}
                                                                onChange={() => handleReasonChange(reason)}
                                                            />
                                                            <span className="radio-checkmark"></span>
                                                            <span className="radio-label">{reason}</span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="overviw-container">
                                <div className="overvie-heading">
                                    <h1>Overview</h1>

                                    <div className="overviw-details">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td><span>Order ID</span></td>
                                                    <td>{orderDetails?.id || orderDetails?.orderId || orderId || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <td><span>Order Date</span></td>
                                                    <td>{formatDate(orderDetails?.orderDate)}</td>
                                                </tr>
                                                <tr>
                                                    <td><span>Payment Method</span></td>
                                                    <td>{orderDetails?.paymentMode || 'N/A'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <h1>Refund Amount Summary</h1>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td><span>Order Amount</span></td>
                                                    <td>₹{calculateSelectedAmount()}</td>
                                                </tr>
                                                {/* <tr>
                                                    <td><span>Processing Fee</span></td>
                                                    <td>₹0 | <span id='cancel'>Free cancellation</span></td>
                                                </tr>
                                                <tr>
                                                    <td><span>Cancellation Fee</span></td>
                                                    <td>₹0 | <span id='cancel'>Free cancellation</span></td>
                                                </tr> */}
                                            </tbody>
                                        </table>

                                        <div className="refund-method">
                                            <h1>Select Refund Method</h1>
                                            <label className="custom-radio">
                                                <input
                                                    type="radio"
                                                    name="refund-method"
                                                    value="original"
                                                    checked={refundMethod === 'original'}
                                                    onChange={() => handleRefundMethodChange('original')}
                                                />
                                                <span className="radio-button"></span>
                                                Original Payment Method <span><PiWarningCircleLight className='warning' /></span>
                                            </label>
                                            <label className="custom-radio">
                                                <input
                                                    type="radio"
                                                    name="refund-method"
                                                    value="wallet"
                                                    checked={refundMethod === 'wallet'}
                                                    onChange={() => handleRefundMethodChange('wallet')}
                                                />
                                                <span className="radio-button"></span>
                                                Wallet
                                            </label>
                                        </div>

                                        {errorMessage && <div className="error-message">{errorMessage}</div>}

                                        <div className="cancel-oredr-btn">
                                            <button
                                                onClick={handleCancelOrder}
                                                disabled={selectedItems.length === 0 || !cancellationReason || isLoading}
                                                className={selectedItems.length > 0 && cancellationReason ? 'active-btn' : 'disabled-btn'}
                                            >
                                                {isLoading ? 'Processing...' : 'Cancel Order'}
                                            </button>
                                            <button className='btn1' onClick={() => navigate(`/order/${orderId}`)}>
                                                Don't Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BottomBar />
            <Footer />
        </div>
    );
}

export default OrderInnerPageCancellation;