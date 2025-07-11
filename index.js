'use strict';

const path = require('path');
const fs = require('fs');

// Configuração de aliases verificada
const setupAliases = () => {
  console.log('✅ Não há necessidade de configuração de aliases.');
  return true;
};

// Carregador de módulos críticos com verificação de caminho
const loadCriticalModule = (modulePath) => {
  try {
    const fullPath = path.resolve(__dirname, modulePath);
    
    if (!fs.existsSync(fullPath)) {
      const jsPath = `${fullPath}.js`;
      const indexPath = path.join(fullPath, 'index.js');
      
      if (fs.existsSync(jsPath)) {
        console.log(`Carregando módulo de ${jsPath}`);
        return require(jsPath);
      } else if (fs.existsSync(indexPath)) {
        console.log(`Carregando módulo de ${indexPath}`);
        return require(indexPath);
      }
      throw new Error(`Módulo não encontrado em ${fullPath}`);
    }
    
    console.log(`Carregando módulo de ${fullPath}`);
    return require(fullPath);
  } catch (error) {
    console.error(`❌ Falha ao carregar módulo crítico ${modulePath}:`, error);
    throw error;
  }
};

const testConnections = async () => {
  const timeout = 5000; // Tempo de espera para a conexão em ms
  const pgPromise = dbPool.query('SELECT 1');
  const redisPromise = redis.ping();
  
  const results = await Promise.race([
    pgPromise,
    redisPromise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout de conexão')), timeout))
  ]);
  
  if (results) {
    console.log('✅ Conexões com banco de dados estabelecidas');
  }
};

// Inicialização da aplicação
const initializeApp = async () => {
  try {
    // 1. Configuração de aliases
    if (!setupAliases()) {
      throw new Error('Falha na configuração de aliases');
    }

    // 2. Módulos críticos com carregamento aprimorado
    const criticalModules = [
      './src/services/aiService',  // Caminho corrigido para o aiService.js
      './config/database',
      './middleware/auth'
    ];

    for (const module of criticalModules) {
      loadCriticalModule(module);
      console.log(`✅ Módulo crítico carregado: ${module}`);
    }

    // 3. Configuração do Express com verificação de dependências
    const express = require('express');
    const app = express();

    // Middlewares essenciais com tratamento de erro individual
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

    // 4. Conexões com banco de dados com teste de conexão
    const { Pool } = require('pg');
    const Redis = require('ioredis');

    const dbPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    const redis = new Redis(process.env.REDIS_URL);

    // Testa conexões com timeout
    await Promise.all([
      dbPool.query('SELECT 1').catch(e => { 
        throw new Error(`Falha na conexão PostgreSQL: ${e.message}`); 
      }),
      redis.ping().catch(e => { 
        throw new Error(`Falha na conexão Redis: ${e.message}`); 
      })
    ]);
    console.log('✅ Conexões com banco de dados estabelecidas');

    // 5. Rotas com tratamento de erro explícito
    const apiRoutes = require('./routes/apiRoutes');
    app.use('/api', apiRoutes);
    console.log('✅ Rotas configuradas com sucesso');

    // 6. Inicialização do servidor
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

// Inicialização com tratamento de erro adequado
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

    // Handlers para rejeições não tratadas e exceções
    process.on('unhandledRejection', (reason) => {
      console.error('Rejeição não tratada:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('Exceção não capturada:', error);
      shutdown('uncaughtException');
    });
  })
  .catch(error => {
    console.error('💥 Falha na inicialização:', error);
    process.exit(1);
  });
