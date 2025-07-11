// logger.js

/**
 * Módulo de logger padronizado para o backend da Kognitiva
 * Adiciona prefixos simples e claros para rastreabilidade
 */

module.exports = {
  info: (...args) => console.log('[INFO]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
};
