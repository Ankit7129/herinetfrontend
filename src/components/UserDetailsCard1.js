// src/components/UserDetailsCard.js
import React from 'react';

const UserDetailsCard = ({ user }) => (
  <div className="user-details-card">
    <img src={user.profile.profileImageUrl} alt="Profile" className="profile-pic" />
    <div className="header-details">
      <h3>{user.name}</h3>
      <p>{user.college} - {user.role}</p>
    </div>
  </div>
);

export default UserDetailsCard;
