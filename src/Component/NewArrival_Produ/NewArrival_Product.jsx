import React, { useEffect } from 'react';
import useNewArrivals from '../../redux/hooks/newArrivalssHook/useNewArrivalss';
import './NewArrival_Product.scss';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import BottomBar from '../BottomBar/BottomBar';
import { Link } from 'react-router-dom';
import { FaRegStar, FaStar } from 'react-icons/fa6';

const NewArrival_Product = () => {
    const { newArrivalId } = useParams();
    const { products, loading, error } = useNewArrivals(newArrivalId);

    useEffect(() => {
        console.log(products);
    }, [products]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const renderStars = (rating) =>
        Array.from({ length: 5 }, (_, i) =>
            rating >= i + 1 ? <FaStar key={i} color="gold" /> : <FaRegStar key={i} color="gray" />
        );

    return (




        <div className="whole-function">
            <div>
                <Navbar />
            </div>

            \
            <div className="new-arrival-container">



                <div className="product-list">
                    {products.map((product) => {
                        const variant = product.variantData || {};

                        return (
                            <div key={product.variantId} className="product-card">
                                <Link to={`/product-page/${product.variantId}`} id='Link'>
                                    <img
                                        src={variant.imageUrls || '/placeholder-image.jpg'}
                                        alt={variant.brandId || 'Product'}
                                        className="product-image"
                                    />
                                    <p id='sponsored'>
                                        Sponsored
                                    </p>

                                    <p> {variant.description ? variant.description.slice(0, 102) + (variant.description.length > 50 ? "..." : "") : "No Description"}</p>

                                    {/* <p>Cash on Delivery: {variant.cashOnDelivery ? 'Yes' : 'No'}</p> */}
                                    {/* ⭐ Add Rating Here */}
                                    <p className="rating">
                                        {variant.rating ? variant.rating.toFixed(1) : "0.0"}
                                        <span className="stars">{renderStars(variant.rating || 0)}</span>
                                    </p>
                                    <h6> ₹ {variant.offerPrice || 'Unknown'}.00</h6>

                                    {/* <button>
                                        Add to Cart
                                    </button> */}


                                </Link>

                            </div>
                        );
                    })}
                </div>
            </div>



            <Footer />
            <BottomBar />

        </div>
    );
};

export default NewArrival_Product;
