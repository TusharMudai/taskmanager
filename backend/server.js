const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/taskRoutes')); // Updated route

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// General error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Export the app object for testing or start the server
if (require.main === module) {
  connectDB(); // Connect to the database

  // Start the server
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} else {
  console.log('Server loaded as a module.');
}

module.exports = app;