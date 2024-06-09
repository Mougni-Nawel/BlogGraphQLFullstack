'use client';
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import '@/assets/css/global.css';
import Link from "next/link";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.location.reload();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);


  return (
    <header className="bg-gray-800 text-white py-4 flex justify-center items-center">
      <div className="max-w-screen-xl w-full flex justify-between items-center px-4">
        <div className="flex items-center">
          <a href="/" className="mr-4">
            Home
          </a>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleSearch}
            className="mr-4 focus:outline-none"
            aria-label="Search"
          >
            <FaSearch className="text-white text-lg" />
          </button>
          {isSearchOpen && (
            <input
              type="text"
              className="rounded bg-gray-700 px-3 py-1 text-white focus:outline-none"
              placeholder="Search..."
            />
          )}
        </div>
        <div className="flex items-center">
        {!isLoggedIn && (
          <Link href={`/auth`}>
            <button className="mr-4">Login</button>
          </Link>
        )}
          {isLoggedIn && (
          <button onClick={handleLogout}>Logout</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
