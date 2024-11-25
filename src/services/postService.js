import axios from 'axios';

const API_URL = 'http://localhost:5000/posts';

const postService = {
  fetchFeed: (params) => axios.get(`${API_URL}/feed`, { params }),
  createPost: (data) => axios.post(`${API_URL}/create`, data),
  likePost: (postId) => axios.post(`${API_URL}/like/${postId}`),
  unlikePost: (postId) => axios.post(`${API_URL}/unlike/${postId}`),
  fetchPost: (postId) => axios.get(`${API_URL}/${postId}`),
  editPost: (postId, data) => axios.put(`${API_URL}/edit/${postId}`, data),
  deletePost: (postId) => axios.delete(`${API_URL}/delete/${postId}`),
  addComment: (postId, content) => axios.post(`${API_URL}/comment/${postId}`, { content }),
  deleteComment: (postId, commentId) => axios.delete(`${API_URL}/comment/delete/${postId}/${commentId}`),
};

export default postService;
