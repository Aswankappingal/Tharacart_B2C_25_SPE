import React from 'react'
import './About.scss';
import BottomBar from '../BottomBar/BottomBar'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'


const About_us = () => {
    return (
        <div className='Aboutuswrapper'>
            <Navbar />
            <div className="about-container">
                <div className="about-content">
                    <h2 className="about-title">About Us</h2>

                    <div className="about-description">
                        <p>Thara Cart is a one-stop B2C and B2B e-commerce marketplace, offering a broad spectrum of product categories and catering to varied consumer and business needs.</p>
                    </div>

                    <div className="company-info">
                        <div className="address-block">
                            <p className="company-name">THARA CART INDIA PRIVATE LIMITED,</p>
                            <p className="address">HNO-8/2-523/16, GROUND FLOOR, RAINBOW ARCADE GOLCONDA TOLI CHOWKI, HYDERABAD – 500008, TELANGANA</p>
                        </div>

                        <div className="address-block">
                            <p className="company-name">THARA CART INDIA PRIVATE LIMITED (OPERATIONS):</p>
                            <p className="address">1/152-26, ROYAL TRADE CENTRE, BYPASS ROAD - PERINTHALMANNA, MALAPPURAM, KERALA, INDIA, PIN:679322</p>
                        </div>

                        <div className="email-info">
                            <p>Email: <a href="mailto:support@tharacart.com">support@tharacart.com</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <BottomBar />
        </div>
    )
}

export default About_us
