// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const db = require("../models/db");
const { sendToSheetsFallback } = require("./feedbackSheets"); // compatível com logs
const logger = require("./logger");

/**
 * Registra o feedback do usuário no PostgreSQL ou, em caso de erro, envia para fallback (Google Sheets).
 * @param {Object} feedback - Objeto contendo os campos: token_sessao, score_resposta, comentario_usuario, contexto_score, hash_contexto, versao_contexto, responsavel_IA, timestamp
 * @returns {Object} status: "ok" | "fallback", origem: "PostgreSQL" | "Sheets"
 */
async function processarFeedback(feedback) {
  try {
    // Tentativa principal: PostgreSQL
    await db.salvarFeedback(feedback);
    logger.sucesso("Feedback registrado com sucesso no PostgreSQL.");
    return { status: "ok", origem: "PostgreSQL" };
  } catch (erroSQL) {
    logger.aviso("Fallback ativado para feedback (PostgreSQL indisponível):", erroSQL.message);
  }

  // Fallback: Google Sheets
  try {
    const respostaFallback = await sendToSheetsFallback("feedback_usuario", feedback);
    logger.sucesso("Feedback enviado para Google Sheets como fallback.");
    return { status: "fallback", origem: "Sheets", resultado: respostaFallback };
  } catch (erroFallback) {
    logger.erro("❌ Falha também no fallback de feedback:", erroFallback.message);
    throw new Error("Falha ao registrar feedback (banco e fallback)");
  }
}

module.exports = {
  processarFeedback,
};
