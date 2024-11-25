import React, { useState } from "react";
import axios from "axios";

const JoinProject = ({ token }) => {
  const [projectId, setProjectId] = useState("");
  const [role, setRole] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/projects/join/${projectId}`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResponseMessage(response.data.message);
    } catch (error) {
      setResponseMessage(error.response?.data?.message || "Error joining project.");
    }
  };

  return (
    <div>
      <h2>Join a Project</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
        />
        <input
          placeholder="Your Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <button type="submit">Join Project</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default JoinProject;
