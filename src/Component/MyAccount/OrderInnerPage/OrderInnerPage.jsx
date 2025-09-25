import './OrderInnerPage.scss'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../../Navbar/Navbar'
import Footer from '../../Footer/Footer'
import { useFetchOrder } from '../../../redux/hooks/orderCompletedPageHooks/useFetchOrder'
import { useEffect, useMemo } from 'react'
import { IoMdCheckmark, IoMdCheckmarkCircleOutline } from 'react-icons/io'



const OrderInnerPage = () => {
    const { orderId } = useParams();
    console.log(orderId);
    const { orderInnerDetails, status, error } = useFetchOrder(orderId);

    useEffect(() => {
        console.log("orderInnerDetails", orderInnerDetails);
    }, [orderInnerDetails])


    const isGreen = (status) => status >= 3;


    // const totalProductsPrice = useMemo(() => {
    //     // Since you're fetching a single order by orderId
    //     if (!orderInnerDetails || !orderInnerDetails.product) return 0;

    //     const items = orderInnerDetails.product.items || [];
    //     return items.reduce((total, item) => {
    //         return total + (item.productPrice * (item.quantity || 1));
    //     }, 0);
    // }, [orderInnerDetails]);



    const totalProductsPrice = useMemo(() => {
        // Check if orders and orders.product exist
        if (!orderInnerDetails || !orderInnerDetails.product) return 0;

        // Ensure items is an array, using optional chaining and nullish coalescing
        const items = Array.isArray(orderInnerDetails.product.items)
            ? orderInnerDetails.product.items
            : [];

        // Safe reduce with additional type checking
        return items.reduce((total, item) => {
            // Ensure item exists and has valid numeric values
            const productPrice = Number(item.productPrice) || 0;
            const quantity = Number(item.quantity) || 1;
            return total + (productPrice * quantity);
        }, 0);
    }, [orderInnerDetails]);

    useEffect(() => {
        console.log("orderinner", orderInnerDetails);

    }, [])



    // Check if orderDate and _seconds exist
    const formattedDate = orderInnerDetails?.orderDate?._seconds
        ? new Date(orderInnerDetails.orderDate._seconds * 1000).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
        : 'Date not available';


    function formatFirestoreTimestamp(orderDate) {
        if (!orderDate || typeof orderDate._seconds === "undefined" || typeof orderDate._nanoseconds === "undefined") {
            return "Date not available"; // Fallback message if orderDate is invalid
        }

        const { _seconds, _nanoseconds } = orderDate;

        // Convert Firestore timestamp to milliseconds
        const milliseconds = _seconds * 1000 + Math.floor(_nanoseconds / 1000000);

        // Create a Date object
        const date = new Date(milliseconds);

        // Format the date (e.g., 22nd Sept 2024 10:00AM)
        const options = { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true };
        const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

        // Add ordinal suffix to the day
        const day = date.getDate();
        const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
        const dayWithSuffix = `${day}${suffix}`;

        // Replace the day in the formatted string
        return formattedDate.replace(/^\d+/, dayWithSuffix);
    }



    const formattedOrderDateDate = formatFirestoreTimestamp(orderInnerDetails.orderDate);

    if (status == 'loading') {
        return <div>Loading...</div>
    }
    if (status == 'failed') {
        return <div>{error}</div>
    }
    return (
        <div className='order-inner-page'>
            <Navbar />
            <div className="order-inner-sub-body">
                <h1>Order Details - {orderId}</h1>

                <div className="container-fluid">
                    <div className="row">

                        <div className="col-lg-8">
                            <div className="delevery-table">
                                <div className="delevery-details-left">
                                    <div className="delevery-address">
                                        <div className="delevery-address-title">
                                            <h3>Delivery Address</h3>
                                        </div>

                                        <div className="address-details">
                                            <h3>{orderInnerDetails?.shipTo?.name}</h3>
                                            <p>{orderInnerDetails?.shipTo?.houseName}, Near {orderInnerDetails?.shipTo?.landMark}, {orderInnerDetails?.shipTo?.localArea}, {orderInnerDetails?.shipTo?.state} IN - {orderInnerDetails?.shipTo?.pincode}</p>
                                            <span>Phone Number</span>
                                            <p>+91 {orderInnerDetails?.shipTo?.phoneNumber}</p>
                                            <span>Delivery Note</span>
                                            <p>No notes.</p>
                                        </div>
                                    </div>
                                    <div className="order-details">
                                        <div className="delevery-address-title">
                                            <h3>Order Details</h3>
                                        </div>


                                        <div className="address-details">


                                            <span>Order ID</span>
                                            <p>{orderInnerDetails?.orderId}</p>
                                            <span>Order Placed On</span>
                                            <p>{formattedDate}</p>
                                            <span>Payment Method</span>
                                            <p>{orderInnerDetails?.paymentMode == 'COD' ? 'Cash On Delivery' : 'Prepaid'}</p>
                                        </div>

                                    </div>
                                </div>
                                {/* <div className="order-issue-claim-video-container">
                                    <div className="order-issue-claim-video-left">
                                        <img src="/Images/box (1) 1.svg" alt="" />
                                        <div className="container-headings">
                                            <h1>Take Unboxing Video for Order Issue Claims </h1>
                                            <span>For smooth & successful order claims ensure to record video</span>
                                        </div>

                                    </div>
                                    <div className="order-issue-claim-video-rights">
                                        <Link to='/' className='see-tutoriel'>See Tutorial</Link>
                                    </div>
                                </div> */}
                            </div>

                        </div>
                        <div className="col-lg-4">
                            <div className="payment-summery">
                                <div className="payment-summery-card">
                                    <h3>Payment Summary</h3>
                                    <table>
                                        <tr>
                                            <td className="left-td">Payment Method</td>
                                            <td className="right-td">{orderInnerDetails?.paymentMode == 'COD' ? 'Cash on Delivery' : 'Prepaid'}</td>
                                        </tr>
                                        <tr>
                                            <td className="left-td">Sub Total</td>
                                            <td className="right-td">  ₹{totalProductsPrice ? Number(totalProductsPrice).toFixed(2) : "0.00"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="left-td">Shipping Charges</td>
                                            <td className="right-td"><strike>₹40.00</strike> | <span className="free-delivery">Free Delivery</span></td>
                                        </tr>
                                        {/* <tr>
                                            <td className="left-td">Thara Coins</td>
                                            <td className="right-td">
                                                <img src="/Images/Coin (1).svg" alt="" className="coin" />
                                                <span className="coin-point">1000 Points </span>
                                                <span className="redused-price"> -₹10.00</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="left-td">Coupon Discount</td>
                                            <td className="right-td coupn-dscnd">-₹50.00</td>
                                        </tr> */}


                                        {orderInnerDetails?.creditCoins > 0 && (
                                            <tr className='thara-coins'>
                                                <td className='left-td'>Thara Coins Discount</td>
                                                <td className='right-td'>
                                                    <div className="coin-main">
                                                        <div className="coin-point">
                                                            <img id='coin-icon' src="/Images/Coin.png" alt="" />
                                                            <small> {orderInnerDetails?.creditCoins || 0} Points</small>
                                                        </div>
                                                        <div className="coin-rs">
                                                            <span className='discount'>
                                                                -₹{(orderInnerDetails?.creditCoins * orderInnerDetails?.coinValue || 0).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}








                                    </table>
                                    <img src="/Images/Line 39.svg" alt="" className="line" />
                                    <table>
                                        <tr>
                                            <td className="left-td totel">Total</td>
                                            {/* <td className="right-td totel">  ₹{orderInnerDetails?.totalPrice ? Number(orderInnerDetails?.totalPrice).toFixed(2) : "0.00"} */}
                                            <td className="right-td totel">  ₹{orderInnerDetails?.product?.orderAmount ? Number(orderInnerDetails?.product?.orderAmount).toFixed(2) : "0.00"}
                                            </td>
                                        </tr>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row ordered-row">
                        <div className="col-lg-6">
                            {
                                Array.isArray(orderInnerDetails?.product?.items) && orderInnerDetails?.product?.items?.map((data, index) =>
                                    <div className="ordered-card" key={index}>
                                        <div className="card-column-1">
                                            <div className="ordered-details">
                                                <div className="left">
                                                    <img src={data.productImage} alt="" />
                                                </div>
                                                <div className="right">
                                                    <div className="order-title">
                                                        <h5>{data.productName}</h5>

                                                        <p>Qty :{data.quantity}</p>
                                                        <span>Replace/Return window will be open till 23/12/2024</span>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="buttons">
                                                <button
                                                    onClick={() => { window.location.href = `/order-inner-cancellation/${orderId}` }}
                                                    className={orderInnerDetails.status > 1 ? 'disabled-button' : ''}
                                                    disabled={orderInnerDetails.status > 1}
                                                >
                                                    {orderInnerDetails.status > 1 ? 'Cannot Cancel' : 'Cancel Item'}
                                                </button>
                                                <button>Need Help?</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="col-lg-6">

                            <div className="card-column-2">
                                {
                                    orderInnerDetails.status == 4 ? (
                                        <div className="desktop-progressBar">
                                            <div className="progrss-bar">

                                                <div className='progres-item' id='track-details'>
                                                    <div className='progres-item-child'>
                                                        <div className='icon-wrapper'>
                                                            <div className="icon green"><IoMdCheckmark className='icon-item' /></div>
                                                        </div>
                                                        <div className='line green-line'></div>
                                                    </div>
                                                    <div className='progres-item-child'>
                                                        <div className='icon-wrapper'>
                                                            <div className="icon green"><IoMdCheckmark className='icon-item' /></div>
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>
                                            <div className="order-status-main">
                                                <div className="otrder-status">Order Placed</div>
                                                <div className="otrder-status">Cancelled</div>
                                                {/* <div className="otrder-status">Out of Delivery</div> */}
                                                {/* <div className="otrder-status delivered">Delivered</div> */}

                                            </div>

                                        </div>
                                    ) : (
                                        <div className="desktop-progressBar">
                                            <div className="progrss-bar">

                                                <div className='progres-item' id='track-details'>

                                                    <div className='progres-item-child'>
                                                        <div className='icon-wrapper'> <div className="icon green"><IoMdCheckmark className='icon-item' /></div></div>
                                                        <div className={`line ${orderInnerDetails.status >= 1 ? 'green-line' : ''}`}></div>
                                                    </div>

                                                    <div className='progres-item-child'>
                                                        <div className='icon-wrapper'>
                                                            <div className={`icon ${orderInnerDetails.status >= 1 ? 'green' : ''}`}>
                                                                <IoMdCheckmark className='icon-item' />
                                                            </div>
                                                        </div>
                                                        <div className={`line ${orderInnerDetails.status >= 2 ? 'green-line' : ''}`}></div>
                                                    </div>


                                                    <div className='progres-item-child'>
                                                        <div className='icon-wrapper'>
                                                            <div className={`icon ${orderInnerDetails.status > 1 && orderInnerDetails.status <= 3 ? 'green' : ''}`}>
                                                                <IoMdCheckmark className='icon-item' />
                                                            </div>

                                                        </div>
                                                        <div className={`line ${orderInnerDetails.status >= 3 ? 'green-line' : ''}`}></div>
                                                    </div>


                                                    <div>
                                                        <div className='icon-wrapper'>
                                                            <div className={`icon ${orderInnerDetails.status == 3 ? 'green' : ''}`}><IoMdCheckmark className='icon-item' />
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>


                                            </div>
                                            <div className="order-status-main">
                                                <div className="otrder-status">Order Placed</div>
                                                <div className="otrder-status">On the Way</div>
                                                <div className="otrder-status">Out of Delivery</div>
                                                <div className="otrder-status delivered">Delivered</div>

                                            </div>

                                        </div>
                                    )
                                }
                                {/* <div className="desktop-progressBar">
                                                                <div className="progrss-bar">
                            
                                                                    <div className='progres-item' id='track-details'>
                            
                                                                        <div className='progres-item-child'>
                                                                            <div className='icon-wrapper'> <div className="icon green"><IoMdCheckmark className='icon-item' /></div></div>
                                                                            <div className={`line ${orders.status >= 1 ? 'green-line' : ''}`}></div>
                                                                        </div>
                            
                                                                        <div className='progres-item-child'>
                                                                            <div className='icon-wrapper'>
                                                                                <div className={`icon ${orders.status >= 1 ? 'green' : ''}`}>
                                                                                    <IoMdCheckmark className='icon-item' />
                                                                                </div>
                                                                            </div>
                                                                            <div className={`line ${orders.status >= 2 ? 'green-line' : ''}`}></div>
                                                                        </div>
                            
                            
                                                                        <div className='progres-item-child'>
                                                                            <div className='icon-wrapper'>
                                                                                <div className={`icon ${orders.status > 1 && orders.status <= 3 ? 'green' : ''}`}>
                                                                                    <IoMdCheckmark className='icon-item' />
                                                                                </div>
                            
                                                                            </div>
                                                                            <div className={`line ${orders.status >= 3 ? 'green-line' : ''}`}></div>
                                                                        </div>
                            
                            
                                                                        <div>
                                                                            <div className='icon-wrapper'>
                                                                                <div className={`icon ${orders.status == 3 ? 'green' : ''}`}><IoMdCheckmark className='icon-item' />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                            
                                                                    </div>
                            
                            
                                                                </div>
                                                                <div className="order-status-main">
                                                                    <div className="otrder-status">Order Placed</div>
                                                                    <div className="otrder-status">On the Way</div>
                                                                    <div className="otrder-status">Out of Delivery</div>
                                                                    <div className="otrder-status delivered">Delivered</div>
                            
                                                                </div>
                            
                                                            </div> */}


                                <div className="mobile-progressBar">
                                    <div className="progress-bar-mobile-sub">

                                        <div className="progres-item-mobile">

                                            <div className="icon green">
                                                <IoMdCheckmark className='icon-item' />
                                            </div>
                                            <div className="content-mobile">
                                                Order Placed
                                            </div>
                                        </div>

                                        <div className={`border-progress-mobile ${orderInnerDetails.status >= 1 ? 'green-line' : ''}`}>

                                        </div>

                                    </div>

                                    <div className="progress-bar-mobile-sub">

                                        <div className="progres-item-mobile">

                                            <div className={`icon ${orderInnerDetails.status >= 1 ? 'green' : ''}`}>
                                                <IoMdCheckmark className='icon-item' />
                                            </div>
                                            <div className="content-mobile">
                                                On the Way
                                            </div>
                                        </div>

                                        <div className={`border-progress-mobile ${orderInnerDetails.status >= 2 ? 'green-line' : ''}`}>

                                        </div>

                                    </div>

                                    <div className="progress-bar-mobile-sub">

                                        <div className="progres-item-mobile">

                                            <div className={`icon ${orderInnerDetails.status > 1 && orderInnerDetails.status <= 3 ? 'green' : ''}`}>
                                                <IoMdCheckmark className='icon-item' />
                                            </div>
                                            <div className="content-mobile">
                                                Out of Delivery
                                            </div>
                                        </div>

                                        <div className={`border-progress-mobile ${orderInnerDetails.status >= 3 ? 'green-line' : ''}`}>

                                        </div>

                                    </div>


                                    <div className="progress-bar-mobile-sub">

                                        <div className="progres-item-mobile">

                                            <div className={`icon ${orderInnerDetails.status == 3 ? 'green' : ''}`}>
                                                <IoMdCheckmark className='icon-item' />
                                            </div>
                                            <div className="content-mobile">
                                                Deliverd
                                            </div>
                                        </div>



                                    </div>

                                </div>

                                <table id='Date-time-demo'>
                                    <tr>
                                        <td><span>{formattedOrderDateDate}</span></td>

                                        <td>You placed order</td>
                                    </tr>
                                    <tr>
                                        <td><span>22nd Sept 2024</span></td>
                                        <td><span>10:00AM</span></td>
                                        <td>Your order successfully created</td>
                                    </tr>
                                    <tr>
                                        <td><span>22nd Sept 2024</span></td>
                                        <td><span>10:00AM</span></td>
                                        <td>Seller has processed your order</td>
                                    </tr>
                                    <tr>
                                        <td><span>22nd Sept 2024</span></td>
                                        <td><span>10:00AM</span></td>
                                        <td>Your item has been picked by courier partner</td>
                                    </tr>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </div>

    )
}
export default OrderInnerPage