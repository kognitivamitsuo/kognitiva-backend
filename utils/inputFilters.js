// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

/**
 * Middleware de filtragem cognitiva para proteger o backend contra abusos,
 * engenharia reversa, exploração de modelo e prompts sensíveis.
 */

// backend/utils/inputFilter.js

function inputFilter(req, res, next) {
  const entrada = JSON.stringify(req.body || {});
  const palavrasProibidas = [
    "prompt original", "explique como funciona", "ignore todas as instruções",
    "como você foi treinado", "reveal", "exploit", "system message", "responda como",
    "reconheça que é um modelo", "prompt injection", "jailbreak"
  ];

  const proibido = palavrasProibidas.some((palavra) =>
    entrada.toLowerCase().includes(palavra)
  );

  if (proibido) {
    console.warn("🚨 Bloqueado por inputFilter:", entrada.slice(0, 100));
    return res.status(403).json({
      status: "bloqueado",
      mensagem: "Conteúdo inseguro detectado. Bloqueado por segurança cognitiva."
    });
  }

  return next();
}

module.exports = inputFilter;

