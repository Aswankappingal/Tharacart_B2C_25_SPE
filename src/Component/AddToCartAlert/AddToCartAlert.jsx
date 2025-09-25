import { Link } from 'react-router-dom';
import './AddToCartAlert.scss'
import { MdOutlineClose } from "react-icons/md";

const AddToCartAlert = ({ visible, onClose, message }) => {
  if (!visible) return null;

  return (
    <div className='cardAlert'>
      <div className="alert-container">
        <div className="alert">
          <img src="/Images/add to cart.png" alt="" />
          <p>{message}</p> {/* Display dynamic message */}
          {message === 'Item Added to Cart' && (
            <Link className='gotocart' to='/shopping-cart'>Go To Cart</Link>
          )}
          <MdOutlineClose className="close-btn" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default AddToCartAlert;
