import { IoMdStarOutline } from "react-icons/io";
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import './Products.scss'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import baseUrl from '../../baseUrl'
import { useEffect, useState } from 'react'
import ScrollToTopOnMount from "../ScrollToTopOnMount";

const Products = () => {
    const { type, itemId } = useParams();
    const [products, setProducts] = useState([])

    const getProducts = async () => {
        try {
            const res = await axios.get(`${baseUrl}/getProducts/${itemId}?type=${type}`);
            console.log(res.data);
            setProducts(res.data)

        } catch (error) {
            console.log(error);

        }
    }
    useEffect(() => {
        getProducts()
    }, [])

    return (

       
        <div className='ProductsMainWrapper'>
              
            <Navbar />
        

            <h2 className='heading'>Products</h2>
            <div className="products">
            <ScrollToTopOnMount />
                <div className="row">
                    {
                        products.map((data, index) => {
                            // Calculate the total number of ratings
                            const totalRatings = data.oneRating + data.twoRating + data.threeRating + data.fourRating + data.fiveRating;

                            // Calculate the weighted sum of ratings
                            const weightedSum =
                                1 * data.oneRating +
                                2 * data.twoRating +
                                3 * data.threeRating +
                                4 * data.fourRating +
                                5 * data.fiveRating;

                            // Calculate the average rating
                            const averageRating = totalRatings > 0 ? (weightedSum / totalRatings).toFixed(1) : 0; // Round to 1 decimal place

                            return (
                                <div key={index} className="col-lg-3">
                                    <div className="prod-card">
                                        <div className="prod-image">
                                            <img src={data.imageUrls[0]} alt={data.name} />
                                        </div>
                                        <div className="offer-box">
                                            {Math.round(((data.price - data.offerPrice) / data.price) * 100)}% OFF
                                        </div>
                                        <h5 className="prodDiscription">{data.name}</h5>
                                        <span className='offerPrice'>₹{data.offerPrice.toFixed(2)}</span>
                                        <span className="ogPrice">
                                            <strike>₹{data.price.toFixed(2)}</strike>
                                        </span>
                                        <span className="offer-text">23% OFF</span>
                                        <div className="stock">
                                            {/* Handle stock availability here */}
                                            {/* Example: */}
                                            {data.stock > 4 && data.stock < 10 && "Only a few left"}
                                            {data.stock <= 4 && data.stock > 0 && `Only ${data.stock} left`}
                                            {data.stock <= 0 && "Out of Stock"}
                                        </div>
                                        <div className="ratingBox">
                                            <IoMdStarOutline className='star' />
                                            <span>{averageRating}</span>
                                        </div>
                                        <span className="sponserd">Sponsored</span>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>

            </div>
            <Footer />
        </div>
    )
}

export default Products