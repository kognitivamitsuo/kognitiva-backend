'use strict';

// Remova qualquer uso de alias e substitua por caminhos relativos
const FeedbackAgent = require('../agents/FeedbackAgent');  // Caminho relativo

/**
 * Envia o feedback do usuário
 */
async function enviarFeedback(req, res) {
  try {
    const { feedback, comentario } = req.body;
    const agente = new FeedbackAgent();
    await agente.coletar(req.user.id, feedback, comentario);
    res.json({ sucesso: true });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao enviar feedback', detalhe: error.message });
  }
}

module.exports = { enviarFeedback };
