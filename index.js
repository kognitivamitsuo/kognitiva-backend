// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares de segurança e rastreabilidade
const inputFilter = require("./utils/inputFilter");
const authMiddleware = require("./middleware/authMiddleware");

// Rotas cognitivas
const apiRoutes = require("./routes/apiRoutes");
const syncUrlRoutes = require("./routes/syncUrl");

const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(inputFilter);       // Filtro cognitivo: bloqueio de engenharia reversa
app.use(authMiddleware);    // JWT obrigatório em todas as rotas abaixo

// Rotas principais
app.use("/", apiRoutes);                          // Rotas: /executar, /proxy/contexto, /proxy/token, etc.
app.use("/proxy/cache_superprompt", syncUrlRoutes); // Rota auxiliar para cache de prompts

// Tratamento de erros globais
app.use((err, req, res, next) => {
  console.error("❌ Erro global:", err);
  res.status(500).json({ erro: "Erro interno no servidor." });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor Kognitiva v3.6 iniciado na porta ${PORT}`);
});

