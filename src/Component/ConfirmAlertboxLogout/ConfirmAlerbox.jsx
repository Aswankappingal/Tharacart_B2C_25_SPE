import React from 'react'
import './ConfirmAlertboxLogout.scss'

const ConfirmAlerbox = ({ onConfirm, onCancel }) => {
    return (
        <div>

            <div className="confirmation-alert">
                <div className="alert-content">
                    <p>Are you sure you want to log out?</p>
                    <button onClick={onConfirm} className="confirm-btn">Yes</button>
                    <button onClick={onCancel} className="cancel-btn">No</button>
                </div>
            </div>



        </div>
    )
}

export default ConfirmAlerbox
