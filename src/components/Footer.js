import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch, faPlus, faComments, faHeart, faFileAlt, faBars, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import "./Footer.css"; // Ensure you have styles for the footer

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-icons">
        <FontAwesomeIcon icon={faHome} title="Home" />
        <FontAwesomeIcon icon={faSearch} title="Search" />
        <FontAwesomeIcon icon={faPlus} title="Add" />
        <FontAwesomeIcon icon={faComments} title="Messages" />
        <FontAwesomeIcon icon={faHeart} title="Favorites" />
        <FontAwesomeIcon icon={faFileAlt} title="Files" />
        <FontAwesomeIcon icon={faBars} title="Menu" />
        <FontAwesomeIcon icon={faQuestionCircle} title="Help" />
      </div>
    </footer>
  );
};

export default Footer;
