import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

const WelcomePage = () => {
  const [logo, setLogo] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track the current image index
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the logo and carousel images from the backend
    const fetchImages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/manage-welcome-page/images");
        const data = await response.json();
        
        setLogo(data.logo);
        setCarouselImages(data.carouselImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    // Only set interval if carouselImages are loaded
    if (carouselImages.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
      }, 10000);

      // Clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [carouselImages]); // Effect depends on carouselImages

  // Function to handle navigation
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <h1>Welcome to Our College Portal</h1>
      </div>

      {/* Display the logo */}
      <div className="logo-container">
        {logo ? (
          <img src={logo} alt="College Logo" className="logo" />
        ) : (
          <p>Loading logo...</p>
        )}
      </div>

      {/* Display carousel images */}
      <div className="carousel-container">
        {carouselImages.length > 0 ? (
          <img
            src={carouselImages[currentImageIndex]}
            alt={`Carousel Image ${currentImageIndex + 1}`}
            className="carousel-image"
          />
        ) : (
          <p>No carousel images available</p>
        )}
      </div>

      {/* Welcome message and navigation buttons */}
      <div className="welcome-message">
        <p>Explore our college portal to get more information about courses, events, and more!</p>
      </div>

      <div className="navigation-buttons">
        <button onClick={() => handleNavigate("/login ")}>get started </button>
      </div>
    </div>
  );
};

export default WelcomePage;
