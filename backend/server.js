const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const { startAutoSync } = require('./services/syncScheduler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'HealthMon API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to HealthMon API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      stats: '/api/stats',
      recentAlerts: '/api/alerts/recent',
      patients: '/api/patients',
      patientById: '/api/patients/:id',
      createPatient: 'POST /api/patients'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');

    // Start server
    app.listen(PORT, () => {
      console.log('');
      console.log('========================================');
      console.log(`🚀 HealthMon API Server is running`);
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: ${process.env.DB_NAME}`);
      console.log('========================================');
      console.log('');
      console.log('Available endpoints:');
      console.log(`  GET  http://localhost:${PORT}/`);
      console.log(`  GET  http://localhost:${PORT}/health`);
      console.log(`  GET  http://localhost:${PORT}/api/stats`);
      console.log(`  GET  http://localhost:${PORT}/api/alerts/recent`);
      console.log(`  GET  http://localhost:${PORT}/api/patients`);
      console.log(`  GET  http://localhost:${PORT}/api/patients/:id`);
      console.log(`  POST http://localhost:${PORT}/api/patients`);
      console.log('');
      
      // Start auto-sync scheduler
      startAutoSync();
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

startServer();

module.exports = app;
