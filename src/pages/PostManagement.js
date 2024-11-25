import React, { useState, useEffect } from "react";
import axios from "axios";
//import './PostManagement.css';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    content: "",
    category: "",
    tags: [],
    visibility: "Public",
    media: [],
  });
  const [editPost, setEditPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewPost, setViewPost] = useState(null); // To view single post details
  const [comment, setComment] = useState(""); // New comment input

  const categories = ["Announcement", "Discussion", "Idea", "Event", "Achievement", "Help Request"];
  const visibilities = ["Public", "Connections Only", "Custom"];

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/feed`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create post
  const handleCreatePost = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/create`,
        newPost,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPosts([response.data.post, ...posts]);
      setNewPost({ content: "", category: "", tags: [], visibility: "Public", media: [] });
    } catch (error) {
      console.error("Error creating post:", error.response?.data?.message || error.message);
    }
  };

  // Edit post
  const handleEditPost = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/posts/edit/${editPost._id}`,
        editPost,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPosts(posts.map((post) => (post._id === editPost._id ? response.data.post : post)));
      setEditPost(null);
    } catch (error) {
      console.error("Error editing post:", error.response?.data?.message || error.message);
    }
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/posts/delete/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error.response?.data?.message || error.message);
    }
  };

  // Like post
  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/like/${postId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, likes: [...post.likes, response.data.likes] } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error.response?.data?.message || error.message);
    }
  };

  // Unlike post
  const handleUnlikePost = async (postId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/unlike/${postId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPosts(
        posts.map((post) =>
          post._id === postId
            ? { ...post, likes: post.likes.filter((userId) => userId !== response.data.likes) }
            : post
        )
      );
    } catch (error) {
      console.error("Error unliking post:", error.response?.data?.message || error.message);
    }
  };

  // Add a comment
  const handleAddComment = async (postId) => {
    if (!comment.trim()) return;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/comment/${postId}`,
        { content: comment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, comments: response.data.comments } : post
        )
      );
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error.response?.data?.message || error.message);
    }
  };
  

  return (
    <div>
      <h1>Post Management</h1>

      {/* Create Post Form */}
      <div>
        <h2>Create Post</h2>
        <textarea
          placeholder="Write your post..."
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        />
        <select
          value={newPost.category}
          onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button onClick={handleCreatePost}>Post</button>
      </div>

      {/* Post List */}
      <div>
        <h2>Posts</h2>
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          posts.map((post) => (
            <div key={post._id}>
              <h3>{post.category}</h3>
              <p>{post.content}</p>
              <small>By: {post.author.name}</small>
              <div>
                <button onClick={() => handleLikePost(post._id)}>Like ({post.likes.length})</button>
                <button onClick={() => handleUnlikePost(post._id)}>Unlike</button>
                <button onClick={() => setEditPost(post)}>Edit</button>
                <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                <button onClick={() => setViewPost(post)}>View Details</button>
              </div>
              <div>
                <h4>Comments</h4>
                {post.comments.map((comment) => (
                  <p key={comment._id}>{comment.content}</p>
                ))}
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                
                <button onClick={() => handleAddComment(post._id)}>Add Comment</button>
                
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Post Modal */}
      {editPost && (
        <div>
          <h2>Edit Post</h2>
          <textarea
            value={editPost.content}
            onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
          />
          <select
            value={editPost.category}
            onChange={(e) => setEditPost({ ...editPost, category: e.target.value })}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button onClick={handleEditPost}>Save Changes</button>
          <button onClick={() => setEditPost(null)}>Cancel</button>
        </div>
      )}

      {/* View Post Details */}
      {viewPost && (
        <div>
          <h2>Post Details</h2>
          <p>{viewPost.content}</p>
          <p>Category: {viewPost.category}</p>
          <button onClick={() => setViewPost(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default PostManagement;
