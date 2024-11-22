import React from 'react';

const UserProfileCard = ({ profile, onSendRequest }) => {
  return (
    <div className="user-profile-card">
      <img src={profile.profilePicture} alt={profile.name} />
      <h3>{profile.name}</h3>
      <p>{profile.email}</p>
      <p>Role: {profile.role}</p>
      <button onClick={() => onSendRequest(profile.id)}>Send Friend Request</button>
    </div>
  );
};

export default UserProfileCard;
