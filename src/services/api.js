import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // Replace with your backend URL
});

export const sendFriendRequest = (fromUserId, toUserId) => {
  return api.post('/users/send-friend-request', { fromUserId, toUserId });
};

export const getFriendRequests = (userId) => {
  return api.get(`/users/friend-requests/${userId}`);
};

export const acceptFriendRequest = (requestId) => {
  return api.post(`/users/accept-friend-request/${requestId}`);
};

export const rejectFriendRequest = (requestId) => {
  return api.post(`/users/reject-friend-request/${requestId}`);
};

export const getFriendsList = (userId) => {
  return api.get(`/users/friends/${userId}`);
};

export default api;
