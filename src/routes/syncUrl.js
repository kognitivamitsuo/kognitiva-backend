// routes/syncUrl.js

const express = require("express");
const router = express.Router();

// Rota pública que retorna o valor de SYNC_URL para o frontend
router.get("/proxy/sync_url", (req, res) => {
  const syncUrl = process.env.SYNC_URL || null;

  if (!syncUrl) {
    return res.status(500).json({ error: "SYNC_URL não configurado no backend." });
  }

  res.json({ sync_url: syncUrl });
});

module.exports = router;
