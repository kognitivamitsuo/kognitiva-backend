require('dotenv').config();  // Carrega as variáveis de ambiente do .env

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  openaiKey: process.env.OPENAI_API_KEY,
};
