# AGENTS.md

## Introdução

Os **agents** são componentes autônomos que desempenham papéis críticos na execução e gestão de interações dentro da plataforma Kognitiva. Cada agent é responsável por realizar uma tarefa específica, como coletar feedback do usuário, executar consultas de IA, monitorar o desempenho do sistema ou realizar manipulações de dados no backend.

Este documento visa fornecer uma visão geral de como os agentes devem ser estruturados e interagir com a plataforma Kognitiva.

## Tipos de Agents

### 1. **Feedback Agent**
O **Feedback Agent** coleta o feedback do usuário durante e após as interações com a IA. Ele registra as respostas dos usuários sobre a qualidade das respostas fornecidas pela IA, além de ajustar o comportamento da IA com base nesses dados.

- **Responsabilidades:**
  - Coletar feedback positivo ou negativo do usuário.
  - Armazenar feedback no banco de dados.
  - Ajustar dinamicamente o comportamento da IA com base no feedback.

- **Exemplo de código:**
  ```js
  class FeedbackAgent {
      constructor() {
          this.feedbackStorage = new FeedbackStorage();
      }

      collectFeedback(feedbackData) {
          // Lógica para coletar feedback
          this.feedbackStorage.store(feedbackData);
      }

      adjustIA(feedback) {
          // Ajuste baseado no feedback
          if (feedback === 'negativo') {
              // Reduz a complexidade das respostas
          } else {
              // Melhora a clareza
          }
      }
  }
2. Execution Agent
O Execution Agent é responsável por acionar a execução da IA. Ele recebe os prompts de usuários, interage com a API de IA (como OpenAI), processa a resposta e a retorna ao frontend.

Responsabilidades:
Receber prompts de usuários.
Enviar o prompt para a IA e recuperar a resposta.
Processar e enviar a resposta da IA de volta ao usuário.
Exemplo de código:
class ExecutionAgent {
    constructor() {
        this.aiService = new AIService();
    }

    executePrompt(prompt) {
        return this.aiService.generateResponse(prompt)
            .then(response => {
                // Processa a resposta e envia de volta ao usuário
                return response;
            });
    }
}
3. Monitoring Agent
O Monitoring Agent monitora o desempenho do sistema, verificando métricas como tempo de resposta da IA, uso de tokens, e integridade das conexões com a base de dados e o Redis.

Responsabilidades:
Monitorar a saúde do sistema.
Enviar alertas se houver falhas de desempenho ou de conexão.
Registrar métricas para análise posterior.
Exemplo de código:
class MonitoringAgent {
    constructor() {
        this.metricsService = new MetricsService();
    }

    monitorPerformance() {
        const metrics = this.metricsService.collectMetrics();
        if (metrics.responseTime > 2000) {
            // Envia um alerta de performance
            this.sendAlert('Alerta: Tempo de resposta elevado!');
        }
    }

    sendAlert(message) {
        // Envia um alerta para a equipe técnica
        console.log(message);
    }
}
4. Context Management Agent
O Context Management Agent lida com a persistência do contexto do usuário, utilizando o Redis e o PostgreSQL. Ele garante que o contexto do usuário seja mantido entre as interações, permitindo que os agentes reutilizem o contexto e forneçam respostas mais precisas.

Responsabilidades:
Salvar e recuperar o contexto do usuário no Redis e PostgreSQL.
Garantir que o contexto esteja atualizado e válido antes de qualquer execução.
Exemplo de código:
class ContextManagementAgent {
    constructor() {
        this.redisClient = new RedisClient();
        this.dbClient = new DatabaseClient();
    }

    saveContext(userId, context) {
        this.redisClient.saveContext(userId, context);
        this.dbClient.saveContext(userId, context);
    }

    getContext(userId) {
        return this.redisClient.getContext(userId);
    }
}
Diretrizes para Implementação

Nomeação de Agents:
Use convenções claras de nomenclatura, como FeedbackAgent, ExecutionAgent, MonitoringAgent, etc.
Estrutura de Diretórios:
Coloque os arquivos dos agentes em um diretório dedicado, como src/agents/, para facilitar o gerenciamento e a escalabilidade.
Modularidade e Testes:
Cada agent deve ser implementado de maneira modular, permitindo a fácil substituição ou atualização no futuro.
Implemente testes unitários e de integração para garantir o bom funcionamento de cada agent.
Reutilização de Contexto:
O Context Management Agent deve garantir que o contexto seja reutilizado de forma eficiente para evitar chamadas desnecessárias à IA e reduzir custos de tokens.
Segurança e Conformidade

Validação de Dados: Todos os dados coletados (como feedback ou contexto do usuário) devem ser validados para garantir a integridade e evitar problemas de segurança.
LGPD e Proteção de Dados: Garantir que todos os agentes sigam as normas da Lei Geral de Proteção de Dados (LGPD), especialmente no que diz respeito à coleta e uso de dados pessoais.
Conclusão

Este arquivo serve como uma base para a implementação de agentes na plataforma Kognitiva. Cada tipo de agent tem uma responsabilidade clara e deve ser integrado ao sistema com cuidado para garantir um funcionamento eficiente, seguro e em conformidade com as regulamentações.

Adapte e estenda os agentes conforme necessário para atender aos requisitos específicos do seu projeto.


### **Passos Finais:**
1. **Crie o arquivo `AGENTS.md`:**  
   Coloque esse conteúdo em um arquivo chamado **`AGENTS.md`** no diretório do seu backend (ex: `src/agents/` ou na raiz do repositório backend).

2. **Comunique a Equipe de Desenvolvimento:**  
   Informe sua equipe sobre as novas diretrizes para implementação de agentes no sistema Kognitiva. Isso garantirá que todos sigam a mesma estrutura e boas práticas.

Se você precisar de mais alguma ajuda com a implementação ou ajustes adicionais, posso orientar você conforme necessário!
