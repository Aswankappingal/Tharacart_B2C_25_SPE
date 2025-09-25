import React, { useState } from 'react';
import axios from 'axios';
import baseUrl from '../../baseUrl';
import './ForgotPassword.scss'
import { Link } from 'react-router-dom';

const RequestPasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading,setloading]=useState(false)

    const handleSubmit = async (e) => {
        setloading(true)
        e.preventDefault();
        setMessage('');
        setError('');

        if (!email) {
            setError('Please enter your email');
            return;
        }

        try {
            const response = await axios.post(`${baseUrl}/reset-password`, { email });
            setMessage(response.data.message); // Message returned from the backend
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        }finally{
            setloading(false)
        }
    };

    return (
        <div className='forgetPasswordMainWrapper'>
            <div className='reg-card'>
                <h2>Reset Your Password</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                     <div><label>Email *</label></div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">{loading?'Sending...':'Send Reset Link'}</button>
                </form>
                <div className='login'><Link to='/login'>Sign In</Link></div>
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default RequestPasswordReset;
