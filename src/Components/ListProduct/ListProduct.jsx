


// import React, { useState, useEffect } from 'react';
// import './ListProduct.css';

// const ListProduct = () => {
//   const [allProducts, setAllProducts] = useState([]);
//   const [editProductId, setEditProductId] = useState(null);
//   const [editValues, setEditValues] = useState({
//     product_quantity: '',
//     new_price: '',
//     old_price: '',
//   });

//   // Fetch products from the backend
//   const fetchInfo = async () => {
//     try {
//       const response = await fetch('http://localhost:4000/allproducts'); // API endpoint
//       const data = await response.json();
//       setAllProducts(data);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   useEffect(() => {
//     fetchInfo();
//   }, []);

//   // Remove product
//   const removeProduct = async (productId) => {
//     try {
//       const response = await fetch('http://localhost:4000/removeproduct', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ id: productId }),
//       });

//       if (response.ok) {
//         setAllProducts(allProducts.filter((product) => product.id !== productId));
//       } else {
//         console.error('Failed to remove product:', await response.text());
//       }
//     } catch (error) {
//       console.error('Error removing product:', error);
//     }
//   };

//   // Update product details
//   const updateProductDetails = async () => {
//     try {
//       const response = await fetch('http://localhost:4000/update-product-details', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ id: editProductId, ...editValues }),
//       });

//       if (response.ok) {
//         const updatedProduct = await response.json();
//         setAllProducts((prev) =>
//           prev.map((product) =>
//             product.id === editProductId
//               ? { ...product, ...editValues }
//               : product
//           )
//         );
//         setEditProductId(null);
//         setEditValues({ product_quantity: '', new_price: '', old_price: '' });
//       } else {
//         console.error('Failed to update product:', await response.text());
//       }
//     } catch (error) {
//       console.error('Error updating product:', error);
//     }
//   };

//   const handleEditClick = (product) => {
//     setEditProductId(product.id);
//     setEditValues({
//       product_quantity: product.product_quantity,
//       new_price: product.new_price,
//       old_price: product.old_price,
//     });
//   };

//   return (
//     <div className="list-product">
//       <h1>All Products List</h1>
//       <div className="listproduct-format-main">
//         <p>Products</p>
//         <p>Title</p>
//         <p>Old Price</p>
//         <p>New Price</p>
//         <p>Category</p>
//         <p>Quantity KG/L</p>
//         <p>Actions</p>
//       </div>
//       <div className="listproduct-allproducts">
//         {allProducts.map((product, index) => (
//           <div key={index} className="listproduct-format-main listproduct-format">
//             <div className="product-image-container">
//               <img
//                 src={product.image}
//                 alt="product"
//                 onError={(e) => { e.target.src = "/placeholder.jpg"; }}
//               />
//               <button
//                 className="remove-icon"
//                 onClick={() => removeProduct(product.id)}
//               >
//                 X
//               </button>
//             </div>
//             <p>{product.name}</p>
//             <p>{product.old_price}</p>
//             <p>{product.new_price}</p>
//             <p>{product.category}</p>
//             <p>{product.product_quantity}</p>
//             <div>
//               {editProductId === product.id ? (
//                 <div>
//                   <label>Quantity:</label>
//                   <input
//                     type="number"
//                     placeholder="Quantity"
//                     value={editValues.product_quantity}
//                     onChange={(e) =>
//                       setEditValues((prev) => ({
//                         ...prev,
//                         product_quantity: e.target.value,
//                       }))
//                     }
//                   />
//                   <label>Old Price:</label>
//                   <input
//                     type="number"
//                     placeholder="Old Price"
//                     value={editValues.old_price}
//                     onChange={(e) =>
//                       setEditValues((prev) => ({
//                         ...prev,
//                         old_price: e.target.value,
//                       }))
//                     }
//                   />
//                   <label>New Price:</label>
//                   <input
//                     type="number"
//                     placeholder="New Price"
//                     value={editValues.new_price}
//                     onChange={(e) =>
//                       setEditValues((prev) => ({
//                         ...prev,
//                         new_price: e.target.value,
//                       }))
//                     }
//                   />
//                   <button onClick={updateProductDetails}>Save</button>
//                   <button onClick={() => setEditProductId(null)}>Cancel</button>
//                 </div>
//               ) : (
//                 <button onClick={() => handleEditClick(product)}>Edit</button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ListProduct;




