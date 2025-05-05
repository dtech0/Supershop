

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CSS/OrderList.css";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');

        if (!userId) {
          setError('User is not authenticated');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:4000/list/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cust_id: userId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();

        if (data.Success && data.orders) {
          setOrders(data.orders);
        } else {
          setError('No orders found');
        }
      } catch (err) {
        setError(err.message || 'Error fetching order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const viewOrderDetails = (orderId) => {
    navigate(`/tracking/${orderId}`);
  };

  return (
    <div className="order-list-container">
      <h2>Order List</h2>
      <ul className="order-list">
        {orders.map((order) => (
          <li key={order.order_id} className="order-item">
            <h3>Order No: {order.order_id}</h3>
            <p>Order Date: {new Date(order.Order_date).toLocaleDateString()}</p>
            <button onClick={() => viewOrderDetails(order.order_id)}>
              See Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;

