// src/components/FriendsList.js
import React from 'react';

const FriendsList = ({ friends }) => {
  return (
    <div className="friends-list">
      {friends.length === 0 ? (
        <p>You don't have any friends yet.</p>
      ) : (
        friends.map(friend => (
          <div key={friend.id} className="friend-card">
            <h3>{friend.name}</h3>
            <p>{friend.email}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendsList;
