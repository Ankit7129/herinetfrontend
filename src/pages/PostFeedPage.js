import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';


import './PostFeedPage.css';

const PostFeedPage = () => {
  const location = useLocation();
  const userDetails = location.state;
  const navigate = useNavigate(); // Initialize navigate

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [shareLinks, setShareLinks] = useState({}); // New state to store share links

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
        `http://localhost:5000/posts/comment/delete/${postId}/${commentId}`,
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
        {attachments.map((item, index) => (
          <div key={index} className="attachment-item">
            {item.type === 'image' ? (
              <img src={item.url} alt={`Attachment ${index}`} className="project-attachment" />
            ) : (
              <p>Unsupported attachment type</p>
            )}
          </div>
        ))}
      </div>
    ) : null;

  // Render project details
  const renderProjectDetails = (projectDetails) =>
    projectDetails && (
      <div className="project-details">
        <h4>Project Title: {projectDetails.title}</h4>
        <p>{projectDetails.description}</p>
        <p><strong>Skills Required:</strong> {projectDetails.skillsRequired.join(', ')}</p>
        <p><strong>Estimated Duration:</strong> {projectDetails.estimatedDuration}</p>
        <p><strong>Team Size:</strong> {projectDetails.teamSize}</p>
        {renderAttachments(projectDetails.attachments)}
      </div>
    );

    return (
      <div className="post-feed-container">
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
              <h3>{post.author.name}</h3>
              <p>{post.author.college} - {post.author.role}</p>
              <p>{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Post Content */}
            <div className="post-content">
              <p>{post.content}</p>
              {renderProjectDetails(post.projectDetails)}
            </div>

            {/* Engagement Stats */}
            <div className="engagement-stats">
              <p>Likes: {post.likeCount} | Comments: {post.commentCount} | Saves: {post.saveCount} | Shares: {post.shareCount}</p>
            </div>

            {/* Post Actions */}
            <div className="post-actions">
              <button onClick={() => handleToggleAction('like', post._id)}>
                {post.likedByCurrentUser ? 'Unlike' : 'Like'}
              </button>
              <button onClick={() => handleToggleAction('save', post._id)}>
                {post.savedByCurrentUser ? 'Unsave' : 'Save'}
              </button>
              <button onClick={() => handleToggleAction('share', post._id)}>Share</button>
              <button onClick={() => handleDeletePost(post._id)}>Delete Post</button>
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
    </div>
  );
};

export default PostFeedPage;
