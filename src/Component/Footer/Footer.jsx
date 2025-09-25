import { Link } from 'react-router-dom'
import './Footer.scss'

const Footer = () => {
  return (
    <div className='FooterMainWrapper'>
      <div className="top-footer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 col-sm-12 col-md-12 footer-left">
              <img src="/Images/tharacart-nav-logo.svg" className='footer-logo' alt="" id='tharacart-navlogo' />
              <img src="/Images/Tharacart-footer-logo.svg" alt="" id='tharacart-footerlogo' />
              <a href="https://maps.app.goo.gl/z6WuEHQbWrr33J7V7">

                <p className="footer-address-naseem">Thara Cart is a one-stop B2C and B2B e-commerce marketplace <br /> offering a broad spectrum of product categories and 
                catering to varied consumer and business needs.</p>

                <p className="footer-address">Thara Cart India Private Limited <br /> 1/152-26,Royal Trade Center , Bypass Road <br />
                  Perinthalmanna,Malappuram,Kerala<br />
                  India,PIN:679322</p>
              </a>
              <p className="download-text">Download Our Mobile App</p>
              <a href="https://apps.apple.com/in/app/thara-cart-marketplace/id1639992424"><img src="/Images/appstore.svg" alt="" style={{ marginRight: "12px" }} /></a>
              <a href="https://play.google.com/store/apps/details?id=com.firstlogicinfolab.thara_cart_customer"><img src="/Images/googleplay.svg" alt="" /></a>

            </div>
            <div className="col-lg col-sm-12 col-md-6 footer-right1">
              <h3>About</h3>
              <div className="footer-items">
                <div><Link to='/About_us'>About Us</Link></div>
                {/* <div><Link to='#'>Career</Link></div> */}
                {/* <div><Link to='#'>Press</Link></div> */}
                {/* <div><Link to='#'>Blog</Link></div> */}
              </div>

            </div>
            {/* <div className="col-lg col-sm-12 col-md-6 footer-right2">
              <h3>Make Money</h3>
              <div className="footer-items">
                <div><Link to='#'>Become A Seller</Link></div>
                <div><Link to='#'>Register Your Brand</Link></div>
                <div><Link to='#'>Be An Affiliate</Link></div>
                <div><Link to='#'>Refer & Earn</Link></div>


              </div>
            </div> */}
            <div className="col-lg col-sm-12 col-md-6 footer-right3">
              <h3>Social</h3>
              <div className="footer-items">
                {/* <div><Link to='#'>Facebook</Link></div> */}
                <div><a href='https://www.instagram.com/tharacart/'>Instagram</a></div>
                <div><Link to='https://in.linkedin.com/company/tharacartpvt'>LinkedIn</Link></div>
                {/* <div><Link to='#'>Youtube</Link></div> */}
                {/* <div><Link to='#'>Twitter</Link></div> */}
              </div>
            </div>
            <div className="col-lg col-sm-12 col-md-6 footer-right4">
              {/* <h3>Help </h3> */}
              <div className="footer-items">
                {/* <div><Link to='#'>Help Centre</Link></div> */}
                {/* <div><Link to='#'>Buyer Protection</Link></div> */}
                {/* <div><Link to='#'>Report Infringement</Link></div> */}


                {/* <div><Link to='#'>Advertise In Thara Cart</Link></div> */}
                {/* <div><Link to='#'>Return & Cancellation</Link></div> */}
                {/* <div><Link to='#'>Don’t have GST?</Link></div> */}
              </div>
            </div>
            <div className="col-lg col-sm-12 col-md-6 footer-right5">
              <h3>Policies </h3>
              <div className="footer-items">

                <div><a href="https://doc.tharacart.com/policy/privacy-policy.html"><span>Privacy Policy</span></a></div>
                <div><a href="https://doc.tharacart.com/policy/shipping&delivery.html"><span>Shipping Policy</span></a></div>
                {/* <div><Link to='#'>Shipping Policy</Link></div> */}
                <div><a href="https://doc.tharacart.com/policy/return&Cancellation.html"><span>Return & Cancellation</span></a></div>
                <div><a href="https://doc.tharacart.com/policy/terms-of-use.html"><span>Terms of Use</span></a></div>
                {/* <div><Link to='#'>Affiliate Policy</Link></div> */}
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="bottom-footer">
        <Link to='#'>© 2019 -2024 Thara Cart India Pvt Ltd</Link>
        <img src="/Images/footer-cards.svg" alt="" />
      </div>
    </div>
  )
}

export default Footer
