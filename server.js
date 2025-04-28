// app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/imoveis.routes'); // Importa as rotas de imóveis
const errorHandler = require('./middleware/error.middleware'); // Importa o middleware de erro
const upload = require('./upload');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5500'
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(upload.array('fotos'));  // Middleware para lidar com o upload de arquivos
app.use('/api', routes); // Usa as rotas de imóveis no caminho '/api'
app.use(errorHandler); // Middleware para tratamento de erros

module.exports = app;

// server.js
const app = require('./app'); // Importa o aplicativo Express
const port = 3001;

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// Captura o sinal SIGINT para desligar o servidor de forma elegante
process.on('SIGINT', () => {
    console.log('Desligando o servidor...');
    // Aqui você pode adicionar lógica para fechar conexões com o banco de dados, etc.
    process.exit(0);
});


// routes/imoveis.routes.js
const express = require('express');
const router = express.Router();
const ImovelController = require('../controllers/imoveis.controller'); // Importa o controlador de imóveis
// Define as rotas para a API de imóveis
router.get('/imoveis/:categoria', ImovelController.getImoveisPorCategoria);
router.get('/imoveis/:categoria/destaques', ImovelController.getImoveisDestaque);
router.get('/imoveis', ImovelController.getAllImoveis);
router.post('/sincronizar-imoveis', ImovelController.sincronizarImoveis);
router.post('/upload', ImovelController.uploadFotos);

module.exports = router;

// controllers/imoveis.controller.js
const { buscarImoveis, inserirOuAtualizarImoveis, obterImoveisDoArquivo } = require('../queries');
const Imovel = require('../src/scripts/classeImovel');

const ImovelController = {
    // Obtém imóveis por categoria
    async getImoveisPorCategoria(req, res, next) {
        try {
            const categoria = req.params.categoria;
            const imoveis = await obterImoveisDoArquivo();  // Usa o arquivo JSON
            const imoveisFiltrados = imoveis.filter(imovel => imovel.categoria.toLowerCase() === categoria.toLowerCase());
             const imoveisResposta = imoveisFiltrados.map(data => { //mapeia para o tipo Imovel
                const imovel = new Imovel();
                Object.assign(imovel, data);
                return imovel;
            });
            res.json(imoveisResposta);
        } catch (error) {
            next(error); // Passa o erro para o middleware de tratamento de erros
        }
    },

    // Obtém imóveis em destaque por categoria
    async getImoveisDestaque(req, res, next) {
        try {
            const categoria = req.params.categoria;
            const imoveis = await obterImoveisDoArquivo(); // Usa o arquivo JSON
            const imoveisFiltrados = imoveis.filter(imovel => imovel.categoria.toLowerCase() === categoria.toLowerCase());
            const destaques = imoveisFiltrados.slice(0, 4);
            res.json(destaques);
        } catch (error) {
            next(error);
        }
    },

    // Obtém todos os imóveis
    async getAllImoveis(req, res, next) {
        try {
           const imoveis = await buscarImoveis(); // Busca do banco de dados
            res.json(imoveis);
        } catch (error) {
            next(error);
        }
    },

    // Sincroniza imóveis do JSON com o banco de dados
    async sincronizarImoveis(req, res, next) {
        try {
            const imoveis = await obterImoveisDoArquivo();
            await inserirOuAtualizarImoveis(imoveis);
            res.status(200).json({ mensagem: 'Imóveis sincronizados com sucesso.' });
        } catch (error) {
            next(error);
        }
    },

     async uploadFotos(req, res, next) {
        try {
            if (!req.files || req.files.length === 0) {
              return res.status(400).send('Nenhum arquivo de foto enviado.');
            }
            const { imovelId, fotoCapa } = req.body;
            const fotos = req.files.map(file => file.filename);
            // Validação de tipo e tamanho dos arquivos pode ser adicionada aqui
            const query = `
                UPDATE imoveis
                SET fotos = ?, fotoCapa = ?
                WHERE id = ?
            `;
            const values = [JSON.stringify(fotos), fotoCapa, imovelId];

           await pool.execute(query, values)
            res.send('Upload realizado com sucesso!');
        } catch (error) {
          next(error);
        }
    }
};

module.exports = ImovelController;


// middleware/error.middleware.js
const errorHandler = (err, req, res, next) => {
    console.error(err); // Registra o erro no console

    // Determina o código de status HTTP apropriado
    let statusCode = 500;
    if (err instanceof SyntaxError) {
        statusCode = 400; // Bad Request para erros de sintaxe (ex: JSON inválido)
    } else if (err.message === 'Arquivo não encontrado') {
        statusCode = 404;  //Not Found
    }

    // Retorna uma resposta de erro JSON padronizada
    res.status(statusCode).json({
        erro: {
            mensagem: err.message || 'Erro interno do servidor',
            codigo: statusCode,
        }
    });
};

module.exports = errorHandler;
