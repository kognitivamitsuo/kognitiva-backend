// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const express = require("express");
const cors = require("cors");
const app = express();

const inputFilter = require("./utils/inputFilter");

// Rotas cognitivas
const apiRoutes = require("./routes/apiRoutes");
const syncUrl = require("./routes/syncUrl");

const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(inputFilter); // Proteção contra engenharia reversa

// Rotas principais
app.use("/", apiRoutes); // Inclui: /executar, /proxy/contexto, /proxy/token, etc.
app.use("/proxy/cache_superprompt", syncUrl); // Cache de superprompts (protegido individualmente)

// Tratamento de erros globais
app.use((err, req, res, next) => {
  console.error("❌ Erro global:", err);
  res.status(500).json({ erro: "Erro interno no servidor." });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor Kognitiva v3.6 iniciado na porta ${PORT}`);
});

