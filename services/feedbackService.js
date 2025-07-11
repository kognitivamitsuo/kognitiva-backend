'use strict';

// Remover qualquer uso de alias e substituir por caminhos relativos
const pool = require('../models/db');  // Caminho relativo

/**
 * Salva o feedback no banco de dados
 * @param {number} userId - ID do usuário
 * @param {string} feedback - Feedback dado pelo usuário
 * @param {string} comentario - Comentário adicional do usuário
 */
async function salvarFeedback(userId, feedback, comentario) {
  const query = 'INSERT INTO feedbacks (user_id, feedback, comentario) VALUES ($1, $2, $3)';
  await pool.query(query, [userId, feedback, comentario]);
}

module.exports = { salvarFeedback };
