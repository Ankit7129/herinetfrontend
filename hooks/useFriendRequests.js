import { useState, useEffect } from 'react';
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest } from '../src/services/api';

const useFriendRequests = (userId) => {
  const [requests, setRequests] = useState({ received: [], sent: [] });

  useEffect(() => {
    getFriendRequests(userId)
      .then((response) => setRequests(response.data))
      .catch((error) => console.error(error));
  }, [userId]);

  const handleAccept = (requestId) => {
    acceptFriendRequest(requestId)
      .then((response) => {
        alert(response.data.message);
        setRequests((prevState) => ({
          ...prevState,
          received: prevState.received.filter((request) => request._id !== requestId),
        }));
      })
      .catch((error) => console.error(error));
  };

  const handleReject = (requestId) => {
    rejectFriendRequest(requestId)
      .then((response) => {
        alert(response.data.message);
        setRequests((prevState) => ({
          ...prevState,
          received: prevState.received.filter((request) => request._id !== requestId),
        }));
      })
      .catch((error) => console.error(error));
  };

  return {
    requests,
    handleAccept,
    handleReject,
  };
};

export default useFriendRequests;
