import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./WelcomePage.css";


const predefinedColleges = [
  "Heritage Law College",
  "Heritage Technology College",
  "Heritage Business Academy",
  "Heritage Arts & Humanities College",
  "Heritage Medical College",
  "Heritage School of Architecture",
  "Other"
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {}; // Get role from the navigation state

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    gender: '',
    role: role || '', // Pre-fill role if passed
  });

  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        college: formData.college,
        gender: formData.gender,
        role: formData.role,
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please verify your email.');
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed!');
      }
    } catch (error) {
      console.error('Error registering:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to render motivational tags based on role
  const getMotivationalMessage = (role) => {
    switch (role) {
      case 'Student':
        return (
          <p>
            Hello, Student! Prepare to unlock endless opportunities and connect with inspiring individuals. Let's make your journey unforgettable in the smart club!
          </p>
        );
      case 'Faculty':
        return (
          <p>
            Hello, Faculty! Help us grow with your knowledge, experience, and guidance. Together, we can build a smarter and more impactful community!
          </p>
        );
      case 'Alumni':
        return (
          <p>
            Hello, Alumni! Your wisdom and suggestions are priceless. Guide the next generation, inspire them, and help us evolve into the smartest club ever!
          </p>
        );
      default:
        return <p>Please choose your role to get started.</p>;
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {role && getMotivationalMessage(role)} {/* Display role-specific message */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="college">College</label>
          <select
            id="college"
            name="college"
            value={formData.college}
            onChange={handleChange}
            required
          >
            <option value="">Select College</option>
            {predefinedColleges.map((college, index) => (
              <option key={index} value={college}>
                {college}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            disabled
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
