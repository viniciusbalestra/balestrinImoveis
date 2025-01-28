///Define as funções do servidor
const express = require('express'); // Importa o módulo Express
const app = express(); // Cria uma instância do aplicativo Express
const port = 3001; // Define a porta
const {connect} = require('./connection');
const fs = require('fs/promises');
const {pool} = require('./connection');
const {insertImoveis, queryDatabase} = require('./queries'); 
const bodyParser = require('body-parser');
const { getAllImoveisFromJSON } = require('./queries'); // Importa getAllImoveisFromJSON
const Imovel = require('./src/scripts/classeImovel');
const cors = require('cors');

app.use(bodyParser.json());

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5500' // Substitua pela porta do seu frontend
}));

///Cria uma array a partir da função getAllImoveis(que acessa o banco de dados) 
///que contém as propriedades de 4 imóveis para colocar na seção de investimentos em destaque;
async function getImoveisDestaque (categoria) {
    try {
        const allImoveis = await getAllImoveisFromJSON();
        const imoveisFiltrados = allImoveis.filter(imovel => imovel.categoria.toLowerCase() === categoria.toLowerCase());
        
        if (!imoveisFiltrados || imoveisFiltrados.length === 0) {
            console.log(`Nenhum imóvel do tipo ${categoria} encontrado.`);
            return [];
        };

        const imoveisDestaqueArray = [];

        imoveisFiltrados.forEach(imovelPlanta => {
            const imovel = new Imovel();
            Object.assign(imovel, imovelPlanta);
            imoveisDestaqueArray.push(imovel);
        });

        return imoveisDestaqueArray.slice(0, 4) ///retorna apenas 4 imóveis
   
    } catch (error) {
        console.error('Erro ao buscar imóveis em destaque: ', error)
        return [];
    };
};

app.get('/api/imoveis/:categoria', async (req, res) => {
    try {
        const allImoveis = await getAllImoveisFromJSON(); // Lê do JSON
        const categoria = req.params.categoria;
        const imoveisFiltrados = allImoveis.filter(imovel => imovel.categoria.toLowerCase() === categoria.toLowerCase());
        const imoveis = imoveisFiltrados.map(data => {
            const imovel = new Imovel();
            Object.assign(imovel, data);
            return imovel;
        });
        res.json(imoveis);
    } catch (error) {
        console.error("Erro na rota /api/imoveis:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

app.get('/api/imoveis/:categoria/destaques', async (req, res) => {
    try {
        const categoria = req.params.categoria;
        const destaques = await getImoveisDestaque(categoria);
        res.json(destaques);
    } catch (error) {
        console.error("Erro na rota /api/imoveis/destaques:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

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