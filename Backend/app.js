const express = require('express');
const app = express();
const user = require('./Modules/User');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const Task = require('./Modules/Task')
const dotenv = require("dotenv");
const connectDB = require("./Config/Connect");

dotenv.config();
connectDB();
const JWT_SECRET = process.env.secret;

app.use(cors({
  origin: process.env.host,
  credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.post('/sign', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await user.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'Lax',
    });

    return res.status(201).json({
      message: 'User registered successfully',token,
      user: {
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: existingUser._id }, JWT_SECRET);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'Lax',
    });

    return res.status(200).json({
      message: 'Login successful',token,
      user: {
        fullName: existingUser.fullName,
        email: existingUser.email,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/home', authenticate, async (req, res) => {
  try {
    const userData = await user.findById(req.userId).select('fullName email profilePic');
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.post('/tasks', authenticate, async (req, res) => {
  try {
    const { title, description, dueDate, status, priority } = req.body;
   

    const task = new Task({
        title,
        description,
        dueDate,
        priority,
        status,
      createdBy: req.userId,
    });

    await task.save();
    res.status(201).json({ task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/view', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sortOption = req.query.sort || 'dueDateAsc';
    const search = req.query.search || '';

    const skip = (page - 1) * limit;
    let sortObj = {};
    if (sortOption === 'dueDateAsc') sortObj.dueDate = 1;
    else if (sortOption === 'dueDateDesc') sortObj.dueDate = -1;
    else if (sortOption === 'priorityHighLow') sortObj.priority = -1;
    else if (sortOption === 'priorityLowHigh') sortObj.priority = 1;
    const searchQuery = search ? { title: { $regex: search, $options: 'i' } } : {};
    const filter = { createdBy:req.userId,...searchQuery };
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.json({ tasks, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching task' });
  }
});
app.put('/tasks/:id', async (req, res) => {
  try {
    const updateFields = req.body; 
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ task: updatedTask });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await Task.deleteOne({ _id: id });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
});
app.post('/logout', (req, res) => {
  res.clearCookie('token'); 
  res.status(200).json({ message: 'Logged out successfully' });
});


app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
