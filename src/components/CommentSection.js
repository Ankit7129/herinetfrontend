// src/components/CommentSection.js
import React from "react";

const CommentSection = ({ post, user, comments, setComments, handleCommentSubmit, handleDeleteComment }) => (
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
);

export default CommentSection;
