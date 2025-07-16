// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect

/**
 * Middleware de filtragem cognitiva para proteger o backend contra abusos,
 * engenharia reversa, exploração de modelo e prompts sensíveis.
 */

function inputFilter(req, res, next) {
  const entrada = JSON.stringify(req.body || {});

  // Padrões bloqueados
  const palavrasProibidas = [
    "prompt original", "explique como funciona", "ignore todas as instruções",
    "como você foi treinado", "reveal", "exploit", "system message", "responda como",
    "reconheça que é um modelo", "prompt injection", "jailbreak"
  ];

  const proibido = palavrasProibidas.some((palavra) =>
    entrada.toLowerCase().includes(palavra)
  );

  if (proibido) {
    console.warn("🚨 Requisição bloqueada por inputFilter.js:", entrada.slice(0, 200));

    return res.status(403).json({
      status: "bloqueado",
      mensagem: "Conteúdo da requisição contém termos proibidos por segurança cognitiva.",
    });
  }

  return next();
}

module.exports = inputFilter;

