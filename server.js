// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(bodyParser.json());

// CORS Configuration
const allowedOrigins = [
  process.env.CORS_ORIGIN, // Ensure this is correctly set in your .env file
  'http://127.0.0.1:5500', // For local development, adjust as needed
  'https://first-year-efqcqo88o-aryan-rs-projects.vercel.app' // Vercel production frontend
];

// CORS Setup
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      console.log(`CORS Error: Origin ${origin} not allowed`); // Log the blocked origin
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allows cookies to be included in requests
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// MongoDB Schema and Model
const memorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  likes: { type: String },
  regret: { type: String },
  memories: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Memory = mongoose.model('Memory', memorySchema);

// Middleware to log incoming requests (for debugging)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// API Routes

// POST - Add a new memory
app.post('/api/memories', async (req, res) => {
  const { name, likes, regret, memories } = req.body;

  // Validate the request body to ensure data integrity
  if (!name || !memories) {
    return res.status(400).json({ error: 'Name and memories are required' });
  }

  const newMemory = new Memory({ name, likes, regret, memories });

  try {
    await newMemory.save();
    res.status(201).json({ message: 'Memory submitted successfully' });
  } catch (err) {
    console.error('Error saving memory:', err);
    res.status(500).json({ error: 'Error submitting memory' });
  }
});

// GET - Retrieve all memories
app.get('/api/memories', async (req, res) => {
  try {
    const memories = await Memory.find().sort({ timestamp: -1 }); // Newest first
    res.status(200).json(memories);
  } catch (err) {
    console.error('Error fetching memories:', err);
    res.status(500).json({ error: 'Error fetching memories' });
  }
});

// GET - Retrieve a specific memory by ID
app.get('/api/memories/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const memory = await Memory.findById(id);
    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    res.status(200).json(memory);
  } catch (err) {
    console.error('Error fetching memory:', err);
    res.status(500).json({ error: 'Error fetching memory' });
  }
});

// Handle preflight OPTIONS request for CORS
app.options('*', cors()); // Enable CORS for preflight requests

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
