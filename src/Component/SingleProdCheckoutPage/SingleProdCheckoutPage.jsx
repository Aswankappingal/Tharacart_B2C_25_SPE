import './SingleProdCheckoutPage.scss'
import { useEffect, useRef, useState } from 'react';
import { BiUser } from "react-icons/bi";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi2";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import UseLoginedUser from '../../redux/hooks/NavbarHook/UseLoginedUser';
import axios from 'axios';
import baseUrl from '../../baseUrl';
import useCartProduct from '../../redux/hooks/cartPageHooks/useCartProduct';
import { updateCartQuantity } from '../../redux/slices/cartSlices/updateQuantity';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../../redux/slices/cartSlices/removeCartItemSlice';
import CustomAlert from '../ConfirmAlert/ConfirmAlert';
import useFetchAddress from '../../redux/hooks/checkoutPageHooks/useFetchAddress';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
// import ConfirmationModal from '../AlertboxLogout/Alertlogout';
import SucessAlertHanna from '../addressAdded/SucessAlert'
import useProductInnerDetails from '../../redux/hooks/ProductInnerPageHooks/useProductInnerDetails';
import useFetchUser from '../../redux/hooks/myAccountHooks/useFetchUser';

const SingleProdCheckoutPage = () => {
    const { user, status, usrerror } = useFetchUser();

    const { prodId } = useParams()
    const [count, setCount] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [cod, setCod] = useState(false);
    const closeButtonRef = useRef(null);
    const [payment, setPayment] = useState(false);
    const [orderPlacing, setOrderPlacing] = useState(false)
    const [isOrderSummaryExpanded, setIsOrderSummaryExpanded] = useState(false);
    const [buttonText, setButtonText] = useState("Proceed to Checkout");
    const [isPaymentOptionsExpanded, setIsPaymentOptionsExpanded] = useState(false);
    const [showAllAddresses, setShowAllAddresses] = useState(false);
    const [addressAdded, setAddressAdded] = useState(false);
    const { error, isLoading, Razorpay } = useRazorpay();
    const navigate = useNavigate()
    const [editIndex, setEditIndex] = useState(null);
    // const [addressAdded, setAddressAdded] = useState(false); // New state for showing success message
    const [alertMessageAdress, setAlertMessageAdress] = useState('');

    const { productInnerDetails, status: proddetailsStatus, error: proddetailsError } = useProductInnerDetails(prodId);
    const [quantity, setQuantity] = useState(1)
    const [locationError, setLocationError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const [latitudeLongitude, setLatitudeLongitude] = useState(null);

    const [invalidPincode, setInvalidPincode] = useState('')

    const [isRedeemingCoins, setIsRedeemingCoins] = useState(false);
    const [redeemedCoins, setRedeemedCoins] = useState(0);
    const [coinData, setCoinData] = useState(null);



    useEffect(() => {
        console.log('====================================');
        console.log(productInnerDetails?.productDetails, "prod-details");
        console.log('====================================');
        // setQuantity(productInnerDetails?.productDetails?.b2bminQty)
    }, [productInnerDetails])


    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        alternativePhoneNumber: '',
        typeOfAddress: 'Home',
        primaryAddress: false,
        houseName: '',
        localArea: '',
        landMark: '',
        pincode: '',
        state: '',
        country: '',
        location: { latitude: null, longitude: null }
    });

    // edit state
    const [editData, setEditData] = useState({
        name: '',
        phoneNumber: '',
        alternativePhoneNumber: '',
        typeOfAddress: 'Home',
        primaryAddress: false,
        houseName: '',
        localArea: '',
        landMark: '',
        country: '',
        pincode: '',
        state: '',
        location: { latitude: null, longitude: null }
    });

    const [addressIndex, setAddressIndex] = useState(null); // Track address being edited
    const [showEditModal, setShowEditModal] = useState(false);
    const closeBtnRef = useRef(null);

    useEffect(() => {
        if (user && addressIndex !== null) {
            // Prefill the editData state with the selected address
            const selectedAddress = user.address[addressIndex] || {};
            setEditData({
                name: selectedAddress.name || '',
                phoneNumber: selectedAddress.phoneNumber || '',
                alternativePhoneNumber: selectedAddress.alternativePhoneNumber || '',
                typeOfAddress: selectedAddress.typeOfAddress || 'Home',
                primaryAddress: selectedAddress.primaryAddress || false,
                houseName: selectedAddress.houseName || '',
                localArea: selectedAddress.localArea || '',
                landMark: selectedAddress.landMark || '',
                country: selectedAddress.country || '',
                pincode: selectedAddress.pincode || '',
                state: selectedAddress.state || '',
                location: selectedAddress.location | ''
            });
        }
    }, [user, addressIndex]);


    const handleEditClick = (index) => {
        // Map the index of the sorted array back to the original array
        const originalIndex = address.findIndex((addr) => addr === getSortedAddresses(address)[index]);
        setAddressIndex(originalIndex); // Use the original index for updating
        setEditData(address[originalIndex]); // Get the data from the original array
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // edit user's current Locaton
    const handleEditMylocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('Location:', latitude, longitude);

                    // Update formData with the current location
                    setEditData({
                        ...editData,
                        location: { latitude, longitude },
                    });
                    setLatitudeLongitude({ latitude, longitude });
                    setLocationError("");
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to fetch location');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
            setLocationError("Unable to fetch location. Please tryagain.");
        }

    }

    // Function to validate Edit inputs
    const validateInputs = () => {
        const errors = {};

        if (editData.phoneNumber.length !== 10) errors.phoneNumber = "Phone number must be 10 digits.";
        if (editData.alternativePhoneNumber && editData.alternativePhoneNumber.length !== 10)
            errors.alternativePhoneNumber = "Alternative phone number must be 10 digits.";
        if (!editData.pincode || editData.pincode.length !== 6) errors.pincode = "Pincode must be 6 digits.";


        setValidationErrors(errors);
        return Object.keys(errors).length === 0; // Returns true if no errors
    };

    // Address Update function
    // Address Update function
    const handleSaveAddress = async () => {
        if (!validateInputs()) {
            alert("Please fix the errors before saving.");
            return;
        }

        try {
            const userId = user ? user.id : null;
            const response = await axios.put(
                `${baseUrl}/update-checkout-address/${userId}`,
                { ...editData, addressIndex }

            );

            if (response.status === 200) {
                alert("Address updated successfully.");
                setInvalidPincode(""); // Clear error messages
                setValidationErrors({});
                setAddressIndex(null); // Clear index
                setEditData({}); // Reset form data
                setShowEditModal(false); // Close modal
                addressRefetch(); // Refresh address data
                window.location.reload(); // Reload immediately

                // setTimeout(() => {
                //     window.location.reload();
                // }, 500);
            }
        } catch (error) {
            console.error('Error updating address:', error);
            const errorMsg = error.response?.data || "Failed to update address. Please try again.";
            setInvalidPincode(errorMsg.includes("Invalid pincode") ? errorMsg : "");
            alert(errorMsg);
        }
    };






    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const [productIdToRemove, setProductIdToRemove] = useState(null);
    const { status: removeItemStatus, error: removeItemError } = useSelector(state => state.removeCartItem);


    const { loginedUser } = UseLoginedUser()
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const { address, status: addressStatus, error: addressError, refetch: addressRefetch } = useFetchAddress()

    const [isExpanded, setIsExpanded] = useState(true);




    const handleAccordionToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const getSortedAddresses = (address) => {
        return [...address].sort((a, b) => {
            if (a.primaryAddress && !b.primaryAddress) return -1;
            if (!a.primaryAddress && b.primaryAddress) return 1;
            return 0;
        });
    };

    useEffect(() => {
        if (address?.length > 0) {
            const sortedAddresses = getSortedAddresses(address); // Sort the addresses
            const primaryIndex = sortedAddresses.findIndex(addr => addr.primaryAddress === true);

            setSelectedAddressIndex(primaryIndex !== -1 ? primaryIndex : 0);
            setSelectedAddress(primaryIndex !== -1 ? sortedAddresses[primaryIndex] : sortedAddresses[0]);
        }
    }, [address]);


    const handleRadioChange = (index) => {
        const sortedAddresses = getSortedAddresses(address); // Sort again to maintain consistent order
        setSelectedAddressIndex(index);
        setSelectedAddress(sortedAddresses[index]);
    };


    const { refetch, cartProduct, status: cartProdStatus, error: cartProderror } = useCartProduct(); // Include refetch;



    // const quantity = 1; // or set this to the actual quantity if it's user-defined
    const subtotal = productInnerDetails?.productDetails?.offerPrice * quantity;





    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle checkbox input explicitly
        if (type === "checkbox") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: checked, // Set true if checked, otherwise false
            }));
        } else {
            // Check if the field requires numeric-only input
            const isNumericField = ["phoneNumber", "alternativePhoneNumber", "pincode"].includes(name);
            const numericRegex = /^\d*$/;

            // Update form data if value is numeric or valid
            if (!isNumericField || numericRegex.test(value)) {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            }
        }
    };

    // Function to get displayed addresses based on showAllAddresses state
    const getDisplayedAddresses = () => {
        const sortedAddresses = getSortedAddresses(address); // Sort addresses
        return showAllAddresses ? sortedAddresses : sortedAddresses.slice(0, 2); // Show all or only two addresses
    };
    // Function to toggle address display
    const toggleAddressDisplay = () => {
        setShowAllAddresses(!showAllAddresses);
    };
    // Function to get the user's current location
    const handleUseMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('Location:', latitude, longitude);

                    // Update formData with the current location
                    setFormData({
                        ...formData,
                        location: { latitude, longitude },
                    });
                    setLatitudeLongitude({ latitude, longitude });
                    setLocationError("");
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to fetch location');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
            setLocationError("Unable to fetch location. Please try again.");
        }
    };


    const handleCloseAlert = () => {
        setAddressAdded(false);
        closeButtonRef.current?.click();
        console.log("Navigating to checkout page");
        setTimeout(() => {
            navigate('/checkOut-page');
        }, 100);

    };


    const addAddress = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('No auth token found');
                return;
            }

            // Validate phoneNumber and pincode
            if (formData.alternativePhoneNumber && formData.alternativePhoneNumber.length !== 10) {
                setAlertMessageAdress('Alternative phone number must be exactly 10 digits.');
                setAddressAdded(true);
                return;
            }

            if (formData.pincode.length !== 6) {
                setAlertMessageAdress('Pincode must be exactly 6 digits.');
                // setAddressAdded(true);
                return;
            }

            // if (!formData.name || !formData.localArea || !formData.houseName || !formData.state || !formData.country) {
            //     alert('Please fill out all required fields.');
            //     return; // Prevent submission
            // }

            // Structure the address object (using formData)
            const address = [
                {


                    name: formData.name,
                    phoneNumber: formData.phoneNumber,
                    alternativePhoneNumber: formData.alternativePhoneNumber,
                    typeOfAddress: formData.typeOfAddress,
                    primaryAddress: formData.primaryAddress,
                    houseName: formData.houseName,
                    localArea: formData.localArea,
                    landMark: formData.landMark,
                    pincode: formData.pincode,
                    state: formData.state,
                    location: formData.location,
                    country: formData.country// Location with latitude and longitude

                },

            ];


            // Send the address data to the backend
            const res = await axios.post(`${baseUrl}/add-address`, { address }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },

            });

            console.log(res.data);
            setAlertMessageAdress('Address added successfully!');
            setAddressAdded(true);
            addressRefetch()
            setFormData({
                name: '',
                phoneNumber: '',
                alternativePhoneNumber: '',
                typeOfAddress: '',
                primaryAddress: '',
                houseName: '',
                localArea: '',
                landMark: '',
                pincode: '',
                state: '',
                location: '',
                country: ''
            });
            setTimeout(() => {
                handleCloseAlert(); // Call the function to close modal and navigate to checkout
                setInvalidPincode("")

            }, 1000);
        } catch (error) {
            console.error('Error adding address:', error);
            if (error.response.data = `Invalid pincode: ${formData.pincode}`) {
                setInvalidPincode(error.response.data)
            }
            setAlertMessageAdress('Error adding address');
            setAddressAdded(true);
        }
    };



    useEffect(() => {
        if (selectedAddressIndex !== null) {
            setIsOrderSummaryExpanded(true);
            setButtonText("Proceed to Payment");
        }
    }, [selectedAddressIndex]);

    const handleButtonClick = () => {
        if (selectedAddressIndex === null) {
            // Logic to proceed to checkout (e.g., navigate to address selection)
        } else {
            setIsPaymentOptionsExpanded(true);
        }
    };

    // const handlePaymentMethodChange = (e) => {
    //     const selectedMethod = e.target.value;
    //     setSelectedPaymentMethod(selectedMethod);
    //     setCod(selectedMethod === "Cash on Delivery");

    //     // Reset payment state when changing methods
    //     if (selectedMethod === "Cash on Delivery") {
    //         setPayment(true);
    //     } else {
    //         setPayment(true); // Ensure payment state is true for Razorpay
    //     }
    // };

    const handlePaymentMethodChange = (e) => {
        const selectedMethod = e.target.value;
        setSelectedPaymentMethod(selectedMethod);
        setCod(selectedMethod === "Cash on Delivery");

        // Always set payment to true for proper state management
        setPayment(true);
    };





    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            // Make sure we have a selected address before proceeding
            if (!selectedAddress) {
                alert("Please select a delivery address");
                return;
            }

            const { data } = await axios.post(`${baseUrl}/create-order`, { amount: 1});

            const options = {
                key: "rzp_live_lyZpWXiwjcRPKB",
                amount: data.amount,
                currency: "INR",
                name: "Thara Cart Pvt.Ltd",
                description: "Test Transaction",
                order_id: data.orderId,
                handler: async function (response) {
                    // Verify payment in backend
                    const verificationData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    };

                    try {
                        const verificationResponse = await axios.post(`${baseUrl}/verify-payment`, verificationData);
                        if (verificationResponse.data.status === "success") {
                            alert("Payment Successful!");
                            setPayment(true);

                            // Automatically place the order after successful payment
                            await placeOrderAfterPayment();
                        } else {
                            alert("Payment verification failed!");
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        alert("Failed to verify payment. Please contact customer support.");
                    }
                },
                prefill: {
                    name: user.name || "Customer Name",
                    email: user.email || "customer@example.com",
                    contact: user.phone || "9999999999",
                },
                theme: {
                    color: "#5D1CAA",
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Payment failed", error);
            alert("Failed to initiate payment. Please try again.");
        }
    };

    // New function to place order after successful payment
    const placeOrderAfterPayment = async () => {
        setOrderPlacing(true);

        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                alert("No authentication token found");
                return;
            }

            console.log("Coin Data Before Order:", coinData);
            console.log("Coin Percentage:", coinData?.percentage);

            // Create order data object matching backend expectations
            const orderData = {
                paymentMode: "Pre-paid", // Set to Prepaid since payment is already complete
                cod: false, // Not COD
                products: [{
                    id: productInnerDetails?.productDetails?.productId,
                    quantity: quantity
                }],
                totalPrice: finalTotal,
                address: selectedAddress,
                creditCoins: isRedeemingCoins ? coinData?.redeemableCoins : 0,
                coinValue: isRedeemingCoins ? coinData?.coinValue : 0
            };

            console.log("Sending order data:", orderData);

            const res = await axios.post(`${baseUrl}/single-product-place-order`,
                orderData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            console.log("Order response:", res.data);
            alert("Order placed successfully");
            navigate(`/order-completed-page/${res.data.orderId}`);
        } catch (error) {
            console.error("Error placing order:", error);
            console.error("Error response:", error.response?.data);
            alert(error.response?.data || "Error placing order. Please try again.");
        } finally {
            setOrderPlacing(false);
        }
    };



    const handleCoinRedemption = (isChecked) => {
        setIsRedeemingCoins(isChecked);
        if (isChecked) {
            const redeemableCoins = coinData?.redeemableCoins || 0;
            setRedeemedCoins(redeemableCoins);
        } else {
            setRedeemedCoins(0);
        }
    };

    // const coinValue = coinData ? Math.floor(user?.coin * (coinData.percentage / 100)) : 0;

    const coinDiscount = (coinData?.redeemableCoins || 0) * (coinData?.coinValue || 0.1);

    const finalTotal = subtotal - (isRedeemingCoins ? coinDiscount : 0);


    useEffect(() => {
        const fetchCoinRange = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get(`${baseUrl}/get-coin-range`, {
                    params: { orderTotal: finalTotal },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setCoinData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching coin range:", error);
            }
        };

        if (finalTotal > 0) {
            fetchCoinRange();
        }
    }, [finalTotal]);

    useEffect(() => {
        console.log("ccccccc", "coindata");
    }, [])


    // const placeOrder = async (e) => {
    //     e.preventDefault();
    //     setOrderPlacing(true);

    //     try {
    //         const token = localStorage.getItem("authToken");
    //         if (!token) {
    //             alert("No authentication token found");
    //             return;
    //         }

    //         if (!selectedAddress) {
    //             alert("Please select a delivery address");
    //             return;
    //         }

    //         console.log("Coin Data Before Order:", coinData);
    //         console.log("Coin Percentage:", coinData?.percentage);

    //         const orderData = {
    //             paymentMode: selectedPaymentMethod, // Ensure this is set correctly
    //             cod: cod, // Include cod flag if it's COD
    //             products: [{
    //                 id: productInnerDetails?.productDetails?.productId,
    //                 quantity: quantity
    //             }],

    //             // products: cartProduct.map((product) => ({
    //             //     id: product.productId,
    //             //     quantity: product.quantity,
    //             // })),
    //             // totalPrice: subtotal - 50 -coinValue * coinData?.coinValue, // Subtracting the coupon discount

    //             totalPrice: finalTotal,
    //             address: selectedAddress,
    //             creditCoins: isRedeemingCoins ? coinData?.redeemableCoins : 0,
    //             coinValue: isRedeemingCoins ? coinData?.coinValue : 0


    //         };






    //         console.log("Sending order data:", orderData);

    //         const res = await axios.post(`${baseUrl}/single-product-place-order`,
    //             orderData,
    //             {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`,
    //                     'Content-Type': 'application/json'
    //                 },
    //             }
    //         );

    //         // setOrderPlacedAlertMessage("Order placed successfully");
    //         alert("Order placed successfully");
    //         navigate(`/order-completed-page/${res.data.orderId}`);
    //     } catch (error) {
    //         console.error("Error placing order:", error);
    //         console.error("Error response:", error.response?.data);
    //         alert(error.response?.data || "Error placing order. Please try again.");
    //     } finally {
    //         setOrderPlacing(false);
    //     }
    // };


    // Keep the original placeOrder function for Cash on Delivery
    const placeOrder = async (e) => {
        if (e) e.preventDefault();
        setOrderPlacing(true);

        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                alert("No authentication token found");
                return;
            }

            if (!selectedAddress) {
                alert("Please select a delivery address");
                return;
            }

            console.log("Coin Data Before Order:", coinData);
            console.log("Coin Percentage:", coinData?.percentage);

            // Create order data object matching backend expectations
            const orderData = {
                paymentMode: selectedPaymentMethod,
                cod: cod,
                products: [{
                    id: productInnerDetails?.productDetails?.productId,
                    quantity: quantity
                }],
                totalPrice: finalTotal,
                address: selectedAddress,
                creditCoins: isRedeemingCoins ? coinData?.redeemableCoins : 0,
                coinValue: isRedeemingCoins ? coinData?.coinValue : 0
            };

            console.log("Sending order data:", orderData);

            const res = await axios.post(`${baseUrl}/single-product-place-order`,
                orderData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            console.log("Order response:", res.data);
            alert("Order placed successfully");
            navigate(`/order-completed-page/${res.data.orderId}`);
        } catch (error) {
            console.error("Error placing order:", error);
            console.error("Error response:", error.response?.data);
            alert(error.response?.data || "Error placing order. Please try again.");
        } finally {
            setOrderPlacing(false);
        }
    };









    if (proddetailsStatus == 'loading') {
        return <div>Loading</div>
    }


    return (
        <div className='singleProdCheckoutPageMainWrapper'>
            <div className="checkuot-page">
                {/* =======================nav-bar==================== */}
                <div className="navigation-bar">
                    <div className="nav-left">
                        <Link to='/'><img src="/Images/tharacart-nav-logo.svg" alt="" /></Link>
                    </div>
                    <div className="nav-center">
                        <img src="/Images/fi_1746680.png" alt="" />
                        <span>Secured Checkout</span>
                    </div>
                    <div className="nav-right">
                        <BiUser className='user-icon' />
                        <select name="" id="">
                            <option value="">{loginedUser?.name}</option>
                        </select>
                    </div>
                </div>
                {/* =================================checkoutPage-left================================ */}
                <div className="container-fluid">
                    <div className="address-section-and-order-summery-wrapper row">
                        <div className="col-lg-8 address-section">
                            <div className="accordion" id="accordionExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header select-address" id="headingOne">
                                        <button
                                            className="accordion-button"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#SelectAddress"
                                            aria-expanded={isExpanded}
                                            aria-controls="collapseOne"
                                            onClick={handleAccordionToggle}
                                        >
                                            {/* Display the selected address or the default message */}
                                            {selectedAddressIndex !== null ? (
                                                <div className="selected-address-true-section">
                                                    <div style={{ width: "80%" }}>
                                                        <h3>Select Address</h3>
                                                        <span className="selected-address">
                                                            {`${address[selectedAddressIndex].houseName}, ${address[selectedAddressIndex].localArea}, ${address[selectedAddressIndex].state}, ${address[selectedAddressIndex].pincode}`}
                                                        </span>
                                                    </div>
                                                    <div className="full-main-btns">
                                                        <div style={{ display: "flex", justifyContent: "end", width: "20%" }} className='Edit-select-add'>
                                                            <button className="edit-btn" data-bs-toggle="collapse" data-bs-target="#SelectAddress">
                                                                Edit
                                                            </button>
                                                        </div>
                                                        {/* <span className='select-addres-heading'>1. Select Address</span> */}
                                                        {/* Always show the Add New Address button */}
                                                        <div className="btn-main-add-new">
                                                            <button className="add-new-address-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                                                Add New Address
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                                : (
                                                    <>
                                                        <button style={{ width: '30%' }} className="add-new-address-btn" id='add-new-else' data-bs-toggle="modal" data-bs-target="#exampleModal">
                                                            Add New Address
                                                        </button>
                                                    </>
                                                )
                                            }
                                        </button>
                                    </h2>

                                    {/* Address Selection Collapse */}
                                    <div id="SelectAddress" className={`accordion-collapse collapse ${isExpanded ? 'show' : ''}`} aria-labelledby="headingOne">
                                        <div className="accordion-body">
                                            {
                                                address?.length > 0 ? (
                                                    getDisplayedAddresses().map((data, index) => (
                                                        <div className="row AddressRow" key={index}>
                                                            <div className="col-lg-8 select-address-left">
                                                                <div className="radio-button">
                                                                    <div>
                                                                        <div className="custom-radio-container">
                                                                            <input
                                                                                type="radio"
                                                                                id={`address-radio-${index}`}
                                                                                name="customRadio"
                                                                                className="custom-radio"
                                                                                checked={selectedAddressIndex === index}
                                                                                onChange={() => {
                                                                                    handleRadioChange(index); // Pass the index to the handler
                                                                                    setIsExpanded(false); // Collapse the address section after selection
                                                                                }}
                                                                            />
                                                                            <label htmlFor={`address-radio-${index}`} className="custom-radio-label"></label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="address-details">
                                                                        <h6>
                                                                            <span>{data.name},</span> <span>+91 {data.phoneNumber}</span>
                                                                        </h6>
                                                                        <p>{data.localArea}, {data.landMark}, {data.state}, {data.pincode}</p>
                                                                        <p>{data.alternativePhoneNumber ? `Alternative Number: ${data.alternativePhoneNumber}` : "No Alternative Number"}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-4 select-address-right">
                                                                {/* <button>Add Delivery Note</button> */}
                                                                <button
                                                                    onClick={() => handleEditClick(index)} // Handle modal opening with React state
                                                                >
                                                                    Edit
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p style={{ textAlign: "center" }}>No Address Available</p>
                                                )
                                            }


                                            {address && address.length > 2 && (
                                                <div className="seemore-btn">
                                                    <button onClick={toggleAddressDisplay}>
                                                        {showAllAddresses ? (
                                                            <>See Less Addresses <HiOutlineChevronUp /></>
                                                        ) : (
                                                            <>See More Addresses <HiOutlineChevronDown /></>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Add-New-Address-Modal --> */}
                                <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">Add New Address</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => window.location.reload()} ref={closeButtonRef}></button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="row">
                                                    <div className="col-lg-6 modal-left">
                                                        <h3>Personal Details</h3>
                                                        <div><label htmlFor="">Full Name *</label></div>
                                                        <div><input type="text" className='name-input' name="name" value={formData.name} onChange={(e) => {
                                                            const regex = /^[A-Za-z\s]*$/; // Allows only letters and spaces
                                                            if (regex.test(e.target.value)) {
                                                                handleInputChange(e); // Update state only if input is valid
                                                            }
                                                        }} /></div>

                                                        <div><label htmlFor="">Phone Number *</label></div>
                                                        <div className="number-input">
                                                            <div className="contry-code">
                                                                <select name="" id="">
                                                                    <option value="">+91</option>
                                                                </select>
                                                            </div>
                                                            <div className="number-typing-section">
                                                                <input type="text" name="phoneNumber" pattern="^\d{10}$" maxLength="10"
                                                                    title="Please enter exactly 10 digits" style={{
                                                                        borderColor: formData.phoneNumber.length < 10 ? 'white' : 'initial',
                                                                        backgroundColor: formData.phoneNumber.length < 10 ? '#fff' : 'initial'
                                                                    }} value={formData.phoneNumber} onChange={handleInputChange} />
                                                            </div>
                                                        </div>
                                                        {formData.phoneNumber.length < 10 && formData.phoneNumber.length > 0 && (
                                                            <p style={{ color: 'red', fontSize: '12px' }}>Phone number must be  10 digits.</p>
                                                        )}
                                                        <div><label htmlFor="">Alternative Phone Number</label></div>
                                                        <div><input type="text" className='number-input' name="alternativePhoneNumber"
                                                            pattern="^\d{10}$"
                                                            maxLength="10"
                                                            value={formData.alternativePhoneNumber}
                                                            onChange={handleInputChange}
                                                            style={{
                                                                borderColor: formData.alternativePhoneNumber.length < 10 ? 'grey' : 'initial',
                                                                backgroundColor: formData.alternativePhoneNumber.length < 10 ? '#fff' : 'initial'
                                                            }}
                                                        />
                                                            {formData.alternativePhoneNumber.length < 10 && formData.alternativePhoneNumber.length > 0 && (
                                                                <p style={{ color: 'red', fontSize: '12px' }}>Phone number must be exactly 10 digits.</p>
                                                            )}
                                                        </div>

                                                        <div><label htmlFor="">Type of Address</label></div>
                                                        <div style={{ paddingTop: "1rem" }}>
                                                            <span className={`address-type ${formData.typeOfAddress === 'Home' ? 'active-address-type' : ''}`} onClick={() => setFormData({ ...formData, typeOfAddress: 'Home' })}>Home</span>
                                                            <span className={`address-type ${formData.typeOfAddress === 'Office' ? 'active-address-type' : ''}`} onClick={() => setFormData({ ...formData, typeOfAddress: 'Office' })}>Office</span>
                                                        </div>

                                                        <div className='check-box'>
                                                            <input type="checkbox" name="primaryAddress" checked={formData.primaryAddress} onChange={handleInputChange} />
                                                            <label htmlFor="">Make this as my primary address</label>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6 modal-right">
                                                        <h3>Delivery Address</h3>
                                                        <div className="use-my-location" onClick={handleUseMyLocation} style={{ cursor: 'pointer' }}>
                                                            <img src="/Images/target-01.png" alt="Use My Location" />
                                                            <span>Use My Location</span>
                                                        </div>
                                                        {latitudeLongitude && (
                                                            <div style={{ marginTop: "10px", fontSize: "14px" }}>
                                                                <p>
                                                                    Latitude: {latitudeLongitude.latitude}, Longitude: {latitudeLongitude.longitude}
                                                                </p>
                                                                <p>

                                                                </p>
                                                            </div>
                                                        )}


                                                        {locationError && (
                                                            <p style={{ color: "red", fontSize: "12px" }}>{locationError}</p>
                                                        )}


                                                        <div><label htmlFor="">House No, Building Name*</label></div>
                                                        <div><input type="text" className='address-input' name="houseName" value={formData.houseName} onChange={handleInputChange} /></div>

                                                        <div><label htmlFor="">Local Area, Nearby Road, City *</label></div>
                                                        <div><input type="text" className='address-input' name="localArea" value={formData.localArea} onChange={(e) => {
                                                            const regex = /^[A-Za-z\s]*$/; // Allows only letters and spaces
                                                            if (regex.test(e.target.value)) {
                                                                handleInputChange(e); // Update state only if input is valid
                                                            }
                                                        }} /></div>

                                                        <div><label htmlFor="">Landmark</label></div>
                                                        <div><input type="text" className='address-input' name="landMark" value={formData.landMark} onChange={handleInputChange} /></div>
                                                        <div><label htmlFor="">Country</label></div>
                                                        <div><input type="text" className='address-input' name="country" value={formData.country} onChange={(e) => {
                                                            const regex = /^[A-Za-z\s]*$/; // Allows only letters and spaces
                                                            if (regex.test(e.target.value)) {
                                                                handleInputChange(e); // Update state only if input is valid
                                                            }
                                                        }} /></div>
                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <label htmlFor="">Pincode *</label>
                                                                <input type="text" name="pincode"
                                                                    value={formData.pincode}
                                                                    onChange={handleInputChange}
                                                                    pattern="^\d{6}$"
                                                                    maxLength="6"
                                                                    style={{
                                                                        borderColor: formData.pincode.length < 6 ? 'grey' : 'initial',
                                                                        backgroundColor: formData.pincode.length < 6 ? '#fff' : 'initial'
                                                                    }}
                                                                />
                                                                {formData.pincode.length < 6 && formData.pincode.length > 0 && (
                                                                    <p style={{ color: 'red', fontSize: '12px' }}>Pincode must be  6 digits.</p>
                                                                )}

                                                                <div>{invalidPincode}</div>


                                                            </div>
                                                            <div className="col-lg-6">
                                                                <label htmlFor="">State *</label>
                                                                <input type="text" name="state" value={formData.state} onChange={(e) => {
                                                                    const regex = /^[A-Za-z\s]*$/; // Allows only letters and spaces
                                                                    if (regex.test(e.target.value)) {
                                                                        handleInputChange(e); // Update state only if input is valid
                                                                    }
                                                                }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="modal-footer">
                                                <button type="button" onClick={addAddress}>Save Address</button>
                                                {addressAdded && <SucessAlertHanna message={alertMessageAdress} />}

                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {/* edit adress */}
                                {showEditModal && (
                                    <div className="modal fade show" id="editAddressModal" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: 'block' }}>
                                        <div className="modal-dialog  modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Update Address</h1>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={closeBtnRef} onClick={() => setShowEditModal(false)}></button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="row">
                                                        <div className="col-lg-6 col-md-6 col-sm-12 modal-left">
                                                            <h3>Personal Details</h3>
                                                            <div><label htmlFor="">Full Name *</label></div>
                                                            <div><input type="text" className='name-input' name="name" value={editData.name} onChange={(e) => {
                                                                const regex = /^[A-Za-z\s]*$/; // Allows only letters and spaces
                                                                if (regex.test(e.target.value)) {
                                                                    handleEditChange(e); // Update state only if input is valid
                                                                }
                                                            }} /></div>

                                                            <div><label htmlFor="">Phone Number *</label></div>
                                                            <div className="number-input">
                                                                <div className="contry-code">
                                                                    <select name="" id="">
                                                                        <option value="">+91</option>
                                                                    </select>
                                                                </div>
                                                                <div className="number-typing-section">
                                                                    <input type="text" name="phoneNumber" pattern="^\d{10}$" maxLength="10"
                                                                        title="Please enter exactly 10 digits" style={{
                                                                            borderColor: editData.phoneNumber.length < 10 ? 'white' : 'initial',
                                                                            backgroundColor: editData.phoneNumber.length < 10 ? '#fff' : 'initial'
                                                                        }} value={editData.phoneNumber} onChange={handleEditChange} />
                                                                </div>
                                                            </div>
                                                            {editData.phoneNumber.length < 10 && editData.phoneNumber.length > 0 && (
                                                                <p style={{ color: 'red', fontSize: '12px' }}>Phone number must be  10 digits.</p>
                                                            )}
                                                            <div><label htmlFor="">Alternative Phone Number</label></div>
                                                            <div><input type="text" className='number-input' name="alternativePhoneNumber"
                                                                pattern="^\d{10}$"
                                                                maxLength="10"
                                                                value={editData.alternativePhoneNumber}
                                                                onChange={handleEditChange}
                                                                style={{
                                                                    borderColor: editData.alternativePhoneNumber.length < 10 ? 'grey' : 'initial',
                                                                    backgroundColor: editData.alternativePhoneNumber.length < 10 ? '#fff' : 'initial'
                                                                }}
                                                            />
                                                                {editData.alternativePhoneNumber.length < 10 && editData.alternativePhoneNumber.length > 0 && (
                                                                    <p style={{ color: 'red', fontSize: '12px' }}>Phone number must be exactly 10 digits.</p>
                                                                )}
                                                            </div>

                                                            <div><label htmlFor="">Type of Address</label></div>
                                                            <div style={{ paddingTop: "1rem" }}>
                                                                <span className={`address-type ${editData.typeOfAddress === 'Home' ? 'active-address-type' : ''}`} onClick={() => setEditData({ ...editData, typeOfAddress: 'Home' })}>Home</span>
                                                                <span className={`address-type ${editData.typeOfAddress === 'Office' ? 'active-address-type' : ''}`} onClick={() => setEditData({ ...editData, typeOfAddress: 'Office' })}>Office</span>
                                                            </div>

                                                            <div className='check-box'>
                                                                <input type="checkbox" name="primaryAddress" checked={editData.primaryAddress} onChange={handleEditChange} />
                                                                <label htmlFor="">Make this as my primary address</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 modal-right">
                                                            <h3>Delivery Address</h3>
                                                            <div className="use-my-location" onClick={handleEditMylocation} style={{ cursor: 'pointer' }}>
                                                                <img src="/Images/target-01.png" alt="Use My Location" />
                                                                <span>Use My Location</span>
                                                            </div>
                                                            {latitudeLongitude && (
                                                                <div style={{ marginTop: "10px", fontSize: "14px" }}>
                                                                    <p>
                                                                        Latitude: {latitudeLongitude.latitude}, Longitude: {latitudeLongitude.longitude}
                                                                    </p>
                                                                    <p>

                                                                    </p>
                                                                </div>
                                                            )}

                                                            {locationError && (
                                                                <p style={{ color: "red", fontSize: "12px" }}>{locationError}</p>
                                                            )}

                                                            <div><label htmlFor="">House No, Building Name*</label></div>
                                                            <div><input type="text" className='address-input' name="houseName" value={editData.houseName} onChange={handleEditChange} /></div>

                                                            <div><label htmlFor="">Local Area, Nearby Road, City *</label></div>
                                                            <div><input type="text" className='address-input' name="localArea" value={editData.localArea} onChange={(e) => {
                                                                const regex = /^[A-Za-z\s]*$/; // Allows only letters and spaces
                                                                if (regex.test(e.target.value)) {
                                                                    handleEditChange(e); // Update state only if input is valid
                                                                }
                                                            }} /></div>

                                                            <div><label htmlFor="">Landmark</label></div>
                                                            <div><input type="text" className='address-input' name="landMark" value={editData.landMark} onChange={handleEditChange} /></div>
                                                            <div><label htmlFor="">Country</label></div>
                                                            <div><input type="text" className='address-input' name="country" value={editData.country} onChange={(e) => {
                                                                const regex = /^[A-Za-z\s]*$/; // Allows only letters and spaces
                                                                if (regex.test(e.target.value)) {
                                                                    handleEditChange(e); // Update state only if input is valid
                                                                }
                                                            }} /></div>
                                                            <div className="row">
                                                                <div className="col-lg-6">
                                                                    <label htmlFor="">Pincode *</label>
                                                                    <input type="text" name="pincode"
                                                                        value={editData.pincode}
                                                                        onChange={handleEditChange}
                                                                        pattern="^\d{6}$"
                                                                        maxLength="6"
                                                                        style={{
                                                                            borderColor: editData.pincode.length < 6 ? 'grey' : 'initial',
                                                                            backgroundColor: editData.pincode.length < 6 ? '#fff' : 'initial'
                                                                        }}
                                                                    />
                                                                    {editData.pincode.length < 6 && editData.pincode.length > 0 && (
                                                                        <p style={{ color: 'red', fontSize: '12px' }}>Pincode must be  6 digits.</p>
                                                                    )}

                                                                    <div> {invalidPincode}</div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <label htmlFor="">State *</label>
                                                                    <input type="text" name="state" value={editData.state} onChange={(e) => {
                                                                        const regex = /^[A-Za-z\s]*$/; // Allows only letters and spaces
                                                                        if (regex.test(e.target.value)) {
                                                                            handleEditChange(e); // Update state only if input is valid
                                                                        }
                                                                    }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="modal-footer">
                                                    <button type="button" onClick={handleSaveAddress}>Save Address</button>
                                                    {addressAdded && <SucessAlertHanna message={alertMessageAdress} />}

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                )}


                                <div className="accordion-item orderSummeryWrapper">
                                    <h2 className="accordion-header" id="headingTwo">
                                        <button
                                            className={`accordion-button ${isOrderSummaryExpanded ? '' : 'collapsed'}`}
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#OrderSummery"
                                            aria-expanded={isOrderSummaryExpanded}
                                            aria-controls="collapseTwo"
                                        >
                                            <span className='order-summery-heading'>2. Order Summary</span>
                                        </button>
                                    </h2>
                                    <div
                                        id="OrderSummery"
                                        className={`accordion-collapse collapse ${isOrderSummaryExpanded ? 'show' : ''}`}
                                        aria-labelledby="headingTwo"
                                    >
                                        <div className="accordion-body">
                                            <div className="order-summery-details-main">

                                                <div className="cart-item row">
                                                    <div className="col-lg-8 cart-item-left">
                                                        <div className="image-description-wrapper">
                                                            <div className="prod-image"><img src={productInnerDetails?.productDetails?.imageUrls[0]} alt="" /></div>
                                                            <div className="discription">
                                                                <p>{productInnerDetails?.productDetails?.name}</p>
                                                                <span className='brand'>Brand</span>
                                                                <span className="brand-value">{productInnerDetails?.productDetails?.brandDetails.brandName}</span>
                                                                <span className="orderd-buy">Sold by</span>
                                                                <span className="ordered-by-value">{productInnerDetails?.productDetails?.sellerDetails.storedetails.storename}</span>
                                                            </div>
                                                        </div>
                                                        <div className="count-section">
                                                            <div className="calculator">
                                                                {/* Decrement button */}
                                                                {/* Decrement button */}
                                                                <div
                                                                    className="decrement"
                                                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                                                    style={{
                                                                        cursor: quantity > 1 ? 'pointer' : 'not-allowed',
                                                                        opacity: quantity > 1 ? 1 : 0.5,
                                                                    }}
                                                                >
                                                                    <FaMinus className="count-icon" />
                                                                </div>

                                                                {/* Display current quantity */}
                                                                <div className="count">
                                                                    <span>{quantity}</span>
                                                                </div>

                                                                {/* Increment button */}
                                                                {/* Increment button */}
                                                                <div
                                                                    className="increment"
                                                                    onClick={() =>
                                                                        setQuantity(prev =>
                                                                            Math.min(
                                                                                productInnerDetails?.productDetails?.b2bMaxQty || Infinity,
                                                                                prev + 1
                                                                            )
                                                                        )
                                                                    }
                                                                    style={{
                                                                        cursor:
                                                                            quantity >= (productInnerDetails?.productDetails?.b2bMaxQty || Infinity)
                                                                                ? 'not-allowed'
                                                                                : 'pointer',
                                                                        opacity:
                                                                            quantity >= (productInnerDetails?.productDetails?.b2bMaxQty || Infinity) ? 0.5 : 1,
                                                                    }}
                                                                >
                                                                    <FaPlus className="count-icon" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="col-lg-4 cart-item-right">
                                                        <div>
                                                            <span className="offer-price">₹{productInnerDetails?.productDetails?.offerPrice.toFixed(2)}</span>
                                                            <span className="og-price"><strike>₹{productInnerDetails?.productDetails?.price.toFixed(2)}</strike></span>
                                                            <span className="gst">Incl. GST</span>
                                                        </div>
                                                        <div>
                                                            <span className='offer-ratio'>{((productInnerDetails?.productDetails?.price - productInnerDetails?.productDetails?.offerPrice) / productInnerDetails?.productDetails?.price * 100).toFixed(0)}% OFF</span>
                                                            <span className='saved-amt'>You Save ₹{(productInnerDetails?.productDetails?.price - productInnerDetails?.productDetails?.offerPrice).toFixed(2)}</span>
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingThree">
                                        <button
                                            className={`accordion-button ${isPaymentOptionsExpanded ? '' : 'collapsed'}`}
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target=""
                                            aria-expanded={isPaymentOptionsExpanded}
                                            aria-controls="collapseThree"
                                        >
                                            <span className='payment-heading'>3. Payment Options</span>
                                        </button>
                                    </h2>
                                    <div
                                        id="collapseThree"
                                        className={`accordion-collapse collapse ${isPaymentOptionsExpanded ? 'show' : 'show'}`}
                                        aria-labelledby="headingThree"
                                    >
                                        <div className="accordion-body payment-body">
                                            <form>

                                                <div className="payment-method-item" disabled={isLoading} >
                                                    <label className="custom-radio">
                                                        <input checked={!cod} type="radio" name="paymentMethod" value="UPI" onChange={handlePaymentMethodChange} />
                                                        <span className="custom-radio-button"></span>
                                                        <img src="/Images/UPI.png" alt="" />
                                                        <span>UPI Or Other</span>
                                                    </label>

                                                </div>
                                                <div className="payment-method-item">
                                                    <label className="custom-radio">
                                                        <input
                                                            type="radio"
                                                            name="paymentMethod"
                                                            value="Cash on Delivery"
                                                            onChange={handlePaymentMethodChange}
                                                        />
                                                        <span className="custom-radio-button"></span>
                                                        <img src="/Images/Frame 1261155772.png" alt="" />
                                                        <span>Cash on Delivery</span>
                                                    </label>
                                                </div>

                                            </form>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="col-lg-4">
                            {address && address.length > 0 && (
                                <div className="order-summery-card">
                                    <h4>Order Summary</h4>
                                    <div className="order-details">
                                        <table>
                                            <tr>
                                                <td className='left-td'>Sub Total</td>
                                                <td className='right-td total'>₹{subtotal.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td className='left-td'>Shipping Charges</td>
                                                <td className='right-td'><span className='crossed-price'><strike>₹40.00</strike> | </span> <span className='free-dlvry-text'>Free Delivery</span></td>
                                            </tr>
                                            {/* <tr>
                                                <td className='left-td'>Coupon Discount</td>
                                                <td className='right-td'><span className='discount'>-₹50.00</span></td>
                                            </tr> */}
                                            {isRedeemingCoins && (
                                                <tr className='thara-coins'>
                                                    <td className='left-td'>Thara Coins Discount</td>
                                                    <td className='right-td'>
                                                        <div className="coin-main">
                                                            <div className="coin-point">
                                                                <img id='coin-icon' src="/Images/Coin.png" alt="" />
                                                                <small> {coinData?.redeemableCoins || 0} Points</small>
                                                            </div>
                                                            <div className="coin-rs">
                                                                <span className='discount'>-₹{(coinData?.redeemableCoins * coinData?.coinValue || 0).toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </table>
                                        <img src="/Images/Line 39.png" alt="" />
                                        <table>
                                            <tr>
                                                <td className='left-td totel-price-text'>Total</td>
                                                <td className='right-td total-price'>₹{finalTotal.toFixed(2)}</td>
                                            </tr>
                                        </table>
                                        <img src="/Images/Line 40.png" alt="" />
                                        <p className='saved-count'>You can save up to ₹140 on this order</p>
                                        {user?.coin > 0 && (
                                            <div className="coins">
                                                <div className="redeem-coin">
                                                    <input
                                                        type="checkbox"
                                                        checked={isRedeemingCoins}
                                                        onChange={(e) => handleCoinRedemption(e.target.checked)}
                                                    />
                                                    <label htmlFor="reddem-coin-checkbox">
                                                        Redeem {coinData?.redeemableCoins || 0} Thara coins
                                                    </label>
                                                    <img src="/Images/Coin.png" alt="" />
                                                </div>
                                            </div>
                                        )}
                                        {/* Proceed to Checkout button */}
                                        {/* {payment == true || selectedPaymentMethod == 'Cash on Delivery' ? (
                                            <button className='checkoutBtn' disabled={orderPlacing} onClick={placeOrder}> {orderPlacing ? 'Placing Order...' : 'Place Order'}</button>
                                        ) : (<a
                                            href={buttonText === 'Proceed to Payment' ? '#payment' : ''}
                                            onClick={(e) => {
                                                e.preventDefault(); // Prevent default anchor behavior
                                                handleButtonClick(); // Expand/collapse logic
                                            }}
                                        >
                                            <button
                                                type="button"
                                                className="checkoutBtn"
                                                disabled={selectedAddressIndex === null}
                                                style={{
                                                    backgroundColor: selectedAddressIndex === null || selectedPaymentMethod === 'UPI' ? '#ccc' : '#02400C',
                                                }}
                                            >
                                                {buttonText}
                                            </button>
    
                                        </a>)} */}
                                        <button id='payment'
                                            onClick={selectedPaymentMethod === 'Cash on Delivery' ? placeOrder : handlePayment}
                                            className="checkoutBtn"
                                        >
                                            {selectedPaymentMethod === 'Cash on Delivery' ? 'Place Order' : 'Pay Now'}
                                        </button>



                                    </div>
                                    <div className="secured-transaction-container">
                                        <img src="/Images/fi_1746680454848.png" alt="" />
                                        <h6>256 bit Secured Transactions</h6>
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleProdCheckoutPage
