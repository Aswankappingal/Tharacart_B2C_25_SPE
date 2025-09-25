import React, { useState, useRef, useEffect } from 'react';
import './Otp.scss';
import axios from 'axios';
import baseUrl from '../../baseUrl';
import { useNavigate, useParams } from 'react-router-dom';

const Otp = () => {
  const { number, otpSession } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otperror,setOtpError]=useState('');
  const [resendOtpSession,setResendOtpSession]=useState('')

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Allow only a single digit and also allow empty input for clearing
    if (value === "" || /^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // If input is empty, keep focus on the current input
      if (value === "" && index > 0) {
        inputRefs.current[index].focus();
      }
      // If input is a digit, move focus to the next input
      else if (index < inputRefs.current.length - 1 && value !== "") {
        inputRefs.current[index + 1].focus();
      }
    }
  };


  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };
  
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}/otp-send`, { number, code: "91" });
      setResendOtpSession(response.data.otpSession)
      setTimeLeft(30);
      setCanResend(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const otpString = otp.join('');

    try {
      const otpSessionValue = resendOtpSession === '' ? otpSession : resendOtpSession;
      const response = await axios.post(`${baseUrl}/otp-check`, { otp: otpString, otpSession:otpSessionValue, number });
      navigate(`/sign-up-with-email-personal-detail/${number}`);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 409) {
        const token = error.response.data.token;
        if (token) {
          localStorage.setItem('authToken', token);
          navigate('/');
        }
      }
      if(error.response.status==500 ||error.response.status==400){
        setOtpError('Incorrect OTP')
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='otp-main-body'>
      <div className="otp-sub-body">
        <div className="otp-form-container">
          <div className="form-title">
            <h1>Enter OTP</h1>
          </div>
          <div className="form-subtitle">
            <h3>Enter the verification code we just sent to your phone number <span>+91 {number}</span></h3>
          </div>

          <form onSubmit={handleSubmit}>
            {timeLeft > 0 ? (
           <>
              <div className="otp-input">
                {otp.map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={otp[index]}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
               
              </div>
              <div className='otpIncorrect' style={{color:"red" }}>{otperror}</div>
           </>
            ) : (
              <p onClick={handleResendOtp} className="resend-otp-button" style={{ cursor: 'pointer',color:"red",textAlign:"center"}}>
                {loading ? 'Resending...' : 'Resend OTP'}
              </p>
            )}
            <div className="otp-timer">
              <h3>{timeLeft > 0 ? `00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}` : "Time exceeded"}</h3>
            </div>
            {timeLeft > 0 && (
              <button type="submit" disabled={loading}>{loading ? 'Confirming...' : 'Confirm'}</button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Otp;
