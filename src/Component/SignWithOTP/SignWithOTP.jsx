import { Link, useNavigate } from 'react-router-dom'
import './SignWithOTP.scss'
import axios from 'axios'
import baseUrl from '../../baseUrl'
import { useState } from 'react'
// import Navbar from '../Navbar/Navbar'
// import Footer from '../Footer/Footer'
const SignWithOTP = () => {
  const [number,setNumber]=useState('');
  const [loading,setLoading]=useState(false);
  const [userExist,setUserExist]=useState('')
  const navigate=useNavigate()

  const  otpSend= async(e)=>{
    setLoading(true)
    e.preventDefault()
    try {
      const response=await axios.post(`${baseUrl}/otp-send`,{number,code:"91"});
      navigate(`/otp-snd/${number}/${response.data.otpSession}`)
    } catch (error) {
      setUserExist(error.message)
      // console.log(error.message);
      console.log(userExist);
    }finally{
      setLoading(false)
    }
  }

  return (
    <>
      {/* <Navbar /> */}

      <div className="signWithOtpMainWrapper">
        <div className="sign-with-otp-card">
          <div className="number-section">
            <h3>Continue to B2C Market</h3>
            <form action="" onSubmit={otpSend}>
              <div><label htmlFor=""> Phone Number *</label></div>
              <div><input type="text" className='emailOrPhone'  onChange={(e)=>setNumber(e.target.value)} /></div>
              <span className="error">{userExist=='Request failed with status code 409'?(<span>User Already Exist You Can Login <Link to='/login'>Login</Link></span>):''}</span>
              <div style={{ display: "flex", alignItems: "center", paddingTop: "10px", paddingBottom: "10px" }}>
                <input type="checkbox" id='subscribe' />
                <label htmlFor='subscribe' className='sub-label'>Subscribe to WhatsApp, Email notifications. (Optional)</label>
              </div>
              <button disabled={loading}>{loading?'Getting OTP':"GET OTP"}</button>
            </form>
            <p>By Continuing, You agreeing to share my information. Also <br />
              agree with our <a href="https://doc.tharacart.com/policy/terms-of-use.html">Terms of Service</a> & <a href="https://doc.tharacart.com/policy/privacy-policy.html">Privacy Policy</a>.</p>
            <div className="underline-number-section">
              <div className="ul"></div>
              <span>OR</span>
              <div className="ul"></div>
            </div>
          </div>
          <div className="google-authentication">
            <div className="google-auth-container">
              <img src="/Images/google.svg" alt="" />
              <span>Continue with Google</span>
            </div>
           <Link to='/sign-up-with-email'> <div className="google-auth-container">
              <img src="/Images/email-icon.svg" alt="" />
              <span>Continue with Email</span>
            </div></Link>

          </div>
        </div>
        <div className="sign-to-B2B-card">
          <p className='buy-bsns'>Buying for Business? </p>
          <Link>Sign In to B2B Account</Link>
        </div>
      </div>
      {/* <Footer /> */}

    </>
  )
}

export default SignWithOTP
