const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const workoutPlanRoutes = require('./routes/workoutPlanRoutes');
const workoutCompletionRoutes = require('./routes/workoutCompletionRoutes');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || '*' // In production, use the frontend URL from env or allow all
    : '*', // In development, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Log requests for debugging (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workout-plans', workoutPlanRoutes);
app.use('/api/workout-completions', workoutCompletionRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Any route that is not an API route will be served the React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

// Root API route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to FIT2 API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Set port
const PORT = process.env.PORT || 5001;

// Start server
const startServer = async () => {
  try {
    // In production, don't force sync the database
    // Just connect to it
    if (process.env.NODE_ENV === 'production') {
      await sequelize.authenticate();
      console.log('Database connected...');
    } else {
      // In development, you can choose to sync
      // But be careful with { force: true } as it drops all tables
      await sequelize.sync({ force: false });
      console.log('Database connected and synced...');
    }
    
    // Start server
    app.listen(PORT, process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost', () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Server accessible at http://localhost:${PORT}`);
        console.log(`For other devices on the same network, use your computer's IP address`);
      }
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    
    // If the database doesn't exist, let's try to create it
    if (error.original && error.original.code === '3D000') {
      console.log('Database does not exist. Please create it manually using PostgreSQL commands:');
      console.log(`1. Connect to PostgreSQL: psql -U ${process.env.DB_USER}`);
      console.log(`2. Create the database: CREATE DATABASE ${process.env.DB_NAME};`);
      console.log('3. Exit psql: \\q');
      console.log('4. Then restart this server');
    }
  }
};

startServer(); 