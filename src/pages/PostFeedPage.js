import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Favorite, FavoriteBorder, Delete, Comment } from "@mui/icons-material";

const PostFeedPage = () => {
  const location = useLocation();
  const userDetails = location.state;
  const navigate = useNavigate();

  const { token } = userDetails || {};
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/feed`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/posts/delete/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
      alert("Post deleted successfully.");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/posts/like/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, likes: [...post.likes, userDetails.userId] } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnlikePost = async (postId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/posts/unlike/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(
        posts.map((post) =>
          post._id === postId
            ? { ...post, likes: post.likes.filter((id) => id !== userDetails.userId) }
            : post
        )
      );
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const handleAddComment = async (postId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/comment/${postId}`,
        { content: commentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, comments: response.data.comments } : post
        )
      );
      setCommentContent("");
      alert("Comment added successfully.");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment.");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/posts/comment/delete/${postId}/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, comments: response.data.comments } : post
        )
      );
      alert("Comment deleted successfully.");
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment.");
    }
  };

  if (!userDetails) {
    return <p>User details not found. Please log in again.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Post Feed
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/create-post", { state: userDetails })}
      >
        Create your Post
      </Button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        posts.map((post) => (
          <Card key={post._id} style={{ margin: "20px 0" }}>
            <CardContent>
              <Typography variant="h6">
                <strong>{post.author.name}</strong> - {post.category}
              </Typography>
              <Typography variant="body1">{post.content}</Typography>
              {post.media.map((media, index) => (
                <div key={index} style={{ margin: "10px 0" }}>
                  {media.type === "image" ? (
                    <img
                      src={media.url}
                      alt="Post Media"
                      style={{ maxWidth: "100%", borderRadius: "5px" }}
                    />
                  ) : (
                    <video controls style={{ maxWidth: "100%" }}>
                      <source src={media.url} type="video/mp4" />
                    </video>
                  )}
                </div>
              ))}
              <Typography variant="body2" color="textSecondary">
                Tags: {post.tags.join(", ")}
              </Typography>
              <div style={{ margin: "10px 0" }}>
                <IconButton
                  onClick={() =>
                    post.likes.includes(userDetails.userId)
                      ? handleUnlikePost(post._id)
                      : handleLikePost(post._id)
                  }
                >
                  {post.likes.includes(userDetails.userId) ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                {post.likes.length} Likes
                {post.author._id === userDetails.userId && (
                  <IconButton onClick={() => handleDeletePost(post._id)}>
                    <Delete />
                  </IconButton>
                )}
              </div>
              <List>
                {post.comments.map((comment) => (
                  <ListItem key={comment._id}>
                    <ListItemText
                      primary={comment.content}
                      secondary={`By: ${comment.commenter.name}`}
                    />
                    {comment.commenter._id === userDetails.userId && (
                      <IconButton
                        onClick={() => handleDeleteComment(post._id, comment._id)}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </ListItem>
                ))}
              </List>
              <div style={{ marginTop: "10px" }}>
                <TextField
                  label="Add a comment"
                  fullWidth
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddComment(post._id)}
                >
                  Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default PostFeedPage;