// import React, { useState, useEffect } from 'react';
// import './ListProduct.css';

// const ListProduct = () => {
//   const [allProducts, setAllProducts] = useState([]);
//   const [editProductId, setEditProductId] = useState(null);
//   const [editValues, setEditValues] = useState({
//     product_quantity: '',
//     new_price: '',
//     old_price: '',
//   });

//   // Fetch products from the backend
//   const fetchInfo = async () => {
//     try {
//       const response = await fetch('http://localhost:4000/allproducts'); // API endpoint
//       const data = await response.json();
      
//       // Sort products by product_quantity in ascending order
//       const sortedProducts = data.sort((a, b) => a.product_quantity - b.product_quantity);
      
//       setAllProducts(sortedProducts);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   useEffect(() => {
//     fetchInfo();
//   }, []);

//   // Remove product
//   const removeProduct = async (productId) => {
//     try {
//       const response = await fetch('http://localhost:4000/removeproduct', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ id: productId }),
//       });

//       if (response.ok) {
//         setAllProducts(allProducts.filter((product) => product.id !== productId));
//       } else {
//         console.error('Failed to remove product:', await response.text());
//       }
//     } catch (error) {
//       console.error('Error removing product:', error);
//     }
//   };

//   // Update product details
//   const updateProductDetails = async () => {
//     try {
//       const response = await fetch('http://localhost:4000/update-product-details', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ id: editProductId, ...editValues }),
//       });

//       if (response.ok) {
//         const updatedProduct = await response.json();
//         setAllProducts((prev) =>
//           prev.map((product) =>
//             product.id === editProductId
//               ? { ...product, ...editValues }
//               : product
//           )
//         );
//         setEditProductId(null);
//         setEditValues({ product_quantity: '', new_price: '', old_price: '' });
//       } else {
//         console.error('Failed to update product:', await response.text());
//       }
//     } catch (error) {
//       console.error('Error updating product:', error);
//     }
//   };

//   const handleEditClick = (product) => {
//     setEditProductId(product.id);
//     setEditValues({
//       product_quantity: product.product_quantity,
//       new_price: product.new_price,
//       old_price: product.old_price,
//     });
//   };

//   return (
//     <div className="list-product">
//       <h1>All Products List</h1>
//       <div className="listproduct-format-main">
//         <p>Products</p>
//         <p>Title</p>
//         <p>Old Price</p>
//         <p>New Price</p>
//         <p>Category</p>
//         <p>Quantity KG/L</p>
//         <p>Actions</p>
//       </div>
//       <div className="listproduct-allproducts">
//         {allProducts.map((product, index) => (
//           <div key={index} className="listproduct-format-main listproduct-format">
//             <div className="product-image-container">
//               <img
//                 src={product.image}
//                 alt="product"
//                 onError={(e) => { e.target.src = "/placeholder.jpg"; }}
//               />
//               <button
//                 className="remove-icon"
//                 onClick={() => removeProduct(product.id)}
//               >
//                 X
//               </button>
//             </div>
//             <p>{product.name}</p>
//             <p>{product.old_price}</p>
//             <p>{product.new_price}</p>
//             <p>{product.category}</p>
//             <p>{product.product_quantity}</p>
//             <div>
//               {editProductId === product.id ? (
//                 <div>
//                   <label>Quantity:</label>
//                   <input
//                     type="number"
//                     placeholder="Quantity"
//                     value={editValues.product_quantity}
//                     onChange={(e) =>
//                       setEditValues((prev) => ({
//                         ...prev,
//                         product_quantity: e.target.value,
//                       }))
//                     }
//                   />
//                   <label>Old Price:</label>
//                   <input
//                     type="number"
//                     placeholder="Old Price"
//                     value={editValues.old_price}
//                     onChange={(e) =>
//                       setEditValues((prev) => ({
//                         ...prev,
//                         old_price: e.target.value,
//                       }))
//                     }
//                   />
//                   <label>New Price:</label>
//                   <input
//                     type="number"
//                     placeholder="New Price"
//                     value={editValues.new_price}
//                     onChange={(e) =>
//                       setEditValues((prev) => ({
//                         ...prev,
//                         new_price: e.target.value,
//                       }))
//                     }
//                   />
//                   <button onClick={updateProductDetails}>Save</button>
//                   <button onClick={() => setEditProductId(null)}>Cancel</button>
//                 </div>
//               ) : (
//                 <button onClick={() => handleEditClick(product)}>Edit</button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ListProduct;




