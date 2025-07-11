'use strict';

// Remova qualquer uso de alias e substitua por caminhos relativos
const MonitoringAgent = require('../agents/MonitoringAgent');  // Caminho relativo
const agent = new MonitoringAgent();

/**
 * Diagnóstico fictício – pode ser expandido com logs reais
 */
async function obter(req, res) {
  try {
    res.status(200).json({
      status: 'diagnóstico gerado',
      integridade: 'ok',
      modelo: 'gpt-4-turbo',
      tempo_execucao: '<2s',
      score_medio: 9.2,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao gerar diagnóstico.' });
  }
}

module.exports = { obter };
