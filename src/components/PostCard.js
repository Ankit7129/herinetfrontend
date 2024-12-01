import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaComment, FaShare, FaBookmark, FaRegBookmark, FaTrashAlt } from "react-icons/fa";
import './PostCard.css';
const PostCard = ({ post, user, handleImageClick, handleAuthorClick, handleToggleAction, handleCommentToggle, handleDeletePost, handleCommentSubmit, handleDeleteComment, visibleComments, comments, setComments, shareLinks,handleJoinRequest }) => {
  const [showModal, setShowModal] = useState(false);
  const [fullImage, setFullImage] = useState("");
  const [requestError, setRequestError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");


  
  // Handle the profile image modal
  const handleImageClickModal = (imageUrl) => {
    setFullImage(imageUrl);
    setShowModal(true);
  };


 

  // Handle close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };
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
  
  // Render project details
  const renderProjectDetails = (projectDetails, postId) => {
    return (
      projectDetails && (
        <div className="project-details">
          <h4><strong>Project Title:</strong> {projectDetails.title}</h4>
          <p><strong>Skills Required:</strong> {projectDetails.skillsRequired.join(', ')}</p>
          <p><strong>Estimated Duration:</strong> {projectDetails.estimatedDuration}</p>
          <p><strong>Team Size:</strong> {projectDetails.teamSize}</p>
          
          {/* Render Attachments with a fixed 16:9 ratio */}
          <div className="attachment-container">
            {renderAttachments(projectDetails.attachments)}
          </div>
  
          {/* Add the Request to Join Button */}
          <button onClick={() => handleJoinRequest(postId)}>Request to Join</button>
        </div>
      )
    );
  };
  

  
  return (
    <div key={post._id} className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <img
          src={post.author.profile.profileImageUrl}
          alt="Profile"
          className="profile-pic"
          onClick={() => handleImageClickModal(post.author.profile.profileImageUrl)}
        />
        {/* Modal for Full Image */}
        {showModal && (
          <div className="modal" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <img src={fullImage} alt="Full View" className="full-image" />
              <button className="close-button" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        )}
        <div className="header-details">
  <div className="name-date">
    <h3 onClick={() => handleAuthorClick(post.author._id)}>{post.author.name}</h3>
    <p className="post-date">{new Date(post.createdAt).toLocaleDateString()}</p>
  </div>
  <p>{post.author.college} - {post.author.role}</p>
  <p className="post-id">Post ID: {post._id}</p>
</div>

      </div>

     {/* Post Content */}
<div className="post-content">
  <h4><strong>Description:</strong> {post.content}</h4>
  
  {/* Render Attachments */}
  <div className="attachments-container">
    {renderAttachments(post.media)}
  </div>
  
  {/* Render Project Details */}
  <div className="project-details-container">
    {renderProjectDetails(post.projectDetails, post._id)}
  </div>
</div>


      {/* Engagement Stats */}
      <div className="engagement-stats">
        <p>Likes: {post.likeCount} | Comments: {post.commentCount} | Shares: {post.shareCount}  | Saves: {post.saveCount}</p>
      </div>


      {/* Post Actions */}
      <div className="post-actions">
        <button onClick={() => handleToggleAction('like', post._id)}>{post.likedByCurrentUser ? <FaHeart color="red" /> : <FaRegHeart />}</button>
        <button onClick={() => handleCommentToggle(post._id)}> <FaComment /> </button>
        <button onClick={() => handleToggleAction('share', post._id)}><FaShare /></button>
        <button onClick={() => handleToggleAction('save', post._id)}>{post.savedByCurrentUser ? <FaBookmark /> : <FaRegBookmark />}</button>
        {user.id === post.author._id && (<button onClick={() => handleDeletePost(post._id)}><FaTrashAlt /> </button>)}
      </div>

      {/* Display share link if available */}
      {shareLinks[post._id] && (
        <div className="share-link">
          <p>Share this link: <a href={shareLinks[post._id]} target="_blank" rel="noopener noreferrer">{shareLinks[post._id]}</a></p>
        </div>
      )}

      {/* Comment Section */}
      {visibleComments[post._id] && (
        <div className="comments-section">
          {post.comments && post.comments.length > 0 && (
            <div className="comments-list">
              {post.comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <p><strong>{comment.commenter.name}</strong>: {comment.content}</p>
                  {(user.id === comment.commenter._id || user.id === post.author._id) && (
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
      )}
    </div>
  );
};

export default PostCard;
