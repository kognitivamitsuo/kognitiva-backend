// Kognitiva v3.6 - Arquivo gerado automaticamente
// Framework: v3.6-finalUX | Última atualização: 2025-07-15
// Responsável: Kognitiva • Mitsuo AI Architect
// Componente: aiService.js | versao_componente: 1.0.0

const axios = require('axios');
const { registrarLog } = require('./logger');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TIMEOUT_MS = 15000;

const chamarOpenAI = async ({ superprompt, modeloPreferido = 'gpt-4o', token_sessao }) => {
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const modelosFallback = ['gpt-4o', 'gpt-3.5-turbo'];

  for (let modelo of modelosFallback) {
    try {
      const resposta = await axios.post(
        endpoint,
        {
          model: modelo,
          messages: [
            { role: 'system', content: 'Você é um assistente comercial da Kognitiva.' },
            { role: 'user', content: superprompt }
          ],
          temperature: 0.7,
          max_tokens: 1024
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: TIMEOUT_MS
        }
      );

      const conteudo = resposta?.data?.choices?.[0]?.message?.content || '';
      const tokens_utilizados = resposta?.data?.usage?.total_tokens || 0;

      await registrarLog({
        tipo: 'execucao',
        token_sessao,
        modelo_utilizado: modelo,
        versao_contexto: 'v3.6-finalUX',
        responsavel_IA: 'Kognitiva • Mitsuo AI Architect',
        observacoes: `tokens=${tokens_utilizados}`
      });

      return {
        sucesso: true,
        resposta: conteudo,
        modelo_utilizado: modelo,
        tokens_utilizados
      };

    } catch (erro) {
      console.warn(`[aiService] Erro com modelo ${modelo}: ${erro.message}`);
      // tenta o próximo modelo
    }
  }

  // Se todos os modelos falharem:
  await registrarLog({
    tipo: 'execucao',
    token_sessao,
    versao_contexto: 'v3.6-finalUX',
    responsavel_IA: 'Kognitiva • Mitsuo AI Architect',
    observacoes: 'Falha completa na OpenAI – fallback aplicado'
  });

  return {
    sucesso: false,
    erro: 'Falha ao acessar a OpenAI. Tente novamente mais tarde.',
    fallback: true
  };
};

module.exports = {
  chamarOpenAI
};
