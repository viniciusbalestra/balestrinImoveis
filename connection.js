///Realiza a conexão do banco de dados
//require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 3306,
    waitForConnections: true, // Se true, espera por conexões disponíveis se todas estiverem em uso. Se false, retorna um erro imediatamente.
    connectionLimit: 10, // Número máximo de conexões no pool.
    waitForConnections: true, // Se true, espera por conexões disponíveis se todas estiverem em uso. Se false, retorna um erro imediatamente.
    connectionLimit: 10, // Número máximo de conexões no pool.
    queueLimit: 0 // Número máximo de requisições em fila esperando por uma conexão. 0 significa sem limite.
};

console.log(dbConfig)

async function connect() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Conexão individual ao banco de dados estabelecida.");

        // Teste de conexão
        await connection.execute('SELECT 1'); // Executa uma query simples
        await connection.execute('SELECT 1'); // Executa uma query simples
        console.log("Teste de conexão bem-sucedido.");

        return connection;
        
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados (conexão individual):", error.message, error.code); // Mensagem de erro 
        console.error("Erro ao conectar ao banco de dados (conexão individual):", error.message, error.code); // Mensagem de erro 
        return null; // Retorna null em caso de erro
    };
}

async function testConnection() {
    const connection = await connect();
    if (connection) {
        console.log('Conexão obtida com sucesso. Testando...');
        try {
            const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
            console.log("Teste bem sucedido!", rows);
        } catch (error) {
            console.error("Erro durante o teste: ", error);
        } finally {
            connection.end(); // Fecha a conexão
            console.log('Conexão fechada.');
        }
    } else {
        console.log('Falha ao obter conexão.');
    };
}

testConnection();
const connection = await connect();

if (connection) {
    console.log('Conexão obtida com sucesso. Testando...');
    try {
        const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
        console.log("Teste bem sucedido!", rows);
    } catch (error) {
        console.error("Erro durante o teste: ", error);
    } finally {
        connection.end(); // Fecha a conexão
        console.log('Conexão fechada.');
    }
} else {
    console.log('Falha ao obter conexão.');
};


testConnection();

const pool = mysql.createPool(dbConfig);
console.log("Pool de conexões criado."); // Mensagem indicando a criação do pool

module.exports = { connect, pool };
