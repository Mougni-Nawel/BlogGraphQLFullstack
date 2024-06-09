'use client';

import { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import client from '@/apollo-client';
import { SAVECOMMENT } from "@/graphql/mutations";
import { GETCOMMENTS } from "@/graphql/queries";
import ProfilCard from "@/components/UI/ProfilCard";
require('dotenv').config()

export default function PostDetails() {
  const [post, setPost] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [id, setId] = useState(null);

  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [postId, setPostId] = useState('');

  const [saveComment, { data }] = useMutation(SAVECOMMENT, { client });

  useEffect(() => {
    const url = window.location.pathname;
    const postId = url.split('/').pop();
    setId(postId);
    setPostId(postId);

    const token = localStorage.getItem('token');
    if (token) {
      const user = localStorage.getItem('userId');
      setUserId(user);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/posts/${id}`);
          const data = await response.json();
          setPost(data.results);
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      };

      fetchPost();
    }
  }, [id]);

  const { data: commentsData, loading, error } = useQuery(GETCOMMENTS, {
    variables: { postId },
    client,
  });

  if (!post) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const comments = commentsData?.getComments || [];

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await saveComment({ variables: { content, userId, postId } });
      location.reload();
    } catch (error) {
      console.error('Error :', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-3xl mx-auto">
          <ProfilCard post={post} />
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Comments</h2>
            <ul className="mt-4 space-y-4">
              {comments.map((comment) => (
                <li key={comment.id} className="border-b pb-2">
                  <strong className="block text-lg text-gray-700">{comment.username}</strong>
                  <p className="mt-1 text-gray-600">{comment.content}</p>
                </li>
              ))}
            </ul>
            {isLoggedIn && (
              <form onSubmit={handleAddComment} className="mt-6">
                <div>
                  <label htmlFor="newComment" className="block text-sm font-medium text-gray-700">
                    Add a new comment
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 p-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
                  ></textarea>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Comment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
