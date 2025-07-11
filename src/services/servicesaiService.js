'use strict';

// Remover qualquer uso de alias e importar diretamente
const axios = require('axios');  // Caminho direto para axios
const openaiKey = process.env.OPENAI_API_KEY;  // Certifique-se de que a chave da API está configurada corretamente no ambiente

/**
 * Gera uma resposta com base no prompt fornecido utilizando a API da OpenAI.
 * @param {string} prompt - O prompt enviado para o modelo.
 * @returns {string} - A resposta gerada pelo modelo.
 */
async function gerarResposta(prompt) {
  try {
    const resposta = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${openaiKey}`,  // A chave de API deve ser configurada corretamente
          'Content-Type': 'application/json'
        }
      }
    );
    return resposta.data.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao gerar resposta:', error);
    throw new Error('Erro ao acessar a API da OpenAI');
  }
}

module.exports = { gerarResposta };
