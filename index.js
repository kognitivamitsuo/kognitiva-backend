import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Pool } from 'pg';
import Redis from 'ioredis';
import dotenv from 'dotenv-safe';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração de caminhos para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verificação e importação segura do logger
let logger;
try {
  const loggerModule = await import('./utils/logger.js');
  logger = loggerModule.default || {
    info: console.log,
    error: console.error
  };
} catch (err) {
  console.warn('Logger não encontrado, usando console padrão');
  logger = {
    info: console.log,
    error: console.error,
    warn: console.warn
  };
}

// Carregar variáveis de ambiente
dotenv.config({
  path: path.resolve(__dirname, process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'),
  example: path.resolve(__dirname, '.env.example')
});

// Inicialização do Express
const app = express();
const server = createServer(app);

// Configuração do banco de dados
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { 
    rejectUnauthorized: false,
    ca: process.env.DB_SSL_CA
  } : false
};

const dbPool = new Pool(dbConfig);

// Configuração do Redis
const redis = new Redis(process.env.REDIS_URL, {
  connectTimeout: 5000,
  maxRetriesPerRequest: 1,
  retryStrategy: (times) => {
    if (times > 3) return null;
    return Math.min(times * 100, 5000);
  }
});

// Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting com Redis
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === '127.0.0.1',
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// Rotas
import apiRouter from './routes/apiRoutes.js';
app.use('/api', limiter, apiRouter);

// Health Check
app.get('/health', async (req, res) => {
  try {
    const [db, redis] = await Promise.all([
      dbPool.query('SELECT 1'),
      redis.ping()
    ]);
    
    res.json({
      status: 'healthy',
      services: {
        database: db ? 'connected' : 'disconnected',
        redis: redis === 'PONG' ? 'connected' : 'disconnected'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Error handling
app.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.path} - ${err.stack}`);
  
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Internal Server Error';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Server startup
const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await Promise.all([
      dbPool.query('SELECT 1'),
      redis.ping()
    ]);
    
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async () => {
  logger.info('Starting graceful shutdown...');
  try {
    await Promise.all([
      dbPool.end(),
      redis.quit()
    ]);
    server.close(() => {
      logger.info('Server stopped');
      process.exit(0);
    });
  } catch (err) {
    logger.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();
