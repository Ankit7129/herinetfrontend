// ProfilesPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();  // Initialize navigation hook

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile/profiles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProfiles(response.data.profiles);
    } catch (error) {
      setError('Failed to fetch profiles.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (userId) => {
    console.log("Navigating to profile with ID:", userId); // Add this for debugging
    navigate(`/profile/${userId}`);
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profiles-page">
      <div className="profiles-list">
        {profiles.map((profile) => (
          <div key={profile._id} className="profile-card">
            <img
              src={profile.profileImageUrl || 'default-profile.png'}
              alt={profile.userId.name}
              className="profile-image"
            />
            <h2>{profile.userId.name}</h2>
            <p>{profile.bio || 'No bio available.'}</p>
            <button onClick={() => handleViewProfile(profile.userId._id)}>
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilesPage;
