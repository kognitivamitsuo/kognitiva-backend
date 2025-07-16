// Kognitiva v3.6 - Arquivo de configuração global
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

require("dotenv").config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "segredo_padrao_para_teste",
  VERSAO: "v3.6-finalUX",
  RESPONSAVEL: "Kognitiva • Mitsuo AI Architect",
  REDIS_URL: process.env.REDIS_URL,
  POSTGRES_URL: process.env.POSTGRES_URL,
};
