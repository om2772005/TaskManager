import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import UserProfileMenu from '../Components/Profilepic';
import { useNavigate } from 'react-router-dom';
const API = import.meta.env.VITE_API;
const View = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('dueDateAsc');
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    axios.get(`${API}/home`, { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(err => setError(err.response?.data?.message || 'Failed to fetch user data'));
  }, []);
  useEffect(() => {
    setTasks([]);
    setPage(1);
    setHasMore(true);
  }, [sortOption]);
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/view`, {
          params: {
            page,
            limit,
            sort: sortOption,
          },
          withCredentials: true
        });

        const newTasks = res.data.tasks || [];

        setTasks(prevTasks => {
          const existingIds = new Set(prevTasks.map(t => t._id));
          const filteredNewTasks = newTasks.filter(t => !existingIds.has(t._id));
          return [...prevTasks, ...filteredNewTasks];
        });

        setHasMore((tasks.length + newTasks.length) < res.data.total);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, [page, sortOption]);
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || loading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setPage(prevPage => prevPage + 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading, hasMore]);

  const filteredTasks = tasks.filter(task => {
    const term = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term)
    );
  });

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div
      ref={containerRef}
      style={{ height: '100vh', overflowY: 'auto' }}
      className="bg-gradient-to-br from-blue-100 to-white flex flex-col items-center justify-start px-4 py-10 relative"
    >
      {user && <UserProfileMenu user={user} setUser={setUser} />}

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 mb-6">

        <button
          onClick={handleBack}
          className="mb-6 text-blue-700 font-semibold px-4 py-2 rounded-xl border border-blue-700 hover:bg-blue-700 hover:text-white transition"
        >
          ← Back
        </button>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Tasks</h2>
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-8 flex justify-center gap-4">
          <label htmlFor="sort" className="font-semibold text-gray-700 self-center">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="dueDateAsc">Due Date ↑ (Ascending)</option>
            <option value="dueDateDesc">Due Date ↓ (Descending)</option>
            <option value="priorityHighLow">Priority High → Low</option>
            <option value="priorityLowHigh">Priority Low → High</option>
          </select>
        </div>

        {error && (
          <p className="text-center text-red-500 text-lg">{error}</p>
        )}

        {filteredTasks.length === 0 && !loading && (
          <p className="text-center text-gray-500 text-lg">No tasks found.</p>
        )}

        <div className="space-y-6">
          {filteredTasks.map(task => (
            <div
              key={task._id}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/update/${task._id}`)}
            >
              <h3 className="text-xl font-semibold text-blue-700">{task.title}</h3>
              <p className="text-gray-700 mt-2">{task.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="bg-blue-100 px-3 py-1 rounded-full">
                  <strong>Status:</strong> {task.status}
                </span>
                <span className="bg-green-100 px-3 py-1 rounded-full">
                  <strong>Priority:</strong> {task.priority}
                </span>
                <span className="bg-yellow-100 px-3 py-1 rounded-full">
                  <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <p className="text-center text-gray-500 text-lg mt-6">Loading more tasks...</p>
        )}

        {!hasMore && (
          <p className="text-center text-gray-500 text-lg mt-6">No more tasks to load.</p>
        )}

      </div>
    </div>
  );
};

export default View;
