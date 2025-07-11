import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Pool } from 'pg';
import Redis from 'ioredis';
import dotenv from 'dotenv-safe';
import jwt from 'jsonwebtoken';
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const server = createServer(app);

// Database connections
const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const redis = new Redis(process.env.REDIS_URL);

// Middleware Stack
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json({ limit: '10kb' }));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

// Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    await Promise.all([
      dbPool.query('SELECT 1'),
      redis.ping()
    ]);
    res.json({
      status: 'healthy',
      database: 'connected',
      redis: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// API Routes (with rate limiting)
import apiRouter from './routes/apiRoutes.js';
app.use('/api', apiLimiter, apiRouter);

// Static Frontend Files (in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
  });
}

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(`[${req.method}] ${req.path} - ${err.message}`);
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error' 
  });
});

// Server Startup
const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    // Test database connections
    await Promise.all([
      dbPool.query('SELECT 1'),
      redis.ping()
    ]);
    
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful Shutdown
const shutdown = async () => {
  logger.info('Shutting down gracefully...');
  await Promise.all([
    dbPool.end(),
    redis.quit()
  ]);
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();
