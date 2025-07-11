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
          Authorization: `Bearer ${openaiKey}`,
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
