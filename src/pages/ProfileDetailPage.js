import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams , useNavigate } from 'react-router-dom';
import './ProfileDetailPage.css';

const ProfileDetailPage = () => {
  const { userId } = useParams(); // Extract userId from URL
  const navigate = useNavigate(); // Initialize navigate function

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);
  const handleViewProfile = (selectedUserId) => {
    navigate(`/profile/${selectedUserId}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const {
    userId: userDetails,
    bio,
    profileImageUrl,
    interests,
    engagement,
    portfolioLinks,
    hobbies,
    educationalBackground,
    professionalExperience,
    achievements,
    certifications,
    skills,
    posts,
    projects,
    connections,
    followers,
    following
  } = profile;

  return (
    <div className="profile-detail-container">
      {/* Header Section */}
      <div className="profile-header">
        <img src={profileImageUrl || '/default-avatar.png'} alt={`${userDetails.name}'s avatar`} className="profile-image" />
        <h2>{userDetails.name}</h2>
        <p className="bio">{bio}</p>
      </div>

      {/* Interests Section */}
      <section className="profile-section">
        <h3>Interests</h3>
        <ul>
          {interests.predefined.map((interest, index) => (
            <li key={index}>{interest}</li>
          ))}
          {interests.custom.length > 0 && interests.custom.map((interest, index) => (
            <li key={index}>{interest}</li>
          ))}
        </ul>
      </section>

      {/* Engagement Section */}
      <section className="profile-section">
        <h3>Engagement</h3>
        <p>Total Likes Received: {engagement.totalLikesReceived}</p>
        <p>Total Shares Received: {engagement.totalSharesReceived}</p>
        <p>Total Comments Received: {engagement.totalCommentsReceived}</p>
      </section>

      {/* Portfolio Links Section */}
      <section className="profile-section">
        <h3>Portfolio Links</h3>
        <ul>
          {Object.entries(portfolioLinks).map(([platform, link]) => (
            link && <li key={platform}><a href={link} target="_blank" rel="noopener noreferrer">{platform}</a></li>
          ))}
        </ul>
      </section>

      {/* Hobbies Section */}
      <section className="profile-section">
        <h3>Hobbies</h3>
        <ul>
          {hobbies.map((hobby, index) => <li key={index}>{hobby}</li>)}
        </ul>
      </section>

      {/* Educational Background Section */}
      <section className="profile-section">
        <h3>Educational Background</h3>
        {educationalBackground.map((edu, index) => (
          <div key={index}>
            <p><strong>{edu.institution}</strong> - {edu.degree}, {edu.fieldOfStudy} ({edu.graduationYear})</p>
          </div>
        ))}
      </section>

      {/* Professional Experience Section */}
      <section className="profile-section">
        <h3>Professional Experience</h3>
        {professionalExperience.map((exp, index) => (
          <div key={index}>
            <p><strong>{exp.jobTitle}</strong> at {exp.company} ({exp.startYear} - {exp.endYear})</p>
            <p>{exp.description}</p>
          </div>
        ))}
      </section>

      {/* Certifications Section */}
      <section className="profile-section">
        <h3>Certifications</h3>
        {certifications.map((cert, index) => (
          <div key={index}>
            <p><strong>{cert.title}</strong> by {cert.issuedBy} ({cert.year})</p>
          </div>
        ))}
      </section>

      {/* Connections, Followers, Following */}
      
      {/* Connections Section */}
      <section className="profile-section">
        <h3>Connections ({connections.length})</h3>
        {connections.length === 0 ? <p>No connections yet.</p> : (
          <ul>
            {connections.map(conn => (
              <li key={conn._id} className="profile-list-item">
                <strong>{conn.name}</strong> ({conn.role})<br />
                <span>{conn.email}</span><br />
                <button onClick={() => handleViewProfile(conn._id)} className="view-profile-button">
                  View Profile
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Followers Section */}
      <section className="profile-section">
        <h3>Followers ({followers.length})</h3>
        {followers.length === 0 ? <p>No followers yet.</p> : (
          <ul>
            {followers.map(follower => (
              <li key={follower._id} className="profile-list-item">
                <strong>{follower.name}</strong> ({follower.role})<br />
                <span>{follower.email}</span><br />
                <button onClick={() => handleViewProfile(follower._id)} className="view-profile-button">
                  View Profile
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Following Section */}
      <section className="profile-section">
        <h3>Following ({following.length})</h3>
        {following.length === 0 ? <p>Not following anyone yet.</p> : (
          <ul>
            {following.map(followed => (
              <li key={followed._id} className="profile-list-item">
                <strong>{followed.name}</strong> ({followed.role})<br />
                <span>{followed.email}</span><br />
                <button onClick={() => handleViewProfile(followed._id)} className="view-profile-button">
                  View Profile
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Posts and Projects */}
      <section className="profile-section">
        <h3>Posts ({posts.length})</h3>
        {posts.map(post => (
          <div key={post._id}>
            <p><strong>Post ID:</strong> {post._id}</p>
            <p>{post.content}</p>
          </div>
        ))}
      </section>

      <section className="profile-section">
        <h3>Projects ({projects.length})</h3>
        {projects.map(project => (
          <div key={project._id}>
            <p><strong>Project ID:</strong> {project._id}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ProfileDetailPage;