// import React, { useState, useEffect } from 'react';
// import './ListProduct.css';

// const ListProduct = () => {
//   const [allProducts, setAllProducts] = useState([]);
//   const [editProductId, setEditProductId] = useState(null);
//   const [editValues, setEditValues] = useState({
//     product_quantity: '',
//     new_price: '',
//     old_price: '',
//   });

//   // Fetch products from the backend
//   const fetchInfo = async () => {
//     try {
//       const response = await fetch('http://localhost:4000/allproducts'); // API endpoint
//       const data = await response.json();
      
//       // Sort products by product_quantity in ascending order
//       const sortedProducts = data.sort((a, b) => a.product_quantity - b.product_quantity);
      
//       setAllProducts(sortedProducts);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   useEffect(() => {
//     fetchInfo();
//   }, []);

//   // Remove product
//   const removeProduct = async (productId) => {
//     try {
//       const response = await fetch('http://localhost:4000/removeproduct', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ id: productId }),
//       });

//       if (response.ok) {
//         setAllProducts(allProducts.filter((product) => product.id !== productId));
//       } else {
//         console.error('Failed to remove product:', await response.text());
//       }
//     } catch (error) {
//       console.error('Error removing product:', error);
//     }
//   };

//   // Update product details
//   const updateProductDetails = async () => {
//     try {
//       const response = await fetch('http://localhost:4000/update-product-details', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ id: editProductId, ...editValues }),
//       });

//       if (response.ok) {
//         const updatedProduct = await response.json();
//         setAllProducts((prev) =>
//           prev.map((product) =>
//             product.id === editProductId
//               ? { ...product, ...editValues }
//               : product
//           )
//         );
//         setEditProductId(null);
//         setEditValues({ product_quantity: '', new_price: '', old_price: '' });
//       } else {
//         console.error('Failed to update product:', await response.text());
//       }
//     } catch (error) {
//       console.error('Error updating product:', error);
//     }
//   };

//   const handleEditClick = (product) => {
//     setEditProductId(product.id);
//     setEditValues({
//       product_quantity: product.product_quantity,
//       new_price: product.new_price,
//       old_price: product.old_price,
//     });
//   };

//   return (
//     <div className="list-product">
//       <h1>All Products List</h1>
//       <div className="listproduct-format-main">
//         <p>Products</p>
//         <p>Title</p>
//         <p>Old Price</p>
//         <p>New Price</p>
//         <p>Category</p>
//         <p>Quantity KG/L</p>
//         <p>Actions</p>
//       </div>
//       <div className="listproduct-allproducts">
//         {allProducts.map((product, index) => (
//           <div
//             key={index}
//             className={`listproduct-format-main listproduct-format ${product.product_quantity <= 100 ? 'red-alert' : ''}`}
//           >
//             <div className="product-image-container">
//               <img
//                 src={product.image}
//                 alt="product"
//                 onError={(e) => { e.target.src = "/placeholder.jpg"; }}
//               />
//               <button
//                 className="remove-icon"
//                 onClick={() => removeProduct(product.id)}
//               >
//                 X
//               </button>
//             </div>
//             <p>{product.name}</p>
//             <p>{product.old_price}</p>
//             <p>{product.new_price}</p>
//             <p>{product.category}</p>
//             <p>{product.product_quantity}</p>
//             <div>
//               {editProductId === product.id ? (
//                 <div>
//                   <label>Quantity:</label>
//                   <input
//                     type="number"
//                     placeholder="Quantity"
//                     value={editValues.product_quantity}
//                     onChange={(e) =>
//                       setEditValues((prev) => ({
//                         ...prev,
//                         product_quantity: e.target.value,
//                       }))
//                     }
//                   />
//                   <label>Old Price:</label>
//                   <input
//                     type="number"
//                     placeholder="Old Price"
//                     value={editValues.old_price}
//                     onChange={(e) =>
//                       setEditValues((prev) => ({
//                         ...prev,
//                         old_price: e.target.value,
//                       }))
//                     }
//                   />
//                   <label>New Price:</label>
//                   <input
//                     type="number"
//                     placeholder="New Price"
//                     value={editValues.new_price}
//                     onChange={(e) =>
//                       setEditValues((prev) => ({
//                         ...prev,
//                         new_price: e.target.value,
//                       }))
//                     }
//                   />
//                   <button onClick={updateProductDetails}>Save</button>
//                   <button onClick={() => setEditProductId(null)}>Cancel</button>
//                 </div>
//               ) : (
//                 <button onClick={() => handleEditClick(product)}>Edit</button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ListProduct;


