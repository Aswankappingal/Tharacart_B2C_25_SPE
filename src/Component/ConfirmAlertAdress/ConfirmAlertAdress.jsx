import React from 'react'
import './ConfirmAlertAdress.scss'

const ConfirmAlertAdress = ({onConfirm, onCancel}) => {
    return (
        <div>

            <div className="alert-overlay">
                <div className="alert-box">
                <p>Are you sure you want add new Adress?</p>
                    <div className="alert-actions">
                        <button onClick={onConfirm} className="alert-confirm">Confirm</button>
                        <button onClick={onCancel} className="alert-cancel">Cancel</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ConfirmAlertAdress
