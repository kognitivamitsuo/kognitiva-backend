// Kognitiva v3.6 - Simulação com Rastreamento Avançado
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const fetch = require("node-fetch");

const BASE_URL = "https://sync.kognitiva.app";
let TOKEN = null;
let TOKEN_SESSAO = null;

async function gerarToken() {
  console.log("🔐 Gerando token de sessão...");
  const resposta = await fetch(`${BASE_URL}/proxy/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });

  const json = await resposta.json();
  TOKEN = json.token;
  TOKEN_SESSAO = json.token_sessao;

  console.debug("🧾 Token JWT:", TOKEN);
  console.debug("📎 Token Sessão:", TOKEN_SESSAO);
}

async function enviarContexto() {
  console.log("📤 Enviando contexto da empresa...");

  const payload = {
    token_sessao: TOKEN_SESSAO,
    nome_empresa: "Empresa Teste S/A",
    site_empresa: "https://exemplo.com",
    perfil_cliente_inferido: "curioso",
    origem_inferencia: "simulacao_debug",
    contexto_score: 100,
    confirmado_usuario: true
  };

  console.debug("📨 Payload de contexto:", payload);

  const resposta = await fetch(`${BASE_URL}/proxy/contexto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(payload)
  });

  const json = await resposta.json();
  console.debug("📬 Resposta do contexto:", json);
}

async function executarIA() {
  console.log("🧠 Executando IA (gpt-4)...");

  const payload = {
    pergunta: "Como a IA pode melhorar negociações comerciais?",
    modelo: "gpt-4",
    via: "chat_publico",
    frontend: true,
    token_sessao: TOKEN_SESSAO,
    contexto_score: 100,
    perfil_cliente_inferido: "curioso",
    origem_inferencia: "simulacao_debug"
  };

  console.debug("📨 Payload de execução:", payload);

  const resposta = await fetch(`${BASE_URL}/executar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(payload)
  });

  const json = await resposta.json();
  console.debug("📬 Resposta da IA:", json);

  return json;
}

async function enviarFeedback(score = 9) {
  console.log("📥 Enviando feedback...");

  const payload = {
    token_sessao: TOKEN_SESSAO,
    score_resposta: score,
    comentario_usuario: "Resposta muito útil",
    contexto_score: 100
  };

  console.debug("📨 Payload de feedback:", payload);

  const resposta = await fetch(`${BASE_URL}/proxy/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(payload)
  });

  const json = await resposta.json();
  console.debug("📬 Resposta do feedback:", json);
}

async function gerarDiagnostico(score = 9) {
  console.log("📊 Gerando diagnóstico...");

  const payload = {
    token_sessao: TOKEN_SESSAO,
    contexto_score: 100,
    score_resposta: score
  };

  console.debug("📨 Payload de diagnóstico:", payload);

  const resposta = await fetch(`${BASE_URL}/proxy/diagnostico`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(payload)
  });

  const json = await resposta.json();
  console.debug("📬 Diagnóstico recebido:", json);
}

(async () => {
  console.log("🚀 Iniciando simulação cognitiva completa da Kognitiva v3.6...");

  await gerarToken();
  await enviarContexto();

  const execucao = await executarIA();
  const score = execucao?.score_resposta || 9;

  await enviarFeedback(score);
  await gerarDiagnostico(score);

  console.log("🏁 Simulação finalizada com sucesso.");
})();
