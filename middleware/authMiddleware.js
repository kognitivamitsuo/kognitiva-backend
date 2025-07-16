// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const jwt = require("jsonwebtoken");
const { VERSAO, RESPONSAVEL } = require("../config/config");

/**
 * Middleware de autenticação JWT para rotas protegidas da Kognitiva.
 * Valida o token, extrai dados para rastreabilidade e impede acessos inválidos.
 */
function autenticar(req, res, next) {
  const headerAuth = req.headers.authorization;

  if (!headerAuth || !headerAuth.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "erro",
      mensagem: "Token JWT ausente ou malformado. Acesso não autorizado.",
    });
  }

  const token = headerAuth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Rastreabilidade cognitiva (Bloco B19)
    req.token_sessao = decoded.token_sessao || "desconhecido";
    req.responsavel_IA = RESPONSAVEL;
    req.versao_contexto = VERSAO;

    return next();
  } catch (err) {
    return res.status(403).json({
      status: "erro",
      mensagem: "Token inválido ou expirado.",
      detalhe: err.message,
    });
  }
}

module.exports = autenticar;
