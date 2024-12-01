import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Typography } from "@mui/material";
import { FaHeart, FaRegHeart, FaComment, FaShare, FaTrashAlt, FaBookmark, FaRegBookmark } from 'react-icons/fa'; // Import icons
import UserDetailsCard from "../components/UserDetailsCard"; // Import the component
import PostCard from "../components/PostCard"; // Import the PostCard component
import Header from "../components/Header";
import Footer from "../components/Footer";
import './PostFeedPage.css';


const PostFeedPage = () => {
  const location = useLocation();
  const [userDetails, setUserDetails] = useState(() => {
    const storedDetails = JSON.parse(localStorage.getItem("userDetails"));
    return location.state || storedDetails || null;
  });
  
  const navigate = useNavigate(); // Initialize navigate
  const { user, token } = userDetails || {};

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [shareLinks, setShareLinks] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [fullImage, setFullImage] = useState('');
  const [requestError, setRequestError] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');



  
  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/feed`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPosts(response.data.posts);
      } catch (err) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Handle post deletion
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/posts/delete/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      alert('Error deleting post');
    }
  };

  // Submit a comment
  const handleCommentSubmit = async (postId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/comment/${postId}`,
        { content: comments[postId] },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      const newComment = response.data.comment || {
        _id: Date.now(),
        content: comments[postId],
        commenter: { name: 'Unknown User', _id: null },
      };

      setPosts(posts.map(post => post._id === postId
        ? { ...post, comments: [...post.comments, newComment], commentCount: post.commentCount + 1 }
        : post
      ));
      setComments({ ...comments, [postId]: '' });
    } catch (err) {
      alert('Error submitting comment');
    }
  };

  // Toggle comment visibility for a post
  const handleCommentToggle = (postId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Handle like/unlike, save/unsave, and share actions
  const handleToggleAction = async (action, postId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/${action}/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likeCount: response.data.likes ?? post.likeCount,
                saveCount: response.data.saves ?? post.saveCount,
                shareCount: response.data.shares ?? post.shareCount,
                likedByCurrentUser: action === 'like' ? !post.likedByCurrentUser : post.likedByCurrentUser,
                savedByCurrentUser: action === 'save' ? !post.savedByCurrentUser : post.savedByCurrentUser,
              }
            : post
        )
      );

      if (action === 'share' && response.data.shareLink) {
        setShareLinks((prev) => ({ ...prev, [postId]: response.data.shareLink }));
      }
    } catch (err) {
      alert(`Error performing ${action}: ${err.response?.data?.message || err.message}`);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/posts/comment/delete/${postId}/${commentId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPosts(posts.map(post =>
        post._id === postId
          ? { ...post, comments: post.comments.filter(comment => comment._id !== commentId), commentCount: post.commentCount - 1 }
          : post
      ));
    } catch (err) {
      alert('Error deleting comment');
    }
  };

  const handleJoinRequest = async (postId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/project/request-to-join/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setRequestMessage(response.data.message);
      alert(response.data.message);
    } catch (error) {
      setRequestError(error.response?.data?.message || 'An error occurred while joining the project.');
      alert(error.response?.data?.message || 'An error occurred while joining the project.');
    }
  };

  // Navigate to author's profile
  const handleAuthorClick = (authorId) => {
    navigate(`/profile/${authorId}`);
  };

  // Handle opening modal for image
  const handleImageClick = (imageUrl) => {
    setFullImage(imageUrl);
    setShowModal(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/welcome');
  };

  // Ensure that user details and token are present
  if (!userDetails || !token) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>User details or session expired. Please login again.</p>
        <Button variant="contained" onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="post-feed-container">
<Header userDetails={userDetails} />
<UserDetailsCard user={user} />

      <div className="create-post-button-container" style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => navigate("/create-post", { state: userDetails })} className="create-button">Create Post</button>
        <button variant="contained" color="secondary" onClick={() => navigate("/create-project", { state: userDetails })} className="create-button">Create Project</button>
        <button variant="outlined" className="btn" onClick={() => navigate("/profiles")}>View Profiles</button>
        <button variant="contained" color="secondary" onClick={handleLogout} className="logout-button">Logout</button> {/* Added Logout Button */}
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            user={user}
            handleImageClick={handleImageClick}
            handleAuthorClick={handleAuthorClick}
            handleToggleAction={handleToggleAction}
            handleCommentToggle={handleCommentToggle}
            handleDeletePost={handleDeletePost}
            handleCommentSubmit={handleCommentSubmit}
            handleDeleteComment={handleDeleteComment}
            visibleComments={visibleComments}
            comments={comments}
            setComments={setComments}
            shareLinks={shareLinks}
            handleJoinRequest={handleJoinRequest}
          />
        ))
      ) : (
        <div>No posts available.</div>
      )}
      <Footer />
    </div>
  );
};

export default PostFeedPage;
