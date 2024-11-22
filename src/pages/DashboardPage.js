import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userDetails = location.state;

  if (!userDetails) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Error</h2>
        <p>User details not found. Please login again.</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  const { user, token } = userDetails;

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", textAlign: "center" }}>
      <h2>Welcome, {user.name}!</h2>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      <p>
        <strong>College:</strong> {user.college}
      </p>
      <p>
        <strong>Interests:</strong>{" "}
        {user.interests.predefined.join(", ")}, {user.interests.custom.join(", ")}
      </p>
      <h3>Educational Background:</h3>
      <ul>
        {user.educationalBackground.map((edu, index) => (
          <li key={index}>
            {edu.degree} in {edu.fieldOfStudy} from {edu.institutionName} (
            {edu.graduationYear})
          </li>
        ))}
      </ul>
      <h3>Portfolio Links:</h3>
      <ul>
        {user.portfolioLinks.linkedin && (
          <li>
            <a href={user.portfolioLinks.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
        )}
        {user.portfolioLinks.github && (
          <li>
            <a href={user.portfolioLinks.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
        )}
      </ul>
      <p>
        <strong>Token:</strong> {token}
      </p>
      <button onClick={() => navigate("/login")}>Logout</button>
      <button onClick={() => navigate('/profiles')} style={{ marginTop: '20px' }}>View All Profiles</button>
      <button onClick={() => navigate("/connexion")} // Redirects to the connexion list pagestyle={{ marginTop: "20px" }}
        >
        View All Connexions
        </button>
    </div>
  );
};

export default DashboardPage;
