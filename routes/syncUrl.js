// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const express = require("express");
const router = express.Router();
const redisClient = require("../services/redisClient"); // Upstash ou local
const autenticar = require("../middleware/authMiddleware");

/**
 * Endpoint protegido para salvar ou recuperar superprompts temporários do cache.
 * TTL: 1 hora (3600 segundos)
 */
router.post("/", autenticar, async (req, res) => {
  try {
    const { token_sessao, superprompt_gerado } = req.body;

    if (!token_sessao) {
      return res.status(400).json({ erro: "token_sessao é obrigatório" });
    }

    const chaveCache = `superprompt:${token_sessao}`;

    if (superprompt_gerado) {
      await redisClient.set(chaveCache, superprompt_gerado, { EX: 3600 });

      console.debug(`[CACHE] Superprompt salvo | token_sessao: ${token_sessao}`);
      return res.status(200).json({
        status: "superprompt armazenado com sucesso",
        versao_contexto: req.versao_contexto,
        responsavel_IA: req.responsavel_IA,
      });
    } else {
      const cached = await redisClient.get(chaveCache);

      if (cached) {
        return res.status(200).json({
          superprompt_gerado: cached,
          versao_contexto: req.versao_contexto,
          responsavel_IA: req.responsavel_IA,
        });
      } else {
        return res.status(404).json({ erro: "superprompt não encontrado no cache" });
      }
    }
  } catch (erro) {
    console.error("Erro em /proxy/cache_superprompt:", erro.message);
    res.status(500).json({ erro: "Erro ao acessar cache de superprompt" });
  }
});

module.exports = router;
