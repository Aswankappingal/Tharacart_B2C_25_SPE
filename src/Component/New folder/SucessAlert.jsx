import React, { useEffect, useState } from 'react';
import './SucessAlert.scss'; // Import the external CSS file

const SucessAlertHanna = ({ message }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Hide the alert after 3 seconds
        const timer = setTimeout(() => setShow(false), 3000);
        return () => clearTimeout(timer); // Cleanup on unmount
    }, []);

    if (!show) return null; // Don't render if not showing

    return (
        <div className="success-alert">
           {message}
        </div>
    );
};

export default SucessAlertHanna;
