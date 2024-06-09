"use client";
import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVEPOST } from "@/graphql/mutations";
import { storage } from '@/firebase';
import client from '@/apollo-client';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);

  const [savePost, { data }] = useMutation(SAVEPOST, { client });

  const handleSavePost = async (e) => {
    e.preventDefault();
    let imageUrl = '';
  
    if (image) {
      try {
        const storageRef = storage.ref('images');
        const imageRef = storageRef.child(image.name);
        
        await imageRef.put(image);
        
        imageUrl = await imageRef.getDownloadURL();
      } catch (error) {
        console.error('Error uploading image:', error);
        return;
      }
    }
    
    try {
      const { data: savedData } = await savePost({
        variables: { title, content, image: imageUrl, userId },
      });
  
      console.log('Post saved:', savedData.savePost);
      setTitle('');
      setContent('');
      setImage(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Create New Post</h1>
      <form onSubmit={handleSavePost}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 p-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 p-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Post
          </button>
        </div>
      </form>
    </div>
  );
}
