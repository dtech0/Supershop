
// import React, { useState, useContext } from "react";
// import { ShopContext } from '../Context/ShopContext';
// import "./CSS/LoginSignup.css";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const { login, fetchCartProducts } = useContext(ShopContext);

//   const changeHandler = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async () => {
//     try {
//       const response = await fetch("http://localhost:4000/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email: formData.email, password: formData.password }),
//       });

//       const responseData = await response.json();

//       if (!responseData.Success) {
//         alert(responseData.error || 'Login Failed');
//       } else {
//         alert("Login Successful");
//         localStorage.setItem("auth-token", responseData.token);
//         localStorage.setItem("cartId", responseData.cartId);
//         localStorage.setItem("userId", responseData.userId);
//         //localStorage.setItem('user-name', response.data.username); // Save the username
//         await login(responseData.token, responseData.cartId, responseData.userId);
//         await fetchCartProducts(responseData.cartId);

//         setTimeout(() => {
//           window.location.replace("/");
//         }, 500);
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//     }
//   };

//   return (
//     <div className="loginsignup">
//       <div className="loginsignup-container">
//         <h1>Login</h1>
//         <div className="loginsignup-fields">
//           <input
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={changeHandler}
//             type="email"
//             placeholder="Email Address"
//           />
//           <input
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={changeHandler}
//             type="password"
//             placeholder="Password"
//           />
//         </div>
//         <button onClick={handleLogin}>Login</button>
//         <div className="loginsignup-options">
//           <p onClick={() => window.location.replace("/signup")}>Create a new account?</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;




import React, { useState, useContext } from "react";
import { ShopContext } from '../Context/ShopContext';
import "./CSS/LoginSignup.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, fetchCartProducts } = useContext(ShopContext);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    
    if (!formData.email || !formData.password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const responseData = await response.json();

      if (!responseData.Success) {
        alert(responseData.error || 'Login Failed');
      } else {
        alert("Login Successful");
        localStorage.setItem("auth-token", responseData.token);
        localStorage.setItem("cartId", responseData.cartId);
        localStorage.setItem("userId", responseData.userId);
        await login(responseData.token, responseData.cartId, responseData.userId);
        await fetchCartProducts(responseData.cartId);

        setTimeout(() => {
          window.location.replace("/");
        }, 500);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Trigger Google OAuth flow
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Login</h1>
        <div className="loginsignup-fields">
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
          />
          <input
            id="password"
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
          />
        </div>
        <button onClick={handleLogin}>Login</button>
        <button className="google-login" onClick={handleGoogleLogin}>
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Logo" />
          Sign in with Google
        </button>
        <div className="loginsignup-options">
          <p onClick={() => window.location.replace("/signup")}>Create a new account?</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

