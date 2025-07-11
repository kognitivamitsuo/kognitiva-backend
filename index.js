'use strict';

// Remover configuração de aliases, já que não será mais utilizado.
const setupAliases = () => {
  // Não é mais necessário configurar aliases com module-alias ou require-alias
  console.log('✅ Não há necessidade de configuração de aliases.');
  return true;
};

// Inicialização segura
const initializeApp = async () => {
  // 1. Não há mais necessidade de configurar aliases
  if (!setupAliases()) {
    process.exit(1);
  }

  // 2. Verificação de módulos críticos
  const criticalModules = [
    './services/iaService',  // Caminho relativo
    './config/database',     // Caminho relativo
    './middleware/auth'      // Caminho relativo
  ];

  for (const module of criticalModules) {
    try {
      require(module);  // Carregamento dos módulos críticos com caminho relativo
      console.log(`✅ Módulo crítico carregado: ${module}`);
    } catch (error) {
      console.error(`❌ Falha ao carregar módulo crítico ${module}:`, error);
      process.exit(1);
    }
  }

  // 3. Configuração do Express com verificações adicionais
  const express = require('express');
  const app = express();

  // Middlewares essenciais com verificações
  try {
    app.use(require('helmet')());
    app.use(require('cors')({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }));
    app.use(require('express-rate-limit')({
      windowMs: 15 * 60 * 1000,
      max: 100
    }));
  } catch (middlewareError) {
    console.error('❌ Falha ao configurar middlewares:', middlewareError);
    process.exit(1);
  }

  // 4. Conexões com banco de dados
  const { Pool } = require('pg');
  const Redis = require('ioredis');

  const dbPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  const redis = new Redis(process.env.REDIS_URL);

  // Teste de conexões imediato
  try {
    await dbPool.query('SELECT 1');
    await redis.ping();
    console.log('✅ Conexões com banco de dados estabelecidas');
  } catch (dbError) {
    console.error('❌ Falha nas conexões com banco de dados:', dbError);
    process.exit(1);
  }

  // 5. Configuração de rotas com verificação
  try {
    app.use('/api', require('./routes/apiRoutes'));  // Caminho relativo
    console.log('✅ Rotas configuradas com sucesso');
  } catch (routesError) {
    console.error('❌ Falha ao configurar rotas:', routesError);
    process.exit(1);
  }

  // 6. Inicialização do servidor
  const PORT = process.env.PORT || 3000;
  return app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
  });
};

// Execução controlada com tratamento de erros
initializeApp()
  .then(server => {
    // Graceful shutdown
    const shutdown = async () => {
      console.log('🛑 Encerrando servidor...');
      await server.close();
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  })
  .catch(error => {
    console.error('💥 Falha crítica na inicialização:', error);
    process.exit(1);
  });
