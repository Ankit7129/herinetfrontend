import React from 'react';

const FriendRequestCard = ({ request, onAccept, onReject }) => {
  return (
    <div className="friend-request-card">
      <img src={request.from.profilePicture} alt={request.from.name} />
      <h3>{request.from.name}</h3>
      <p>{request.from.email}</p>
      <button onClick={() => onAccept(request._id)}>Accept</button>
      <button onClick={() => onReject(request._id)}>Reject</button>
    </div>
  );
};

export default FriendRequestCard;
