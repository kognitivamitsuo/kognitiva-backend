// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const JWT_SECRET = process.env.JWT_SECRET || "segredo_default";
const EXPIRACAO_PADRAO = "2h";

/**
 * Gera um token JWT assinado com um UUID interno (token_sessao)
 * @returns {Object} Objeto contendo token JWT e token_sessao
 */
function gerarTokenSessao() {
  const token_sessao = uuidv4();

  const payload = {
    token_sessao,
    criado_em: Date.now(),
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRACAO_PADRAO });

  return { token, token_sessao };
}

/**
 * Verifica e decodifica um token JWT
 * @param {string} token - Token JWT enviado no header Authorization
 * @returns {Object} Payload decodificado se válido
 * @throws {Error} Se o token for inválido ou expirado
 */
function verificarToken(token) {
  if (!token) {
    throw new Error("Token ausente.");
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error("Token inválido ou expirado.");
  }
}

module.exports = {
  gerarTokenSessao,
  verificarToken,
};
