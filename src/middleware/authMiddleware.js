const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');
const logger = require('../utils/logger');

// Enum for roles
const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

module.exports = (roles = []) => {
  return async (req, res, next) => {
    // 1. Verifica token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      logger.warn(`Tentativa de acesso sem token: ${req.ip}`);
      return res.status(401).json({ error: 'Token ausente', code: 'TOKEN_MISSING' });
    }

    // 2. Valida token
    try {
      const decoded = jwt.verify(token, jwtSecret);

      // 3. Autorização por roles (opcional)
      if (roles.length && !roles.includes(decoded.role)) {
        logger.warn(`Acesso negado para role: ${decoded.role} de IP ${req.ip}`);
        return res.status(403).json({ error: 'Acesso não autorizado', code: 'ROLE_FORBIDDEN' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      logger.error(`Falha na autenticação: ${error.message} | IP: ${req.ip}`);
      
      // Identificar o tipo de erro específico
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado', code: 'TOKEN_EXPIRED' });
      }

      return res.status(403).json({ error: 'Token inválido', code: 'INVALID_TOKEN' });
    }
  };
};
