import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const UserDetailsCard = ({ user }) => {
  return (
    <Card className="user-details-card">
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Welcome, {user.name}!
        </Typography>
        <Typography variant="h6" color="textSecondary">
          <strong>User ID:</strong> {user.id}
        </Typography>
        <Typography variant="h6" color="textSecondary">
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography variant="h6" color="textSecondary">
          <strong>Role:</strong> {user.role}
        </Typography>
        <Typography variant="h6" color="textSecondary">
          <strong>College:</strong> {user.college}
        </Typography>
        <Typography variant="h6" color="textSecondary">
          <strong>Gender:</strong> {user.gender}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserDetailsCard;
