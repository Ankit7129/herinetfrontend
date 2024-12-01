// src/components/PostHeader.js
import React from 'react';

const PostHeader = ({ post, handleImageClick, handleAuthorClick }) => (
  <div className="post-header">
    <img
      src={post.author.profile.profileImageUrl}
      alt="Profile"
      className="profile-pic"
      onClick={() => handleImageClick(post.author.profile.profileImageUrl)}
    />
    {/* Modal for Full Image */}
    {post.showModal && (
      <div className="modal" onClick={handleCloseModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <img src={post.fullImage} alt="Full View" className="full-image" />
          <button className="close-button" onClick={handleCloseModal}>
            Close
          </button>
        </div>
      </div>
    )}
    <div className="header-details">
      <h3 onClick={() => handleAuthorClick(post.author._id)}>{post.author.name}</h3>
      <p>{post.author.college} - {post.author.role}</p>
      <p className="post-date">{new Date(post.createdAt).toLocaleDateString()}</p>
      <p className="post-id">Post ID: {post._id}</p>
    </div>
  </div>
);

export default PostHeader;
