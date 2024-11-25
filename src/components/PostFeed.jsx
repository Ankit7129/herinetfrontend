import React, { useState, useEffect } from 'react';
import postService from '../services/postService';
import PostItem from './PostItem';
import Pagination from './Pagination';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await postService.fetchFeed({ page });
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
    fetchPosts();
  }, [page]);

  return (
    <div>
      {posts.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default PostFeed;
