const pool = require('../models/db');

async function salvarFeedback(userId, feedback, comentario) {
  const query = 'INSERT INTO feedbacks (user_id, feedback, comentario) VALUES ($1, $2, $3)';
  await pool.query(query, [userId, feedback, comentario]);
}

module.exports = { salvarFeedback };
