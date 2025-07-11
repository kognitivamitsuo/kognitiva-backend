const axios = require('axios');
const { openaiKey } = require('../config/config');

async function generateResponse(prompt) {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }]
    }, {
      timeout: 10000, // 10s timeout
      headers: { Authorization: `Bearer ${openaiKey}` }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI error:', error.response?.data || error.message);
    throw new Error('Failed to generate AI response');
  }
}

module.exports = { generateResponse };
