import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserProfileMenu from '../Components/Profilepic';
const API = import.meta.env.VITE_API;


const Delete = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 5; 
  const [hasMore, setHasMore] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');

  const containerRef = useRef(null);
  const navigate = useNavigate();


  const [selectedTask, setSelectedTask] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    axios.get(`${API}/home`, { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/view`, {
          params: { page, limit },
          withCredentials: true,
        });

        setTasks(prev => {
          const prevIds = new Set(prev.map(t => t._id));
          const newTasks = res.data.tasks.filter(t => !prevIds.has(t._id));
          return [...prev, ...newTasks];
        });

        if (res.data.tasks.length < limit) {
          setHasMore(false);
        }

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, [page]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTasks(tasks);
      return;
    }
    const lower = searchTerm.toLowerCase();
    setFilteredTasks(
      tasks.filter(
        t =>
          t.title.toLowerCase().includes(lower) ||
          t.description.toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, tasks]);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current || loading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setPage(prev => prev + 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', onScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', onScroll);
      }
    };
  }, [loading, hasMore]);
  const handleDeleteClick = (task) => {
    setSelectedTask(task);
    setShowConfirmModal(true);
  };

  const handleCancelDelete = () => {
    setSelectedTask(null);
    setShowConfirmModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API}/delete/${selectedTask._id}`, { withCredentials: true });
      setTasks(tasks.filter(t => t._id !== selectedTask._id));
      setFilteredTasks(filteredTasks.filter(t => t._id !== selectedTask._id));
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete task');
      setShowConfirmModal(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleBack = () => navigate(-1);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col items-center px-4 py-8 relative overflow-y-auto"
      style={{ height: '100vh' }}
    >
      {user && (
        <div>
          <UserProfileMenu user={user} setUser={setUser} />
        </div>
      )}

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-10 flex flex-col">

        <button
          onClick={handleBack}
          className="mb-6 text-blue-700 font-semibold px-4 py-2 rounded-xl border border-blue-700 hover:bg-blue-700 hover:text-white transition self-start"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Delete Your Tasks
        </h1>
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="mb-6 w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {error && (
          <p className="text-center mt-6 text-red-500 font-semibold">{error}</p>
        )}

        {filteredTasks.length === 0 && !loading && !error && (
          <p className="text-gray-600 italic text-lg text-center">
            No tasks found. Try a different search or create one!
          </p>
        )}

        <div className="space-y-6">
          {filteredTasks.map(task => (
            <div
              key={task._id}
              className="bg-red-50 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-red-100 transition"
            >
              <div className="flex-1 w-full sm:w-auto" onClick={() => navigate(`/update/${task._id}`)}>
                <h2 className="text-xl font-semibold text-red-900 break-words">{task.title}</h2>
                <p className="text-red-800 mt-1 break-words">{task.description}</p>
                <p className="mt-3 text-red-700 text-sm whitespace-normal">
                  <span className="font-medium">Due:</span> {new Date(task.dueDate).toLocaleDateString()} &nbsp;|&nbsp;
                  <span className="font-medium">Priority:</span> {task.priority} &nbsp;|&nbsp;
                  <span className="font-medium">Status:</span> {task.status}
                </p>
              </div>

              <button
                onClick={() => handleDeleteClick(task)}
                className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {loading && (
          <p className="text-center mt-6 text-red-600 font-semibold">Loading more tasks...</p>
        )}

        {!hasMore && tasks.length > 0 && (
          <p className="text-center mt-6 text-gray-500">No more tasks to load.</p>
        )}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-xl text-center w-80">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Are you sure?</h3>
            <p className="mb-6">Do you really want to delete <strong>{selectedTask?.title}</strong>? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-xl text-center w-80">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Task Deleted Successfully!</h3>
            <button
              onClick={handleCloseSuccessModal}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Delete;
