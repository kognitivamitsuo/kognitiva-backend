// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

const express = require("express");
const cors = require("cors");
const app = express();

const inputFilter = require("./utils/inputFilter");
const authMiddleware = require("./middleware/authMiddleware");
const apiRoutes = require("./routes/apiRoutes");
const syncUrlRoutes = require("./routes/syncUrl");

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ⚠️ Ordem importa: segurança cognitiva antes da autenticação
app.use(inputFilter);
app.use(authMiddleware);

// Rotas principais
app.use("/", apiRoutes);
app.use("/proxy/cache_superprompt", syncUrlRoutes);

// Erros globais
app.use((err, req, res, next) => {
  console.error("❌ Erro capturado globalmente:", err);
  res.status(500).json({ erro: "Erro interno no servidor." });
});

// Inicialização
app.listen(PORT, () => {
  console.log(`🧠 Kognitiva v3.6 rodando na porta ${PORT}`);
});
