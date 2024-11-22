import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ProfilePage.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/profile/profiles`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-container p-4">
      <h2>User Profile</h2>
      {profile ? (
        <>
          <div className="profile-header">
            <img
              src={profile.profileImageUrl}
              alt="Profile"
              className="profile-image"
            />
            <div className="profile-info">
              <h3>{profile.userId.name}</h3>
              <p><strong>Email:</strong> {profile.userId.email}</p>
              <p><strong>College:</strong> {profile.userId.college}</p>
              <p><strong>Bio:</strong> {profile.bio}</p>
            </div>
          </div>

          <h4>Educational Background</h4>
          {profile.educationalBackground.length > 0 ? (
            <ul>
              {profile.educationalBackground.map((education) => (
                <li key={education._id}>
                  <strong>{education.degree}</strong> in {education.fieldOfStudy} from {education.institution} ({education.graduationYear})
                </li>
              ))}
            </ul>
          ) : (
            <p>No educational background available.</p>
          )}

          <h4>Professional Experience</h4>
          {profile.professionalExperience.length > 0 ? (
            <ul>
              {profile.professionalExperience.map((experience) => (
                <li key={experience._id}>
                  <strong>{experience.jobTitle}</strong> at {experience.company} ({experience.startYear} - {experience.endYear ? experience.endYear : "Present"})
                  <p>{experience.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No professional experience available.</p>
          )}

          <h4>Achievements</h4>
          {profile.achievements.length > 0 ? (
            <ul>
              {profile.achievements.map((achievement) => (
                <li key={achievement}>{achievement}</li>
              ))}
            </ul>
          ) : (
            <p>No achievements listed.</p>
          )}

          <h4>Hobbies</h4>
          {profile.hobbies.length > 0 ? (
            <ul>
              {profile.hobbies.map((hobby) => (
                <li key={hobby}>{hobby}</li>
              ))}
            </ul>
          ) : (
            <p>No hobbies listed.</p>
          )}

          <h4>Certifications</h4>
          {profile.certifications.length > 0 ? (
            <ul>
              {profile.certifications.map((certification) => (
                <li key={certification}>{certification}</li>
              ))}
            </ul>
          ) : (
            <p>No certifications listed.</p>
          )}

          <h4>Skills</h4>
          <ul>
            {profile.skills.length > 0 ? (
              profile.skills.map((skill, index) => <li key={index}>{skill}</li>)
            ) : (
              <p>No skills listed.</p>
            )}
          </ul>

          <h4>Connections</h4>
          {profile.connections.length > 0 ? (
            <ul>
              {profile.connections.map((connection) => (
                <li key={connection}>{connection}</li>
              ))}
            </ul>
          ) : (
            <p>No connections available.</p>
          )}

          <h4>Followers</h4>
          {profile.followers.length > 0 ? (
            <ul>
              {profile.followers.map((follower) => (
                <li key={follower}>{follower}</li>
              ))}
            </ul>
          ) : (
            <p>No followers.</p>
          )}

          <h4>Following</h4>
          {profile.following.length > 0 ? (
            <ul>
              {profile.following.map((following) => (
                <li key={following}>{following}</li>
              ))}
            </ul>
          ) : (
            <p>No following.</p>
          )}

          <h4>Connection Requests</h4>
          {profile.connectionRequests.length > 0 ? (
            <ul>
              {profile.connectionRequests.map((request) => (
                <li key={request._id}>
                  User {request.userId} has a {request.status} request.
                </li>
              ))}
            </ul>
          ) : (
            <p>No connection requests.</p>
          )}

          <button onClick={() => navigate("/edit-profile")} className="edit-profile-btn">
            Edit Profile
          </button>
        </>
      ) : (
        <p>Profile data not available</p>
      )}
    </div>
  );
};

export default ProfilePage;
