import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/feed`, {
        params: {
          page: page,
          limit: limit,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Your auth token here
        },
      });

      // Log the response for debugging
      console.log('API Response:', response.data);

      const { posts = [], totalPosts, totalPages } = response.data; // Default posts to an empty array if undefined

      setPosts(posts);
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts when the component mounts or when the page number changes
  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  // Handle pagination clicks
  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <h1>Feed</h1>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div>
          <div>
            {posts.length === 0 ? (
              <p>No posts available.</p>
            ) : (
              posts.map((post) => (
                <div key={post._id} style={{ marginBottom: '20px' }}>
                  <h3>{post.category}</h3>
                  <p>{post.content}</p>
                  <small>By: {post.author?.name}</small> {/* Optional chaining to avoid errors */}
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          <div>
            <button
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
