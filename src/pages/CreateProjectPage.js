import React, { useState } from "react";
import axios from "axios";

const CreateProject = ({ token }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    tags: "",
  });
  const [responseMessage, setResponseMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/projects/create",
        { ...formData, tags: formData.tags.split(",") },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResponseMessage(response.data.message);
    } catch (error) {
      setResponseMessage(error.response?.data?.message || "Error creating project.");
    }
  };

  return (
    <div>
      <h2>Create Project</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleInputChange} required />
        <textarea name="description" placeholder="Description" onChange={handleInputChange} required />
        <input name="requiredSkills" placeholder="Required Skills (comma-separated)" onChange={handleInputChange} />
        <input name="tags" placeholder="Tags (comma-separated)" onChange={handleInputChange} />
        <button type="submit">Create</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default CreateProject;
