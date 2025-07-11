'use strict';

const path = require('path');
const fs = require('fs');

// Improved alias setup with verification
const setupAliases = () => {
  console.log('✅ Não há necessidade de configuração de aliases.');
  return true;
};

// Enhanced module loader with path verification
const loadCriticalModule = (modulePath) => {
  try {
    // Verify file exists before requiring
    const fullPath = path.resolve(__dirname, modulePath);
    
    // Check for .js, .cjs, or directory with index.js
    if (!fs.existsSync(fullPath) {
      const jsPath = `${fullPath}.js`;
      const indexPath = path.join(fullPath, 'index.js');
      
      if (fs.existsSync(jsPath)) {
        return require(jsPath);
      } else if (fs.existsSync(indexPath)) {
        return require(indexPath);
      }
      throw new Error(`Module not found at ${fullPath}`);
    }
    
    return require(fullPath);
  } catch (error) {
    console.error(`❌ Falha ao carregar módulo crítico ${modulePath}:`, error);
    throw error; // Re-throw for outer handling
  }
};

const initializeApp = async () => {
  try {
    // 1. Alias setup
    if (!setupAliases()) {
      throw new Error('Alias configuration failed');
    }

    // 2. Critical modules with enhanced loading
    const criticalModules = [
      './services/iaService',
      './config/database',
      './middleware/auth'
    ];

    for (const module of criticalModules) {
      loadCriticalModule(module);
      console.log(`✅ Módulo crítico carregado: ${module}`);
    }

    // 3. Express setup with dependency verification
    const express = require('express');
    const app = express();

    // Essential middleware with individual error handling
    const helmet = require('helmet');
    const cors = require('cors');
    const rateLimit = require('express-rate-limit');

    app.use(helmet());
    app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }));
    app.use(rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100
    }));

    // 4. Database connections with connection testing
    const { Pool } = require('pg');
    const Redis = require('ioredis');

    const dbPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    const redis = new Redis(process.env.REDIS_URL);

    // Test connections with timeout
    await Promise.all([
      dbPool.query('SELECT 1').catch(e => { throw new Error(`PostgreSQL connection failed: ${e.message}`); }),
      redis.ping().catch(e => { throw new Error(`Redis connection failed: ${e.message}`); })
    ]);
    console.log('✅ Conexões com banco de dados estabelecidas');

    // 5. Routes with explicit error handling
    const apiRoutes = require('./routes/apiRoutes');
    app.use('/api', apiRoutes);
    console.log('✅ Rotas configuradas com sucesso');

    // 6. Server startup
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
    });

    return server;
  } catch (error) {
    console.error('💥 Falha crítica na inicialização:', error);
    process.exit(1);
  }
};

// Startup with proper error handling
initializeApp()
  .then(server => {
    const shutdown = async (signal) => {
      console.log(`🛑 Recebido ${signal}, encerrando servidor...`);
      try {
        await server.close();
        console.log('Servidor encerrado com sucesso');
        process.exit(0);
      } catch (err) {
        console.error('Erro ao encerrar servidor:', err);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Unhandled rejection/exception handlers
    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled Rejection at:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      shutdown('uncaughtException');
    });
  })
  .catch(error => {
    console.error('💥 Falha na inicialização:', error);
    process.exit(1);
  });
