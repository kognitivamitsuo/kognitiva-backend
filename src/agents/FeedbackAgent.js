// agents/FeedbackAgent.js

const { salvarFeedback } = require('../services/feedbackService');

/**
 * Agente responsável por registrar o feedback do usuário
 * após a execução da IA (bloco B11 e B12).
 */
class FeedbackAgent {
  /**
   * Coleta e registra o feedback do usuário.
   * @param {string} tokenSessao - Token da sessão (ou userId)
   * @param {string} feedback - Tipo de feedback: "positivo" | "negativo"
   * @param {string} comentario - Comentário adicional do usuário (opcional)
   */
  async coletar(tokenSessao, feedback, comentario = "") {
    if (!tokenSessao || !feedback) {
      console.warn("⚠️ Feedback inválido: campos obrigatórios ausentes.");
      return;
    }

    try {
      await salvarFeedback(tokenSessao, feedback, comentario);
      console.log("✅ Feedback registrado com sucesso.");
    } catch (error) {
      console.error("❌ Erro ao salvar feedback:", error);
    }
  }
}

module.exports = FeedbackAgent;
