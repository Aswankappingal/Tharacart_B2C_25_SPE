import { useEffect, useState } from "react";
import "./MyAccountDefault.scss";
import { IoIosArrowForward } from "react-icons/io";
import { MdFavoriteBorder } from "react-icons/md";
import { RiErrorWarningLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import useOrders from "../../../redux/hooks/OrderPageHooks/useOrderProduct";
import { FaAngleLeft } from "react-icons/fa6";
import baseUrl from "../../../baseUrl";
import axios from "axios";
import { Box, CircularProgress } from "@mui/material";

const MyAccountDefault = ({ rightSection, setRightSection, user }) => {




  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false); // State to manage OTP verification flow
  const [otp, setOtp] = useState(""); // Store OTP input by user
  const [errorMessage, setErrorMessage] = useState(""); // Store error message if OTP is invalid or expired

  const [loading, setLoading] = useState(false); // Ensure loading state is defined

  const [isEmailSent, setIsEmailSent] = useState(false); // Check if email verification OTP has been sent


  const { orders } = useOrders();

  const handleNavigateToWishlist = () => {
    setRightSection('whishlist'); // Update the right section to Wishlist
  };

  // State to control displaying all or limited orders
  const [showAllOrders, setShowAllOrders] = useState(false);

  // State for managing displayed orders
  const [displayedOrders, setDisplayedOrders] = useState([]);

  // Helper function to get the primary address
  const getPrimaryAddress = (addresses) => {
    if (!addresses || addresses.length === 0) return null;
    return addresses.find((address) => address.primaryAddress === true) || null;
  };

  // Effect to update displayed orders based on `showAllProducts`
  useEffect(() => {
    if (orders && orders.length > 0) {
      const updatedOrders = showAllOrders
        ? orders
        : orders.slice(0, 2);
      setDisplayedOrders(updatedOrders);
    }


  }, [orders, showAllOrders]);

  useEffect(() => {
    if (user) {
      console.log("propsData", user);
    }
  }, []);

  const primaryAddress = getPrimaryAddress(user?.address);

  const toggleOrderDisplay = () => {
    setShowAllOrders(!showAllOrders);
  };



  // State to control displaying all or limited orders

  // Function to request OTP for email verification
  const requestOTP = async () => {

    setLoading(true); // Start loading
    try {
      // Log the request to ensure the URL is correct and user has the right token
      console.log(`${baseUrl} / send - verification - email`);
      console.log('Authorization:', `Bearer ${user.token}`);

      const token = localStorage.getItem('authToken');

      if (!token) {
        console.error('No token found');
        setAlertMessage('Authentication error. Please log in.');
        setCartAlertVisible(true);
        setTimeout(() => setCartAlertVisible(false), 3000);
        return;
      }

      const response = await axios.post(`${baseUrl}/send-verification-email`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log('Email sent successfully');
        setIsEmailSent(true);
        setIsVerifyingEmail(true); // Trigger OTP input form
        setErrorMessage(""); // Clear any previous error
      }
    } catch (error) {
      console.error('Error sending OTP:', error); // Log the error for debugging
      setErrorMessage(error.response?.data?.error || 'Failed to send OTP');
    }
    finally {
      setLoading(false); // Stop loading
    }
  };


  // Function to verify OTP
  const verifyOTP = async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        console.error('No token found');
        setAlertMessage('Authentication error. Please log in.');
        setCartAlertVisible(true);
        setTimeout(() => setCartAlertVisible(false), 3000);
        return;
      }

      const response = await axios.post(`${baseUrl}/verify-otp`, { otp }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setIsEmailSent(false); // Hide OTP form
        setIsVerifyingEmail(false); // Hide OTP input
        alert('Email verified successfully!');
        window.location.reload();
      }
    }
    catch (error) {
      setErrorMessage(error.response?.data?.error || 'Failed to verify OTP');

    }
  };


  return (
    <div className="myAccount-wrapper">
      <div className="myaccount-main-body">
        <div className="myaccount-right-home">

          <div className="welcome-title">
            <div className="welcome-head">
              <Link to='/' className="welcome-heade-main">
                <div className="arrow-icon">
                  <FaAngleLeft style={{ color: 'white' }} />
                </div>
              </Link>
              <h1>Welcome to your Thara Cart Account</h1>
            </div>

            <div className="coins">
              <img src="/Images/Coin.png" alt="" />
              <span>{user?.coin}</span>
            </div>
          </div>
          {/* Display email verification section if email is not verified */}
          {user?.emailVerified === false && (
            <div className="email-verification-details">
              <div className="left-section">
                <div className="warning-icon">
                  <RiErrorWarningLine className="warning-symbel" />
                </div>
                <div className="warning-text">
                  <span>Your email id is not verified</span>
                </div>
              </div>
              <div className="right-section">
                {/* Display verify button */}
                <Link className="verify-btn" onClick={requestOTP} disabled={loading}>
                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <CircularProgress className="spinner" size={24} />
                    </Box>
                  ) : (
                    "Verify Now"
                  )}
                </Link>
              </div>
            </div>
          )}

          {/* OTP Verification Section */}
          {isVerifyingEmail && (
            <div className="email-verification-otp" style={{
              padding: '20px',
              maxWidth: '300px',
              // margin: '0 auto'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#333333',
                marginBottom: '15px'
              }}>
                Enter OTP sent to your email
              </h3>

              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                style={{
                  width: '80%',
                  padding: '8px 12px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '4px',
                  marginBottom: '15px',
                  fontSize: '14px',
                  color: '#333333'
                }}
              />

              <button
                onClick={verifyOTP}
                style={{
                  backgroundColor: '#6a0dad',
                  color: 'white',
                  padding: '8px 15px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  width: 'fit-content'
                }

                }
              >
                Verify OTP
              </button>

              {errorMessage && (
                <p style={{
                  color: '#ff0000',
                  fontSize: '14px',
                  marginTop: '10px'
                }}>
                  {errorMessage}
                </p>
              )}
            </div>
          )}

          <div className="my-order-main-container">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-7">
                  <div className="order-deatis-card-left">
                    <div className="my-orders">
                      <div className="my-order-icon">
                        <img src="/Images/my-order.png" alt="" />
                      </div>
                      <h1>My Orders</h1>
                    </div>

                    {/* Orders Section */}
                    {displayedOrders && displayedOrders.length > 0 ? (
                      displayedOrders.map((order) => {
                        const itemsArray = Array.isArray(order?.product?.items)
                          ? order.product.items
                          : Array.isArray(order?.product)
                            ? order.product
                            : [];

                        return (
                          <div className="row" key={order.id}>
                            {itemsArray.map((item, index) => (
                              <div className="col-lg-12" key={item.productId || index}>
                                <div className="order-item">
                                  <div className="order-item-image">
                                    <img
                                      src={item.productImage}
                                      alt={item.productName || "Product"}
                                    />
                                  </div>

                                  <div className="item-details">
                                    <div className="about-item">
                                      <h1>
                                        {item.status === 0 && "Processing"}
                                        {(item.status === 1 || order.status === 2) &&
                                          `Arriving on ${order.expectedDeliveryDate
                                            ? new Date(
                                              order.expectedDeliveryDate
                                            ).toLocaleDateString("en-GB", {
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                            })
                                            : "N/A"}`}
                                        {item.status === 3 &&
                                          `Delivered on ${order.deliveredDate
                                            ? new Date(order.deliveredDate).toLocaleDateString(
                                              "en-GB",
                                              {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                              }
                                            )
                                            : "N/A"}`}
                                      </h1>
                                      <p>{item.productName || "Product Name Unavailable"}</p>
                                      <div className="track-order-btn">
                                        <Link
                                          to={`/order-inner-page/${order.id}#track-details`}
                                          style={{ textDecoration: "none" }}
                                        >
                                          <button>Track Order</button>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })
                    ) : (
                      <p>No orders</p>
                    )}



                    {/* See More Button */}
                    {orders && orders.length > 2 && (
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="see-more">
                            <button className="seemore-btn" onClick={toggleOrderDisplay}>
                              {showAllOrders
                                ? "See Less Orders"
                                : "See More Orders"}
                              <span>
                                <IoIosArrowForward className="right-arrow" />
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right-side Account Info */}
                <div className="col-lg-5">
                  <div className="order-deatis-card-right">
                    <div className="my-orders">
                      <div className="my-order-icon">
                        <img src="/Images/user.png" alt="" />
                      </div>
                      <h1>Account Info</h1>
                    </div>
                    <div className="contact-details">
                      <span>Phone</span>
                      <span>+91-{user?.phone}</span>
                    </div>
                    <div className="contact-details">
                      <span>Email</span>
                      <p>{user?.email}</p>
                    </div>
                    <div className="contact-details">
                      <span>Primary Address</span>
                      {primaryAddress ? (
                        <p>
                          {primaryAddress.houseName},{" "}
                          {primaryAddress.landMark},{" "}
                          {primaryAddress.localArea}, {primaryAddress.state} -{" "}
                          {primaryAddress.pincode}
                          <br />
                          Phone: {primaryAddress.phoneNumber}
                        </p>
                      ) : (
                        <p>No Primary Address</p>
                      )}
                    </div>
                    <div className="contact-details">
                      <span>Social Accounts</span>
                      <p>No Social Account Connected</p>
                    </div>
                    {/* 
                    <div className="see-more2">
                      <div>
                        <Link className="seemore-btn" to="/">
                          see-more
                        </Link>
                        <span>
                          <IoIosArrowForward className="right-arrow" />
                        </span>
                      </div>
                    </div> 
                    */}

                  </div>
                </div>
              </div>
            </div>

            {/* Wishlist Section */}
            <div className="my-wishlist-container">
              <div className="wishlist-left">
                <div className="favourate-icon">
                  <MdFavoriteBorder className="fav-icon" />
                  <span>My Wishlist</span>
                </div>



                {/* <div className="create-new-list">
                  <div className="create-icon">
                    <img src="/Images/plus-01.png" alt="" />
                  </div>
                  <Link className="crate-link" to="/">
                    Create New List
                  </Link>
                </div> */}


              </div>
              <div className="wishlist-right">
                <div className="see-more">
                  <div>
                    <Link
                      className={`seemore-btn ${rightSection === 'wishlist' ? 'active' : ''}`}
                      onClick={handleNavigateToWishlist}>
                      See More
                    </Link>
                    <span>
                      <IoIosArrowForward className="right-arrow" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-wishlist-container2">
              <div className="default-list-left">
                <span>Default List</span>
                <p>0 Items</p>
              </div>
              <div className="viewlist-right">
                <div className="list-btn">
                  <button>View List</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountDefault;
