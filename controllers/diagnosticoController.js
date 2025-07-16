// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect
// Componente: diagnosticoController.js | versao_componente: 1.0.0

const { gerarDiagnostico } = require('../diagnosticoEngine');

const diagnosticoController = async (req, res) => {
  try {
    const {
      token_sessao,
      contexto_score,
      score_resposta,
      modelo_utilizado,
      versao_contexto,
      responsavel_IA,
      hash_contexto
    } = req.body;

    if (!token_sessao || !contexto_score || !score_resposta) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Campos obrigatórios ausentes para diagnóstico.'
      });
    }

    const resultado = await gerarDiagnostico({
      token_sessao,
      contexto_score,
      score_resposta,
      modelo_utilizado,
      versao_contexto,
      responsavel_IA,
      hash_contexto
    });

    return res.status(200).json(resultado);

  } catch (erro) {
    console.error('[diagnosticoController] Erro ao processar diagnóstico:', erro.message);

    return res.status(500).json({
      sucesso: false,
      erro: 'Erro interno ao gerar diagnóstico.',
      fallback_ativado: true
    });
  }
};

module.exports = {
  diagnosticoController
};
