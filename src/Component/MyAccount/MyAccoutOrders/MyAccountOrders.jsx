import { useEffect, useState } from 'react';
import useOrders from '../../../redux/hooks/OrderPageHooks/useOrderProduct';
import './MyAccountOrders.scss';
import { Link } from 'react-router-dom';
import { FaAngleLeft } from 'react-icons/fa6';

const MyAccountOrders = () => {
  const { orders, status, error } = useOrders();
  const [deliveryStatuses, setDeliveryStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedOrderTime, setSelectedOrderTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (orders?.length > 0) {
      const uniqueStatuses = Array.from(new Set(orders.map((order) => order.status)))
        .map((status) => ({
          value: status,
          label: getStatusLabel(status),
        }));
      setDeliveryStatuses(uniqueStatuses);
    }
  }, [orders]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 0: return 'Processing';
      case 1: return 'Shipped';
      case 2: return 'Out for Delivery';
      case 3: return 'Delivered';
      case 4: return 'Cancelled';
      default: return 'Unknown Status';
    }
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleOrderTimeChange = (event) => {
    setSelectedOrderTime(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filterOrdersByTime = (orderDate) => {
    if (!selectedOrderTime) return true;

    const now = new Date();
    const orderDateObj = new Date(orderDate);

    if (isNaN(orderDateObj)) {
      console.warn("Invalid order date:", orderDate);
      return false;
    }

    switch (selectedOrderTime) {
      case '6months':
        return now - orderDateObj <= 6 * 30 * 24 * 60 * 60 * 1000; // Last 6 months
      case '1year':
        return now - orderDateObj <= 12 * 30 * 24 * 60 * 60 * 1000; // Last 1 year
      case '2years':
        return now - orderDateObj <= 24 * 30 * 24 * 60 * 60 * 1000; // Last 2 years
      default:
        return true;
    }
  };

  // const filterOrdersBySearch = (order) => {
  //   const orderIdMatch = order.id?.toLowerCase().includes(searchTerm);

  //   const productNameMatch = order?.product?.items?.some((item) =>
  //     item.productName?.toLowerCase().includes(searchTerm)
  //   );
  //   return !searchTerm || orderIdMatch || productNameMatch;
  // };


  const filterOrdersBySearch = (order) => {
    const orderIdMatch = order.id?.toLowerCase().includes(searchTerm);

    const itemsArray = Array.isArray(order?.product?.items)
      ? order.product.items
      : Array.isArray(order?.product)
        ? order.product
        : [];

    const productNameMatch = itemsArray.some((item) =>
      item.productName?.toLowerCase().includes(searchTerm)
    );

    return !searchTerm || orderIdMatch || productNameMatch;
  };





  const filteredOrders = orders?.filter((order) =>
    (!selectedStatus || order.status === Number(selectedStatus)) &&
    filterOrdersByTime(order.orderDate) &&
    filterOrdersBySearch(order)
  );

  return (
    <div className='myaccout-wrapper'>
      <div className="myaccount-main-body">
        <div className="myaccount-homepage">
          <div className="homepage-content">
            <div className="welcome-head">
              <Link onClick={() => window.location.reload()} className='linkkkkkkk'>
                <div className="arrow-icon">
                  <FaAngleLeft style={{ color: 'white' }} />
                </div>
              </Link>
              <h1>My Saved Addresses</h1>
            </div>
            <div className="drop-down-containers">
              <div className="left-side">
                <div className="drop-down">
                  <select value={selectedStatus} onChange={handleStatusChange}>
                    <option value="">All Delivery Status</option>
                    {deliveryStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="drop-down">
                  <select value={selectedOrderTime} onChange={handleOrderTimeChange}>
                    <option value="">Order Time: All</option>
                    <option value="6months">Last 6 Months</option>
                    <option value="1year">Last 1 Year</option>
                    <option value="2years">Last 2 Years</option>
                  </select>
                </div>
              </div>
              <div className="right-side">
                <form>
                  <div className="search-bar">
                    <div className="search-bar-icon">
                      <img src="/Images/search-01.png" alt="" />
                    </div>
                    <input
                      type="search"
                      placeholder="Search product name / order ID"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </form>
              </div>
            </div>

            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div key={order.id || Math.random()}>
                  <div className="main-container">
                    <div className="oredr-tracking-container">
                      <div className="tracking-titles">
                        <div className="order-id">
                          <h4><span>Order ID</span> {order.id}</h4>
                        </div>
                        <div className="oredr-placed">
                          <h4>
                            <span>Order Placed</span>{' '}
                            {order.orderDate
                              ? new Date(order.orderDate).toLocaleDateString('en-GB', {
                                weekday: 'long',
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                              : 'N/A'}
                          </h4>
                        </div>
                        <div className="total-amount">
                          {/* <h4><span>Total Amount</span> ₹{order.totalPrice?.toFixed(2) || 'N/A'}</h4> */}
                          <h4><span>Total Amount</span> ₹{order.product && (order.product.orderAmount || 'N/A')}</h4>
                        </div>
                      </div>
                    </div>
                    <div className="container-fluid">
                      <div className="row tracking-container-row">
                        {Array.isArray(order?.product?.items) && order.product.items.length > 0 ?
                          order.product.items.map((item, index) => (
                            <div className="col-lg-8 Align" key={item.productId || index}>
                              <div className="track-container-left-side">
                                <div className="oredr-image">
                                  <img src={item.productImage} alt={item.productName || 'Product'} />
                                </div>
                                <div className="order-details">
                                  <h5>
                                    {item.status === 0 && 'Processing'}
                                    {item.status === 1 || order.status === 2 ? (
                                      `Arriving on ${order.expectedDeliveryDate
                                        ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: 'short',
                                          year: 'numeric',
                                        })
                                        : 'N/A'
                                      }`
                                    ) : null}
                                    {item.status === 3 ? (
                                      `Delivered on ${order.deliveredDate
                                        ? new Date(order.deliveredDate).toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: 'short',
                                          year: 'numeric',
                                        })
                                        : 'N/A'
                                      }`
                                    ) : null}
                                    {item.status === 4 && (
                                      `Cancelled on ${item.cancel?.cancellationDate ?
                                        new Date(item.cancel.cancellationDate).toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: 'short',
                                          year: 'numeric',
                                        }) : 'Invalid Date'}`
                                    )}
                                  </h5>
                                  <p>{item.productName || 'Product Name Unavailable'}</p>
                                  <p>Quantity: {item.quantity || 1}</p>
                                  <p>Price: ₹{item.productPrice?.toFixed(2) || 'N/A'}</p>
                                </div>
                              </div>
                            </div>
                          ))
                          : Array.isArray(order?.cancelledOrders) && order.cancelledOrders.length > 0 ?
                            order.cancelledOrders.map((item, index) => (
                              <div className="col-lg-8 Align" key={item.productId || index}>
                                <div className="track-container-left-side">
                                  <div className="oredr-image">
                                    <img src={item.productImage} alt={item.productName || 'Product'} />
                                  </div>
                                  <div className="order-details">
                                    <h5> {item.cancel?.cancellationDate ? (
                                      `Cancelled on ${new Date(item.cancel.cancellationDate).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                      })}`
                                    ) : 'Cancelled'} </h5>
                                    <p>{item.productName || 'Product Name Unavailable'}</p>
                                    <p>Quantity: {item.quantity || 1}</p>
                                    <p>Price: ₹{item.productPrice?.toFixed(2) || 'N/A'}</p>
                                    {item.cancel && item.cancel.cancellationReason && (
                                      <p>
                                        {/* Reason: {item.cancel.cancellationReason} */}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                            : <div className="col-lg-8 Align">No items available</div>
                        }
                      </div> 
                    </div>

                    <div>
                      <Link to={`/order-inner-page/${order.id}`} className="goto-order-btn" ><div >View Order Details</div></Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', paddingTop: '5rem' }}>No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default MyAccountOrders;
