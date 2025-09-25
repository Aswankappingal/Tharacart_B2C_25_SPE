// ConfirmationModal.js
import React from 'react';
import './ConfirmationModal.scss'

const ConfirmationModal = ({ onConfirm, onCancel ,message }) => {
    return (
        <div>

        <div className="confirmation-alert">
            <div className="alert-content">
                <p>{message}</p>
                <button onClick={onConfirm} className="confirm-btn">Yes</button>
                <button onClick={onCancel} className="cancel-btn">No</button>
            </div>
        </div>



  </div>

    );
};

export default ConfirmationModal;