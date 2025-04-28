require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env

const mysql = require('mysql2/promise'); // Importa a versão promise do mysql2

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 3306,
    waitForConnections: true, // Espera por conexões disponíveis se todas estiverem em uso
    connectionLimit: 10, // Número máximo de conexões no pool
    queueLimit: 0 // Número máximo de requisições em fila esperando por uma conexão. 0 significa sem limite.
};

console.log(dbConfig); // Exibe a configuração do banco de dados (remova em produção por segurança)

/**
 * Estabelece uma conexão individual com o banco de dados MySQL.
 * @returns {Promise<mysql.Connection | null>} Uma Promise que resolve para um objeto de conexão MySQL ou null em caso de erro.
 */
async function connect() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Conexão individual ao banco de dados estabelecida.");

        // Teste de conexão
        await connection.execute('SELECT 1'); // Executa uma query simples para verificar a conexão
        console.log("Teste de conexão bem-sucedido.");

        return connection; // Retorna a conexão

    } catch (error) {
        console.error("Erro ao conectar ao banco de dados (conexão individual):", error.message, error.code);
        return null; // Retorna null em caso de erro
    } finally { //Adicionado para fechar a conexão em caso de sucesso ou falha
        if (connection) {
            connection.end();
            console.log('Conexão fechada após o uso.');
        }
    }
}

/**
 * Testa a conexão com o banco de dados, obtendo uma conexão do pool e realizando uma query.
 * @returns {Promise<void>}
 */
async function testConnection() {
    try {
        const connection = await pool.getConnection(); // Obtém uma conexão do pool
        console.log('Conexão obtida do pool com sucesso. Testando...');
        const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
        console.log("Teste bem-sucedido!", rows);
        connection.release(); // Devolve a conexão ao pool
        console.log('Conexão devolvida ao pool.');
    } catch (error) {
        console.error("Erro ao testar conexão do pool:", error);
    }
}

testConnection(); // Chama a função de teste

const pool = mysql.createPool(dbConfig); // Cria um pool de conexões
console.log("Pool de conexões criado.");

// Adiciona tratamento de erro para o pool
pool.on('error', (err) => {
  console.error('Erro no pool de conexões:', err);
});

module.exports = { connect, pool }; // Exporta as funções e o pool
