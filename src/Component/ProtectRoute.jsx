import { Link, Navigate } from 'react-router-dom';
import UseLoginedUser from '../redux/hooks/NavbarHook/UseLoginedUser';
import { useEffect, useState } from 'react';
import Navbar from './Navbar/Navbar';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('authToken');
  const { loginedUser, isLoading: isUserLoading } = UseLoginedUser(); // Assuming UseLoginedUser returns a loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoading) {
      setIsLoading(false);
    }
  }, [isUserLoading]);

  // Redirect to login if no token or invalid user data
  if (!token || loginedUser?.length === 0) {
    return <Navigate to="/login" />;
  }

  // Show buffer while loading
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="pleaseLoginContainer">
          <div
            style={{
              width: '100%',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            Loading... Please wait
          </div>
        </div>
      </>
    );
  }


  return element;
};

export default ProtectedRoute;