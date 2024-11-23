import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const GroupChatPage = () => {
  const { projectId } = useParams(); // Get project ID from URL
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch messages for the specific project
    const token = localStorage.getItem("token");

    axios
      .get(`/api/projects/${projectId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMessages(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Failed to load messages");
        setIsLoading(false);
      });
  }, [projectId]);

  const handleSendMessage = async () => {
    if (!newMessage) return;

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `http://localhost:5000//api/projects/messages/${projectId}`,
        { content: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage(""); // Clear input field
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="group-chat-container">
      <h2>Group Chat for Project</h2>
      {error && <p className="error">{error}</p>}

      <div className="messages-list">
        {isLoading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p>No messages yet. Be the first to send a message!</p>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="message-card">
              <p>
                <strong>{message.sender.name}</strong>: {message.content}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="message-input">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        ></textarea>
        <button onClick={handleSendMessage}>Send</button>
      </div>

      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
};

export default GroupChatPage;
