// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const crypto = require("crypto");

/**
 * Gera um hash SHA-256 a partir de um objeto.
 * Ideal para rastreabilidade e verificação de integridade do contexto (hash_contexto).
 * @param {Object} dados - Objeto a ser convertido em hash.
 * @returns {string} Hash SHA-256 do conteúdo.
 */
function gerarHash(dados) {
  try {
    const texto = JSON.stringify(dados, Object.keys(dados).sort()); // ordena chaves
    return crypto.createHash("sha256").update(texto).digest("hex");
  } catch (erro) {
    console.error("[hashUtils] Erro ao gerar hash:", erro.message);
    return null;
  }
}

module.exports = {
  gerarHash,
};
