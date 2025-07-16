// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const express = require("express");
const router = express.Router();

// Importação de middlewares e controllers
const autenticar = require("../middleware/authMiddleware");

const iaController = require("../controllers/iaController");
const tokenController = require("../controllers/tokenController");
const contextoController = require("../controllers/contextoController");
const feedbackController = require("../controllers/feedbackController");
const diagnosticoController = require("../controllers/diagnosticoController");

// Rota pública para geração de token JWT (sem autenticação)
router.post("/proxy/token", tokenController.gerarTokenJWT);

// Rotas protegidas com middleware cognitivo
router.post("/executar", autenticar, iaController.executarIA);
router.post("/proxy/contexto", autenticar, contextoController.salvarOuAtualizarContexto);
router.post("/proxy/feedback", autenticar, feedbackController.receberFeedback);
router.post("/proxy/diagnostico", autenticar, diagnosticoController.gerarDiagnostico);

// [Opcional] Rota protegida para cache do superprompt
router.get("/proxy/cache_superprompt", autenticar, iaController.recuperarSuperpromptSalvo);

module.exports = router;
