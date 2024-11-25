import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import EditProfilePage from './pages/EditProfilePage';  // Assuming you have an EditProfilePage component
import ProfilesPage from "./pages/ProfilesPage";
import ConnexionListPage from "./pages/ConnexionListPage"; // Make sure this is the correct component name
import CreateProjectPage from "./pages/CreateProjectPage";
import SuggestedProjects from "./pages/SuggestedProjects";
import JoinProject from "./pages/JoinProject";
import GroupChatPage from "./pages/GroupChatPage";
import MessageManagementPage from "./pages/MessageManagementPage";
import ChatPage from './pages/ChatPage';
import RoleSelectionPage from './pages/RoleSelectionPage';


const App = () => {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profiles" element={<ProfilesPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/connexion" element={<ConnexionListPage />} /> {/* Updated to connexion */}
        <Route path="/projects/create" element={<CreateProjectPage  />} />
        <Route path="/projects/suggestions" element={<SuggestedProjects t/>} />
        <Route path="/projects/join" element={<JoinProject  />} />      
          <Route path="/group-chat/:projectId" element={<GroupChatPage />} />
          <Route path="/chat/:userId" element={<ChatPage />} />

        <Route path="/messages" element={<MessageManagementPage />} />
        <Route path="/select-role" element={<RoleSelectionPage />} /> {/* New Role Selection Page */}

  


      </Routes>
    </Router>
  );
};

export default App;
