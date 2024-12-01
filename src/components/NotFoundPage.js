import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Page Not Found</h1>
      <p>We are working on this page. Please check back later.</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default NotFound;
