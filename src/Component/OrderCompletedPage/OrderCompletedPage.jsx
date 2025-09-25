import { useParams } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import './OrderCompltedPage.scss';
import useFetchUser from '../../redux/hooks/myAccountHooks/useFetchUser';
import { useEffect, useMemo } from 'react';
import ScrollToTopOnMount from '../ScrollToTopOnMount';
import { useOrderedCompletedProducts } from '../../redux/hooks/orderCompletedPageHooks/useOrderedCompletedProducts';

const OrderCompletedPage = () => {
    const { parentOrderId } = useParams();
    console.log(parentOrderId);

    const { user, status, error } = useFetchUser();
    const { orders, status: orderStatus, error: orderError } = useOrderedCompletedProducts(parentOrderId);

    useEffect(() => {
        console.log("orders", orders);
    }, [orders]);

    // Function to format the delivery date
    function formatDeliveryDate(timestamp) {
        const milliseconds = timestamp._seconds * 1000;
        const date = new Date(milliseconds);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        return `Est. Delivery by ${formattedDate}`;
    }

    const totalSavings = useMemo(() => {
        if (!orders || !Array.isArray(orders) || orders.length === 0) return 0;
        return orders.reduce((total, order) => {
            if (!order.product?.items) return total;
            return total + order.product.items.reduce((sum, item) => {
                const crossedPrice = item.productDetails?.price || 0;
                const offerPrice = item.productDetails?.offerPrice || 0;
                return sum + (crossedPrice - offerPrice);
            }, 0);
        }, 0);
    }, [orders]);

    // Calculate total price of products
    const totalProductsPrice = useMemo(() => {
        if (!orders || !Array.isArray(orders) || orders.length === 0) return 0;
        return orders.reduce((total, order) => {
            if (!order.product?.items) return total;
            return total + order.product.items.reduce((sum, item) => sum + (item.productPrice || 0), 0);
        }, 0);
    }, [orders]);

    const totalAmountWithDiscount = useMemo(() => {
        if (!orders || !Array.isArray(orders) || orders.length === 0) return 0;

        const subtotal = totalProductsPrice;
        let coinDiscount = 0;

        // Calculate coin discount if coins were used
        if (orders[0]?.creditCoins > 0) {
            coinDiscount = orders[0].creditCoins * orders[0].coinValue;
        }

        // Subtract coin discount from subtotal
        return subtotal - coinDiscount;
    }, [orders, totalProductsPrice]);

    if (orderStatus === 'loading') {
        return <div>Loading...</div>
    }
    
    if (orderStatus === 'failed') {
        return <div>Error: {orderError}</div>
    }

    if (!orders || orders.length === 0) {
        return <div>No orders found</div>
    }

    return (
        <div className='OrderCompltedMainWrapper'>
            <ScrollToTopOnMount />
            <Navbar />
            <div className="order-completed-page">
                <div className="thanks-container">
                    <div className='thanks-container-left'>
                        <img src="/Images/Frame 1261155039.png" alt="" />
                        <div>
                            <h3>Thanks for shopping with us</h3>
                            <p>An email confirming the Order ID : {parentOrderId} has been sent your mail <br /> address {user?.email}</p>
                            <span>You save ₹{totalSavings.toFixed(2)} on this order</span>
                        </div>
                    </div>
                    <div className="thanks-container-right">
                        {/* <button>View Order Details</button> */}
                    </div>
                </div>
                {/* =======================order-summery=================== */}
                <div className="container-fluid">
                    <div className="order-summery-payment-summery-wrapper row">
                        <div className="col-lg-8 col-md-8 col-sm-12 order-summery-section">
                            <div className="order-summery-card">
                                <h3 className="order-item-heading">Order Summary</h3>
                                {orders.map((order, orderIndex) =>
                                    order.product?.items?.map((data, productIndex) => (
                                        <div
                                            className="order-item-main-wrapper row"
                                            key={`${orderIndex}-${productIndex}`}
                                        >
                                            <div className="col-lg-9 order-details">
                                                <div className="product-image">
                                                    <img src={data.productImage} alt="" />
                                                </div>
                                                <div className="prod-details">
                                                    <p className="delivery-date">
                                                        {order.expectedDeliveryDate && formatDeliveryDate(order.expectedDeliveryDate)}
                                                    </p>
                                                    <p className="prod-discription">{data.productName}</p>
                                                    <span className="brand">
                                                        <span>Brand</span>
                                                        <span>{data.brandDetails?.brandName}</span>
                                                    </span>
                                                    <span className="sold-by">
                                                        <span>Sold by</span>
                                                        <span>{data.sellerDetails?.storedetails?.storename}</span>
                                                    </span>
                                                    <span className="quantity">
                                                        <span>Quantity</span>
                                                        <span>{data.quantity}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 price-details">
                                                <div>
                                                    <span className="offer-price">₹{(data.productPrice || 0).toFixed(2)}</span>
                                                    <span className="og-price">
                                                        <strike>₹{data.productDetails?.price}</strike>
                                                    </span>
                                                    <span className="gst">Incl. GST</span>
                                                </div>
                                                <div>
                                                    <span className="offer-ratio">
                                                        {data.productDetails?.price && data.productDetails?.offerPrice 
                                                            ? Math.round(((data.productDetails.price - data.productDetails.offerPrice) / data.productDetails.price) * 100)
                                                            : 0}% OFF
                                                    </span>

                                                    <span className="saved-price">
                                                        You Save ₹{((data.productDetails?.price || 0) - (data.productDetails?.offerPrice || 0)).toFixed()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="delivefry-fee">
                                                        <strike>₹40.00</strike> |{" "}
                                                        <span className="free-delivery">Free Delivery</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )) || []
                                )}
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12 payment-summery-section">
                            <div className="payment-summery-card">
                                <h3>Payment Summary</h3>
                                <table>
                                    <tr>
                                        <td className="left-td">Payment Method</td>
                                        <td className="right-td">{orders[0]?.paymentMode === 'COD' ? 'Cash on Delivery' : 'Prepaid'}</td>
                                    </tr>
                                    <tr>
                                        <td className="left-td">Sub Total</td>
                                        <td className="right-td">₹{totalProductsPrice.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="left-td">Shipping Charges</td>
                                        <td className="right-td"><strike>₹40.00</strike> | <span className="free-delivery">Free Delivery</span></td>
                                    </tr>
                                    {orders.map((data, index) => (
                                        data.creditCoins > 0 && (
                                            <tr key={index} className='thara-coins'>
                                                <td className='left-td'>Thara Coins Discount</td>
                                                <td className='right-td'>
                                                    <div className="coin-main">
                                                        <div className="coin-point"> 
                                                            <img id='coin-icon' src="/Images/Coin.png" alt="" />
                                                            <small> {data?.creditCoins || 0} Points</small>
                                                        </div>
                                                        <div className="coin-rs"> 
                                                            <span className='discount'>-₹{(data?.creditCoins * data?.coinValue || 0).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    ))}
                                </table>
                                <img src="/Images/Line 39.png" alt="" className="line" />
                                <table>
                                    <tr>
                                        <td className="left-td totel">Total</td>
                                        <td className="right-td totel">₹{(totalAmountWithDiscount).toFixed(2)}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderCompletedPage;