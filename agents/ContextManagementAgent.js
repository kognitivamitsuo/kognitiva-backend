const Redis = require('ioredis');
const { redisUrl, databaseUrl } = require('../../config/config');
const logger = require('../../utils/logger');
const db = require('../../models/db');

class ContextManagementAgent {
  constructor() {
    this.redis = new Redis(redisUrl);
    this.redis.on('error', (err) => {
      logger.warn(`Redis falhou: ${err.message}`);
      this.redis = null; // Desativa Redis
    });
  }

  async saveContext(userId, context) {
    try {
      // Verifica a conexão com Redis
      if (this.redis && await this.redis.ping()) {
        await this.redis.set(`ctx:${userId}`, JSON.stringify(context), 'EX', 86400); // 24h
        return;
      }
      
      // Fallback para PostgreSQL
      await db.query(
        'INSERT INTO user_context (user_id, data) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET data = $2',
        [userId, context]
      );
    } catch (error) {
      logger.error(`Falha ao salvar contexto: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ContextManagementAgent();

