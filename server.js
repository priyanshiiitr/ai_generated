require('dotenv').config();
const express = require('express');
const path = require('path');
const gradingRoutes = require('./routes/grading');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/grade', gradingRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
