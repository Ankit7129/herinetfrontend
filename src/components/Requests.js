import React, { useEffect, useState } from 'react';
import { getConnections, handleRequest } from '../api';

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await getConnections(); // Replace with your API for pending requests
        setRequests(data.pendingRequests);
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
    };
    fetchRequests();
  }, []);

  const respondToRequest = async (userId, action) => {
    try {
      await handleRequest(userId, action);
      alert(`Request ${action}`);
      setRequests((prev) => prev.filter((req) => req.userId !== userId));
    } catch (err) {
      console.error(`Error ${action} request:`, err);
    }
  };

  return (
    <div>
      <h2>Connection Requests</h2>
      {requests.map((request) => (
        <div key={request.userId}>
          <p>{request.name}</p>
          <button onClick={() => respondToRequest(request.userId, 'accept')}>
            Accept
          </button>
          <button onClick={() => respondToRequest(request.userId, 'reject')}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
};

export default Requests;
