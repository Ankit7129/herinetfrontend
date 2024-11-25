import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const [profile, setProfile] = useState({
    bio: "",
    profileImageUrl: "",
    hobbies: [],
    educationalBackground: [],
    professionalExperience: [],
    achievements: [],
    certifications: [],
    skills: [],
    interests: { predefined: [], custom: [] },
    portfolioLinks: {
      linkedin: "",
      github: "",
      portfolioWebsite: "",
      twitter: "",
    },
    visibility: "Public",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const predefinedInterests = [
    "Leadership", "Research", "Entrepreneurship", "Programming", "AI",
    "Data Science", "Cybersecurity", "Robotics", "Human Rights",
    "Corporate Law", "Criminal Justice", "Marketing", "Finance",
    "Business Strategy", "Public Health", "Medicine", "Biotech",
    "UI/UX", "Graphic Design", "Architecture", "Physics", "Chemistry",
    "Biology", "Sports", "Music", "Arts", "Photography", "Writing",
    "Traveling", "Volunteering", "Other",
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/profile/profiles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile({
          bio: data.bio || "",
          profileImageUrl: data.profileImageUrl || "",
          hobbies: data.hobbies || [],
          educationalBackground: data.educationalBackground || [],
          professionalExperience: data.professionalExperience || [],
          achievements: data.achievements || [],
          certifications: data.certifications || [],
          skills: data.skills || [],
          interests: {
            predefined: data.interests?.predefined || [],
            custom: data.interests?.custom || [],
          },
          portfolioLinks: {
            linkedin: data.portfolioLinks?.linkedin || "",
            github: data.portfolioLinks?.github || "",
            portfolioWebsite: data.portfolioLinks?.portfolioWebsite || "",
            twitter: data.portfolioLinks?.twitter || "",
          },
          visibility: data.visibility || "Public",
        });
      } catch (err) {
        setError("Error fetching profile data");
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/profile/update`,
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Profile updated successfully");
      navigate("/profiles");
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profilePicture", selectedFile); // Updated to "profilePicture"
      const { data } = await axios.post(
        `http://localhost:5000/api/profile/upload-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfile((prev) => ({
        ...prev,
        profileImageUrl: data.profilePicture,
      }));
      alert("Profile picture uploaded successfully");
    } catch (err) {
      setError("Failed to upload profile picture");
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (interest) => {
    setProfile((prev) => {
      const isSelected = prev.interests.predefined.includes(interest);
      const updatedInterests = isSelected
        ? prev.interests.predefined.filter((i) => i !== interest)
        : [...prev.interests.predefined, interest];
      return {
        ...prev,
        interests: { ...prev.interests, predefined: updatedInterests },
      };
    });
  };

  const handleAddItem = (key) => {
    setProfile((prev) => ({
      ...prev,
      [key]: [...prev[key], {}],
    }));
  };

  const handleRemoveItem = (key, index) => {
    setProfile((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (key, index, field, value) => {
    setProfile((prev) => {
      const updatedItems = [...prev[key]];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      return { ...prev, [key]: updatedItems };
    });
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <h2>Profile Picture</h2>
        <img
          src={profile.profileImageUrl || "/default-avatar.png"}
          alt="Profile"
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <button onClick={handleImageUpload}>Upload Picture</button>
      </div>

      <div>
        <h2>Basic Information</h2>
        <textarea
          name="bio"
          value={profile.bio}
          placeholder="Write something about yourself..."
          onChange={handleChange}
        />
      </div>

      <div>
        <h2>Hobbies</h2>
        <textarea
          name="hobbies"
          value={profile.hobbies.join(", ")}
          placeholder="Enter your hobbies (comma-separated)"
          onChange={(e) =>
            setProfile((prev) => ({
              ...prev,
              hobbies: e.target.value.split(",").map((hobby) => hobby.trim()),
            }))
          }
        />
      </div>

      <div>
        <h2>Educational Background</h2>
        {profile.educationalBackground.map((education, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Institution"
              value={education.institution || ""}
              onChange={(e) =>
                handleItemChange("educationalBackground", index, "institution", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Degree"
              value={education.degree || ""}
              onChange={(e) =>
                handleItemChange("educationalBackground", index, "degree", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Field of Study"
              value={education.fieldOfStudy || ""}
              onChange={(e) =>
                handleItemChange("educationalBackground", index, "fieldOfStudy", e.target.value)
              }
            />
            <input
              type="number"
              placeholder="Graduation Year"
              value={education.graduationYear || ""}
              onChange={(e) =>
                handleItemChange("educationalBackground", index, "graduationYear", e.target.value)
              }
            />
            <button onClick={() => handleRemoveItem("educationalBackground", index)}>
              Remove
            </button>
          </div>
        ))}
        <button onClick={() => handleAddItem("educationalBackground")}>
          Add Education
        </button>
      </div>

      {/* Professional Experience */}
      <div>
  <h2>Professional Experience</h2>
  {profile.professionalExperience.map((experience, index) => (
    <div key={index}>
      <input
        type="text"
        placeholder="Company"
        value={experience.company || ""}
        onChange={(e) =>
          handleItemChange("professionalExperience", index, "company", e.target.value)
        }
      />
      <input
        type="text"
        placeholder="Job Title"
        value={experience.jobTitle || ""}
        onChange={(e) =>
          handleItemChange("professionalExperience", index, "jobTitle", e.target.value)
        }
      />
      <input
        type="number"
        placeholder="Start Year"
        value={experience.startYear || ""}
        onChange={(e) =>
          handleItemChange("professionalExperience", index, "startYear", parseInt(e.target.value))
        }
      />
      <input
        type="number"
        placeholder="End Year"
        value={experience.endYear || ""}
        onChange={(e) =>
          handleItemChange("professionalExperience", index, "endYear", parseInt(e.target.value))
        }
      />
      <textarea
        placeholder="Description"
        value={experience.description || ""}
        onChange={(e) =>
          handleItemChange("professionalExperience", index, "description", e.target.value)
        }
      />
      <button onClick={() => handleRemoveItem("professionalExperience", index)}>
        Remove
      </button>
    </div>
  ))}
  <button onClick={() => handleAddItem("professionalExperience")}>
    Add Experience
  </button>
</div>


      {/* Achievements */}
      <div>
  <h2>Achievements</h2>
  {profile.achievements.map((achievement, index) => (
    <div key={index}>
      <input
        type="text"
        placeholder="Title"
        value={achievement.title || ""}
        onChange={(e) =>
          handleItemChange("achievements", index, "title", e.target.value)
        }
      />
      <textarea
        placeholder="Description"
        value={achievement.description || ""}
        onChange={(e) =>
          handleItemChange("achievements", index, "description", e.target.value)
        }
      />
      <button onClick={() => handleRemoveItem("achievements", index)}>
        Remove
      </button>
    </div>
  ))}
  <button onClick={() => handleAddItem("achievements")}>Add Achievement</button>
</div>



      {/* Certifications */}
      <div>
  <h2>Certifications</h2>
  {profile.certifications.map((certification, index) => (
    <div key={index}>
      <input
        type="text"
        placeholder="Title"
        value={certification.title || ""}
        onChange={(e) =>
          handleItemChange("certifications", index, "title", e.target.value)
        }
      />
      <input
        type="text"
        placeholder="Issued By"
        value={certification.issuedBy || ""}
        onChange={(e) =>
          handleItemChange("certifications", index, "issuedBy", e.target.value)
        }
      />
      <input
        type="number"
        placeholder="Year"
        value={certification.year || ""}
        onChange={(e) =>
          handleItemChange("certifications", index, "year", e.target.value)
        }
      />
      <button onClick={() => handleRemoveItem("certifications", index)}>
        Remove
      </button>
    </div>
  ))}
  <button onClick={() => handleAddItem("certifications")}>Add Certification</button>
</div>



      {/* Skills */}
     {/* Skills */}
     <div>
  <h2>Skills</h2>
  {profile.skills.map((skill, index) => (
    <div key={index} style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Skill Name"
        value={skill.name || ""}
        onChange={(e) =>
          handleItemChange("skills", index, "name", e.target.value)
        }
        style={{ marginRight: "1rem", padding: "0.5rem" }}
      />
      <select
        value={skill.level || "Beginner"}
        onChange={(e) =>
          handleItemChange("skills", index, "level", e.target.value)
        }
        style={{ marginRight: "1rem", padding: "0.5rem" }}
      >
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
      <button
        onClick={() => handleRemoveItem("skills", index)}
        style={{
          background: "red",
          color: "white",
          border: "none",
          padding: "0.5rem",
          cursor: "pointer",
        }}
      >
        Remove
      </button>
    </div>
  ))}
  <button
    onClick={() => handleAddItem("skills")}
    style={{
      background: "green",
      color: "white",
      border: "none",
      padding: "0.5rem 1rem",
      cursor: "pointer",
    }}
  >
    Add Skill
  </button>
</div>



      <button onClick={handleProfileUpdate}>Update Profile</button>
    </div>
  );
};

export default EditProfilePage;
