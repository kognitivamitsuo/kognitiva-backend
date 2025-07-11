// src/controllers/aiController.js

// Importação corrigida para garantir que os caminhos estão corretos.
const { gerarRespostaIA } = require('../services/iaService');  // Caminho corrigido para '../services/iaService'
const { salvarLogExecucao } = require('../services/logger');   // Caminho corrigido
const { salvarFeedback } = require('../services/feedbackService');  // Caminho corrigido
const { gerarDiagnosticoFinal } = require('../services/diagnosticService');  // Caminho corrigido
const { atualizarContexto } = require('../services/contextService');  // Caminho corrigido

// Função para executar a IA
const executarIA = async (req, res) => {
  try {
    const { mensagem, contexto } = req.body;

    // Validação das entradas de mensagem e contexto
    if (!mensagem || !contexto) {
      return res.status(400).json({ erro: 'Mensagem ou contexto ausente.' });
    }

    // Chamada para gerar a resposta da IA
    const resposta = await gerarRespostaIA(mensagem, contexto);

    // Salvando o log de execução
    await salvarLogExecucao({
      token_sessao: contexto.token_sessao,
      cliente_nome: contexto.cliente_nome,
      modelo_utilizado: resposta.modelo_utilizado,
      resposta_final: resposta.resposta,
      score_resposta: resposta.score_resposta,
      tempo_execucao_ms: resposta.tempo_execucao_ms
    });

    // Atualizando o contexto
    await atualizarContexto(contexto.token_sessao, contexto);

    // Retornando a resposta da IA para o usuário
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

// Função para receber o feedback do usuário
const receberFeedback = async (req, res) => {
  try {
    const feedback = req.body;

    // Salvando o feedback recebido
    await salvarFeedback(feedback);
    return res.status(200).json({ status: 'feedback registrado' });
  } catch (erro) {
    console.error('[ERRO FEEDBACK]', erro);
    return res.status(500).json({ erro: 'Erro ao registrar o feedback.' });
  }
};

// Função para gerar o diagnóstico final da sessão
const gerarDiagnostico = async (req, res) => {
  try {
    const { token_sessao } = req.body;
    
    // Gerando o diagnóstico com base no token da sessão
    const diagnostico = await gerarDiagnosticoFinal(token_sessao);
    return res.status(200).json(diagnostico);
  } catch (erro) {
    console.error('[ERRO DIAGNÓSTICO]', erro);
    return res.status(500).json({ erro: 'Erro ao gerar o diagnóstico.' });
  }
};

// Exportando as funções para o roteamento
module.exports = {
  executarIA,
  receberFeedback,
  gerarDiagnostico
};

