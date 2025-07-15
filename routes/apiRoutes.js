// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const express = require("express");
const router = express.Router();

// Controllers
const tokenController = require("../controllers/tokenController");
const contextoController = require("../controllers/contextoController");
const feedbackController = require("../controllers/feedbackController");
const diagnosticoController = require("../controllers/diagnosticoController");
const iaController = require("../controllers/iaController");

// Rota para geração do token de sessão (início do fluxo)
router.post("/proxy/token", tokenController.gerarToken);

// Rota para salvar ou atualizar contexto do cliente
router.post("/proxy/contexto", contextoController.salvarContexto);

// Rota para envio de feedback do usuário (score + comentário)
router.post("/proxy/feedback", feedbackController.receberFeedback);

// Rota para diagnóstico cognitivo da resposta (B16)
router.post("/proxy/diagnostico", diagnosticoController.gerarDiagnostico);

// Rota principal de execução da IA (superprompt → resposta)
router.post("/executar", iaController.executarIA);

module.exports = router;

