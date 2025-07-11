'use strict';

const express = require('express');
const router = express.Router();

// Ajuste para caminhos relativos diretos
const iaController = require('../controllers/iaController');  // Caminho relativo
const feedbackController = require('../controllers/feedbackController');  // Caminho relativo
const diagnosticoController = require('../controllers/diagnosticoController');  // Caminho relativo
const contextoController = require('../controllers/contextoController');  // Caminho relativo
const authMiddleware = require('../middleware/authMiddleware');  // Caminho relativo

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
