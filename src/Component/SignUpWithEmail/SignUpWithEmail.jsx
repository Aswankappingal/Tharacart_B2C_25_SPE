import { useState, useEffect } from 'react';
import './SignUpWithEmail.scss'
import { FaArrowLeft, FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import ScrollToTopOnMount from '../ScrollToTopOnMount';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import baseUrl from '../../baseUrl';

const SignUpWithEmail = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [ConformPasswordVisible, setConformPasswordVisible] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [alreadyExist, setAlreadyExist] = useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageConfirm, setErrorMessageConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });

  useEffect(() => {
    setUserData(prevState => ({ ...prevState }));
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConformPasswordVisibility = () => {
    setConformPasswordVisible(!ConformPasswordVisible);
  };


  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=])[A-Za-z\d@#$%^&+=]{8,}$/;

  const GetUserData = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
    setErrorMessage(''); // Clear error message when user starts typing
    console.log(userData);
  };



  const RegisterUser = async (e) => {
    e.preventDefault();

    // Password validation
    if (!passwordPattern.test(userData.password)) {
      setErrorMessage("Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setErrorMessageConfirm("Password and confirm password are not the same");
      return;
    }

    setIsLoading(true); // Start loading

    const dataToSubmit = { ...userData, officialPhoneNumber: userData.phone };
    console.log(dataToSubmit);

    try {
      const response = await axios.post(`${baseUrl}/sign-up-with-email`, dataToSubmit);
      console.log(response.status);
      navigate('/login');
    } catch (error) {
      if (error.response.status == 400) {
        setAlreadyExist('Email Already Exist')
      }
      console.log(error);

    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleInput = (event) => {
    const { value } = event.target;
    // Replace any non-letter characters with an empty string
    const sanitizedValue = value.replace(/[^A-Za-z\s]/g, '');
    event.target.value = sanitizedValue;
  };

  const handlePhoneNumberChange = (event) => {
    const { value } = event.target;
    // Remove any non-digit characters
    const sanitizedValue = value.replace(/\D/g, '');

    // Update the input field value with the sanitized value
    event.target.value = sanitizedValue;

    // Optionally, call GetUserData or any other function
    GetUserData(event);
  };


  return (
    <div className='SignUpWithEmailMainWrapper'>
      {/* <Navbar /> */}
      <ScrollToTopOnMount />
      <div className="sign-up-with-email">
        <div className="create-account-card">
          <div className="create-ac-form-data">
            <div className="create-ac-heading">
              <FaArrowLeft className='left-arrow' />
              <h2>Create Account</h2>
            </div>

            <div className="formData">
              <form onSubmit={RegisterUser}>
                <div>
                  <label htmlFor="name">Full Name *</label>
                </div>
                <div>
                  <input
                    type="text"
                    className="nameField"
                    onChange={GetUserData}
                    onInput={handleInput} // Event handler for input
                    name="name"
                    required
                    pattern="[A-Za-z\s]*"
                    title="Please enter only letters"
                  />
                </div>


                <div>
                  <label htmlFor="email">Email *</label>
                </div>
                <div>
                  <input
                    type="email"
                    className="emailField"
                    onChange={GetUserData}
                    name="email"
                    required
                    pattern="^[^@]+@[^@]+\.[^@]+$"  // Custom pattern to ensure at least one '.'
                    title="Please enter a valid email address with at least one '.'"
                  />
                </div>
                <span style={{ color: "red", fontSize: "12px" }}>  {alreadyExist}</span>


                <div><label htmlFor="">Phone Number *</label></div>
                <div className="phoneNumber">
                  <div className="contry-code">
                    <select name="" id="" onChange={(e) => setCountryCode(e.target.value)}>
                      <option value="+91" >+91</option>
                      <option value="+97">+97</option>
                    </select>
                  </div>
                  <div> <input
                    type="text"
                    className='numberFiled'
                    onChange={handlePhoneNumberChange}
                    name="phone"
                    required
                    maxLength="10"
                    pattern="\d{10}"
                    title="Please enter a 10-digit phone number"
                  /></div>
                </div>
                <div><label htmlFor="">Password *</label></div>
                <div className="password">
                  <input type={passwordVisible ? "text" : "password"} onChange={GetUserData} name='password' required />
                  <div className="eye" onClick={togglePasswordVisibility}>
                    {passwordVisible ? <FaRegEyeSlash className='eye-icon' /> : <FaRegEye className='eye-icon' />}
                  </div>


                </div>
                {errorMessage && <div style={{ color: "red", fontSize: "12px" }}>{errorMessage}</div>}
                <div><label htmlFor="">Confirm Password *</label></div>
                <div className="password">
                  <input type={ConformPasswordVisible ? "text" : "password"} onChange={GetUserData} name='confirmPassword' required />
                  <div className="eye" onClick={toggleConformPasswordVisibility}>
                    {ConformPasswordVisible ? <FaRegEyeSlash className='eye-icon' /> : <FaRegEye className='eye-icon' />}
                  </div>
                </div>
                {errorMessageConfirm && <div style={{ color: "red", fontSize: "12px" }}>{errorMessageConfirm}</div>}
                <div><label htmlFor="">Referral Code (Optional)</label></div>
                <div><input type="text" className='nameField' name='referralCode' onChange={GetUserData} /></div>
                <div style={{ display: "flex", alignItems: "center", paddingTop: "10px", paddingBottom: "10px" }}>
                  <input type="checkbox" id='subscribe' />
                  <label htmlFor='subscribe' className='sub-label'>Subscribe to WhatsApp, Email notifications. (Optional)</label>
                </div>
                <button disabled={isLoading} type="submit" className={`${isLoading?'small-btn':""}`}>{isLoading ? (<Box sx={{ display: 'flex',justifyContent:"center" }}>
                  <CircularProgress style={{color:"white",width:"25px",height:"25px"}}/>
                </Box>) : 'Sign Up'}</button>
                <p>By Continuing, You agreeing to share my information. Also
                  agree with our <a href="">Terms of Service</a> & <a href="">Privacy Policy.</a></p>
              </form>
            </div>
          </div>
          <div className="bottomData">
            <div>
              <p>Creating for Business? </p>
              <Link>Signup for B2B Account</Link>
            </div>
            <div>
              <p>Already have account?  </p>
              <Link>Sign In to Thara Cart</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpWithEmail;
