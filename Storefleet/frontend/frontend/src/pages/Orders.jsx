import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Orders.css'; // Import the external CSS

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/storefleet/order/',
      {
        method:'GET',
        credentials: 'include'
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch orders');
        }
        return res.json();
      })
      .then((data) => {
        setOrders(data.fetchedData || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="orders-loading">Loading orders...</p>;
  if (error) return <p className="orders-error">Error: {error}</p>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="orders-empty">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            {/* <div className="order-header">
              <h2>Order #{order._id}</h2>
              <span className={`order-status ${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span>
            </div> */}

            <div className="order-info">
              {/* <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Phone:</strong> {order.shippingInfo.phoneNumber}</p> */}
              <p><strong>Shipping To:</strong> {order.shippingInfo.address}, {order.shippingInfo.state}, {order.shippingInfo.country} - {order.shippingInfo.pincode}</p>
            </div>

            <h3>Items</h3>
            <div className="order-items">
              {order.orderedItems.map((item) => (
                <Link to={`/product/${item.product}`} key={item._id} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p className="item-name" style={{color:'#001572'}}>{item.name}</p>
                    <p className="item-details">${item.price} × {item.quantity}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="order-summary">
              <p><strong>Items Price:</strong> ${order.itemsPrice}</p>
              <p><strong>Tax:</strong> ${order.taxPrice}</p>
              <p><strong>Shipping:</strong> ${order.shippingPrice}</p>
              <p><strong>Total:</strong> ${order.totalPrice}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
