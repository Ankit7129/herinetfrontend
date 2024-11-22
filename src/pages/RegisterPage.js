import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const predefinedInterests = [
  "Leadership", "Research", "Entrepreneurship",
  "Programming", "AI", "Data Science", "Cybersecurity", "Robotics",
  "Human Rights", "Corporate Law", "Criminal Justice",
  "Marketing", "Finance", "Business Strategy",
  "Public Health", "Medicine", "Biotech",
  "UI/UX", "Graphic Design", "Architecture",
  "Physics", "Chemistry", "Biology",
  "Sports", "Music", "Arts", "Photography", "Writing",
  "Traveling", "Volunteering", "Other"
];

const predefinedColleges = [
  "Heritage Law College",
  "Heritage Technology College",
  "Heritage Business Academy",
  "Heritage Arts & Humanities College",
  "Heritage Medical College",
  "Heritage School of Architecture",
  "Other"
];

const roles = ["Student", "Faculty", "Alumni", "Admin"];
const genders = ["Male", "Female", "Other"];

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Student",
    college: "Heritage Law College",
    gender: "Male",
    predefinedInterests: [],
    customInterest: "",
    educationalBackground: [{ degree: "", fieldOfStudy: "", institutionName: "", graduationYear: "" }],
    portfolioLinks: { linkedin: "", github: "", portfolioWebsite: "", twitter: "" },
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const handleAddEducation = () => {
    setFormData({
      ...formData,
      educationalBackground: [...formData.educationalBackground, { degree: "", fieldOfStudy: "", institutionName: "", graduationYear: "" }]
    });
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.educationalBackground];
    updatedEducation[index][field] = value;
    setFormData({ ...formData, educationalBackground: updatedEducation });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Registration successful! Please verify your email.");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister} style={{ display: "inline-block", textAlign: "left" }}>
        <label>Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <br />
        
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <br />
        
        <label>Role:</label>
        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <br />
        
        <label>College:</label>
        <select value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })}>
          {predefinedColleges.map((college) => (
            <option key={college} value={college}>
              {college}
            </option>
          ))}
        </select>
        <br />
        
        <label>Gender:</label>
        <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
          {genders.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
        <br />
        
        <label>Interests:</label>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px" }}>
  {predefinedInterests.map((interest) => (
    <label key={interest} style={{ display: "flex", alignItems: "center" }}>
      <input
        type="checkbox"
        value={interest}
        checked={formData.predefinedInterests.includes(interest)}
        onChange={(e) => {
          const updatedInterests = e.target.checked
            ? [...formData.predefinedInterests, interest]
            : formData.predefinedInterests.filter((i) => i !== interest);
          setFormData({ ...formData, predefinedInterests: updatedInterests });
        }}
      />
      <span style={{ marginLeft: "8px" }}>{interest}</span>
    </label>
  ))}
</div>

        <input
          type="text"
          placeholder="Custom Interest"
          value={formData.customInterest}
          onChange={(e) => setFormData({ ...formData, customInterest: e.target.value })}
        />
        <br />
        
        <label>Educational Background:</label>
        {formData.educationalBackground.map((edu, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
            />
            <input
              type="text"
              placeholder="Field of Study"
              value={edu.fieldOfStudy}
              onChange={(e) => handleEducationChange(index, "fieldOfStudy", e.target.value)}
            />
            <input
              type="text"
              placeholder="Institution Name"
              value={edu.institutionName}
              onChange={(e) => handleEducationChange(index, "institutionName", e.target.value)}
            />
            <input
              type="number"
              placeholder="Graduation Year"
              value={edu.graduationYear}
              onChange={(e) => handleEducationChange(index, "graduationYear", e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddEducation}>
          Add More Education
        </button>
        <br />
        
        <label>Portfolio Links:</label>
        <input
          type="text"
          placeholder="LinkedIn"
          value={formData.portfolioLinks.linkedin}
          onChange={(e) =>
            setFormData({ ...formData, portfolioLinks: { ...formData.portfolioLinks, linkedin: e.target.value } })
          }
        />
        <input
          type="text"
          placeholder="GitHub"
          value={formData.portfolioLinks.github}
          onChange={(e) =>
            setFormData({ ...formData, portfolioLinks: { ...formData.portfolioLinks, github: e.target.value } })
          }
        />
        <br />
        
        <label>Password:</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <br />
        
        <label>Confirm Password:</label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
        />
        <br />
        
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
