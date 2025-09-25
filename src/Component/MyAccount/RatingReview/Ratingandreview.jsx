import React, { useState } from 'react'
import './Ratingandreview.scss'
import { Link } from 'react-router-dom'
import { FaAngleLeft, FaStar } from 'react-icons/fa6'
import { MdOutlineVerifiedUser } from 'react-icons/md'
import useProductRating from '../../../redux/hooks/ProductInnerPageHooks/useProductRating.js'
import Modal from '../../ImageModal/ImageModal'

const Ratingandreview = () => {

  const { productRatings, status: productRatingStatus, error: productRatingError } = useProductRating();
  // console.log(productRatings, 'hai');

  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (url) => {
    setModalImage(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };




  return (
    <div className='Rating-review-main-wrapper'>
      <div className="rating-review">
        <div className="welcome-head">
          <Link className='back' onClick={() => window.location.reload()}>
            <div className="arrow-icon">
              <FaAngleLeft style={{ color: 'white' }} />
            </div>
          </Link>
          <h2 className='information-heading'>Rating & Reviews</h2>
        </div>
        <div className="main-border">
          {productRatings?.message ? (
            // Display the message if there is no data
            <div className='noRevew'>No Reviews Found</div>
          ) : (productRatings?.map((data, index) => (
            <div className="rating-details" key={index}>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < data.rating ? 'fill-star-rated' : 'fill-star-rated not-fill'}
                  />
                ))}
              </div>
              <div><h3 className='rating-head'>{data.review}</h3></div>
              <div className="sub-head">
                <div className="user-name"> <h6>by {data.userDetails.name}</h6></div>
                <div className="verified"> <p><MdOutlineVerifiedUser /> VerifiedUser
                </p></div>
              </div>
              <div className="review-description">
                <p>{data.comment}</p>
              </div>
              <div className="images">
                {data.mediaUrl?.map((url, index) => (
                  <div className="review-image" key={index} onClick={() => handleImageClick(url.url)}>
                    <img src={url.url} alt="" />
                  </div>
                ))}
              </div>
              <div className="bottom-buttons">
                <div className="buttons">
                  {/* <button>Edit</button> */}
                  <Link to={`/product-inner-page/${data.productId}`}> <button>View Product</button></Link>
                </div>
              </div>
              <div className="bottom-border">

              </div>
            </div>

          )))}

          <Modal isOpen={isModalOpen} onClose={closeModal} imageUrl={modalImage} />



          {/* <div className="rating-details">
                        <div className="stars">
                            <FaStar className='fill-star-rated' />
                            <FaStar className='fill-star-rated' />
                            <FaStar className='fill-star-rated' />
                            <FaStar className='fill-star-rated' />
                            <FaStar className='fill-star-rated' />
                        </div>
                        <h3 className='rating-head'>hello</h3>
                        <div className="sub-head">
                            <div className="user-name"> <h6>by Akhil V</h6></div>
                            <div className="verified"> <p><MdOutlineVerifiedUser /> VerifiedUser
                            </p></div>
                        </div>
                        <div className="review-description">
                            <p>you are right</p>
                        </div>
                        <div className="images">
                            <img src="./Images/hot-cat2.png" alt="" />
                            <img src="./Images/hot-cat2.png" alt="" />
                        </div>
                        <div className="bottom-buttons">
                            <div className="buttons">
                                <button>Edit</button>
                                <button>View Product</button>
                            </div>
                        </div>
                        <div className="bottom-border">

                        </div>
                    </div> */}

          {/* <div className="rating-details">
                        <div className="stars">
                            <FaStar className='fill-star-rated' />
                            <FaStar className='fill-star-rated' />
                            <FaStar className='fill-star-rated' />
                            <FaStar className='fill-star-rated' />
                            <FaStar className='fill-star-rated' />
                        </div>
                        <h3 className='rating-head'>hello</h3>
                        <div className="sub-head">
                            <div className="user-name"> <h6>by Akhil V</h6></div>
                            <div className="verified"> <p><MdOutlineVerifiedUser /> VerifiedUser
                            </p></div>
                        </div>
                        <div className="review-description">
                            <p>you are right</p>
                        </div>
                        <div className="images">
                            <img src="./Images/hot-cat2.png" alt="" />
                            <img src="./Images/hot-cat2.png" alt="" />
                        </div>
                        <div className="bottom-buttons">
                            <div className="buttons">
                                <button>Edit</button>
                                <button>View Product</button>
                            </div>
                        </div>
                        <div className="bottom-border">

                        </div>
                    </div> */}
        </div>
      </div>


    </div>
  )
}

export default Ratingandreview



