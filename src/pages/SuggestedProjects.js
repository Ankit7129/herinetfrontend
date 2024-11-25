import React, { useEffect, useState } from "react";
import axios from "axios";

const SuggestedProjects = ({ token }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/projects/suggestions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching suggested projects:", error.response?.data?.message);
      }
    };
    fetchProjects();
  }, [token]);

  return (
    <div>
      <h2>Suggested Projects</h2>
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p>Tags: {project.tags.join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedProjects;
