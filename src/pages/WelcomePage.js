import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the App</h1>
      <button onClick={() => navigate("/login")}>Get Started</button>
    </div>
  );
};

export default WelcomePage;
