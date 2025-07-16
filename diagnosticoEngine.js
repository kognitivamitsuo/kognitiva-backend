// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect
// Componente: diagnosticoEngine.js | versao_componente: 1.0.0

const { pool } = require('../models/db');
const { registrarLog } = require('../services/logger');
const { salvarDiagnosticoFallback } = require('../services/redisUtils');

const gerarDiagnostico = async (dados) => {
  try {
    const {
      token_sessao,
      contexto_score,
      score_resposta,
      modelo_utilizado,
      versao_contexto,
      responsavel_IA,
      hash_contexto
    } = dados;

    // Validações básicas exigidas pelo framework
    if (!token_sessao || !versao_contexto || !responsavel_IA) {
      throw new Error('Campos obrigatórios ausentes para diagnóstico.');
    }

    // Cálculo da média e avaliação qualitativa
    const media_diagnostico = ((Number(contexto_score) + Number(score_resposta)) / 2).toFixed(2);

    let qualidade = 'Indefinida';
    if (media_diagnostico >= 9) qualidade = 'Excelente';
    else if (media_diagnostico >= 7) qualidade = 'Boa';
    else qualidade = 'Necessita melhoria';

    const query = `
      INSERT INTO diagnostico_kognitiva_v36 (
        token_sessao, contexto_score, score_resposta, media_diagnostico,
        qualidade, versao_contexto, responsavel_ia, "timestamp", hash_contexto
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8)
    `;

    const valores = [
      token_sessao,
      contexto_score,
      score_resposta,
      media_diagnostico,
      qualidade,
      versao_contexto,
      responsavel_IA,
      hash_contexto
    ];

    await pool.query(query, valores);

    await registrarLog({
      tipo: 'diagnostico',
      token_sessao,
      score_resposta,
      contexto_score,
      media_diagnostico,
      qualidade,
      hash_contexto,
      responsavel_IA,
      versao_contexto
    });

    return {
      sucesso: true,
      media_diagnostico,
      qualidade,
      versao_contexto,
      responsavel_IA
    };

  } catch (erro) {
    console.error('[diagnosticoEngine] Falha ao gerar diagnóstico:', erro.message);

    // Fallback para redis ou sheets
    await salvarDiagnosticoFallback(dados);

    return {
      sucesso: false,
      erro: erro.message,
      fallback_ativado: true
    };
  }
};

module.exports = {
  gerarDiagnostico
};
