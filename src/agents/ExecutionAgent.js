// agents/ExecutionAgent.js

const { gerarResposta } = require('../services/aiService');

/**
 * Agente responsável por executar a IA com o superprompt fornecido.
 * Atua como camada de orquestração da lógica cognitiva (B09).
 */
class ExecutionAgent {
  /**
   * Executa a IA com o prompt fornecido
   * @param {string} prompt - Instrução completa para a IA
   * @returns {Promise<string>} - Resposta da IA
   */
  async executar(prompt) {
    try {
      return await gerarResposta(prompt);
    } catch (error) {
      console.error("❌ Erro na execução da IA:", error);
      throw error;
    }
  }
}

module.exports = ExecutionAgent;
