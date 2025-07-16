// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const aiService = require("../services/aiService");
const { salvarContexto } = require("../models/db");

const VERSAO = "v3.6-finalUX";
const RESPONSAVEL = "Kognitiva • Mitsuo AI Architect";

async function executarIA(req, res) {
  try {
    const {
      pergunta,
      modelo = "gpt-4",
      via = "chat_publico",
      frontend = true,
      token_sessao,
      contexto_score,
      perfil_cliente_inferido,
      origem_inferencia,
    } = req.body;

    if (!pergunta || !token_sessao) {
      return res.status(400).json({ erro: "Campos obrigatórios ausentes." });
    }

    const resultado = await aiService.enviarParaIA(pergunta, modelo);

    if (!resultado || !resultado.resposta) {
      return res.status(500).json({ erro: "Falha ao gerar resposta da IA." });
    }

    const respostaIA = resultado.resposta;

    // Persistência opcional do contexto (B10)
    await salvarContexto({
      token_sessao,
      pergunta,
      respostaIA,
      versao_contexto: VERSAO,
      responsavel_IA: RESPONSAVEL,
      hash_contexto: resultado.hash_contexto || null,
    });

    // Diagnóstico automático (B16) se contexto_score e score_resposta existirem
    const diagnostico_gerado = contexto_score && resultado.score_resposta
      ? {
          contexto_score,
          score_resposta: resultado.score_resposta,
          media_diagnostico: (contexto_score + resultado.score_resposta) / 2,
          qualidade: resultado.score_resposta >= 9 ? "excelente" :
                     resultado.score_resposta >= 7 ? "boa" : "regular",
        }
      : null;

    return res.status(200).json({
      resposta: respostaIA,
      modelo_utilizado: modelo,
      versao_contexto: VERSAO,
      responsavel_IA: RESPONSAVEL,
      diagnostico_gerado,
    });

  } catch (erro) {
    console.error("❌ Erro ao executar IA:", erro.message);
    return res.status(500).json({ erro: "Erro interno na execução da IA" });
  }
}

module.exports = {
  executarIA,
};
