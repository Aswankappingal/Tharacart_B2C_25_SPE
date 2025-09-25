import { useState, useEffect } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import './Signin.scss';
import Navbar from '../Navbar/Navbar';
import ScrollToTopOnMount from '../ScrollToTopOnMount';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import baseUrl from '../../baseUrl';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Signin = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const [user, setUser] = useState(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const userLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${baseUrl}/signin-check`, { email, password });

      // Get the current time and set the expiration time to 1 hour (3600000 milliseconds)
      const currentTime = new Date().getTime();
      const tokenExpiry = currentTime + 3600000; // 1 hour from now

      // Store both the token and the expiration time in localStorage
      localStorage.setItem('authToken', res.data.token);
      localStorage.setItem('tokenExpiry', tokenExpiry);

      console.log(res.data);
      navigate('/');
      window.location.reload();
    } catch (error) {
      setErrorMsg('Incorrect email or password');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // const handleGoogleSignIn = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user; // The signed-in user info
  //     setUser(user); // Set the user state
  //     console.log("User info: ", user);

  //     // Retrieve user token and set expiration
  //     const token = await user.getIdToken();
  //     localStorage.setItem('authToken', token);
  //     localStorage.setItem('tokenExpiry', new Date().getTime() + 3600000); // Set token expiration

  //     // Check if phone number is available (note: it may not be available)
  //     if (user.phoneNumber) {
  //       console.log("User phone number: ", user.phoneNumber);
  //     } else {
  //       console.log("Phone number is not available for this user.");
  //     }

  //     // Redirect to the home page or dashboard
  //     navigate('/');
  //   } catch (error) {
  //     console.error("Google sign-in error: ", error);
  //     setErrorMsg('Failed to sign in with Google');
  //   }
  // };


  // Check for token expiry
  useEffect(() => {
    const checkTokenExpiry = () => {
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      const currentTime = new Date().getTime();

      // If the current time is greater than the token expiry time, remove the token
      if (tokenExpiry && currentTime > tokenExpiry) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiry');
        console.log('Token has expired and is removed');
      }
    };

    checkTokenExpiry();
  }, []); // Runs on component mount
  const handleGoogleSignInSuccess = async (response) => {
    try {
      const token = response.credential;

      // Send the token to your backend API to verify and sign up the user
      const res = await axios.post(`${baseUrl}/sign-up-with-google`, { token });

      // Log the full response to check if token is present
      console.log('Response from server:', res.data);

      // Check if token is returned from the backend
      if (res.data.token) {
        // Get the current time and set the expiration time to 1 hour (3600000 milliseconds)
        const currentTime = new Date().getTime();
        const tokenExpiry = currentTime + 3600000; // 1 hour from now

        // Store both the token and the expiration time in localStorage
        localStorage.setItem('authToken', res.data.token);
        localStorage.setItem('tokenExpiry', tokenExpiry);

        console.log('User signed in successfully with token:', res.data.token);

        // Redirect to the home page or dashboard
        navigate('/');
        window.location.reload()
      } else {
        console.error('Token is missing in the response.');
        setErrorMsg('Failed to retrieve authentication token');
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      setErrorMsg('Failed to sign in with Google');
    }
  };


  return (
    <div className='signin-main-body'>
      <ScrollToTopOnMount />
      <div className="signin-sub-body">

        <div className="signin-form-container">
          <div className="signin-title">
            <h1>Sign In with Email</h1>
          </div>

          <div className="form-section">
            <form onSubmit={userLogin}>
              <div className="form-inputs">
                <label htmlFor="email">Email *</label>
                <input
                  className='email-input'
                  type="email"

                  required
                  name='email'
                  pattern="^[^@]+@[^@]+\.[^@]+$"  // Custom pattern to ensure at least one '.'
                  title="Please enter a valid email address with at least one '.'"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password">Password *</label>
                <div className="password-section">
                  <div className="password-input-section">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      required
                      name='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="password-right-section" onClick={togglePasswordVisibility}>
                    {passwordVisible ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  </div>
                </div>
                <div style={{ color: "red", fontSize: "12px", paddingTop: "5px", paddingLeft: "5px" }}>
                  {errorMsg}
                </div>
              </div>
              <div className="forgot-password">
                <Link to="/forget-password">Forgot Password? <span>Reset it</span></Link>
              </div>
              <div className="form-group checkbox">
                <input className="check-box" type="checkbox" id="subscribe" />
                <label htmlFor="subscribe">Subscribe to WhatsApp, Email notifications. (Optional)</label>
              </div>
              <div className="sign-in-btn">
                <button className={`${isLoading ? "small-btn" : ""}`} type='submit' disabled={isLoading}>{isLoading ? (<Box sx={{ display: 'flex', justifyContent: "center" }}>
                  <CircularProgress style={{ color: "white", width: "22px", height: "22px" }} />
                </Box>) : "Sign In"}</button>

                <div className='Just_link'>
                  <Link to={'/'} className='LInk'>
                    Explore Without Login
                  </Link>
                </div>

              </div>
              <div className="form-description">
                <p>By Continuing, You agreeing to share my information. Also agree with our <a href="https://doc.tharacart.com/policy/terms-of-use.html">Terms of Service</a> &<a href="https://doc.tharacart.com/policy/privacy-policy.html"> Privacy Policy</a>.</p>
              </div>
              <div className="underline-number-section">
                <div className="ul"></div>
                <span>OR</span>
                <div className="ul"></div>
              </div>
            </form>
            {/* <div  style={{ textDecoration: "none", cursor: 'pointer' }}>
              <div className="continue-with-google">
                <h3>Continue with Google</h3>
              </div>
            </div> */}
            <GoogleOAuthProvider clientId='109848744218-4pf9fga0q4kr106ofvja2uvcvoujvtc3.apps.googleusercontent.com'>
              <div className='google'>
                <GoogleLogin
                  onSuccess={handleGoogleSignInSuccess}
                  onError={() => console.log('Login Failed')}
                />
              </div>
            </GoogleOAuthProvider>

            <a href="" style={{ textDecoration: "none" }}>
              <Link to='/sign-with-otp' style={{ textDecoration: "none" }}>
                <div className="continue-with-otp">
                  <div className="google-logo">
                    <img src="/Images/email-newsletter-subscription-svgrepo-com 1.png" alt="" />
                  </div>
                  <h3>Continue with OTP</h3>
                </div></Link>
            </a>

            <Link style={{ textDecoration: "none" }} to='/sign-up-with-email'><div className='sign-up' style={{ textAlign: 'center', fontWeight: "600", color: "black" }}>Sign Up</div></Link>
            {/* <div className="business-buying">
              <div className="buying-business">
                <a href="">Buying for Business?</a>
              </div>
              <div className="sign-in-to-b2b">
                <a href="">Sign In to B2B Account</a>
              </div>
            </div> */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
