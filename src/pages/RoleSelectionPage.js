import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./ProfilePage.css";

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    // Redirect to register page with role passed as state
    navigate('/register', { state: { role } });
  };

  return (
    <div className="role-selection-container">
      <h2>Select Your Role</h2>
      <div className="role-options">
        <div 
          className="role-button" 
          onClick={() => handleRoleSelect('Student')}
        >
          <span>Student</span>
        </div>
        <div 
          className="role-button" 
          onClick={() => handleRoleSelect('Faculty')}
        >
          <span>Faculty</span>
        </div>
        <div 
          className="role-button" 
          onClick={() => handleRoleSelect('Alumni')}
        >
          <span>Alumni</span>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
