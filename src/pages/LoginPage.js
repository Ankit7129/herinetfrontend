import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error state
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Start loading
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      setLoading(false); // Stop loading
      if (response.ok) {
        localStorage.setItem("token", data.token); // Save token
        navigate("/dashboard", { state: data }); // Pass data to dashboard
      } else {
        setError(data.msg || "Login failed!"); // Show error message
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred. Please try again later."); // General error handling
      setLoading(false); // Stop loading on error
    }
  };

  const handleRegister = () => {
    navigate("/select-role"); // Redirect to RoleSelectionPage for new user registration
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      {loading && (
        <div
          style={{
            width: "100%",
            height: "5px",
            backgroundColor: "#ccc",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#4caf50",
              animation: "progress 1.5s infinite",
            }}
          ></div>
        </div>
      )}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit" disabled={loading}>
          Login
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error */}
      <button onClick={() => navigate("/forgot-password")} disabled={loading}>
        Forgot Password
      </button>
      <button onClick={handleRegister} disabled={loading}>
        New User? Register
      </button>
      <button onClick={() => navigate("/")} disabled={loading}>
        Go Back to Welcome
      </button>
    </div>
  );
};

export default LoginPage;
