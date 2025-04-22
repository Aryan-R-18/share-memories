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
app.use(cors({
  origin: process.env.CORS_ORIGIN,  // Load origin from .env
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// MongoDB Schema and Model
const memorySchema = new mongoose.Schema({
  name: String,
  likes: String,
  regret: String,
  memories: String,
  timestamp: { type: Date, default: Date.now }
});

const Memory = mongoose.model('Memory', memorySchema);

// API Routes

// POST - Add a new memory
app.post('/api/memories', async (req, res) => {
  const { name, likes, regret, memories } = req.body;

  const newMemory = new Memory({ name, likes, regret, memories });

  try {
    await newMemory.save();
    res.status(201).json({ message: 'Memory submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error submitting memory' });
  }
});

// GET - Retrieve all memories
app.get('/api/memories', async (req, res) => {
  try {
    const memories = await Memory.find().sort({ timestamp: -1 }); // Newest first
    res.status(200).json(memories);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error fetching memories' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
