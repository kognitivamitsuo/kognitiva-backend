const axios = require('axios');
const { openaiKey } = require('../config/config');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.openai.com/v1',
      timeout: 15000, // 15s timeout
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async generateResponse(prompt) {
    try {
      const response = await this.client.post('/chat/completions', {
        model: 'gpt-4-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: process.env.MAX_TOKENS || 500
      });

      return {
        success: true,
        content: response.data.choices[0].message.content
      };
    } catch (error) {
      if (error.response) {
        // Erro da resposta da OpenAI
        logger.error(`OpenAI API erro: ${error.response.status} - ${error.response.data}`);
        throw new Error(`Erro na OpenAI: ${error.response.data.error.message}`);
      } else if (error.request) {
        // Falha na requisição
        logger.error('Falha na requisição à API da OpenAI');
        throw new Error('Serviço de IA indisponível');
      } else {
        // Outro erro
        logger.error(`Erro desconhecido: ${error.message}`);
        throw new Error('Erro desconhecido na interação com o serviço de IA');
      }
    }
  }
}

module.exports = new AIService();
