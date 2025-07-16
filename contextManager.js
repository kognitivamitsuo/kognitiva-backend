// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-16
// Responsável: Kognitiva • Mitsuo AI Architect

const redis = require("./services/redisUtils");
const db = require("./models/db");
const { gerarHash } = require("./utils/hashUtils");

// Fallback seguro: usa função mock caso feedbackSheets.js não esteja implementado
let sendToSheetsFallback = async () => {
  console.warn("⚠️ fallbackSheets.js ausente — fallback ignorado.");
};
try {
  const fallback = require("./services/feedbackSheets");
  if (typeof fallback.sendToSheetsFallback === "function") {
    sendToSheetsFallback = fallback.sendToSheetsFallback;
  }
} catch {
  // Ignorado: módulo opcional, fallback será silencioso
}

const VERSAO = "v3.6-finalUX";
const RESPONSAVEL = "Kognitiva • Mitsuo AI Architect";
const TTL_SEGUNDOS = 3600;

/**
 * Salva o contexto do usuário no Redis com TTL e também no PostgreSQL.
 * Se falhar, ativa fallback para Google Sheets.
 */
async function salvarContextoCompleto(contexto) {
  const tokenSessao = contexto?.token_sessao;
  if (!tokenSessao) throw new Error("Token da sessão ausente no contexto");

  const contextoBase = {
    ...contexto,
    hash_contexto: gerarHash(contexto),
    versao_contexto: VERSAO,
    responsavel_IA: RESPONSAVEL,
    timestamp: new Date().toISOString(),
  };

  // 1️⃣ Redis com TTL
  try {
    await redis.setWithTTL(`contexto:${tokenSessao}`, contextoBase, TTL_SEGUNDOS);
  } catch (erroRedis) {
    console.warn("⚠️ Falha ao salvar contexto no Redis:", erroRedis.message);
  }

  // 2️⃣ PostgreSQL
  try {
    await db.salvarContexto(contextoBase);
  } catch (erroSQL) {
    console.warn("⚠️ Fallback ativado: PostgreSQL indisponível:", erroSQL.message);
    await sendToSheetsFallback("contexto_reutilizavel", contextoBase);
  }
}

/**
 * Recupera o contexto do Redis. Se não encontrar, tenta PostgreSQL. Se falhar, retorna null.
 */
async function recuperarContextoPorToken(tokenSessao) {
  if (!tokenSessao) return null;

  // 1️⃣ Redis
  try {
    const contexto = await redis.get(`contexto:${tokenSessao}`);
    if (contexto) return contexto;
  } catch (erroRedis) {
    console.warn("⚠️ Falha no Redis ao buscar contexto:", erroRedis.message);
  }

  // 2️⃣ PostgreSQL
  try {
    const contextoDB = await db.buscarContexto(tokenSessao);
    if (contextoDB) return contextoDB;
  } catch (erroSQL) {
    console.warn("⚠️ Falha no PostgreSQL ao buscar contexto:", erroSQL.message);
  }

  return null;
}

module.exports = {
  salvarContextoCompleto,
  recuperarContextoPorToken,
};
