// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AuthCallback = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let isMounted = true; // Prevent multiple executions

//     const params = new URLSearchParams(window.location.search);
//     const token = params.get("token");
//     const userId = params.get("userId");
//     const cartId = params.get("cartId");

//     console.log("URL Params:", params.toString());
//     console.log("Token:", token);
//     console.log("UserId:", userId);
//     console.log("CartId:", cartId);

//     if (isMounted && token && userId && cartId) {
//       try {
//         localStorage.setItem("auth-token", token);
//         localStorage.setItem("userId", userId);
//         localStorage.setItem("cartId", cartId);

//         console.log("Authentication successful. Redirecting to homepage...");
//         navigate("/");
//       } catch (err) {
//         console.error("Error saving data to localStorage:", err);
//         setError("An error occurred while logging in. Please try again.");
//         setLoading(false);
//       }
//     } else if (isMounted) {
//       console.error("Missing or invalid parameters in the callback URL");
//       setError("Invalid login callback. Redirecting to login page.");
//       navigate("/login");
//     }

//     setLoading(false);

//     return () => {
//       isMounted = false; // Cleanup to prevent unwanted re-executions
//     };
//   }, [navigate]);

//   return (
//     <div>
//       {loading && <p>Logging you in...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// };

// export default AuthCallback;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userId = params.get("userId");
    const cartId = params.get("cartId");

    console.log("URL Params:", params.toString());
    console.log("Token:", token);
    console.log("UserId:", userId);
    console.log("CartId:", cartId);

    if (token && userId && cartId) {
      try {
        console.log("Saving to localStorage...");
        
        // Check if localStorage is available
        if (typeof Storage !== "undefined") {
          localStorage.setItem("auth-token", token);
          localStorage.setItem("userId", userId);
          localStorage.setItem("cartId", cartId);

          console.log("Authentication successful. Redirecting to homepage...");
          console.log("LocalStorage Data:", {
            token: localStorage.getItem("auth-token"),
            userId: localStorage.getItem("userId"),
            cartId: localStorage.getItem("cartId")
          });

          setLoading(false); // Stop loading
          navigate("/"); // Navigate to homepage
        } else {
          console.error("LocalStorage is not supported.");
          setError("LocalStorage is not supported on your browser.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error saving data to localStorage:", err);
        setError("An error occurred while logging in. Please try again.");
        setLoading(false);
      }
    } else {
      console.error("Missing or invalid parameters in the callback URL");
      setError("Invalid login callback. Redirecting to login page.");
      setLoading(false);
      navigate("/login"); // Redirect to login if data is invalid or missing
    }
  }, [navigate]);

  return (
    <div>
      {loading && <p>Logging you in...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AuthCallback;
