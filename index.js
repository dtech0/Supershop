
// Required dependencies
const port = 4000;
const express = require("express");
const app = express();
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require("express-session");

app.use(express.json());
app.use(cors());
// Session and passport setup for Google OAuth
app.use(session({
  secret: 'Hakimi@#1221',
  resave: true,
  saveUninitialized: true
}));


// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: "root",
  password: "122165",
  database: "online_super_shop"
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Serve images
app.use("/images", express.static(path.join(__dirname, "upload/images")));




// Add product API
app.post("/addproduct", upload.single("image"), (req, res) => {
  const { name, old_price, new_price, production_date, expire_date, product_quantity, category } = req.body;
  const image = req.file ? `/images/${req.file.filename}` : null;

  const query = `INSERT INTO product (name, old_price, new_price, product_quantity, production_date, Expire_date, category, image) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    query,
    [name, old_price, new_price, product_quantity, production_date, expire_date, category, image],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Success: false, error: "Database error." });
      }
      res.json({ Success: true, message: "Product added successfully." });
    }
  );
});




// Remove product API
app.post("/removeproduct", (req, res) => {
  const { id } = req.body;

  const query = `DELETE FROM product WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Success: false, error: "Database error." });
    }
    res.json({ Success: true, message: "Product removed successfully." });
  });
});




// Get all products API
app.get("/allproducts", (req, res) => {
  const query = `SELECT * FROM product`;
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Success: false, error: "Database error." });
    }
    const productsWithImages = results.map(product => ({
      ...product,
      image: product.image ? `http://localhost:4000${product.image}` : null
    }));
    res.json(productsWithImages);
  });
});




// API to update product quantity and prices
app.post("/update-product-details", (req, res) => {
  const { id, product_quantity, new_price, old_price } = req.body;

  // Validate input
  if (!id || product_quantity === undefined || product_quantity < 0 || new_price === undefined || old_price === undefined) {
    return res.status(400).send({ error: "Invalid input: id, valid product_quantity, new_price, and old_price are required." });
  }

  // Update the product details in the database
  const query = "UPDATE product SET product_quantity = ?, new_price = ?, old_price = ? WHERE id = ?";
  db.query(query, [product_quantity, new_price, old_price, id], (err, result) => {
    if (err) {
      console.error("Error updating product details:", err.message);
      return res.status(500).send({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: "Product not found" });
    }

    res.send({
      message: "Product details updated successfully.",
      productId: id,
      product_quantity,
      new_price,
      old_price,
    });
  });
});







app.get('/newitems', async (req, res) => {
  const query = `
    SELECT * 
    FROM product
    ORDER BY id ASC
    LIMIT 8 OFFSET 1
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: "Database error." });
    }

    // Ensure full image path
    const productsWithImages = results.map(product => ({
      ...product,
      image: product.image ? `http://localhost:4000${product.image}` : null // Add full URL for image
    }));

    console.log("NewCollection Fetched with images:", productsWithImages);
    res.status(200).json({ success: true, data: productsWithImages });
  });
});







app.post("/get-cart", (req, res) => {
  const { cart_id } = req.body;  // Accept cart_id from request body

  const getCartItemsQuery = `
    SELECT cp.product_id, cp.quantity, p.name, p.new_price as price, p.image
    FROM cart_product cp
    JOIN product p ON cp.product_id = p.id
    WHERE cp.cart_id = ?;
  `;
  db.query(getCartItemsQuery, [cart_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Success: false, error: "Database error." });
    }

    const cartItems = results.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      name: item.name,
      price: item.price,
      image: item.image ? `http://localhost:4000${item.image}` : null
    }));

    res.json({ Success: true, products: cartItems }); // Send the cart items back in response
  });
});






