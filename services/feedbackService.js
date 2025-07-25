// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-16
// Responsável: Kognitiva • Mitsuo AI Architect

const db = require("../models/db");
const { sendToSheetsFallback } = require("./feedbackSheets");
const logger = require("./logger");

/**
 * Registra o feedback do usuário no PostgreSQL ou, em caso de erro, envia para fallback (Google Sheets).
 * @param {Object} feedback - Objeto contendo os campos: token_sessao, score_resposta, comentario_usuario, contexto_score, hash_contexto, versao_contexto, responsavel_IA, timestamp
 * @returns {Object} status: "ok" | "fallback", origem: "PostgreSQL" | "Sheets"
 */
async function processarFeedback(feedback) {
  // ✅ Validação mínima
  if (!feedback?.token_sessao || !feedback?.score_resposta) {
    logger.erro("Feedback inválido: campos obrigatórios ausentes.");
    throw new Error("Feedback inválido: token_sessao e score_resposta são obrigatórios.");
  }

  logger.debug("⏳ Iniciando registro de feedback:", feedback);

  try {
    // Tentativa principal: PostgreSQL
    await db.salvarFeedback(feedback);
    logger.sucesso("✅ Feedback registrado com sucesso no PostgreSQL.");
    return { status: "ok", origem: "PostgreSQL" };
  } catch (erroSQL) {
    logger.aviso("⚠️ Fallback ativado para feedback (PostgreSQL indisponível):", erroSQL.message);
  }

  // Fallback: Google Sheets
  try {
    const respostaFallback = await sendToSheetsFallback("feedback_usuario", feedback);
    logger.sucesso("✅ Feedback enviado para Google Sheets como fallback.");
    return {
      status: "fallback",
      origem: "Sheets",
      resultado: respostaFallback,
    };
  } catch (erroFallback) {
    logger.erro("❌ Falha também no fallback de feedback:", erroFallback.message);
    throw new Error(`Falha ao registrar feedback em ambos os canais (PostgreSQL e Sheets): ${erroFallback.message}`);
  }
}

module.exports = {
  processarFeedback,
};
