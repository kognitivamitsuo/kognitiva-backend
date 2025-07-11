// src/controllers/aiController.js

const { gerarRespostaIA } = require('../services/iaService');  // Caminho corrigido para '../services/iaService'
const { salvarLogExecucao } = require('../services/logger');   // Caminho corrigido
const { salvarFeedback } = require('../services/feedbackService');  // Caminho corrigido
const { gerarDiagnosticoFinal } = require('../services/diagnosticService');  // Caminho corrigido
const { atualizarContexto } = require('../services/contextService');  // Caminho corrigido

const executarIA = async (req, res) => {
  try {
    const { mensagem, contexto } = req.body;

    if (!mensagem || !contexto) {
      return res.status(400).json({ erro: 'Mensagem ou contexto ausente.' });
    }

    const resposta = await gerarRespostaIA(mensagem, contexto);

    await salvarLogExecucao({
      token_sessao: contexto.token_sessao,
      cliente_nome: contexto.cliente_nome,
      modelo_utilizado: resposta.modelo_utilizado,
      resposta_final: resposta.resposta,
      score_resposta: resposta.score_resposta,
      tempo_execucao_ms: resposta.tempo_execucao_ms
    });

    await atualizarContexto(contexto.token_sessao, contexto);

    return res.status(200).json({
      resposta: resposta.resposta,
      modelo_utilizado: resposta.modelo_utilizado,
      score_resposta: resposta.score_resposta
    });

  } catch (erro) {
    console.error('[ERRO IA]', erro);
    return res.status(500).json({ erro: 'Erro interno ao executar a IA.' });
  }
};

const receberFeedback = async (req, res) => {
  try {
    const feedback = req.body;
    await salvarFeedback(feedback);
    return res.status(200).json({ status: 'feedback registrado' });
  } catch (erro) {
    console.error('[ERRO FEEDBACK]', erro);
    return res.status(500).json({ erro: 'Erro ao registrar o feedback.' });
  }
};

const gerarDiagnostico = async (req, res) => {
  try {
    const { token_sessao } = req.body;
    const diagnostico = await gerarDiagnosticoFinal(token_sessao);
    return res.status(200).json(diagnostico);
  } catch (erro) {
    console.error('[ERRO DIAGNÓSTICO]', erro);
    return res.status(500).json({ erro: 'Erro ao gerar o diagnóstico.' });
  }
};

module.exports = {
  executarIA,
  receberFeedback,
  gerarDiagnostico
};

