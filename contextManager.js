// Kognitiva v3.6 - contextManager.js
// Framework: v3.6-finalUX | Última atualização: 2025-07-16
// Responsável: Kognitiva • Mitsuo AI Architect

const fetch = require("node-fetch");
const SHEETS_ENDPOINT = process.env.SHEETS_ENDPOINT; // Ex: https://script.google.com/macros/s/AKfycbx12345/exec
const PLANILHA_PADRAO = "logs_execucao";

/**
 * Envia dados para o WebApp do Google Apps Script que escreve na planilha.
 * @param {string} aba - Nome da aba na planilha (ex: "contexto_reutilizavel")
 * @param {Object} dados - Objeto com os dados a serem enviados
 */
async function sendToSheetsFallback(aba = PLANILHA_PADRAO, dados = {}) {
  if (!SHEETS_ENDPOINT) {
    console.warn("❌ SHEETS_ENDPOINT não configurado no ambiente.");
    return;
  }

  const payload = {
    aba,
    dados,
    enviado_em: new Date().toISOString(),
  };

  try {
    const resposta = await fetch(SHEETS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const resultado = await resposta.json();
    if (!resposta.ok || resultado?.status !== "ok") {
      throw new Error("Erro ao salvar no Google Sheets: " + JSON.stringify(resultado));
    }

    console.log(`✅ Dados enviados com sucesso para a aba '${aba}'.`);
  } catch (erro) {
    console.error("⚠️ Erro ao enviar para Google Sheets:", erro.message);
  }
}

module.exports = {
  sendToSheetsFallback,
};

