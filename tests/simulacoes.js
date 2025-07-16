// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const fetch = require("node-fetch");

const BASE_URL = "https://sync.kognitiva.app";
let TOKEN = null;
let TOKEN_SESSAO = null;

async function gerarToken() {
  console.log("🔐 Gerando token...");
  const resposta = await fetch(`${BASE_URL}/proxy/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });

  const json = await resposta.json();
  TOKEN = json.token;
  TOKEN_SESSAO = json.token_sessao;

  console.log("✅ Token gerado:", TOKEN_SESSAO);
}

async function enviarContexto() {
  console.log("📤 Enviando contexto...");

  const payload = {
    token_sessao: TOKEN_SESSAO,
    nome_empresa: "Empresa Teste S/A",
    site_empresa: "https://exemplo.com",
    perfil_cliente_inferido: "curioso",
    origem_inferencia: "simulação de teste",
    contexto_score: 100
  };

  const resposta = await fetch(`${BASE_URL}/proxy/contexto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`
    },
    body: JSON.stringify(payload)
  });

  const json = await resposta.json();
  console.log("✅ Contexto salvo:", json);
}

async function executarIA() {
  console.log("🧠 Executando IA...");

  const payload = {
    pergunta: "Quais os benefícios do uso de IA em vendas B2B?",
    token_sessao: TOKEN_SESSAO,
    modelo: "gpt-4",
    via: "chat_publico",
    frontend: true,
    contexto_score: 100,
    perfil_cliente_inferido: "curioso",
    origem_inferencia: "simulação de teste"
  };

  const resposta = await fetch(`${BASE_URL}/executar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`
    },
    body: JSON.stringify(payload)
  });

  const json = await resposta.json();
  console.log("✅ Resposta da IA:", json.resposta);
  return json;
}

async function enviarFeedback(score_resposta = 10, comentario = "Excelente resposta.") {
  console.log("📥 Enviando feedback...");

  const payload = {
    token_sessao: TOKEN_SESSAO,
    score_resposta,
    comentario_usuario: comentario,
    contexto_score: 100
  };

  const resposta = await fetch(`${BASE_URL}/proxy/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`
    },
    body: JSON.stringify(payload)
  });

  const json = await resposta.json();
  console.log("✅ Feedback registrado:", json);
}

async function gerarDiagnostico(score_resposta = 10) {
  console.log("📊 Gerando diagnóstico...");

  const payload = {
    token_sessao: TOKEN_SESSAO,
    contexto_score: 100,
    score_resposta
  };

  const resposta = await fetch(`${BASE_URL}/proxy/diagnostico`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`
    },
    body: JSON.stringify(payload)
  });

  const json = await resposta.json();
  console.log("✅ Diagnóstico gerado:", json);
}

(async () => {
  console.log("🚀 Iniciando dry-run completo da Kognitiva v3.6...");

  await gerarToken();
  await enviarContexto();

  const respostaIA = await executarIA();
  const scoreGerado = respostaIA?.diagnostico_gerado?.score_resposta || 10;

  await enviarFeedback(scoreGerado);
  await gerarDiagnostico(scoreGerado);

  console.log("🏁 Dry-run finalizado com sucesso.");
})();
