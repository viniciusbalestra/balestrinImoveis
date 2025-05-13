///Define as funções do servidor

const express = require('express'); // Importa o módulo Express
const app = express(); // Cria uma instância do aplicativo Express
const port = 3001; // Define a porta
const {connect} = require('./connection');
const fs = require('fs/promises');
const {pool} = require('./connection');
const {insertImoveis, queryDatabase} = require('./queries'); 

app.use(express.json());

app.get('/imoveis', async (req, res) => {
    try {
        const imoveis = await queryDatabase();

        if(imoveis) {
            res.json(imoveis);
        } else {
            res.status(500).json({message: 'Não foi possível obter imóveis.'});
        }
    } catch (error) {
        console.error("Erro ao obter imóveis:", error);
        res.status(500).json({error:'Erro interno do servidor.'});
    }
});


app.post('/sincronizar-imoveis', async (req, res) => {
    try {
        const data = await fs.readFile('allImoveis.json', 'utf-8');
        const imoveis = JSON.parse(data);

        await insertImoveis(imoveis);

        res.status(200).json({mensagem: 'Imóveis sincronizados com sucesso.'})
    } catch(error) {
        console.error('Erro ao sincronizar imóveis:', error);
        res.status(500).json({mensagem: 'Erro ao sincronizar imóveis.'})
    };
});

app.listen(port, ()=> {
    console.log(`Servidor rodando na porta ${port}`);
});

process.on('SIGINT', () => {
    console.log('fechando pool de conexões')
    pool.end().then(() => {
        console.log('pool de conexões fechado')
        process.exit(0);
    });
});