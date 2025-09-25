// CustomAlert.js
import React from 'react';
import './ConformAlert.scss'; // Create a CSS file for styling if needed

const CustomAlert = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="customeAlertOverlay">
      <div className="custom-alert">
      <p className='alert-message'>{message}</p>
      <button onClick={onConfirm} className="confirm-btn">Yes</button>
      <button onClick={onCancel} className="cancel-btn">No</button>
    </div>
    </div>
  );
};

export default CustomAlert;
