// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect
// Componente: logger.js | versao_componente: 1.0.0

const { pool } = require('../models/db');

// Função genérica para registrar logs de execução cognitiva
const registrarLog = async (dados) => {
  try {
    const {
      tipo = 'execucao',
      token_sessao,
      versao_contexto = 'v3.6-finalUX',
      responsavel_IA = 'Kognitiva • Mitsuo AI Architect',
      hash_contexto,
      contexto_score,
      score_resposta,
      qualidade,
      modelo_utilizado,
      observacoes
    } = dados;

    const query = `
      INSERT INTO logs_execucao (
        token_sessao, tipo, versao_contexto, responsavel_ia,
        contexto_score, score_resposta, qualidade, modelo_utilizado,
        hash_contexto, observacoes, "timestamp"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
    `;

    const valores = [
      token_sessao,
      tipo,
      versao_contexto,
      responsavel_IA,
      contexto_score || null,
      score_resposta || null,
      qualidade || null,
      modelo_utilizado || null,
      hash_contexto || null,
      observacoes || null
    ];

    await pool.query(query, valores);

  } catch (erro) {
    console.error('[logger] Falha ao registrar log de execução:', erro.message);
    // Intencionalmente não repropaga erro para não quebrar outros fluxos
  }
};

module.exports = {
  registrarLog
};
