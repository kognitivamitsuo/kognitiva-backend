const Redis = require('ioredis');
const { redisUrl } = require('../config/config');
const db = require('../models/db');

class ContextManagementAgent {
  constructor() {
    this.redis = new Redis(redisUrl);
    this.redis.on('error', (err) => {
      console.error('Redis error:', err);
      this.redis = null;
    });
  }

  async saveContext(userId, context) {
    try {
      if (this.redis) {
        await this.redis.set(`ctx:${userId}`, JSON.stringify(context));
        return;
      }
      await db.query(
        'INSERT INTO user_context (user_id, data) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET data = $2',
        [userId, JSON.stringify(context)]
      );
    } catch (error) {
      throw new Error(`Failed to save context: ${error.message}`);
    }
  }
}

module.exports = new ContextManagementAgent();
