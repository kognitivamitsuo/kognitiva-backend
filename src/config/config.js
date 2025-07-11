const crypto = require('crypto');
require('dotenv-safe').config(); // Exige todas as variáveis

// Defina uma chave secreta estável para JWT em produção
const jwtSecret = process.env.JWT_SECRET || (() => {
  // Gerar apenas uma vez no ambiente de produção ou armazenar a chave em um arquivo seguro
  const secret = crypto.randomBytes(32).toString('hex');
  console.warn('A chave JWT foi gerada aleatoriamente. Defina JWT_SECRET em produção para maior segurança.');
  return secret;
})();

module.exports = {
  jwtSecret,
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  openaiKey: process.env.OPENAI_API_KEY,
  nodeEnv: process.env.NODE_ENV || 'development'
};
