import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConnexionListPage = () => {
  const [profiles, setProfiles] = useState([]);  
  const [connections, setConnections] = useState([]);  
  const [followers, setFollowers] = useState([]);  
  const [pendingRequests, setPendingRequests] = useState([]); 
  const [totalRequests, setTotalRequests] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/connexion`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfiles(res.data || []);  
      } catch (err) {
        setError('Failed to fetch profiles');
      }
    };

    fetchProfiles();
  }, []);  // Empty dependency array ensures this runs once when the component mounts

  // Fetch user data (connections, followers, pending requests)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const resConnections = await axios.get(`${process.env.REACT_APP_API_URL}/api/connections`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setConnections(resConnections.data.connections || []);
        setFollowers(resConnections.data.followers || []);
    
        const resPendingRequests = await axios.get(`${process.env.REACT_APP_API_URL}/api/pending-requests`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPendingRequests(resPendingRequests.data.pendingRequests || []);
        setTotalRequests(resPendingRequests.data.totalRequests || 0);
        
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);  // Empty dependency array ensures this runs once when the component mounts

  // Send a connection request
  const sendConnectionRequest = async (userId) => {
    try {
      const isRequestSent = profiles.some(profile => 
        profile.connectionRequests?.some(req => req.userId === userId && req.status === 'pending')
      );
  
      if (isRequestSent) {
        alert('Connection request already sent');
        return; 
      }
  
      await axios.post(`${process.env.REACT_APP_API_URL}/api/send-request/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Connection request sent!');
    } catch (err) {
      console.error('Error sending connection request:', err);
      alert('Failed to send connection request');
    }
  };

  // Handle a connection request (accept or reject)
  const handleRequest = async (userId, action) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/handle-request/${userId}`, { action }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert(`Connection request ${action}ed!`);
      setPendingRequests(pendingRequests.filter(req => req.userId !== userId));
    } catch (err) {
      alert('Failed to handle connection request');
    }
  };

  // Follow/unfollow a user
  const toggleFollow = async (userId, action) => {
    try {
      const url = action === 'follow'
        ? `${process.env.REACT_APP_API_URL}/api/follow/${userId}`
        : `${process.env.REACT_APP_API_URL}/api/unfollow/${userId}`;
      
      await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert(`${action === 'follow' ? 'Followed' : 'Unfollowed'} user!`);
    } catch (err) {
      alert('Failed to follow/unfollow user');
    }
  };

  // Remove a connection
  const removeConnection = async (userId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/remove-connection/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Connection removed successfully!');
      setConnections(connections.filter(connection => connection._id !== userId));
    } catch (err) {
      console.error('Error removing connection:', err);
      alert('Failed to remove connection');
    }
  };
  // Send Message Handler
const handleSendMessage = (userId) => {
  // Navigate to the message page (you can use react-router-dom for navigation)
  window.location.href = `/chat/${userId}`;
};


  // Loading state
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Profiles</h1>
      <div>
        {profiles.length > 0 ? profiles.map((profile) => (
          <div key={profile._id}>
            <img src={profile.profileImageUrl} alt="Profile" width="50" height="50" />
            <h2>{profile.userId}</h2>
            <p>{profile.bio}</p>
            <p><strong>Followers:</strong> {profile.followers ? profile.followers.length : 0}</p>
            <p><strong>Connections:</strong> {profile.connections ? profile.connections.length : 0}</p>
            <button
              onClick={() => sendConnectionRequest(profile.userId)}
              disabled={profile.connectionRequests?.some(req => req.userId === profile.userId && req.status === 'pending')}
            >
              {profile.connectionRequests?.some(req => req.userId === profile.userId && req.status === 'pending')
                ? 'Request Sent'
                : 'Send Request'}
            </button>
            <button
              onClick={() => toggleFollow(profile.userId, 'follow')}
            >
              Follow
            </button>
            <button
              onClick={() => toggleFollow(profile.userId, 'unfollow')}
            >
              Unfollow
            </button>
            {/* Add the Send Message button */}
            <button
              onClick={() => handleSendMessage(profile.userId)}
            >
              Send Message
            </button>
          </div>
        )) : <p>No profiles available</p>}
      </div>

      <h1>Your Connections</h1>
      <div>
        {connections.length > 0 ? connections.map((connection) => (
          <div key={connection._id}>
            <h2>{connection.name}</h2>
            <p>Email: {connection.email}</p>
            <p>User ID: {connection._id}</p>
            <button onClick={() => removeConnection(connection._id)}>
              Remove Connection
            </button>
          </div>
        )) : <p>No connections</p>}
      </div>

      <h1>Your Followers</h1>
      <div>
        {followers.length > 0 ? followers.map((follower) => (
          <div key={follower._id}>
            <h2>{follower.name}</h2>
            <p>{follower.email}</p>
          </div>
        )) : <p>No followers</p>}
      </div>

      <h1>Connection Requests</h1>
      <div>
        {totalRequests === 0 ? (
          <p>No connection requests</p>
        ) : (
          <>
            <p>Total pending requests: {totalRequests}</p>
            {pendingRequests.map((request) => (
              <div key={request._id}>
                <h2>User ID: {request.userId}</h2>
                <p>Status: {request.status}</p>
                <button onClick={() => handleRequest(request.userId, 'accept')}>
                  Accept
                </button>
                <button onClick={() => handleRequest(request.userId, 'reject')}>
                  Reject
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ConnexionListPage;
