import React from 'react';
import './ImageModal.scss'; // Import CSS for modal styling

const Modal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <img src={imageUrl} alt="Full screen" className="modal-image" />
      </div>
    </div>
  );
};

export default Modal;
