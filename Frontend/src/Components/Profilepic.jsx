import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API = import.meta.env.VITE_API;
export default function profilePic({ user, setUser }) {
  const [showLogout, setShowLogout] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleLogout = async () => {
    try {
      await axios.post(`${API}/logout`, {}, { withCredentials: true });
      setUser(null);
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      alert('Logout failed');
    }
  };
  const profilePicUrl = user?.profilePic && user.profilePic.trim() !== '' 
    ? user.profilePic 
    : 'https://i.pravatar.cc/40';
  return (
    <div ref={dropdownRef} className="absolute top-6 right-6 cursor-pointer">
      <img src={profilePicUrl} alt="Profile" className="w-12 h-12 rounded-full border-2 border-blue-600" onClick={() => setShowLogout(prev => !prev)}/>
      {showLogout && (
        <div className="mt-2 w-32 bg-white rounded-md shadow-lg py-2 absolute right-0 z-50">
          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 transition rounded-md">Logout</button>
        </div>
      )}
    </div>
  );
}
