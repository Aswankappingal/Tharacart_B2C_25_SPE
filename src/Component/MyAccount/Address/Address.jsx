import { useEffect, useRef, useState } from 'react';
import './Address.scss'
import baseUrl from '../../../baseUrl';
import useFetchAddress from '../../../redux/hooks/checkoutPageHooks/useFetchAddress';
import axios from 'axios';
import SucessAlertHanna from '../../addressAdded/SucessAlert';
// import ConfirmationModal from '../../AlertboxLogout/Alertlogout';
import { Link, useNavigate } from 'react-router-dom';
import { FaAngleLeft } from 'react-icons/fa6';
import CustomAlert from '../../ConfirmAlert/ConfirmAlert';


const Address = ({ user }) => {
    const closeBtnRef = useRef(null);

    const { address, status: addressStatus, error: addressError, refetch: addressRefetch } = useFetchAddress();
    const [alertMessageAdress, setAlertMessageAdress] = useState('');
    const [addressAdded, setAddressAdded] = useState(false);
    // const [addresses, setAddresses] = useState(user.address || []); // Local state for addresses
    const [deleteIndex, setDeleteIndex] = useState(null); // Track the index of the address to delete
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [invalidPincode, setInvalidPincode] = useState('');
    const closeButtonRef = useRef(null);
    const navigate = useNavigate()




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
    const [showEditModal, setShowEditModal] = useState(false);
    const [addressIndex, setAddressIndex] = useState(null); // Track address being edited

    useEffect(() => {
        if (addressIndex !== null) {
            // Prefill the editData state with the selected address
            const selectedAddress = address[addressIndex] || {};
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
    }, [addressIndex]);


    const handleEditClick = (addressId) => {

        setAddressIndex(addressId);
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
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
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to fetch location');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
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
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to fetch location');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }

    }
    const handleCloseAlert = () => {
        setAddressAdded(false);
        closeButtonRef.current?.click();
        console.log("Navigating to checkout page");
        // setTimeout(() => {
        //     navigate('/address');
        // }, 100);

    };
    // Address Adding

    const addAddress = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('No auth token found');
                return;
            }

            // Check for empty fields and invalid data
            if (!formData.data) {
                setAlertMessageAdress('Data is mandatory for the fields.');
                setAddressAdded(true);
                return;
            }

            if (formData.phoneNumber.length !== 10) {
                setAlertMessageAdress('Phone number must be exactly 10 digits.');
                setAddressAdded(true);
                return;
            }

            if (formData.alternativePhoneNumber && formData.alternativePhoneNumber.length !== 10) {
                setAlertMessageAdress('Alternative phone number must be exactly 10 digits.');
                setAddressAdded(true);
                return;
            }

            // Validation for pincode
            if (formData.pincode.length !== 6) {
                setAlertMessageAdress('Pincode must be exactly 6 digits.');
                return;
            }

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
            if (error.response.data = `Invalid pincode: ${formData.pincode}  is not serviceable`) {
                setInvalidPincode(error.response.data)
            }

            setAlertMessageAdress('Error adding address');
            setAddressAdded(true);
        }
    };
    // Address Update function
    const handleSaveAddress = async () => {
        try {
            const userId = user ? user?.id : null;
            const response = await axios.put(
                `${baseUrl}/update-checkout-address/${userId}`,
                { ...editData, addressIndex }
            );





            if (response.status === 200) {
                setAlertMessageAdress('Address Updated successfully!');
                setAddressAdded(true);
                setInvalidPincode("");
                // Reset addressAdded after 3 seconds to allow the alert to reappear on subsequent updates
                setTimeout(() => {
                    setAddressAdded(false);
                }, 3000);
                addressRefetch()
                setShowEditModal(false);
                closeBtnRef.current.click();
            }
        } catch (error) {
            console.error('Error adding address:', error);
            if (error.response.data = `Invalid pincode: ${formData.pincode}  is not serviceable`) {
                setInvalidPincode(error.response.data)
            }

            alert("Failed to update address. Please try again.");
        }
    };

    const handlemodalclose = () => {
        setFormData({ name: '', phoneNumber: '', alternativePhoneNumber: '', typeOfAddress: '', primaryAddress: '', houseName: '', localArea: '', landMark: '', pincode: '', state: '', location: '', country: '' })

    }


    // Function to confirm deletion (open modal)
    const confirmDelete = (index) => {
        setDeleteIndex(index);
        setIsModalVisible(true);
    };

    // Function to handle address deletion
    const handleDelete = async () => {
        if (deleteIndex === null) return;

        try {
            const userId = user.id; // Assuming the user object has an id field
            const response = await axios.delete(`${baseUrl}/delete-address/${userId}`, {
                data: { addressIndex: deleteIndex },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            if (response.status === 200) {
                // setAddresses((prevAddresses) => prevAddresses.filter((_, i) => i !== deleteIndex));
                setAlertMessageAdress('Address Deleted !');
                setAddressAdded(true);
                setTimeout(() => {
                    setAddressAdded(false);
                }, 3000);
                addressRefetch()
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            alert('Failed to delete the address. Please try again.');
        } finally {
            setDeleteIndex(null);
            setIsModalVisible(false);
        }
    };

    // Cancel deletion
    const handleCancel = () => {
        setDeleteIndex(null);
        setIsModalVisible(false);
    };

    const handleprimaryChange = (event) => {
        const { name, type, checked, value } = event.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value // Use `checked` for checkboxes
        }));
    };

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


    // sorting primary address as first
    const sortedAddresses = [...address].map((addr, index) => ({ ...addr, originalIndex: index }))
        .sort((a, b) => {
            if (a.primaryAddress && !b.primaryAddress) return -1;
            if (!a.primaryAddress && b.primaryAddress) return 1;
            return 0;
        });

    return (
        <div className='AddressPageMainWrapper'>
            {/* edit adress */}
            {addressAdded && <SucessAlertHanna message={alertMessageAdress} />}


            {showEditModal && (
                <div className="modal fade show" id="editAddressModal" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Update Address</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={closeBtnRef} onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-lg-6 modal-left">
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
                                                <div>  {invalidPincode}</div>
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
                                <button type="button" onClick={handleSaveAddress}>Update Address</button>


                            </div>
                        </div>
                    </div>
                </div>

            )}




            <div className="address-section">
                <div className="address-header">
                    <div className="welcome-head">
                        <Link className='back' onClick={() => window.location.reload()} >
                            <div className="arrow-icon">
                                <FaAngleLeft style={{ color: 'white' }} />
                            </div>
                        </Link>
                        <h2>My Saved Addresses</h2>
                    </div>
                    <button data-bs-toggle="modal" data-bs-target="#exampleModal">Add New Address</button>
                </div>
                <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Add New Address</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={closeButtonRef} onClick={handlemodalclose}></button>
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
                                                <div>  {invalidPincode}</div>
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
                <div className="container-fluid">
                    <div className="address-cards-main row">
                        {
                            sortedAddresses.map((data, sortedIndex) => (
                                <div className="col-lg-6" key={sortedIndex}>
                                    <div className="address-card">
                                        <div className="card-header">
                                            <div>
                                                {data.primaryAddress ? (
                                                    <button className="addressType active-address">Default</button>
                                                ) : (
                                                    ''
                                                )}
                                                <button className="addressType">{data.typeOfAddress}</button>
                                            </div>
                                            <div>
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => handleEditClick(data.originalIndex)} // Use originalIndex here
                                                >
                                                    Edit
                                                </button>
                                                {
                                                    data.primaryAddress ? ("") : (<button
                                                        onClick={() => confirmDelete(data.originalIndex)} // Use originalIndex here
                                                        className="edit-btn delete-btn"
                                                    >
                                                        Delete
                                                    </button>)
                                                }
                                            </div>
                                        </div>
                                        <h2 className="card-title">{data.name}, +91 {data.phoneNumber}</h2>
                                        <p>
                                            {data.houseName}, {data.landMark}, {data.localArea}, {data.state}, IN - {data.pincode}
                                        </p>
                                        <p>{`Alternative Number : ${data.alternativePhoneNumber}`}</p>
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                </div>
            </div>
            {isModalVisible && (
                <CustomAlert
                    message="Are you sure you want to delete this address?"
                    onConfirm={handleDelete}
                    onCancel={handleCancel}
                />
            )}
        </div>
    )
}

export default Address
