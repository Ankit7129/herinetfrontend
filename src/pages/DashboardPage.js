import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Typography } from "@mui/material";
import "./Dashboard.css";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userDetails = location.state;

  // Check if userDetails exists, if not, show an error and navigate to login page
  if (!userDetails) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>User details not found. Please login again.</p>
        <Button variant="contained" onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  const { user, token } = userDetails || {};

  // Check if token is missing, if so, show an error and navigate to login page
  if (!token) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>Session expired. Please login again.</p>
        <Button variant="contained" onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* User Details Section */}
      <Card className="card">
        <CardContent>
          <Typography variant="h4" gutterBottom>Welcome, {user.name}!</Typography>
          <Typography variant="h6" color="textSecondary"><strong>Email:</strong> {user.email}</Typography>
          <Typography variant="h6" color="textSecondary"><strong>Role:</strong> {user.role}</Typography>
          <Typography variant="h6" color="textSecondary"><strong>College:</strong> {user.college}</Typography>
          <Typography variant="h6" color="textSecondary"><strong>Gender:</strong> {user.gender}</Typography>
        </CardContent>
      </Card>

      {/* Interests Section */}
      <Card className="card">
        <CardContent>
          <Typography variant="h5" gutterBottom>Interests</Typography>
          <Typography variant="body1"><strong>Predefined Interests:</strong> {user.interests?.predefined?.join(", ") || "No predefined interests"}</Typography>
          <Typography variant="body1"><strong>Custom Interests:</strong> {user.interests?.custom?.join(", ") || "No custom interests"}</Typography>
        </CardContent>
      </Card>

      {/* Educational Background Section */}
      <Card className="card">
        <CardContent>
          <Typography variant="h5" gutterBottom>Educational Background</Typography>
          <ul>
            {user.educationalBackground?.map((edu, index) => (
              <li key={index}>
                <Typography variant="body1">{edu.degree} in {edu.fieldOfStudy} from {edu.institutionName} ({edu.graduationYear})</Typography>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Portfolio Links Section */}
      <Card className="card">
        <CardContent>
          <Typography variant="h5" gutterBottom>Portfolio Links</Typography>
          <ul>
            {user.portfolioLinks?.linkedin && <li><a href={user.portfolioLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>}
            {user.portfolioLinks?.github && <li><a href={user.portfolioLinks.github} target="_blank" rel="noreferrer">GitHub</a></li>}
          </ul>
        </CardContent>
      </Card>

      {/* Token Section */}
      <Card className="card">
        <CardContent>
          <Typography variant="h5" gutterBottom>Token</Typography>
          <Typography variant="body1"><strong>Token:</strong> {token}</Typography>
        </CardContent>
      </Card>

      {/* Buttons for Navigation */}
      <div className="button-container">
        <Button variant="contained" color="primary" className="btn" onClick={() => navigate("/login")}>Logout</Button>
        <Button variant="outlined" className="btn" onClick={() => navigate("/profiles")}>View All Profiles</Button>
        <Button variant="outlined" className="btn" onClick={() => navigate("/connexion")}>View All Connexions</Button>
        <Button variant="outlined" className="btn" onClick={() => navigate("/projects/create")}>Create Project</Button>
        <Button variant="outlined" className="btn" onClick={() => navigate("/projects/suggestions")}>Suggested Projects</Button>
        <Button variant="outlined" className="btn" onClick={() => navigate("/projects/join")}>Join a Project</Button>
        <Button variant="outlined" className="btn" onClick={() => navigate("/messages")}>Manage Messages</Button>
        <Button variant="contained" color="secondary" className="btn-special" onClick={() => alert("Special feature coming soon!")}>Special Feature</Button>
      </div>
    </div>
  );
};

export default DashboardPage;
