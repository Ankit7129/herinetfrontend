import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Importing pages
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import EditProfilePage from './pages/EditProfilePage';
import ProfilesPage from "./pages/ProfilesPage";
import ConnexionListPage from "./pages/ConnexionListPage";
import SuggestedProjects from "./pages/SuggestedProjects";
import JoinProject from "./pages/JoinProject";
import GroupChatPage from "./pages/GroupChatPage";
import MessageManagementPage from "./pages/MessageManagementPage";
import ChatPage from './pages/ChatPage';
import RoleSelectionPage from './pages/RoleSelectionPage';

import ProfileDetailPage from './pages/ProfileDetailPage';

import PostFeedPage from "./pages/PostFeedPage";
import CreatePostPage from "./pages/CreatePostPage";
import CreateProjectPage from "./pages/CreateProjectPage"; // Import the new component


import io from 'socket.io-client';

// Connect to the Socket.io server
const socket = io('http://localhost:3000'); // Replace with your server URL

// Join a specific project room (based on project ID)
const projectId = '12345'; // Example project ID
socket.emit('join_room', projectId);

// Listen for incoming messages in the project room
socket.on('receive_message', (message) => {
  console.log('New message:', message);
  // Render the message in your chat UI
});

// Send a message to the server (when user sends a chat message)
const sendMessage = (messageContent) => {
  const messageData = {
    projectId, // The ID of the project (chat room)
    message: messageContent,
    sender: 'User Name', // Replace with actual sender info
    timestamp: new Date().toISOString(),
  };
  socket.emit('send_message', messageData);
};


const App = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // Basic check for authentication

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profiles" element={<ProfilesPage />} />
            <Route path="/profile/:userId" element={<ProfileDetailPage />} />

            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/connexion" element={<ConnexionListPage />} />
            <Route path="/projects/suggestions" element={<SuggestedProjects />} />
            <Route path="/projects/join" element={<JoinProject />} />
            <Route path="/group-chat/:projectId" element={<GroupChatPage />} />
            <Route path="/chat/:userId" element={<ChatPage />} />
            <Route path="/messages" element={<MessageManagementPage />} />
            <Route path="/select-role" element={<RoleSelectionPage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/create-project" element={<CreateProjectPage />} /> {/* New route */}

            <Route path="/post-feed" element={<PostFeedPage />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
