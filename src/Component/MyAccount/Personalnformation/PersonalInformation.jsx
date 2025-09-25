import { useEffect, useState } from 'react';
import axios from 'axios';
import './PersonalInformation.scss';
import baseUrl from '../../../baseUrl';
import SucessAlertHanna from '../../addressAdded/SucessAlert';
import { FaAngleLeft } from 'react-icons/fa6';
import { Link } from 'react-router-dom';


const PersonalInformation = ({ user }) => {
    const [editingField, setEditingField] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const [validationMessages, setValidationMessages] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(user, 'User data loaded');
    }, [user]);

    const validateField = (field, value) => {
        if (field === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) || 'Invalid email format.';
        }
        if (field === 'phone') {
            const phoneRegex = /^\d{10}$/;
            return phoneRegex.test(value) || 'Phone number must be 10 digits.';
        }
        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        const validationMessage = validateField(name, value);
        setValidationMessages((prev) => ({
            ...prev,
            [name]: validationMessage === true ? '' : validationMessage,
        }));
    };

    const handleEditClick = (field) => {
        setEditingField(field === editingField ? null : field);
    };

    const handleSave = async (field) => {
        const validationMessage = validateField(field, formData[field]);
        if (validationMessage !== true) {
            alert(validationMessage);
            return;
        }

        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                throw new Error('Authentication token missing. Please log in again.');
            }

            const response = await axios.post(
                `${baseUrl}/updateUser`,
                {
                    newEmail: formData.email,
                    name: formData.name,
                    phone: formData.phone,
                },
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );

            if (response.status === 200) {
                setAlertMessage('User information updated successfully!');
                setShowAlert(true);

                setFormData((prev) => ({
                    ...prev,
                    [field]: formData[field],
                }));
                setEditingField(null);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setAlertMessage(error.response?.data?.message || 'Failed to update user information.');
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className='Personal-information-main-wrapper'>
            <div className="personal-information">
                <div className="welcome-head">
                    <Link onClick={() => window.location.reload()} className='Arrow-main-whole'>
                        <div className="arrow-icon">
                            <FaAngleLeft style={{ color: 'white' }} />
                        </div>
                    </Link>
                    <h2 className='information-heading'>Personal information</h2>
                </div>
                <div className="container-fluid">
                    <div className="personal-information-cards-wrapper row">
                        <div className="col-lg-6 infrmtn-left">
                            <div className="address-card">
                                {['name', 'email', 'phone'].map((field) => (
                                    (field === 'phone' && user?.email) ? null : ( // Hide phone field if logged in via email
                                        <div key={field} className="address-item">
                                            <div>
                                                <p>{field.charAt(0).toUpperCase() + field.slice(1)}</p>
                                                {editingField === field ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            name={field}
                                                            value={formData[field]}
                                                            onChange={handleInputChange}
                                                            autoFocus
                                                            disabled={field === 'email' && user?.emailVerified} // Disable email input if verified
                                                        />
                                                        {validationMessages[field] && (
                                                            <p className="error-message" style={{ color: 'red' }}>
                                                                {validationMessages[field]}
                                                            </p>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span>{formData[field]}</span>
                                                )}
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        editingField === field
                                                            ? handleSave(field)
                                                            : handleEditClick(field)
                                                    }
                                                    disabled={
                                                        loading && editingField === field ||
                                                        (field === 'email' && user?.emailVerified) // Disable email edit button if verified
                                                    }
                                                >
                                                    {loading && editingField === field
                                                        ? 'Saving...'
                                                        : editingField === field
                                                            ? 'Save'
                                                            : field === 'email' && user?.emailVerified
                                                                ? 'Verified'
                                                                : 'Edit'}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                ))}
                                {/* <div className="address-item">
                                    <div>
                                        <p>Password</p>
                                        <span>{showPassword ? user.password : '*'.repeat(user.password?.length)}</span>
                                    </div>
                                    <div>
                                        <button onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div className="col-lg-6 infrmtn-right">
                            <div className="connect-social-account-card">
                                <h2>Connect Social Accounts</h2>
                                <div className="create-account-item">
                                    <div className="connect-google">
                                        <img src="/Images/google.svg" alt="" />
                                        <span>Connect Google Account</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                        <img
                                            src={
                                                user?.email
                                                    ? "/Images/Icon copy.png" // Connected icon
                                                    : "/Images/x-circle-contained.png" // Not connected icon
                                            }
                                            className="cross-img"
                                            alt=""
                                        />
                                        <span className={`connection ${user?.email ? "connected" : "not-connected"}`}>
                                            {user?.email ? "Connected" : "Not Connected"}
                                        </span>
                                    </div>
                                </div>

                                <div className="create-account-item">
                                    <div className="connect-google">
                                        <img src="/Images/Apple.png" alt="" />
                                        <span>Apple account</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                        <img src="/Images/x-circle-contained.png" className='cross-img' alt="" />
                                        <span className='connection-apple'>Not Connected</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showAlert && <SucessAlertHanna message={alertMessage} />}
        </div>
    )
}

export default PersonalInformation
