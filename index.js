'use strict';

// Configuração de aliases deve ser a PRIMEIRA coisa no arquivo
require('module-alias/register');
const path = require('path');
const moduleAlias = require('module-alias');

// Configuração robusta de aliases com verificação
try {
  moduleAlias.addAliases({
    '@root': __dirname,
    '@config': path.join(__dirname, 'src', 'config'),
    '@controllers': path.join(__dirname, 'src', 'controllers'),
    '@services': path.join(__dirname, 'src', 'services'),
    '@routes': path.join(__dirname, 'src', 'routes'),
    '@middleware': path.join(__dirname, 'src', 'middleware'),
    '@models': path.join(__dirname, 'src', 'models'),
    '@utils': path.join(__dirname, 'utils'),
    '@agents': path.join(__dirname, 'src', 'agents')
  });
  
  // Verificação imediata dos aliases
  console.log('✅ Aliases configurados:', moduleAlias.getAliases());
} catch (error) {
  console.error('❌ Falha ao configurar aliases:', error);
  process.exit(1);
}

// Verificação de módulo crítico
try {
  require('@services/iaService');
  console.log('✅ Módulo @services/iaService carregado com sucesso');
} catch (error) {
  console.error('❌ Falha ao carregar módulo crítico:', error);
  process.exit(1);
}

// Importações principais
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');
const Redis = require('ioredis');
const pino = require('pino');
const apiRoutes = require('@routes/apiRoutes');

// Configuração do logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
      ignore: 'pid,hostname'
    }
  }
});

// Inicialização do Express
const app = express();
const PORT = process.env.PORT || 3000;

// Verificação de variáveis de ambiente
const requiredEnvVars = ['DATABASE_URL', 'REDIS_URL', 'JWT_SECRET'];
requiredEnvVars.forEach(env => {
  if (!process.env[env]) {
    logger.fatal(`Variável de ambiente necessária faltando: ${env}`);
    process.exit(1);
  }
});

logger.info(`Iniciando Kognitiva Backend (v${require('./package.json').version})`);
logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
logger.info(`Porta: ${PORT}`);

// Middlewares avançados
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:']
    }
  },
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Conexão com PostgreSQL (com pooling avançado)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { 
    rejectUnauthorized: false,
    ca: process.env.DB_SSL_CA 
  } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  allowExitOnIdle: true
});

pool.on('error', err => {
  logger.error('Erro inesperado no pool do PostgreSQL:', err);
});

// Conexão com Redis (com reconexão automática)
const redis = new Redis(process.env.REDIS_URL, {
  retryStrategy: times => Math.min(times * 100, 5000),
  reconnectOnError: err => {
    logger.warn('Erro no Redis, tentando reconectar:', err.message);
    return true;
  }
});

redis.on('connect', () => logger.info('Conectado ao Redis'));
redis.on('error', err => logger.error('Erro no Redis:', err));

// Health Check aprimorado
const healthCheck = async () => {
  const checks = {
    database: false,
    redis: false,
    memoryUsage: process.memoryUsage().rss / 1024 / 1024 < 500 // Menos de 500MB
  };

  try {
    await pool.query('SELECT 1');
    checks.database = true;
  } catch (err) {
    logger.error('Health Check: Falha no PostgreSQL', err);
  }

  try {
    await redis.ping();
    checks.redis = true;
  } catch (err) {
    logger.error('Health Check: Falha no Redis', err);
  }

  return checks;
};

// Rotas
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    version: require('./package.json').version,
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', async (req, res) => {
  const checks = await healthCheck();
  const isHealthy = Object.values(checks).every(Boolean);
  
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    checks,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Rotas da API
app.use('/api', apiRoutes);

// Tratamento de erros centralizado
app.use((err, req, res, next) => {
  logger.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : err.message;
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Graceful shutdown
const shutdown = async (signal) => {
  logger.info(`Recebido ${signal}, encerrando servidor...`);
  
  try {
    await pool.end();
    await redis.quit();
    server.close(() => {
      logger.info('Servidor encerrado com sucesso');
      process.exit(0);
    });
  } catch (err) {
    logger.error('Erro durante o shutdown:', err);
    process.exit(1);
  }
};

// Inicialização segura
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
  logger.info(`Modo: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Health Check: http://localhost:${PORT}/health`);
});

// Manipuladores de sinais para graceful shutdown
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', err => {
  logger.error('Unhandled Rejection:', err);
});
process.on('uncaughtException', err => {
  logger.error('Uncaught Exception:', err);
  shutdown('uncaughtException');
});
