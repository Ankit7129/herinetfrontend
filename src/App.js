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


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profiles" element={<ProfilesPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/connexion" element={<ConnexionListPage />} /> {/* Updated to connexion */}



      </Routes>
    </Router>
  );
};

export default App;
