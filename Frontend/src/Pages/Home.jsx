import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, List, Pencil, Trash2 } from 'lucide-react';
import UserProfileMenu from '../Components/Profilepic'
const API = import.meta.env.VITE_API;
export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    axios.get(`${API}/home`, { withCredentials: true })
      .then(res => {
        setUser(res.data.user);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch user data');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col items-center justify-center px-6 relative">
      {user && <UserProfileMenu user={user} setUser={setUser} />}

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-14 mb-10">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 text-center tracking-wide">
          <span className='text-blue-500'>T</span>ask<span className='text-red-600'>V</span>erse
          <span
            className="block h-1.5 w-32 rounded-full mt-2 mx-auto"
            style={{
              background:
                'linear-gradient(to right, blue 0%, blue 45%, red 55%, red 100%)',
            }}
          ></span>
        </h1>
        <h2 className='text-xl font-bold text-gray-900 mb-4 text-center tracking-wide'>A Smart Management App</h2>


        {error && (
          <p className="text-red-500 text-center mb-6">{error}</p>
        )}

        {user ? (
          <p className="text-center text-xl mb-12 max-w-xl mx-auto">

            Welcome, <span className="font-semibold">{user.fullName}</span>! Manage your daily tasks efficiently and boost your productivity.
          </p>
        ) : (
          <p className="text-center text-xl mb-12 max-w-xl mx-auto">Loading user info...</p>
        )}
      </div>

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <button
            onClick={() => handleNavigate('/create')}
            className="flex flex-col items-center justify-center gap-3 bg-blue-700 hover:bg-blue-800 text-white text-2xl font-semibold py-5 rounded-2xl shadow-lg hover:shadow-2xl transition"
          >
            <Plus size={28} />
            <span>Create Task</span>
          </button>

          <button
            onClick={() => handleNavigate('/view')}
            className="flex flex-col items-center justify-center gap-3 bg-green-700 hover:bg-green-800 text-white text-2xl font-semibold py-5 rounded-2xl shadow-lg hover:shadow-2xl transition"
          >
            <List size={28} />
            <span>View Tasks</span>
          </button>

          <button
            onClick={() => handleNavigate('/edit')}
            className="flex flex-col items-center justify-center gap-3 bg-yellow-600 hover:bg-yellow-700 text-white text-2xl font-semibold py-5 rounded-2xl shadow-lg hover:shadow-2xl transition"
          >
            <Pencil size={28} />
            <span>Update Task</span>
          </button>

          <button
            onClick={() => handleNavigate('/delete')}
            className="flex flex-col items-center justify-center gap-3 bg-red-700 hover:bg-red-800 text-white text-2xl font-semibold py-5 rounded-2xl shadow-lg hover:shadow-2xl transition"
          >
            <Trash2 size={28} />
            <span>Delete Task</span>
          </button>
        </div>
      </div>
    </div>
  );
}
