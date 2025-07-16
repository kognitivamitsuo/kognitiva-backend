// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const { gerarHash } = require("../utils/hashUtils");
const feedbackService = require("../services/feedbackService");

const VERSAO = "v3.6-finalUX";
const RESPONSAVEL = "Kognitiva • Mitsuo AI Architect";

/**
 * Recebe o feedback do usuário (score + comentário) e o processa com fallback seguro.
 */
async function receberFeedback(req, res) {
  try {
    const {
      token_sessao,
      score_resposta,
      comentario_usuario,
      contexto_score,
      hash_contexto,
    } = req.body;

    // Validação mínima
    if (!token_sessao || typeof score_resposta !== "number") {
      return res.status(400).json({ erro: "Campos obrigatórios ausentes." });
    }

    const payload = {
      token_sessao,
      score_resposta,
      comentario_usuario: comentario_usuario || null,
      contexto_score: contexto_score || null,
      hash_contexto: hash_contexto || gerarHash({ token_sessao, score_resposta }),
      versao_contexto: VERSAO,
      responsavel_IA: RESPONSAVEL,
      timestamp: new Date().toISOString(),
    };

    const resultado = await feedbackService.processarFeedback(payload);
    return res.status(200).json(resultado);

  } catch (erro) {
    console.error("❌ Erro ao registrar feedback:", erro.message);
    return res.status(500).json({ erro: "Falha ao registrar feedback" });
  }
}

module.exports = {
  receberFeedback,
};
