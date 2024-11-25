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
import PostManagement from "./pages/PostManagement";


import PostFeedPage from "./pages/PostFeedPage";
import CreatePostPage from "./pages/CreatePostPage"; 

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
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/connexion" element={<ConnexionListPage />} />
            <Route path="/projects/suggestions" element={<SuggestedProjects />} />
            <Route path="/projects/join" element={<JoinProject />} />
            <Route path="/group-chat/:projectId" element={<GroupChatPage />} />
            <Route path="/chat/:userId" element={<ChatPage />} />
            <Route path="/messages" element={<MessageManagementPage />} />
            <Route path="/select-role" element={<RoleSelectionPage />} />
            <Route path="/post-management" element={<PostManagement />} />
            <Route path="/create-post" element={<CreatePostPage />} />
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