app.post("/add-to-cart", async (req, res) => {
  const { cart_id, products } = req.body;

  try {
    // Loop through products and insert them into the cart
    for (let product of products) {
      const { product_id, quantity } = product;

      const addToCartQuery = `
        INSERT INTO cart_product (cart_id, product_id, quantity) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
      `;
      
      // Use promise to wait for query execution
      await new Promise((resolve, reject) => {
        db.query(addToCartQuery, [cart_id, product_id, quantity], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    }

    // After adding products to the cart, fetch the updated cart items
    const getUpdatedCartQuery = `
      SELECT cp.product_id, cp.quantity, p.name, p.new_price AS price, p.image
      FROM cart_product cp
      JOIN product p ON cp.product_id = p.id
      WHERE cp.cart_id = ?;
    `;

    // Query to get the updated cart items
    db.query(getUpdatedCartQuery, [cart_id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Success: false, error: "Database error while fetching updated cart." });
      }

      // Map the results to a cartItems format
      const cartItems = results.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        image: item.image ? `http://localhost:4000${item.image}` : null
      }));

      // Send the updated cart items back in the response
      res.json({ Success: true, products: cartItems });
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ Success: false, error: "Database error." });
  }
});





app.post("/remove-from-cart", (req, res) => {
  const { cart_id, product_id } = req.body;

  const query = "DELETE FROM cart_product WHERE cart_id = ? AND product_id = ?";
  db.query(query, [cart_id, product_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Success: false, error: "Database error." });
    }

    // After removing, fetch the updated cart items
    const getUpdatedCartQuery = `
      SELECT cp.product_id, cp.quantity, p.name, p.new_price AS price, p.image
      FROM cart_product cp
      JOIN product p ON cp.product_id = p.id
      WHERE cp.cart_id = ?;
    `;

    // Query to get the updated cart items
    db.query(getUpdatedCartQuery, [cart_id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Success: false, error: "Database error while fetching updated cart." });
      }

      // Map the results to cartItems format
      const cartItems = results.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        image: item.image ? `http://localhost:4000${item.image}` : null
      }));

      // Send the updated cart items back in the response
      res.json({ Success: true, products: cartItems });
    });
  });
});



//get the seasonal food
app.get('/products-by-category', (req, res) => {
  const category = 'seasonal'; // Set the desired category to 'seasonal'
  
  const query = `
    SELECT * 
    FROM product
    WHERE category = ?
  `;
  
  db.query(query, [category], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: "Database error." });
    }
    
    // Map through the results to add the full image URL
    const productsWithImages = results.map(product => ({
      ...product,
      image: product.image ? `http://localhost:4000${product.image}` : null
    }));
    
    res.status(200).json({ success: true, data: productsWithImages });
  });
});




app.post("/update-cart-quantity", (req, res) => {
  const { cart_id, product_id, quantity } = req.body;

  // Prevent setting quantity to less than 1
  if (quantity < 1) {
    return res.status(400).json({ Success: false, error: "Quantity cannot be less than 1." });
  }

  const query = "UPDATE cart_product SET quantity = ? WHERE cart_id = ? AND product_id = ?";
  db.query(query, [quantity, cart_id, product_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Success: false, error: "Database error." });
    }

    // Fetch updated cart items after updating the quantity
    const getUpdatedCartQuery = `
      SELECT cp.product_id, cp.quantity, p.name, p.new_price AS price, p.image
      FROM cart_product cp
      JOIN product p ON cp.product_id = p.id
      WHERE cp.cart_id = ?;
    `;

    db.query(getUpdatedCartQuery, [cart_id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Success: false, error: "Error fetching updated cart." });
      }

      const cartItems = results.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        image: item.image ? `http://localhost:4000${item.image}` : null
      }));

      res.json({ Success: true, products: cartItems });
    });
  });
});








//user place order

