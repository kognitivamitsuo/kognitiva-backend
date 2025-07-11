'use strict';

// Remova qualquer uso de alias e substitua por caminhos relativos
const ContextManagementAgent = require('../agents/ContextManagementAgent');  // Caminho relativo
const agent = new ContextManagementAgent();

/**
 * Salva o contexto recebido no body
 */
async function salvar(req, res) {
  const { token_sessao, contexto } = req.body;

  if (!token_sessao || !contexto) {
    return res.status(400).json({ erro: 'token_sessao e contexto são obrigatórios.' });
  }

  try {
    await agent.salvar(token_sessao, contexto);
    res.status(200).json({ status: 'contexto salvo' });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao salvar contexto.' });
  }
}

/**
 * Retorna o contexto associado ao token_sessao
 */
async function carregar(req, res) {
  const { token_sessao } = req.query;

  if (!token_sessao) {
    return res.status(400).json({ erro: 'token_sessao é obrigatório.' });
  }

  try {
    const contexto = await agent.carregar(token_sessao);
    res.status(200).json({ contexto });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao carregar contexto.' });
  }
}

module.exports = { salvar, carregar };
