// src/routes/apiRoutes.js

const express = require('express');
const router = express.Router();

const iaController = require('../controllers/iaController');
const feedbackController = require('../controllers/feedbackController');
const diagnosticoController = require('../controllers/diagnosticoController');
const contextoController = require('../controllers/contextoController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota principal de execução da IA
router.post('/executar', authMiddleware, iaController.executarIA);

// Rota de envio de feedback do usuário
router.post('/feedback', authMiddleware, feedbackController.receberFeedback);

// Rota de geração de diagnóstico final
router.post('/diagnostico', authMiddleware, diagnosticoController.gerarDiagnostico);

// Rota para recuperar o contexto atual (usada para reaproveitamento ou visualização)
router.get('/contexto', authMiddleware, contextoController.obterContexto);

// Rota para salvar o contexto atualizado
router.put('/contexto', authMiddleware, contextoController.salvarContexto);

// Outras rotas podem ser adicionadas aqui conforme necessário...

module.exports = router;
