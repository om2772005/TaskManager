import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserProfileMenu from '../Components/Profilepic';
import { useNavigate } from 'react-router-dom';
const API = import.meta.env.VITE_API;

const Create = () => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'To-Do',
    priority: 'Medium',
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false); 

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/home`, { withCredentials: true })
      .then(res => {
        setUser(res.data.user);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch user data');
      });
  }, []);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/tasks`, task, { withCredentials: true });
      console.log('Task created:', response.data);
      setTask({
        title: '',
        description: '',
        dueDate: '',
        status: 'To-Do',
        priority: 'Medium',
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error creating task:', error.response?.data?.message || error.message);
      alert('Failed to create task');
    }
  };
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-4 relative">
      {user && <UserProfileMenu user={user} setUser={setUser} />}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-10">
          <button onClick={handleBack} className="mb-6 text-blue-700 font-semibold px-4 py-2 rounded-xl border border-blue-700 hover:bg-blue-700 hover:text-white transition">← Back</button>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create a New Task</h2>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Title</label>
            <input type="text" name="title" value={task.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea name="description" value={task.description} onChange={handleChange} rows="4" required className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Due Date</label>
              <input type="date" name="dueDate" value={task.dueDate} onChange={handleChange} required className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Status</label>
              <select name="status" value={task.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Priority</label>
              <select name="priority" value={task.priority} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow transition">Create Task</button>
          </div>
        </form>
      </div>
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-8 shadow-xl text-center w-80">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Task Created Successfully!</h3>
            <div className="flex flex-col gap-4">
              <button onClick={() => navigate('/home')} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition" > Go Back to Home </button>
              <button onClick={() => navigate('/view')} className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition" >View Your Tasks </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Create;
