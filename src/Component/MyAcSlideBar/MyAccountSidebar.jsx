import { useEffect, useState } from 'react';
import './MyAccountSidebar.scss'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom'
import ConfirmAlerbox from '../ConfirmAlertboxLogout/ConfirmAlerbox';
import { useNavigate } from 'react-router-dom';



const MyAccountSidebardemo = ({ rightSection, setRightSection, user }) => {


    const [isOpen, setIsOpen] = useState(true); // Initialize the state as true
    const [showAlert, setShowAlert] = useState(false);
    const [profileUrl, setProfileUrl] = useState('');


    const handleToggleOffcanvas = () => {
        setIsOpen((prevState) => !prevState); // Toggle the state

    };
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        console.log("this is user", user);
    }, []);


    const handleLogout = () => {
        setShowAlert(true);
    };


    const handleConfirmLogout = () => {
        localStorage.clear();
        setShowAlert(false);
        navigate('/login');
        window.location.reload
    };


    const handleCancelLogout = () => {
        setShowAlert(false);
    };

    useEffect(() => {
        console.log("hai", profileUrl);
    }, [profileUrl])


    return (
        <div className='myaccount-sidebar'>
            {/* ====================================mobile=============================== */}

            {
                isOpen ? (
                    <div className="mobile-menubarrrrrr">

                        <div className="right-angle" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample" onClick={handleToggleOffcanvas}>  {isOpen ? <FaAngleLeft /> : <FaAngleRight />}</div>

                        <div className={`offcanvas offcanvas-start ${isOpen ? 'show' : ''}`} id="offcanvasExample" aria-labelledby="offcanvasExampleLabel" onHide={() => setIsOpen(false)}>
                            <div className="offcanvas-header">

                                <h5 className="offcanvas-title" id="offcanvasExampleLabel">  <div className="silidebar-heading-section">
                                    <h1 data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => setRightSection('MyAcDefault')}><img src={user?.profileUrl} alt="Profile" onError={() => console.log("Image failed to load:", user?.profileUrl)} />
                                        Hi,{user?.name}</h1>
                                    <div className="register-b2b">
                                        <p>Save up to 15% with Business Account</p>
                                        <a href='https://b2b.tharacart.com/login' className='reg-account'>Register B2B Account Now</a>
                                    </div>
                                </div></h5>

                                <div className="left-angle" data-bs-dismiss="offcanvas" aria-label="Close" onClick={handleToggleOffcanvas}><FaAngleLeft /></div>
                            </div>
                            <div className="offcanvas-body">
                                <div className="my-orders-main">
                                    {/* <div className="my-orders" onClick={() => setRightSection('my-orders')} data-bs-dismiss="offcanvas" aria-label="Close"> */}
                                    <div
                                        className="my-orders"
                                        onClick={() => {
                                            setRightSection('my-orders');
                                            handleToggleOffcanvas();
                                        }}
                                    >
                                        <div className="my-order-icon">
                                            <img src="/Images/my-order.png" alt="" />
                                        </div>
                                        <h1 className={`${rightSection == 'my-orders' ? "active" : ''}`}>My Orders</h1>
                                    </div>

                                    <div className="myorders-collapse">
                                        <div className="accordion" id="accordionExample">
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="headingOne">
                                                    < div className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                        <div className="account-info">
                                                            <div className="icon">
                                                                <img src="/Images/user.png" alt="" />
                                                            </div>
                                                            <div className="text">
                                                                <span>Account Info</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </h2>
                                                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">
                                                        <div className="body-contents">
                                                            <div data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => { setRightSection('personal-information'); handleToggleOffcanvas() }}><Link className={`account-info-contents ${rightSection == 'personal-information' ? "active" : ''}`} >Personal Information</Link></div>
                                                            <div data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => { setRightSection('address'); handleToggleOffcanvas() }}>
                                                                <Link className={`account-info-contents ${rightSection == 'address' ? "active" : ''}`}>Addresses</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="headingTwo">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                        <div className="account-info">
                                                            <div className="icon">
                                                                <img src="/Images/my-stuff.png" alt="" />
                                                            </div>
                                                            <div className="text">
                                                                <span>My Stuff</span>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </h2>
                                                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">
                                                        <div className="body-contents">
                                                            <div data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => { setRightSection('whishlist'); handleToggleOffcanvas() }}><Link className={`account-info-contents ${rightSection == 'whishlist' ? "active" : ''}`} >Wishlist</Link></div>
                                                            <div
                                                                onClick={() => { setRightSection('RatingandReview'); handleToggleOffcanvas() }}
                                                            >
                                                                <Link className={`account-info-contents ${rightSection == 'RatingandReview' ? "active" : ''}`}>My Ratings & Reviews</Link>
                                                            </div>
                                                            <div>
                                                                <Link className='account-info-contents' >My Question & Answers</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="my-orders" onClick={() => { setRightSection('wallet'); handleToggleOffcanvas() }} data-bs-dismiss="offcanvas" aria-label="Close">
                                                <div className="my-order-icon">
                                                    <img src="/Images/wallet-03.svg" alt="" />
                                                </div>
                                                <h1 className={`${rightSection == 'wallet' ? "active" : ''}`}>Wallet</h1>
                                            </div>
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="headingThree">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                        <div className="account-info">
                                                            <div className="icon">
                                                                <img src="/Images/announcement-02-svgrepo-com 1.png" alt="" />
                                                            </div>
                                                            <div className="text">
                                                                <span> Reward Area</span>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </h2>
                                                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">
                                                        <div className="body-contents">
                                                            <div> <Link className='account-info-contents'>Refer & Earn</Link></div>
                                                            <div>
                                                                <Link className='account-info-contents'>Affiliate Dashboard</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="my-orders">
                                                {showAlert && (
                                                    <ConfirmAlerbox
                                                        onConfirm={handleConfirmLogout}
                                                        onCancel={handleCancelLogout}
                                                    />

                                                )}
                                                <div className="my-order-icon">
                                                    <img src="/Images/logout-02.png" alt="" />
                                                </div>
                                                <h1 onClick={handleLogout}>Logout</h1>
                                            </div>
                                        </div>
                                    </div>

                                </div>


                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="right-angle" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample" onClick={handleToggleOffcanvas}>  {isOpen ? <FaAngleLeft /> : <FaAngleRight />}</div>

                )
            }

            {/* =================================desktop============================== */}
            <div className="sidebar-content">
                <div className="silidebar-heading-section">
                    <h1> <img src={user?.profileUrl} alt="" />Hi,{user?.name}</h1>
                    <div className="register-b2b">
                        <p>Save up to 15% with Business Account</p>
                        <a href='https://b2b.tharacart.com/login' className='reg-account'>Register B2B Account Now</a>
                    </div>
                </div>

                <div className="my-orders-main">
                    <div className="my-orders" onClick={() => setRightSection('my-orders')} >
                        <div className="my-order-icon">
                            <img src="/Images/my-order.png" alt="" />
                        </div>
                        <h1 className={`${rightSection == 'my-orders' ? "active" : ''}`}>My Orders</h1>
                    </div>

                    <div className="myorders-collapse">
                        <div className="accordion" id="accordionExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne">
                                    < div className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        <div className="account-info">
                                            <div className="icon">
                                                <img src="/Images/user.png" alt="" />
                                            </div>
                                            <div className="text">
                                                <span>Account Info</span>
                                            </div>
                                        </div>
                                    </div>
                                </h2>
                                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <div className="body-contents">
                                            <div onClick={() => setRightSection('personal-information')}><Link className={`account-info-contents ${rightSection == 'personal-information' ? "active" : ''}`} >Personal Information</Link></div>
                                            <div onClick={() => setRightSection('address')}>
                                                <Link className={`account-info-contents ${rightSection == 'address' ? "active" : ''}`}>Addresses</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingTwo">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        <div className="account-info">
                                            <div className="icon">
                                                <img src="/Images/my-stuff.png" alt="" />
                                            </div>
                                            <div className="text">
                                                <span>My Stuff</span>
                                            </div>
                                        </div>
                                    </button>
                                </h2>
                                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <div className="body-contents">
                                            <div onClick={() => setRightSection('whishlist')}><Link className={`account-info-contents ${rightSection == 'whishlist' ? "active" : ''}`} >Wishlist</Link></div>

                                            <div
                                                onClick={() => { setRightSection('RatingandReview'); handleToggleOffcanvas() }}
                                            >
                                                <Link className={`account-info-contents ${rightSection == 'RatingandReview' ? "active" : ''}`}>My Ratings & Reviews</Link>
                                            </div>

                                            <div>
                                                <Link className='account-info-contents' >My Question & Answers</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="my-orders" onClick={() => setRightSection('wallet')}>
                                <div className="my-order-icon">
                                    <img src="/Images/wallet-03.svg" alt="" />
                                </div>
                                <h1 className={`${rightSection == 'wallet' ? "active" : ''}`}>Wallet</h1>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingThree">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        <div className="account-info">
                                            <div className="icon">
                                                <img src="/Images/announcement-02-svgrepo-com 1.png" alt="" />
                                            </div>
                                            <div className="text">
                                                <span> Reward Area</span>
                                            </div>
                                        </div>
                                    </button>
                                </h2>
                                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <div className="body-contents">
                                            <div>        <Link className='account-info-contents'>Refer & Earn</Link></div>
                                            <div>
                                                <Link className='account-info-contents'>Affiliate Dashboard</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="my-orders">

                                {showAlert && (
                                    <ConfirmAlerbox
                                        onConfirm={handleConfirmLogout}
                                        onCancel={handleCancelLogout}
                                    />

                                )}
                                <div className="my-order-icon">
                                    <img src="/Images/logout-02.png" alt="" />
                                </div>
                                <h1 onClick={handleLogout}>Logout</h1>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MyAccountSidebardemo