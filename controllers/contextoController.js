// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const contextManager = require("../contextManager");

const VERSAO = "v3.6-finalUX";
const RESPONSAVEL = "Kognitiva • Mitsuo AI Architect";

/**
 * Controlador responsável por salvar ou atualizar o contexto da sessão
 * Atende aos blocos B04–B06 + B19 do framework
 */
async function salvarContexto(req, res) {
  try {
    const contexto = req.body;

    // ✅ Validação mínima obrigatória (bloco B04)
    if (!contexto.nome_empresa || !contexto.site_empresa) {
      return res.status(400).json({
        erro: "Campos obrigatórios ausentes: nome_empresa ou site_empresa",
        contexto_valido: false,
      });
    }

    // 🔄 Preenchimento automático dos campos padrão
    contexto.contexto_valido = true;
    contexto.versao_contexto = VERSAO;
    contexto.responsavel_IA = RESPONSAVEL;

    // 🔍 Bloco B06 – Inferência padrão se não vier preenchido
    contexto.perfil_cliente_inferido = contexto.perfil_cliente_inferido || "não informado";
    contexto.origem_inferencia = contexto.origem_inferencia || "manual/default";
    contexto.contexto_score = contexto.contexto_score || 100;

    // Salva no Redis e PostgreSQL via contextManager
    await contextManager.salvarContexto(contexto);

    return res.status(200).json({
      status: "Contexto salvo com sucesso",
      contexto_valido: true,
    });

  } catch (erro) {
    console.error("Erro ao salvar contexto:", erro);
    return res.status(500).json({ erro: "Erro ao processar o contexto" });
  }
}

module.exports = {
  salvarContexto,
};
