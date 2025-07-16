// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect
// Componente: feedbackProcessor.js | versao_componente: 1.0.0

const { pool } = require('../models/db');
const { gerarDiagnostico } = require('./diagnosticoEngine');
const { registrarLog } = require('../services/logger');
const { salvarFeedbackFallback } = require('../services/redisUtils');

const processarFeedback = async (dados) => {
  try {
    const {
      token_sessao,
      score_resposta,
      feedback_usuario,
      comentario,
      contexto_score,
      modelo_utilizado,
      versao_contexto,
      responsavel_IA,
      hash_contexto
    } = dados;

    if (!token_sessao || !score_resposta || !feedback_usuario) {
      throw new Error('Campos obrigatórios ausentes para feedback.');
    }

    // Persistência no PostgreSQL
    const query = `
      INSERT INTO feedback_usuario (
        token_sessao, score_resposta, feedback_usuario, comentario,
        versao_contexto, responsavel_ia, "timestamp", hash_contexto
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
    `;

    const valores = [
      token_sessao,
      score_resposta,
      feedback_usuario,
      comentario || '',
      versao_contexto || 'v3.6-finalUX',
      responsavel_IA || 'Kognitiva • Mitsuo AI Architect',
      hash_contexto || null
    ];

    await pool.query(query, valores);

    await registrarLog({
      tipo: 'feedback',
      token_sessao,
      score_resposta,
      feedback_usuario,
      comentario,
      versao_contexto,
      responsavel_IA,
      hash_contexto
    });

    // Diagnóstico automático (B16)
    if (contexto_score && modelo_utilizado) {
      await gerarDiagnostico({
        token_sessao,
        contexto_score,
        score_resposta,
        modelo_utilizado,
        versao_contexto,
        responsavel_IA,
        hash_contexto
      });
    }

    return { sucesso: true };

  } catch (erro) {
    console.error('[feedbackProcessor] Falha ao processar feedback:', erro.message);

    await salvarFeedbackFallback(dados);

    return {
      sucesso: false,
      erro: erro.message,
      fallback_ativado: true
    };
  }
};

module.exports = {
  processarFeedback
};
