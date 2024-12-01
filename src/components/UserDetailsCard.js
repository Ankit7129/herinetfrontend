import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const UserDetailsCard = ({ user }) => {
  const cardStyle = {
    margin: "20px auto",
    padding: "10px",
    maxWidth: "800px",
    
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  };

  const textStyle = {
    fontSize: "18px",
    color: "#555",
    margin: "8px 0",
  };

  const strongStyle = {
    fontWeight: "bold",
    color: "#000",
  };

  return (
    <Card style={cardStyle}>
      <CardContent>
        <Typography variant="h4" gutterBottom style={titleStyle}>
          Welcome, {user.name}!
        </Typography>
        <Typography variant="h6" style={textStyle}>
          <strong style={strongStyle}>User ID:</strong> {user.id}
        </Typography>
        <Typography variant="h6" style={textStyle}>
          <strong style={strongStyle}>Email:</strong> {user.email}
        </Typography>
        <Typography variant="h6" style={textStyle}>
          <strong style={strongStyle}>Role:</strong> {user.role}
        </Typography>
        <Typography variant="h6" style={textStyle}>
          <strong style={strongStyle}>College:</strong> {user.college}
        </Typography>
        <Typography variant="h6" style={textStyle}>
          <strong style={strongStyle}>Gender:</strong> {user.gender}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserDetailsCard;
