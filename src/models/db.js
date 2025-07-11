'use strict';

// Importação de Pool do pg para criar a conexão com o PostgreSQL
const { Pool } = require('pg');  

// Ajuste do caminho para o arquivo de configuração
const { databaseUrl } = require('../config/config');  // Caminho relativo para o arquivo de configuração

// Criação da instância do pool para gerenciar as conexões com o banco de dados
const pool = new Pool({ connectionString: databaseUrl });

module.exports = pool;
