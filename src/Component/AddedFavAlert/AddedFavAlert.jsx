import './AddedFavAlert.scss';
import { SiTicktick } from "react-icons/si";
import { MdOutlineClose } from "react-icons/md";

const AddedFavAlert = ({ visible, onClose, message }) => {
  if (!visible) return null;

  return (
    <div className='AddedFavAlertMainWrapper'>
      <div className="alert-container">
        <div className="alert">
          <SiTicktick className='filled-fav-icon' />
          <p>{message}</p>
          <MdOutlineClose className="close-btn" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};


export default AddedFavAlert;
