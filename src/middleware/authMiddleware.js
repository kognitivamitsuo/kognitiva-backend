const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

function verificarToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ erro: 'Token ausente' });

  try {
    const token = auth.split(' ')[1];
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch (error) {
    return res.status(403).json({ erro: 'Token inválido' });
  }
}

module.exports = verificarToken;
