import React, { useState } from 'react';
import postService from '../services/postService';

const CommentSection = ({ postId, comments, setComments }) => {
  const [commentContent, setCommentContent] = useState('');

  const handleAddComment = async () => {
    try {
      const { data } = await postService.addComment(postId, commentContent);
      setComments(data.comments);
      setCommentContent('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const { data } = await postService.deleteComment(postId, commentId);
      setComments(data.comments);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className="comment-section">
      <h4>Comments</h4>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>
            <p>{comment.content}</p>
            <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="Add a comment..."
      />
      <button onClick={handleAddComment}>Add Comment</button>
    </div>
  );
};

export default CommentSection;
