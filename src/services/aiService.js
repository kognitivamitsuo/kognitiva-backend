const axios = require('axios');
const { openaiKey } = require('../config/config');

async function gerarResposta(prompt) {
  const resposta = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    },
    {
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return resposta.data.choices[0].message.content;
}

module.exports = { gerarResposta };
