import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
//import Button from '@material-ui/core/Button';  // If using Material-UI
import { FaHeart, FaRegHeart, FaComment, FaShare, FaTrashAlt, FaBookmark, FaRegBookmark } from 'react-icons/fa'; // Import icons
import { Button, Card, CardContent, Typography } from "@mui/material";
import './PostFeedPage.css';

const PostFeedPage = () => {
  const location = useLocation();
  const userDetails = location.state;
  const navigate = useNavigate(); // Initialize navigate
  const { user, token } = userDetails || {};


  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [shareLinks, setShareLinks] = useState({}); // New state to store share links
  const [showModal, setShowModal] = useState(false); // Modal for profile image
  const [fullImage, setFullImage] = useState(''); // Full image URL
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
  //console.log(userDetails); // Ensure this has `id`

  // Handle post deletion
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/posts/delete/${postId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPosts(posts.filter(post => post._id !== postId)); // Update local state
    } catch (err) {
      alert('Error deleting post');
    }
  };

  // Handle comment input change
  const handleCommentChange = (postId, content) => {
    setComments((prev) => ({ ...prev, [postId]: content }));
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
        ? { 
            ...post, 
            comments: [...post.comments, newComment], 
            commentCount: post.commentCount + 1 
          }
        : post
      ));
      setComments({ ...comments, [postId]: '' });
    } catch (err) {
      alert('Error submitting comment');
    }
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
                shareCount: response.data.shares ?? post.shareCount,  // Add shareCount update
                likedByCurrentUser:
                  action === 'like' ? !post.likedByCurrentUser : post.likedByCurrentUser,
                savedByCurrentUser:
                  action === 'save' ? !post.savedByCurrentUser : post.savedByCurrentUser,
              }
            : post
        )
      );
  
      // Handle and store share link for the specific post
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
          ? { 
              ...post, 
              comments: post.comments.filter(comment => comment._id !== commentId),
              commentCount: post.commentCount - 1
            }
          : post
      ));
    } catch (err) {
      alert('Error deleting comment');
    }
  };
  // Render media attachments
 const renderAttachments = (attachments) =>
  attachments && attachments.length > 0 ? (
    <div className="attachments-container">
      {attachments.map((item, index) => {
        if (item.type === 'image') {
          return (
            <div key={index} className="attachment-item">
              <img src={item.url} alt={`Attachment ${index}`} className="project-attachment" />
            </div>
          );
        } else if (item.type === 'video') {
          return (
            <div key={index} className="attachment-item">
              <video controls className="project-attachment">
                <source src={item.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          );
        } else {
          return (
            <div key={index} className="attachment-item">
              <p>Unsupported attachment type</p>
            </div>
          );
        }
      })}
    </div>
  ) : null;



     // Show profile image modal
  const handleProfileImageClick = (imageUrl) => {
    setFullImage(imageUrl);
    setShowModal(true);
  };

  // Hide profile image modal
  const closeModal = () => {
    setShowModal(false);
    setFullImage('');
  };

  // Navigate to author's profile
  const handleAuthorClick = (authorId) => {
    navigate(`/profile/${authorId}`);
  };

  const handleJoinRequest = async (postId) => {
    try {
      // Make the POST request to join the project (using postId as projectId)
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/project/request-to-join/${postId}`,  // postId is used here as projectId
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,  // Include the token in the request header
          },
        }
      );
  
      // Log the response message and optionally update state
      console.log(response.data.message);  // Log the message from the backend
  
      // Optionally, set the message in state for showing to the user
      setRequestMessage(response.data.message);  // Store message in state for success message display
      alert(response.data.message);  // Show success message in alert (or you can use a UI component for messages)
      
    } catch (error) {
      // Handle errors and show the error message
      console.error(error);
  
      // Set error message if available from the backend, or default to a general error message
      setRequestError(error.response?.data?.message || 'An error occurred while joining the project.');
      
      // Optionally, show an error message in an alert
      alert(error.response?.data?.message || 'An error occurred while joining the project.');
    }
  };
  
  
  

  


    // Render project details
    const renderProjectDetails = (projectDetails, postId) => {
      return (
        projectDetails && (
          <div className="project-details">
            <h4>Project Title: {projectDetails.title}</h4>
            <p>{projectDetails.description}</p>
            <p><strong>Skills Required:</strong> {projectDetails.skillsRequired.join(', ')}</p>
            <p><strong>Estimated Duration:</strong> {projectDetails.estimatedDuration}</p>
            <p><strong>Team Size:</strong> {projectDetails.teamSize}</p>
            {renderAttachments(projectDetails.attachments)}
    
            {/* Add the Request to Join Button */}
            <button onClick={() => handleJoinRequest(postId)}>Request to Join</button>
          </div>
        )
      );
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

         {/* User Details Section */}
      <Card className="card">
        <CardContent>
          <Typography variant="h4" gutterBottom>Welcome, {user.name}!</Typography>
          <Typography variant="h6" color="textSecondary"><strong>User ID:</strong> {user.id}</Typography>
          <Typography variant="h6" color="textSecondary"><strong>Email:</strong> {user.email}</Typography>
          <Typography variant="h6" color="textSecondary"><strong>Role:</strong> {user.role}</Typography>
          <Typography variant="h6" color="textSecondary"><strong>College:</strong> {user.college}</Typography>
          <Typography variant="h6" color="textSecondary"><strong>Gender:</strong> {user.gender}</Typography>
        </CardContent>
      </Card>
        {/* Create Post and Create Project Buttons */}
        <div className="create-post-button-container" style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button 
            onClick={() => navigate("/create-post", { state: userDetails })}
            className="create-button"
          >
            Create Post
          </button>
          <button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/create-project", { state: userDetails })} // Inline navigate for consistency
            className="create-button"
          >
            Create Project
          </button>
          {/* New View Profiles Button */}
        <button 
          variant="outlined" 
          className="btn" 
          onClick={() => navigate("/profiles")}
        >
          View Profiles
        </button>
        </div>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : posts.length > 0 ? (
        posts.map((post) => (
        
          <div key={post._id} className="post-card">
            
            {/* Post Header */}
            <div className="post-header">
              <img src={post.author.profile.profileImageUrl} alt="Profile" className="profile-pic" 
              onClick={() => handleProfileImageClick(post.author.profile.profileImageUrl)}
              />
              <div className="header-details">
              <h3 onClick={() => handleAuthorClick(post.author._id)}>{post.author.name}</h3>
              <p>{post.author.college} - {post.author.role}</p>
                <p className="post-date">{new Date(post.createdAt).toLocaleDateString()}</p>
                <p className="post-id">Post ID: {post._id}</p> {/* Add this line */}

              </div>
               {/* Modal for full profile image */}
      <div className={`modal ${showModal ? 'show' : ''}`}>
        <div className="modal-content">
          <button className="close-button" onClick={closeModal}>X</button>
          <img src={fullImage} alt="Full profile" className="full-profile-image" />
        </div>
      </div>
            </div>


            {/* Post Content */}
            <div className="post-content">
              <p>{post.content}</p>
              {renderProjectDetails(post.projectDetails , post._id)}
            </div>

            {/* Engagement Stats */}
            <div className="engagement-stats">
              <p>Likes: {post.likeCount} | Comments: {post.commentCount} | Saves: {post.saveCount} | Shares: {post.shareCount}</p>
            </div>

            {/* Post Actions */}
            <div className="post-actions">
              <button onClick={() => handleToggleAction('like', post._id)}>
                {post.likedByCurrentUser ? <FaHeart color="red" /> : <FaRegHeart />}
              </button>
              <button onClick={() => handleCommentSubmit(post._id)}>
                <FaComment />
              </button>
              <button onClick={() => handleToggleAction('share', post._id)}>
                <FaShare />
              </button>
              <button onClick={() => handleToggleAction('save', post._id)}>
                {post.savedByCurrentUser ? <FaBookmark /> : <FaRegBookmark />}
              </button>
              {user.id === post.author._id && (
                <button onClick={() => handleDeletePost(post._id)}>
                  <FaTrashAlt />
                </button>
              )}
            </div>


            {/* Display share link if available */}
            {shareLinks[post._id] && (
              <div className="share-link">
                <p>Share this link: <a href={shareLinks[post._id]} target="_blank" rel="noopener noreferrer">{shareLinks[post._id]}</a></p>
              </div>
            )}

            {/* Comment Section */}
            <div className="comments-section">
            {post.comments && post.comments.length > 0 && (
              <div className="comments-list">
                {post.comments.map((comment) => (
                  <div key={comment._id} className="comment">
                     <p><strong>{comment.commenter.name}</strong>: {comment.content}</p>
          {/* Delete button visible only for comment author or post author */}
          {(userDetails.id === comment.commenter._id || userDetails.id === post.author._id) && (
            <button onClick={() => handleDeleteComment(post._id, comment._id)}>
              Delete
            </button>
          )}
                    </div>
                  ))}
                </div>
              )}
              <textarea
                value={comments[post._id] || ''}
                onChange={(e) => setComments({ ...comments, [post._id]: e.target.value })}
                placeholder="Write a comment..."
              />
              <button onClick={() => handleCommentSubmit(post._id)}>Submit</button>
            </div>
          </div>
        ))
      ) : (
        <div>No posts available.</div>
      )}
      {/* Profile Image Modal */}
      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={fullImage} alt="Full Profile" className="full-profile-image" />
            <button onClick={closeModal} className="close-button">Close</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default PostFeedPage;
