import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBullhorn,
  faBook,
  faBriefcase,
  faBell,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

const Header = ({ userDetails }) => {
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [logo, setLogo] = useState(null);
  const navigate = useNavigate();
  const { token, user } = userDetails || {};

  // Detect scroll direction to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down and past a threshold
        setHeaderVisible(false);
      } else {
        // Scrolling up
        setHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Fetch the logo
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/manage-welcome-page/images`
        );
        const data = await response.json();
        setLogo(data.logo);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);


  const handleNavigation = (path) => {
    navigate(path, { state: userDetails });
  };

  return (
    <header className={`header ${isHeaderVisible ? "visible" : "hidden"}`}>
      <div className="logo">
        {logo && <img src={logo} alt="Logo" />}
        <h1>Heritage Group Of Institutions</h1>
      </div>
      <nav className="nav-menu">
        <button onClick={() => handleNavigation("/post-feed")}>
          <FontAwesomeIcon icon={faHome} /> Home
        </button>
        <button onClick={() => handleNavigation("/*")}>
          <FontAwesomeIcon icon={faBullhorn} /> Announcements
        </button>
        <button onClick={() => handleNavigation("/library")}>
          <FontAwesomeIcon icon={faBook} /> Library
        </button>
        <button onClick={() => handleNavigation("/opportunities")}>
          <FontAwesomeIcon icon={faBriefcase} /> Opportunities
        </button>
        <button onClick={() => handleNavigation("/notifications")}>
          <FontAwesomeIcon icon={faBell} /> Notifications
        </button>
      </nav>
      
    </header>
  );
};

export default Header;
