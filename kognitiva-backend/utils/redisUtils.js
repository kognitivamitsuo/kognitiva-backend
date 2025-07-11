// redisClient.js

const Redis = require('ioredis');
const { redisUrl } = require('../config/config');

// Criação do cliente Redis com URL do .env
const client = new Redis(redisUrl);

// Exporta funções utilitárias com JSON automático
module.exports = {
  client,

  /**
   * Salva um valor em Redis (convertido para JSON)
   * @param {string} key - Chave
   * @param {*} value - Valor a ser armazenado
   */
  async set(key, value) {
    try {
      await client.set(key, JSON.stringify(value));
    } catch (error) {
      console.error("❌ Erro ao salvar no Redis:", error);
    }
  },

  /**
   * Recupera e converte um valor do Redis
   * @param {string} key - Chave
   * @returns {*} Valor convertido ou null
   */
  async get(key) {
    try {
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("❌ Erro ao recuperar do Redis:", error);
      return null;
    }
  }
};
