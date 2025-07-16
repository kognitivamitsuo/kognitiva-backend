// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect
// Componente: feedbackController.js | versao_componente: 1.0.0

const { processarFeedback } = require('../feedbackProcessor');

const feedbackController = async (req, res) => {
  try {
    const resultado = await processarFeedback(req.body);

    if (resultado.sucesso) {
      return res.status(200).json({ sucesso: true });
    } else {
      return res.status(500).json({
        sucesso: false,
        erro: resultado.erro || 'Erro ao processar feedback.',
        fallback_ativado: resultado.fallback_ativado || false
      });
    }

  } catch (erro) {
    console.error('[feedbackController] Erro ao processar feedback:', erro.message);

    return res.status(500).json({
      sucesso: false,
      erro: 'Erro interno no servidor.'
    });
  }
};

module.exports = {
  feedbackController
};