app.post('/place-order', (req, res) => {
  let { Order_date, Order_amount, Cust_id, products } = req.body;

  // If Order_date is not provided, set it to the current date
  Order_date = Order_date || new Date().toISOString().split('T')[0];

  // Input validation
  if (!Order_amount || !Cust_id || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({
      error: 'Order_amount, Cust_id, and products are required, and products should be an array.',
    });
  }

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({
        error: 'There was an error processing your order.',
      });
    }

    // Insert order into place_order table
    const orderQuery = 'INSERT INTO place_order (Order_date, Order_amount, Cust_id) VALUES (?, ?, ?)';
    db.query(orderQuery, [Order_date, Order_amount, Cust_id], (err, orderResult) => {
      if (err) {
        console.error('Error creating order:', err);
        return db.rollback(() => {
          res.status(500).json({
            error: 'There was an error creating the order.',
          });
        });
      }

      const orderId = orderResult.insertId;

      // Insert products into order_product table
      const orderProductQuery = 'INSERT INTO order_product (order_id, product_id, quantity) VALUES ?';
      const orderProductData = products.map((product) => [
        orderId,
        product.product_id,
        product.quantity,
      ]);

      db.query(orderProductQuery, [orderProductData], (err, orderProductResult) => {
        if (err) {
          console.error('Error inserting products into order:', err);
          return db.rollback(() => {
            res.status(500).json({
              error: 'There was an error inserting products into the order.',
            });
          });
        }

        // Decrease product quantities in the product table
        const updateProductQuery = `
          UPDATE product
          SET product_quantity = product_quantity - ?
          WHERE id = ? AND product_quantity >= ?`;

        const productUpdates = products.map((product) => {
          return new Promise((resolve, reject) => {
            db.query(updateProductQuery, [product.quantity, product.product_id, product.quantity], (err, result) => {
              if (err) return reject(err);
              if (result.affectedRows === 0) return reject(new Error('Insufficient product quantity.'));
              resolve();
            });
          });
        });

        Promise.all(productUpdates)
          .then(() => {
            // Remove the ordered items from the cart
            const productIds = products.map((product) => product.product_id);
           const removeFromCartQuery = 'DELETE FROM cart_product WHERE Cart_id = ? AND product_id IN (?)';

            db.query(removeFromCartQuery, [Cust_id, productIds], (err, cartRemoveResult) => {
              if (err) {
                console.error('Error removing items from cart:', err);
                return db.rollback(() => {
                  res.status(500).json({
                    error: 'There was an error removing items from the cart.',
                  });
                });
              }

              // Commit the transaction
              db.commit((err) => {
                if (err) {
                  console.error('Error committing transaction:', err);
                  return db.rollback(() => {
                    res.status(500).json({
                      error: 'There was an error finalizing the order.',
                    });
                  });
                }

                res.status(201).json({
                  message: 'Order placed successfully, items removed from cart, and product quantities updated.',
                  order_id: orderId,
                });
              });
            });
          })
          .catch((err) => {
            console.error('Error updating product quantities:', err);
            db.rollback(() => {
              res.status(500).json({
                error: 'There was an error updating product quantities. Please check product availability.',
              });
            });
          });
      });
    });
  });
});










//getting user order list of orders
app.post('/list/orders', (req, res) => {
  const { cust_id } = req.body; // Get cust_id from the request body

  if (!cust_id) {
    return res.status(400).json({ Success: false, error: 'Customer ID (cust_id) is required.' });
  }

  // SQL query to fetch orders and related details
  const query = 
   `SELECT DISTINCT
  place_order.order_id,
  place_order.Order_date,
  place_order.order_amount AS payment_amount,
  ANY_VALUE(payment.payment_method) AS payment_method, 
  GROUP_CONCAT(DISTINCT tracking_details.order_status) AS order_status,
  GROUP_CONCAT(DISTINCT tracking_details.delivery_date) AS delivery_dates
FROM
  place_order
LEFT JOIN
  payment ON place_order.order_id = payment.order_id
LEFT JOIN
  tracking_details ON place_order.order_id = tracking_details.order_id
WHERE
  place_order.Cust_id = ?
GROUP BY
  place_order.order_id
ORDER BY
  place_order.Order_date DESC
LIMIT 0, 1000`;

  db.query(query, [cust_id], (err, rows) => {
    if (err) {
      console.error('Error fetching order details:', err);
      return res.status(500).json({ Success: false, error: 'Failed to fetch order details.', details: err.message });
    }

    if (rows.length === 0) {
      return res.status(404).json({ Success: false, message: 'No orders found for this customer.' });
    }

    res.status(200).json({
      Success: true,
      message: 'Order details retrieved successfully.',
      orders: rows,
    });
  });
});