import React, { useState, useEffect } from 'react';
import './ListProduct.css';

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [editValues, setEditValues] = useState({
    product_quantity: '',
    new_price: '',
    old_price: '',
  });

  // Fetch products from the backend
  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/allproducts'); // API endpoint
      const data = await response.json();
      
      // Sort products by product_quantity in ascending order
      const sortedProducts = data.sort((a, b) => a.product_quantity - b.product_quantity);
      
      setAllProducts(sortedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // Remove product
  const removeProduct = async (productId) => {
    try {
      const response = await fetch('http://localhost:4000/removeproduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId }),
      });

      if (response.ok) {
        setAllProducts(allProducts.filter((product) => product.id !== productId));
      } else {
        console.error('Failed to remove product:', await response.text());
      }
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  // Update product details
  const updateProductDetails = async () => {
    // Get the current product and update its quantity optimistically
    const updatedQuantity = Number(editValues.product_quantity) + 
                            Number(allProducts.find(product => product.id === editProductId).product_quantity);

    // Optimistically update the product in the UI immediately
    setAllProducts((prev) =>
      prev.map((product) =>
        product.id === editProductId
          ? { ...product, product_quantity: updatedQuantity, ...editValues }
          : product
      )
    );

    try {
      const response = await fetch('http://localhost:4000/update-product-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editProductId,
          product_quantity: updatedQuantity,
          new_price: editValues.new_price,
          old_price: editValues.old_price,
        }),
      });

      if (!response.ok) {
        // Revert the update if the backend fails
        console.error('Failed to update product:', await response.text());
        setAllProducts((prev) =>
          prev.map((product) =>
            product.id === editProductId
              ? { ...product, product_quantity: product.product_quantity } // revert back to original quantity
              : product
          )
        );
      }

      setEditProductId(null);
      setEditValues({ product_quantity: '', new_price: '', old_price: '' });
    } catch (error) {
      // Handle error and revert
      console.error('Error updating product:', error);
      setAllProducts((prev) =>
        prev.map((product) =>
          product.id === editProductId
            ? { ...product, product_quantity: product.product_quantity } // revert back to original quantity
            : product
        )
      );
    }
  };

  const handleEditClick = (product) => {
    setEditProductId(product.id);
    setEditValues({
      product_quantity: product.product_quantity,
      new_price: product.new_price,
      old_price: product.old_price,
    });
  };

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Quantity KG/L</p>
        <p>Actions</p>
      </div>
      <div className="listproduct-allproducts">
        {allProducts.map((product, index) => (
          <div
            key={index}
            className={`listproduct-format-main listproduct-format ${product.product_quantity <= 100 ? 'red-alert' : ''}`}
          >
            <div className="product-image-container">
              <img
                src={product.image}
                alt="product"
                onError={(e) => { e.target.src = "/placeholder.jpg"; }}
              />
              <button
                className="remove-icon"
                onClick={() => removeProduct(product.id)}
              >
                X
              </button>
            </div>
            <p>{product.name}</p>
            <p>{product.old_price}</p>
            <p>{product.new_price}</p>
            <p>{product.category}</p>
            <p>{product.product_quantity}</p>
            <div>
              {editProductId === product.id ? (
                <div>
                  <label>Quantity:</label>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={editValues.product_quantity}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        product_quantity: e.target.value,
                      }))
                    }
                  />
                  <label>Old Price:</label>
                  <input
                    type="number"
                    placeholder="Old Price"
                    value={editValues.old_price}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        old_price: e.target.value,
                      }))
                    }
                  />
                  <label>New Price:</label>
                  <input
                    type="number"
                    placeholder="New Price"
                    value={editValues.new_price}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        new_price: e.target.value,
                      }))
                    }
                  />
                  <button onClick={updateProductDetails}>Save</button>
                  <button onClick={() => setEditProductId(null)}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => handleEditClick(product)}>Edit</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
