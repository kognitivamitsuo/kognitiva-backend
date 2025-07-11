// Configure module aliases before anything else
require('module-alias/register');
const path = require('path');
const moduleAlias = require('module-alias');

// Configura os aliases para diretórios específicos
moduleAlias.addAliases({
  '@services': path.join(__dirname, 'src', 'services'),
  '@controllers': path.join(__dirname, 'src', 'controllers'),
  '@routes': path.join(__dirname, 'src', 'routes'),
  '@middleware': path.join(__dirname, 'src', 'middleware'),
  '@models': path.join(__dirname, 'src', 'models'),
  '@utils': path.join(__dirname, 'utils'),
  '@agents': path.join(__dirname, 'src', 'agents')
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');
const Redis = require('ioredis');
const apiRoutes = require('@routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Logger aprimorado
const log = (...args) => console.log(`[${new Date().toISOString()}]`, ...args);

// Verificação inicial de variáveis
const requiredEnvVars = ['DATABASE_URL', 'REDIS_URL'];
requiredEnvVars.forEach(env => {
  if (!process.env[env]) {
    log(`❌ Variável de ambiente faltando: ${env}`);
    process.exit(1);
  }
});

// Inicialização
log('✅ Inicializando backend Kognitiva...');
log('🌐 Ambiente:', process.env.NODE_ENV || 'development');
log('⚙️ Porta:', PORT);

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',  // Melhor configurar em produção
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json({ limit: '10mb' }));

// PostgreSQL com reconexão automática
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  retry_strategy: (options) => {
    if (options.error.code === 'ECONNREFUSED') {
      return 5000; // Tentar novamente após 5 segundos
    }
    return 1000;
  }
});

// Redis com tratamento de erros
const redis = new Redis(process.env.REDIS_URL, {
  retryStrategy: (times) => Math.min(times * 100, 5000)
});

// Verificações de saúde
const healthCheck = async () => {
  try {
    await pool.query('SELECT 1');
    await redis.ping();
    return true;
  } catch (error) {
    log('❌ Health check falhou:', error);
    return false;
  }
};

// Rotas
app.get('/', (req, res) => res.send('🧠 Kognitiva backend ativo!'));
app.get('/health', async (req, res) => {
  const isHealthy = await healthCheck();
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    db: isHealthy ? 'connected' : 'disconnected',
    redis: isHealthy ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', apiRoutes);

// Error handling
app.use((err, req, res, next) => {
  log('❌ Erro:', err.stack);
  res.status(500).json({ error: 'Erro interno' });
});

// Inicialização segura
const startServer = async () => {
  try {
    // Testar conexões antes de subir
    await pool.query('SELECT 1');
    await redis.ping();
    
    app.listen(PORT, '0.0.0.0', () => {
      log(`🚀 Servidor rodando na porta ${PORT}`);
      log(`🔗 Health check disponível em http://localhost:${PORT}/health`);
    });
  } catch (error) {
    log('❌ Falha na inicialização:', error);
    process.exit(1);
  }
};

startServer();
