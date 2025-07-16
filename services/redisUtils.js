// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect
// Componente: redisUtils.js | versao_componente: 1.0.0

const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || '');

const DEFAULT_TTL_SECONDS = 3600; // 1 hora

const salvarComTTL = async (chave, dados, ttl = DEFAULT_TTL_SECONDS) => {
  try {
    await redis.set(chave, JSON.stringify(dados), 'EX', ttl);
  } catch (erro) {
    console.error(`[redisUtils] Erro ao salvar chave ${chave}:`, erro.message);
  }
};

const lerComFallback = async (chave) => {
  try {
    const valor = await redis.get(chave);
    return valor ? JSON.parse(valor) : null;
  } catch (erro) {
    console.error(`[redisUtils] Erro ao ler chave ${chave}:`, erro.message);
    return null;
  }
};

// 🔁 Fallbacks específicos para falhas em banco
const salvarFeedbackFallback = async (dados) => {
  const chave = `feedback_fallback:${dados.token_sessao}`;
  await salvarComTTL(chave, dados, 3600);
};

const salvarDiagnosticoFallback = async (dados) => {
  const chave = `diagnostico_fallback:${dados.token_sessao}`;
  await salvarComTTL(chave, dados, 3600);
};

const salvarSuperpromptTemporario = async (token_sessao, superprompt) => {
  const chave = `superprompt_cache:${token_sessao}`;
  await salvarComTTL(chave, { superprompt }, 900); // 15 minutos
};

const lerSuperpromptTemporario = async (token_sessao) => {
  const chave = `superprompt_cache:${token_sessao}`;
  return await lerComFallback(chave);
};

module.exports = {
  salvarComTTL,
  lerComFallback,
  salvarFeedbackFallback,
  salvarDiagnosticoFallback,
  salvarSuperpromptTemporario,
  lerSuperpromptTemporario
};
