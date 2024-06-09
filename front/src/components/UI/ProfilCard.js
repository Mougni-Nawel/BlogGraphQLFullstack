import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { DELETEPOST } from '@/graphql/mutations';
import client from '@/apollo-client';

const ProfilCard = ({ post }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  
  const [deletePost, { data }] = useMutation(DELETEPOST, { client });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (token) {
      setIsLoggedIn(true);
    }
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }
  }, []);

  const handleDelete = async () => {
    try {
      const { data } = await deletePost({ variables: { id: post.id } });
      if (data.deletePost.success) {
        window.location = '/';
      } else {
        console.error('Failed to delete the post:', data.deletePost.message);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <img className="h-64 w-full object-cover" src={post.image} alt={post.title} />
      <div className="p-6">
        <div className="flex justify-between items-center">
          <div className="font-bold text-2xl mb-2 text-gray-800">{post.title}</div>
          {isLoggedIn && userId === post.userId && (
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 font-bold"
            >
              Delete
            </button>
          )}
        </div>
        <p className="text-gray-600 text-base">{post.content}</p>
      </div>
    </div>
  );
};

export default ProfilCard;
