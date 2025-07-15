// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const express = require("express");
const router = express.Router();
const redisClient = require("../services/redisClient"); // Upstash ou local

/**
 * Endpoint auxiliar para cache temporário de superprompts
 * Permite salvar ou recuperar superprompts de forma segura
 */
router.post("/", async (req, res) => {
  try {
    const { token_sessao, superprompt_gerado } = req.body;

    if (!token_sessao) {
      return res.status(400).json({ erro: "token_sessao é obrigatório" });
    }

    if (superprompt_gerado) {
      // Salva no cache com TTL de 1 hora
      await redisClient.set(`superprompt:${token_sessao}`, superprompt_gerado, { EX: 3600 });
      return res.status(200).json({ status: "superprompt armazenado com sucesso" });
    } else {
      // Recupera do cache
      const cached = await redisClient.get(`superprompt:${token_sessao}`);
      if (cached) {
        return res.status(200).json({ superprompt_gerado: cached });
      } else {
        return res.status(404).json({ erro: "superprompt não encontrado no cache" });
      }
    }
  } catch (erro) {
    console.error("Erro em /proxy/cache_superprompt:", erro);
    res.status(500).json({ erro: "Erro ao acessar cache de superprompt" });
  }
});

module.exports = router;
