import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import axios from 'axios';
import baseUrl from '../../baseUrl';
import './SignInWithEmailPersonalAddress.scss';

const SignInWithEmailPersonalAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { phone } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    referralCode: ""
  });

  const getData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const AddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous error messages

    try {
      const res = await axios.post(`${baseUrl}/sign-up-with-personal-details`, { ...formData, phone });
      console.log(res.data);
      localStorage.setItem('authToken', res.data.token);
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.error); 
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='sign-in-with-personal-Address'>
      <div className="signWithOtpMainWrapper">
        <div className="sign-with-otp-card">
          <div className="number-section">
            <h3>Enter Your Personal Details</h3>
            <h6 className='sub-heading-form'>Before shopping provide your basic details</h6>
            
            <form onSubmit={AddUser}>
              <div><label htmlFor="">Name *</label></div>
              <div><input type="text" className='emailOrPhone' name='name' required onChange={getData} /></div>
              
              <div><label htmlFor="">Email *</label></div>
              <div><input type="email" className='emailOrPhone' name='email' required onChange={getData} /></div>
              
              <div><label htmlFor="">Referral Code (Optional)</label></div>
              <div><input type="text" className='emailOrPhone' name='referralCode' onChange={getData} /></div>

              {error && <div className="error-message" style={{color:"red",fontSize:"13px"}}>{error}</div>} {/* Display error message here */}

              <button disabled={loading} className={`${loading ? 'small-btn' : ''}`}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: "center" }}>
                    <CircularProgress style={{ color: "white", width: "25px", height: "25px" }} />
                  </Box>
                ) : "Continue to Home"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInWithEmailPersonalAddress;
