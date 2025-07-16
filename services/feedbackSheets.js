// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-16
// Responsável: Kognitiva • Mitsuo AI Architect

const axios = require("axios");
const { gerarHash } = require("../utils/hashUtils");
const { SYNC_URL } = require("../config/config");

/**
 * Envia os dados de feedback para o fallback Google Sheets via GAS.
 * Utiliza o campo `tipo` como nome da aba e aplica token de segurança.
 */
async function sendToSheetsFallback(tipo = "feedback_usuario", dados = {}) {
  try {
    const payload = {
      ...dados,
      tipo,
      token_seguranca: "KOGNITIVA_2025",
    };

    const response = await axios.post(SYNC_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });

    if (response.data?.status === "success") {
      return {
        status: "ok",
        detalhes: response.data.details,
      };
    } else {
      console.warn("Fallback para Sheets falhou:", response.data);
      return {
        status: "erro",
        detalhes: response.data?.error || "Erro desconhecido",
      };
    }
  } catch (err) {
    console.error("Erro ao enviar para fallback Sheets:", err.message);
    return {
      status: "falha",
      detalhes: err.message,
    };
  }
}

module.exports = {
  sendToSheetsFallback,
};
