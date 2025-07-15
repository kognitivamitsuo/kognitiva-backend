// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const { gerarTokenSessao } = require("../authHandler");
const { registrarLogExecucao } = require("../services/logger");

/**
 * Controlador responsável por gerar o token JWT inicial e retorná-lo ao frontend
 * Atende ao fluxo B01 → B02 → B03
 */
async function gerarToken(req, res) {
  try {
    const { token, token_sessao } = gerarTokenSessao();

    // Log opcional (não obrigatório, mas útil para rastrear sessões anônimas)
    await registrarLogExecucao({
      token_sessao,
      tipo_fallback: null,
      modelo_utilizado: null,
      superprompt_gerado: null,
      resposta_IA: null,
      ms_execucao: 0,
      hash_contexto: null,
      versao_contexto: "v3.6-finalUX",
      responsavel_IA: "Kognitiva • Mitsuo AI Architect",
    });

    return res.status(200).json({ token, token_sessao });
  } catch (erro) {
    console.error("Erro ao gerar token de sessão:", erro);
    return res.status(500).json({ erro: "Erro ao gerar token de sessão" });
  }
}

module.exports = {
  gerarToken,
};
