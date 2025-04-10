const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./db');
const timeout = require('connect-timeout');
const config = require('./config');

// Route imports 
const finance = require('./routes/finance');
const index = require('./routes/index');

const errorHandler = require('./middleware/errors');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"]
    }
  }
}));

// Configure CORS
app.use(cors({
  origin: config.allowed_origins || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());

// Logging configuration
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger('combined'));
}

// Middleware to timeout after 30 seconds
app.use(timeout(config.request_timeout));
app.use((req, res, next) => {
    if (!req.timedout) next();
});

// Initialize database connection
(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
})();

// API routes
app.use('/api/finance', finance);
app.use('/api', index);
app.use('/', (req, res) => {
  res.json({status: 'successful', message: 'Welcome to XYRA API', data: null });
});

// Error handling
app.use(errorHandler);

module.exports =  app;
