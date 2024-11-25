import React from 'react';
import postService from '../services/postService';

const PostItem = ({ post }) => {
  const handleLike = async () => {
    try {
      await postService.likePost(post._id);
      alert('Post liked!');
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleUnlike = async () => {
    try {
      await postService.unlikePost(post._id);
      alert('Post unliked!');
    } catch (error) {
      console.error('Failed to unlike post:', error);
    }
  };

  return (
    <div>
      <h3>{post.content}</h3>
      <p>Category: {post.category}</p>
      <p>Likes: {post.likes.length}</p>
      <button onClick={handleLike}>Like</button>
      <button onClick={handleUnlike}>Unlike</button>
    </div>
  );
};

export default PostItem;
