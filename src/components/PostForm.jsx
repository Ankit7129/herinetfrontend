import React, { useState } from 'react';
import postService from '../services/postService';

const PostForm = ({ onSubmit, initialData = {} }) => {
  const [content, setContent] = useState(initialData.content || '');
  const [category, setCategory] = useState(initialData.category || '');
  const [tags, setTags] = useState(initialData.tags || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { content, category, tags: tags.split(',') };
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your post..." required />
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="">Select Category</option>
        <option value="Announcement">Announcement</option>
        <option value="Discussion">Discussion</option>
        <option value="Idea">Idea</option>
        <option value="Event">Event</option>
        <option value="Achievement">Achievement</option>
        <option value="Help Request">Help Request</option>
      </select>
      <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma-separated)" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default PostForm;
