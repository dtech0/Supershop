





// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import "./CSS/TrackingPage.module.css";

// const TrackingPage = () => {
//   const { orderId } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         setLoading(true);
//         const userId = localStorage.getItem('userId');

//         if (!userId) {
//           setError('User is not authenticated');
//           setLoading(false);
//           return;
//         }

//         // Call the updated API endpoint for tracking details by order
//         const response = await fetch('http://localhost:4000/tracking/details-by-order', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ order_id: orderId }),
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch order details');
//         }

//         const data = await response.json();

//         if (data) {
//           setOrder(data); // Store the order details in the state
//         } else {
//           setError('Order not found');
//         }
//       } catch (err) {
//         setError(err.message || 'Error fetching order details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [orderId]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div>
//       <h1>Order Details</h1>
//       <div>
//         <h3>Order No: {order.order_id}</h3>
//         <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
//         <p>Amount: ${order.payment_amount}</p>
//         <p>Payment Method: {order.payment_method}</p>
//         <p>Status: {order.combined_status || 'Not available'}</p>
//         <p>Delivery Date: {order.delivery_date || 'Not available'}</p>

//         <h4>Products</h4>
//         <ul>
//           {order.product_names.split(',').map((productId, index) => (
//             <li key={productId}>
//               <p> {productId}</p>
//               <img
//                 src={order.product_images.split(',')[index]} 
//                 alt={`Product ${productId}`}
//                 style={{ width: '100px', height: '100px' }}
//               />
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default TrackingPage;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./CSS/TrackingPage.css";

const TrackingPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');

        if (!userId) {
          setError('User is not authenticated');
          setLoading(false);
          return;
        }

        // Call the updated API endpoint for tracking details by order
        const response = await fetch('http://localhost:4000/tracking/details-by-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order_id: orderId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();

        if (data) {
          setOrder(data); // Store the order details in the state
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError(err.message || 'Error fetching order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="tracking-page-container">
      <h1>Order Details</h1>
      <div className="order-details">
        <h3>Order No: {order.order_id}</h3>
        <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
        <p>Amount: ${order.payment_amount}</p>
        <p>Payment Method: {order.payment_method}</p>
        <p>Status: {order.combined_status || 'Not available'}</p>
        <p>Delivery Date: {order.delivery_date || 'Not available'}</p>

        <h4>Products</h4>
        <ul>
          {order.product_names.split(',').map((productId, index) => (
            <li key={productId}>
              <p className="product-name">{productId}</p>
              <img
                src={order.product_images.split(',')[index]} 
                alt={`Product ${productId}`}
                className="product-img"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrackingPage;