// User tracking details by order ID

app.post('/tracking/details-by-order', (req, res) => {
  const { order_id } = req.body;

  if (!order_id) {
      return res.status(400).json({ error: "Missing 'order_id' in request body" });
  }

  const query = `
      SELECT 
          td.order_id,
          GROUP_CONCAT(DISTINCT td.order_status) AS combined_status,
          td.delivery_date,
          GROUP_CONCAT(DISTINCT p.name) AS product_names,
          GROUP_CONCAT(DISTINCT p.image) AS product_images,
          py.payment_amount,
          py.payment_method,
         po.order_date
      FROM 
          tracking_details td
      JOIN 
          order_product op ON td.order_id = op.order_id
      JOIN 
          place_order po on td.order_id=po.order_id
      JOIN 
          product p ON op.product_id = p.id
      JOIN 
          payment py ON td.order_id = py.order_id
      WHERE 
          td.order_id = ?
      GROUP BY 
          td.order_id, td.delivery_date, py.payment_amount, py.payment_method;
  `;

  db.query(query, [order_id], (err, results) => {
      if (err) {
          console.error('Error executing query:', err.stack);
          return res.status(500).json({ error: 'Database query failed' });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'Order not found' });
      }

      // Append the base URL to the image paths in the result
      const updatedResult = results[0];
      updatedResult.product_images = updatedResult.product_images.split(',').map(image => {
        return image ? `http://localhost:4000${image}` : null;
      }).join(',');

      res.json(updatedResult); // Send the updated result with full image URLs as JSON
  });
});









