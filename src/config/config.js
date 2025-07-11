require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  openaiKey: process.env.OPENAI_API_KEY,
};
