import React, { useEffect, useState } from "react";
//import "./EditProfilePage.css"; // You can create this file for custom styling
import "./ProfilePage.css";

const EditProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);

  // Fetch profile details
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/profile/profiles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setProfile(data);
          setFormData(data); // Initialize form with profile data
        } else {
          alert(data.message || "Failed to fetch profile.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update profile
  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Profile updated successfully.");
        setProfile(data.profile);
      } else {
        alert(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Upload profile picture
  const handleProfilePictureUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/profile/upload-picture`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert("Profile picture uploaded successfully.");
        setProfile((prev) => ({ ...prev, profileImageUrl: data.profilePicture }));
      } else {
        alert(data.message || "Failed to upload profile picture.");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  // Delete profile
  const handleDeleteProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/profile/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        alert("Profile deleted successfully.");
        localStorage.removeItem("token");
        window.location.href = "/"; // Redirect to home page
      } else {
        alert(data.message || "Failed to delete profile.");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <div className="edit-profile-container">
      <h1>Edit Profile</h1>
      {profile ? (
        <div className="edit-profile-content">
          <h2>{profile.userId.name}'s Profile</h2>

          {/* Display Profile Picture */}
          <div className="profile-picture-section">
            <img
              src={profile.profileImageUrl || "https://via.placeholder.com/150"}
              alt="Profile"
              className="profile-image"
            />
            <form onSubmit={handleProfilePictureUpload}>
              <input
                type="file"
                onChange={(e) => setProfilePicture(e.target.files[0])}
                required
              />
              <button type="submit">Upload Profile Picture</button>
            </form>
          </div>

          {/* Edit Profile Form */}
          <div className="edit-form">
            <label>
              Bio:
              <textarea
                name="bio"
                value={formData.bio || ""}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Skills:
              <input
                type="text"
                name="skills"
                value={formData.skills || ""}
                onChange={handleInputChange}
              />
            </label>

            <button onClick={handleUpdate}>Update Profile</button>
          </div>

          {/* Delete Profile Button */}
          <button className="delete-profile-btn" onClick={handleDeleteProfile}>
            Delete Profile
          </button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default EditProfilePage;
