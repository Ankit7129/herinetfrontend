import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//import "./MessageManagementPage.css";

const MessageManagementPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch user's projects
    fetch(`${process.env.REACT_APP_API_URL}/api/projects/user-projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));
  }, []);

  const fetchMessages = (projectId) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/projects/messages/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages);
        setSelectedProjectId(projectId);
      })
      .catch((err) => console.error(err));
  };

  const sendMessage = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/projects/message/${selectedProjectId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newMessage }),
    })
      .then((res) => res.json())
      .then(() => {
        setNewMessage("");
        fetchMessages(selectedProjectId); // Refresh messages
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", textAlign: "center" }}>
      <h2>Manage Messages</h2>
      <p>Select a project to view or send messages:</p>
      <select
        value={selectedProjectId}
        onChange={(e) => fetchMessages(e.target.value)}
        style={{ marginBottom: "20px" }}
      >
        <option value="">Select Project</option>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>
            {project.title}
          </option>
        ))}
      </select>

      {messages.length > 0 && (
        <div style={{ textAlign: "left", marginTop: "20px" }}>
          <h3>Messages</h3>
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>
                <strong>{msg.sender.name}:</strong> {msg.content}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedProjectId && (
        <div style={{ marginTop: "20px" }}>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here"
            rows="4"
            style={{ width: "100%" }}
          />
          <button onClick={sendMessage} style={{ marginTop: "10px" }}>
            Send Message
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageManagementPage;
