import { useState } from 'react';
import './WalletSection.scss';
import { IoArrowUpSharp } from "react-icons/io5";
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { FaAngleLeft } from 'react-icons/fa6';

const WalletSection = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const data = Array.from({ length: 170 }, (_, index) => ({
        id: `TC00023${index + 1}`,
        date: `06 December 2023 ${12 + index % 12}:00 PM`,
        price: -150.50 + index
    }));

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const currentItems = data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className='walletSectionMainWrapper'>
            <div className="walletSection">

                <div className="welcome-head">
                    <Link onClick={() => window.location.reload()} className='Main-heade-link'>
                        <div className="arrow-icon">
                            <FaAngleLeft style={{ color: 'white' }} />
                        </div>
                    </Link>
                    <h1>My Wallet</h1>
                </div>
               
                <div className="heyTharaCard">
                    <img src="/Images/heythara.png" alt="" />
                    <div>
                        <h5>Hey, Thara</h5>
                    </div>
                    <div>
                        <h3>₹150.50</h3>
                        <p>Your Wallet Balance</p>
                    </div>
                </div>
                <div className="transaction-history-card">
                    <div className="transaction-header">
                        <h3>Transaction History</h3>
                        <select name="" id="">
                            <option value="">Last 90 Days</option>
                            <option value="">Last 90 Days</option>
                            <option value="">Last 90 Days</option>
                        </select>
                    </div>
                    <div className="table-section">
                        <div className="table-only">
                            <table>
                                <tbody>
                                    {currentItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <IoArrowUpSharp className='arrow outArrow' />
                                                <span>Used for Ordering</span>
                                            </td>
                                            <td><p>For Order ID : {item.id}</p></td>
                                            <td><p>{item.date}</p></td>
                                            <td className="price">{item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <ReactPaginate
                            previousLabel={'< previous'}
                            nextLabel={'next >'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={Math.ceil(data.length / itemsPerPage)}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={1}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination'}
                            activeClassName={'active'}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletSection;
