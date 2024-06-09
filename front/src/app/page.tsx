"use client";
import 'tailwindcss/tailwind.css';
import ProfilCard from "@/components/UI/ProfilCard";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PencilIcon, PlusIcon } from '@heroicons/react/solid';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  content: string;
  userId: number;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts');
        const data = await response.json();
        setPosts(data.results);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Blog Posts</h1>
        {isLoggedIn && (
          <div className="absolute top-16 right-0 m-4">
            <Link href={`/post/create`}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center">
                <PlusIcon className="h-6 w-6 mr-1" />
                Add Post
              </button>
            </Link>
          </div>
        )}
        <div className="flex justify-center flex-wrap">
        {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="max-w-sm bg-white rounded-lg overflow-hidden shadow-lg m-4 hover:shadow-xl transition-shadow duration-300 relative">
                <Link href={`/post/${post.id}`}>
                  <ProfilCard post={post} />
                </Link>
                {userId === post.userId && (
                  <div className="absolute top-0 right-0 m-4">
                    <Link href={`/post/edit/${post.id}`}>
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                        <PencilIcon className="h-6 w-6 text-white" />
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600">No posts found</div>
          )}
        </div>
      </div>
    </div>
  );
}
