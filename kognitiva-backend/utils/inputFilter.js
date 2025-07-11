// inputFilter.js

/**
 * Remove espaços extras e normaliza a entrada do usuário.
 * Exemplo: "  Olá   mundo  " ➝ "Olá mundo"
 * 
 * @param {string} texto - Texto de entrada do usuário
 * @returns {string} Texto limpo
 */
function filtrarEntrada(texto) {
  return texto.trim().replace(/\s+/g, ' ');
}

module.exports = { filtrarEntrada };
