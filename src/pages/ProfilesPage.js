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
        <div className="profile-boxes">
          <div className="user-info-box">
            <h3>User Information</h3>
            <p><strong>Name:</strong> {profile.userId.name}</p>
            <p><strong>Email:</strong> {profile.userId.email}</p>
            <p><strong>Role:</strong> {profile.userId.role}</p>
            <p><strong>College:</strong> {profile.userId.college}</p>
          </div>

          <div className="profile-header">
            <img
              src={profile.profileImageUrl}
              alt="Profile"
              className="profile-image"
            />
          </div>

          <div className="bio-box">
            <h3>Bio</h3>
            <p>{profile.bio || "No bio available."}</p>
          </div>

          <div className="interests-box">
            <h3>Interests</h3>
            <p><strong>Predefined:</strong> {profile.interests.predefined.length > 0 ? profile.interests.predefined.join(", ") : "No predefined interests."}</p>
            <p><strong>Custom:</strong> {profile.interests.custom.length > 0 ? profile.interests.custom.join(", ") : "No custom interests."}</p>
          </div>

          <div className="portfolio-box">
            <h3>Portfolio Links</h3>
            <p><strong>LinkedIn:</strong> {profile.portfolioLinks.linkedin || "Not provided"}</p>
            <p><strong>GitHub:</strong> {profile.portfolioLinks.github || "Not provided"}</p>
            <p><strong>Portfolio Website:</strong> {profile.portfolioLinks.portfolioWebsite || "Not provided"}</p>
            <p><strong>Twitter:</strong> {profile.portfolioLinks.twitter || "Not provided"}</p>
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

          <h4>Skills</h4>
          <ul>
            {profile.skills.length > 0 ? (
              profile.skills.map((skill, index) => <li key={index}>{skill}</li>)
            ) : (
              <p>No skills listed.</p>
            )}
          </ul>
        </div>
      ) : (
        <p>Profile data not available</p>
      )}

      <button onClick={() => navigate("/edit-profile")} className="edit-profile-btn">
        Edit Profile
      </button>
    </div>
  );
};

export default ProfilePage;
