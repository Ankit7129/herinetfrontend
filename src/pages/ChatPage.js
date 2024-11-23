import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
  const { userId } = useParams(); // Get the userId from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Track current logged-in user

  // Fetch current user information from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Assuming user info is stored as a JSON string
    setCurrentUser(user?.id); // Store only the user's ID for comparison
  }, []);

  // Fetch chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/messages/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Log fetched messages for debugging
        console.log("Fetched Messages:", res.data.messages);

        // Normalize sender field to ensure proper comparison
        const normalizedMessages = res.data.messages.map((msg) => ({
          ...msg,
          sender: msg.sender?.toString(), // Ensure sender is always a string
        }));

        setMessages(normalizedMessages || []);
      } catch (err) {
        console.error("Error fetching messages:", err.response ? err.response.data : err.message);
        setError('Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  // Send a new message
  const sendMessage = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/messages/send-message/${userId}`, 
        { content: newMessage }, // Ensure you're sending the correct field name (content)
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Add the newly created message with its ID to the state
      setMessages([
        ...messages, 
        { 
          content: newMessage, 
          sender: currentUser, 
          timestamp: new Date(), 
          _id: res.data.messageId, // Use the messageId returned by the backend
        },
      ]);
      setNewMessage(''); // Clear input after sending
    } catch (err) {
      console.error("Error sending message:", err.response ? err.response.data : err.message);
      setError('Failed to send message');
    }
  };

  // Delete a message
  const deleteMessage = async (messageId) => {
    if (!messageId) {
      setError('No message ID provided');
      return;
    }
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/messages/delete-message/${messageId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages(messages.filter(msg => msg._id !== messageId)); // Remove message from the state
    } catch (err) {
      console.error("Error deleting message:", err.response ? err.response.data : err.message);
      setError('Failed to delete message');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Chat with {userId}</h1>
      <div>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg._id} className={msg.sender === currentUser ? 'sent' : 'received'}>
              <p>
                {msg.sender === currentUser ? 'You' : msg.sender}: {msg.content}
              </p>
              <p>
                <small>
                  {new Date(msg.timestamp).getTime() 
                    ? new Date(msg.timestamp).toLocaleString() 
                    : 'Invalid Date'}
                </small>
              </p>

              {/* Display message ID */}
              {msg._id && (
                <p><small>Message ID: {msg._id}</small></p>
              )}

              {/* Show delete button only if the current user is the sender */}
              {msg.sender === currentUser && (
                <button onClick={() => deleteMessage(msg._id)}>Delete</button>
              )}
            </div>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>
      <div>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