//user address
app.post('/save-address', (req, res) => {
  const { Cust_id, fullName, addressLine1, addressLine2, city, state, zipCode, phone } = req.body;

  if (!Cust_id || !fullName || !addressLine1 || !city || !state || !zipCode || !phone) {
    return res.status(400).json({ error: 'All required fields must be provided.' });
  }

  // Concatenate all address-related fields into a single string
  const fullAddress = `${fullName}, ${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}, ${city}, ${state} - ${zipCode}, Phone: ${phone}`;

  const sql = `
    UPDATE customer
    SET address = ?
    WHERE Cust_id = ?`;

  db.query(sql, [fullAddress, Cust_id], (err, result) => {
    if (err) {
      console.error('Error updating address:', err);
      return res.status(500).json({ error: 'Failed to save the address.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    res.status(200).json({ message: 'Address saved successfully.' });
  });
});






// API to get and update address
app.post('/address', (req, res) => {
  const { Cust_id, fullName, addressLine1, addressLine2, city, state, zipCode, phone } = req.body;

  // If Cust_id is provided but other address fields are missing, it's a GET request.
  if (Cust_id && !fullName && !addressLine1 && !addressLine2 && !city && !state && !zipCode && !phone) {
    // Fetch the address from the database
    const sql = 'SELECT address FROM customer WHERE Cust_id = ?';
    db.query(sql, [Cust_id], (err, result) => {
      if (err) {
        console.error('Error fetching address:', err);
        return res.status(500).json({ error: 'Failed to fetch the address.' });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: 'Customer not found.' });
      }

      // Send the address back to the client
      res.status(200).json({ address: result[0].address });
    });
  } else {
    // Update the address if all required fields are provided
    if (!fullName || !addressLine1 || !city || !state || !zipCode || !phone) {
      return res.status(400).json({ error: 'All required fields must be provided to update the address.' });
    }

    // Concatenate address fields
    const fullAddress = `${fullName}, ${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}, ${city}, ${state} - ${zipCode}, Phone: ${phone}`;

    const sql = `
      UPDATE customer
      SET address = ?
      WHERE Cust_id = ?`;

    db.query(sql, [fullAddress, Cust_id], (err, result) => {
      if (err) {
        console.error('Error updating address:', err);
        return res.status(500).json({ error: 'Failed to save the address.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Customer not found.' });
      }

      res.status(200).json({ message: 'Address saved successfully.' });
    });
  }
});






//user create payment
app.post('/create-payment', (req, res) => {
  const { order_id, payment_method, cust_id } = req.body;

  // Validate input
  if (!order_id || !payment_method || !cust_id) {
    return res.status(400).json({
      error: 'order_id, payment_method, and cust_id are required.',
    });
  }

  // Check if customer exists
  const checkCustomerQuery = 'SELECT Cust_id FROM customer WHERE Cust_id = ?';
  db.query(checkCustomerQuery, [cust_id], (err, results) => {
    if (err) {
      console.error('Error checking customer ID:', err);
      return res.status(500).json({ error: 'Error checking customer ID.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    // Fetch order amount
    const getOrderAmountQuery =
      'SELECT Order_amount FROM place_order WHERE order_id = ? AND Cust_id = ?';
    db.query(getOrderAmountQuery, [order_id, cust_id], (err, results) => {
      if (err) {
        console.error('Error fetching order amount:', err);
        return res.status(500).json({ error: 'Error fetching order amount.' });
      }

      if (results.length === 0) {
        return res.status(404).json({
          error: 'Order not found for the given order_id and cust_id.',
        });
      }

      const orderAmount = results[0].Order_amount;

      // Insert payment record
      const createPaymentQuery = `
        INSERT INTO payment (payment_date, payment_amount, payment_method, cust_id, order_id)
        VALUES (CURRENT_TIMESTAMP, ?, ?, ?, ?)
      `;
      db.query(
        createPaymentQuery,
        [orderAmount, payment_method, cust_id, order_id],
        (err, paymentResult) => {
          if (err) {
            console.error('Error inserting payment record:', err);
            return res.status(500).json({ error: 'Error creating payment.' });
          }

          // Insert into tracking_details table
          const insertTrackingDetailsQuery = `
            INSERT INTO tracking_details (order_id, order_status, delivery_date)
            VALUES (?, 'Ongoing', NULL)
          `;
          db.query(insertTrackingDetailsQuery, [order_id], (err) => {
            if (err) {
              console.error('Error inserting tracking details:', err);
              return res
                .status(500)
                .json({ error: 'Error creating tracking details.' });
            }

            // Respond with success (No deletion step here)
            res.status(201).json({
              message:
                'Payment created successfully and tracking details created.',
              payment_id: paymentResult.insertId,
              payment_amount: orderAmount,
            });
          });
        }
      );
    });
  });
});




// Fetch all orders in admin with tracking details
app.get("/admin/orders", (req, res) => {
  const query = `
    SELECT 
      o.Order_id AS order_id,
      c.Cust_name AS cust_name,
      p.payment_method,
      o.Order_amount AS payment_amount,
      COALESCE(td.order_status, '') AS order_status,
      o.Order_date,
      p.payment_date,
      td.delivery_date
    FROM place_order o
    JOIN customer c ON o.Cust_id = c.Cust_id
    LEFT JOIN payment p ON o.Order_id = p.order_id
    LEFT JOIN tracking_details td ON o.Order_id = td.order_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ success: false, error: "Database error." });
    }
    res.json({ success: true, data: results });
  });A
});



// // Fetch all orders in admin with tracking details
// app.get("/admin/orders", (req, res) => {
//   const query = `
//     SELECT 
//       o.Order_id AS order_id,
//       c.Cust_name AS cust_name,
//       p.payment_method,
//       o.Order_amount AS payment_amount,
//       td.order_status,
//       o.Order_date,
//       p.payment_date,
//       td.delivery_date
//     FROM place_order o
//     JOIN customer c ON o.Cust_id = c.Cust_id
//     LEFT JOIN payment p ON o.Order_id = p.order_id
//     LEFT JOIN tracking_details td ON o.Order_id = td.order_id
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error fetching orders:", err);
//       return res.status(500).json({ success: false, error: "Database error." });
//     }
//     res.json({ success: true, data: results });
//   });
// });






app.post("/admin/tracking/update", (req, res) => {
  const { order_id, order_status, delivery_date } = req.body;

  if (!order_id) {
    return res.status(400).json({ success: false, error: "Order ID is required." });
  }

  // Build the dynamic update query
  let updates = [];
  if (order_status) updates.push(`order_status = '${order_status}'`);
  if (delivery_date) updates.push(`delivery_date = '${delivery_date}'`);

  if (updates.length === 0) {
    return res.status(400).json({ success: false, error: "No fields to update." });
  }

  const query = `
    UPDATE tracking_details
    SET ${updates.join(", ")}
    WHERE order_id = ?
  `;

  db.query(query, [order_id], (err, results) => {
    if (err) {
      console.error("Error updating tracking details:", err);
      return res.status(500).json({ success: false, error: "Database error." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Order not found." });
    }

    res.json({ success: true, message: "Tracking details updated successfully." });
  });
});







app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM customer WHERE email = ?`;

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Success: false, error: "Database error." });
    }

    if (results.length === 0) {
      return res.status(400).json({ Success: false, error: "Invalid email." });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(400).json({ Success: false, error: "Invalid password." });
    }

    // Check if the user already has a cart
    const getCartQuery = "SELECT Cart_id FROM cart WHERE Cust_id = ?";
    db.query(getCartQuery, [user.Cust_id], (err, cartResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Success: false, error: "Database error." });
      }

      if (cartResults.length > 0) {
        // If the user already has a cart, return its ID
        return res.status(200).json({
          Success: true,
          userId: user.Cust_id,
          cartId: cartResults[0].Cart_id,
          token: "some-jwt-token", // Placeholder for a real JWT token
        });
      } else {
        // If the user doesn't have a cart, create one
        const createCartQuery = "INSERT INTO cart (Cust_id) VALUES (?)";
        db.query(createCartQuery, [user.Cust_id], (err, createResult) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ Success: false, error: "Database error." });
          }

          // Return the response with the new cart ID
          return res.status(200).json({
            Success: true,
            userId: user.Cust_id,
            cartId: createResult.insertId,
            token: "some-jwt-token", // Placeholder for a real JWT token
          });
        });
      }
    });
  });
});








// Submit a review
app.post('/user/reviews', (req, res) => {
  const { comment, cust_id, productId } = req.body;

  if (!comment || !cust_id || !productId) {
    return res.status(400).json({ Success: false, error: 'Comment, Customer ID (cust_id), and Product ID (productId) are required.' });
  }

  const insertQuery = `
    INSERT INTO review (Product_id, cust_id, Comment)
    VALUES (?, ?, ?);
  `;
  
  db.query(insertQuery, [productId, cust_id, comment], (err, result) => {
    if (err) {
      console.error("Error submitting review:", err);
      return res.status(500).json({ Success: false, error: 'Error submitting review' });
    }

    res.json({ Success: true, message: 'Review submitted successfully' });
  });
});





app.post('/get/user/reviews', (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ Success: false, error: 'Product ID is required.' });
  }

  // Updated query with JOIN to fetch user names
  const query = `
    SELECT r.comment, r.review_date, c.cust_name AS user_name
    FROM review r
    JOIN customer c ON r.cust_id = c.cust_id
    WHERE r.product_id = ?
    ORDER BY r.review_date DESC
  `;

  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Error fetching reviews:', err);
      return res.status(500).json({ Success: false, error: 'Failed to fetch reviews.' });
    }

    const reviews = results.map((review) => ({
      user: review.user_name, // Now uses actual user name
      Comment: review.comment,
      review_date: review.review_date,
    }));

    res.json({ Success: true, reviews });
  });
});






// User registration API
app.post("/signup", (req, res) => {
  const { username, password, email } = req.body;

  const checkQuery = `SELECT * FROM customer WHERE email = ?`;

  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Success: false, error: "Database error." });
    }
    if (results.length > 0) {
      return res.status(400).json({ Success: false, error: "User  already exists." });
    }

    //const cartData = JSON.stringify(Array(300).fill(0));
   const insertQuery = `INSERT INTO customer (Cust_name, password, email) VALUES (?, ?, ?)`;

    db.query(insertQuery, [username, password,email], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Success: false, error: "Database error." });
      }

      const token = jwt.sign({ id: result.insertId }, "secret_ecom");
      res.json({ Success: true, token });
    });
  });
});






// **Password Reset - Reset Password (with previous password verification)**
app.post('/reset-password', (req, res) => {
  try {
      const { email, previousPassword, newPassword } = req.body;

      // Fetch user from database
      const query = 'SELECT * FROM customer WHERE email = ?';
      db.query(query, [email], (err, results) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ Success: false, error: "Database error." });
          }

          if (results.length === 0) {
              return res.status(400).json({ Success: false, errors: "User not found." });
          }

          const user = results[0];

          // Compare plain-text passwords
          if (user.password !== previousPassword) {
              return res.status(400).json({ Success: false, errors: "Previous password is incorrect." });
          }

          // Update password in the database
          const updateQuery = 'UPDATE customer SET password = ? WHERE email = ?';
          db.query(updateQuery, [newPassword, email], (err, result) => {
              if (err) {
                  console.error(err);
                  return res.status(500).json({ Success: false, error: "Database error." });
              }
              res.json({ Success: true, message: "Password reset successful." });
          });
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ Success: false, error: "Server error." });
  }
});





// **Update Account**
app.post('/update-account', (req, res) => {
  try {
      const { email, newUsername, newPassword } = req.body;

      const query = 'SELECT * FROM customer WHERE email = ?';
      db.query(query, [email], (err, results) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ Success: false, errors: "Database error." });
          }

          if (results.length === 0) {
              return res.status(400).json({ Success: false, errors: "User not found." });
          }

          const user = results[0];
          const updates = [];

          if (newUsername) updates.push({ field: 'Cust_name', value: newUsername });
          if (newPassword) updates.push({ field: 'password', value: newPassword });

          updates.forEach(update => {
              const updateQuery = `UPDATE customer SET ${update.field} = ? WHERE email = ?`;
              db.query(updateQuery, [update.value, email], (err, result) => {
                  if (err) {
                      console.error(err);
                      return res.status(500).json({ Success: false, errors: "Database error." });
                  }
              });
          });

          res.json({ Success: true, message: "Account updated successfully." });
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ Success: false, errors: "Server error." });
  }
});





// **Delete Account**
app.post('/delete-account', (req, res) => {
  try {
      const { email } = req.body;

      console.log("Email received:", email);

      // Delete user from the database
      const query = 'DELETE FROM customer WHERE email = ?';
      db.query(query, [email], (err, result) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ Success: false, errors: "Database error." });
          }

          if (result.affectedRows === 0) {
              return res.status(400).json({ Success: false, errors: "User not found." });
          }

          res.json({ Success: true, message: "Account deleted successfully." });
      });
  } catch (error) {
      console.error("Error details:", error);
      res.status(500).json({ Success: false, errors: "Server error.", details: error.message });
  }
});




// Start server
app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on port " + port);
  } else {
    console.error("Error starting server:", error);
  }
});

