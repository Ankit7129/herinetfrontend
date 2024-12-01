// src/components/PostActions.js
import React from "react";
import { FaHeart, FaRegHeart, FaComment, FaShare, FaBookmark, FaRegBookmark, FaTrashAlt } from "react-icons/fa";

const PostActions = ({ post, user, handleToggleAction, handleCommentToggle, handleDeletePost }) => (
  <div className="post-actions">
    <button onClick={() => handleToggleAction("like", post._id)}>
      {post.likedByCurrentUser ? <FaHeart color="red" /> : <FaRegHeart />}
    </button>
    <button onClick={() => handleCommentToggle(post._id)}>
      <FaComment />
    </button>
    <button onClick={() => handleToggleAction("share", post._id)}>
      <FaShare />
    </button>
    <button onClick={() => handleToggleAction("save", post._id)}>
      {post.savedByCurrentUser ? <FaBookmark /> : <FaRegBookmark />}
    </button>
    {user.id === post.author._id && (
      <button onClick={() => handleDeletePost(post._id)}>
        <FaTrashAlt />
      </button>
    )}
  </div>
);

export default PostActions;
