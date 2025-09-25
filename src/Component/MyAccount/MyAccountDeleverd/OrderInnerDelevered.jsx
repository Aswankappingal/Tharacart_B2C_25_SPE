import React from 'react'
import './OrderInnerDelevered.scss'
import { Link } from 'react-router-dom'
import Navbar from '../../Navbar/Navbar'
import Footer from '../../Footer/Footer'



const OrderInnerDelevered = () => {
    return (
        <div className='order-inner-deliveredPage'>
            <Navbar />
            <div className="order-inner-sub-body">
                <h1>Order Details - TC567890</h1>

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
                                            <h3>Nadeem Kongan</h3>
                                            <p>Thara Apartments, Near HDFC Bank, Perinthalmanna .PO, Malappuram Dist. Kerala, IN - 678439</p>
                                            <span>Phone Number</span>
                                            <p>+91 9876543210</p>
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
                                            <p>TC-KL345678</p>
                                            <span>Order Placed On</span>
                                            <p>29 Sept 2024</p>
                                            <span>Payment Method</span>
                                            <p>Cash On Delivery</p>
                                        </div>

                                    </div>
                                </div>
                                <div className="order-issue-claim-video-container">
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
                                </div>
                            </div>

                        </div>
                        <div className="col-lg-4">
                            <div className="payment-summery">
                                <div className="payment-summery-card">
                                    <h3>Payment Summary</h3>
                                    <table>
                                        <tr>
                                            <td className="left-td">Payment Method</td>
                                            <td className="right-td">Prepaid (Credit Card)</td>
                                        </tr>
                                        <tr>
                                            <td className="left-td">Sub Total</td>
                                            <td className="right-td">₹76.00</td>
                                        </tr>
                                        <tr>
                                            <td className="left-td">Shipping Charges</td>
                                            <td className="right-td"><strike>₹40.00</strike> | <span className="free-delivery">Free Delivery</span></td>
                                        </tr>
                                        <tr>
                                            <td className="left-td">Thara Coins</td>
                                            <td className="right-td">
                                                <img src="/Images/Coin.png" alt="" className="coin" />
                                                <span className="coin-point">1000 Points </span>
                                                <span className="redused-price"> -₹10.00</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="left-td">Coupon Discount</td>
                                            <td className="right-td coupn-dscnd">-₹50.00</td>
                                        </tr>
                                    </table>
                                    <img src="/Images/Line 39.svg" alt="" className="line" />
                                    <table>
                                        <tr>
                                            <td className="left-td totel">Total</td>
                                            <td className="right-td totel">₹76.00</td>
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
                            <div className="ordered-card">
                                <div className="card-column-1">
                                    <div className="ordered-details">
                                        <div className="left">
                                            <img src="/Images/trend prod3.svg" alt="" />
                                        </div>
                                        <div className="right">
                                            <div className="order-title">
                                                <h5>Slurrp Farm No Maida No MSG Not Fried, Curry Masala Millet Hakka Noodles, Pack of 3 Hakka Noodles Vegetarian (192 g)</h5>

                                                <p>Qty : 2</p>
                                                <span>Replace/Return window will be open till 23/12/2024</span>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="buttons">
                                        <button className='buyagain-btn'> <span style={{ marginRight: "10px" }}><img src="/Images/arrow-rotate-right-01 - Copy.svg" alt="" /></span>Buy Again</button>
                                        <button>Return/Replace</button>
                                        <button>Review Product</button>
                                    </div> </div>

                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card-column-2">
                                <div className="progress-bar">
                                    <div className="delivery-progress-bar">
                                        <div className="step completed">
                                            <div className="step-indicator"><i className="fas fa-check-circle"></i></div>
                                            <div className="step-label">Order Placed</div>
                                        </div>
                                        <div className="step completed">
                                            <div className="step-indicator"><i className="fas fa-check-circle"></i></div>
                                            <div className="step-label">On the Way</div>
                                        </div>
                                        <div className="step">
                                            <div className="step-indicator"></div>
                                            <div className="step-label">Out for Delivery</div>
                                        </div>
                                        <div className="step">
                                            <div className="step-indicator"></div>
                                            <div className="step-label">Delivered</div>
                                        </div>
                                    </div>

                                </div>
                                <table>
                                    <tr>
                                        <td><span>22nd Sept 2024</span></td>
                                        <td><span>10:00AM</span></td>
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

            <Footer />
        </div>

    )
}

export default OrderInnerDelevered