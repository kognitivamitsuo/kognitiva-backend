// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Função utilitária para executar queries
async function executarQuery(texto, valores = []) {
  const client = await pool.connect();
  try {
    const resultado = await client.query(texto, valores);
    return resultado;
  } finally {
    client.release();
  }
}

// 🧠 Diagnóstico (B16)
async function salvarDiagnostico(diagnostico) {
  const query = `
    INSERT INTO logs_execucao (
      token_sessao, contexto_score, score_resposta,
      media_diagnostico, qualidade, timestamp,
      versao_contexto, responsavel_IA, hash_contexto
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
  `;
  const valores = [
    diagnostico.token_sessao,
    diagnostico.contexto_score,
    diagnostico.score_resposta,
    diagnostico.media_diagnostico,
    diagnostico.qualidade,
    diagnostico.timestamp,
    diagnostico.versao_contexto,
    diagnostico.responsavel_IA,
    diagnostico.hash_contexto,
  ];
  await executarQuery(query, valores);
}

// 💬 Feedback (B17)
async function salvarFeedback(feedback) {
  const query = `
    INSERT INTO feedback_usuario (
      token_sessao, score_resposta, comentario_usuario,
      contexto_score, hash_contexto,
      versao_contexto, responsavel_IA, timestamp
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
  `;
  const valores = [
    feedback.token_sessao,
    feedback.score_resposta,
    feedback.comentario_usuario,
    feedback.contexto_score,
    feedback.hash_contexto,
    feedback.versao_contexto,
    feedback.responsavel_IA,
    feedback.timestamp,
  ];
  await executarQuery(query, valores);
}

// ♻️ Contexto (B10)
async function salvarContexto(contexto) {
  const query = `
    INSERT INTO contexto_reutilizavel (
      token_sessao, pergunta, respostaIA, hash_contexto,
      versao_contexto, responsavel_IA, timestamp
    ) VALUES ($1,$2,$3,$4,$5,$6,$7)
  `;
  const valores = [
    contexto.token_sessao,
    contexto.pergunta,
    contexto.respostaIA,
    contexto.hash_contexto,
    contexto.versao_contexto,
    contexto.responsavel_IA,
    new Date().toISOString(),
  ];
  await executarQuery(query, valores);
}

// 🔐 Token JWT
async function salvarTokenSessao({ token_sessao, modelo, via }) {
  const query = `
    INSERT INTO tokens_sessao (
      token_sessao, modelo_utilizado, via_origem, criado_em
    ) VALUES ($1,$2,$3,$4)
  `;
  const valores = [
    token_sessao,
    modelo,
    via,
    new Date().toISOString(),
  ];
  await executarQuery(query, valores);
}

module.exports = {
  salvarDiagnostico,
  salvarFeedback,
  salvarContexto,
  salvarTokenSessao,
};
