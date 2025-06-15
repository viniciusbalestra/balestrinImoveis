///Executa as consultas no banco de dados
//import { connect, pool } from './connection.js';
const { connect, pool } = require('./connection.js');
const fs = require('fs');

//Pega todos os imóveis do banco de dados, selecionando por categoria
async function getAllImoveis(categoria) {
    try {
        const [rows] = await pool.execute('SELECT * FROM imoveis WHERE categoria = ?', [categoria]);

        const imoveis = rows.map(row => {
            const imovel = new Imovel(
                row.id,
                row.categoria,
                row.titulo,
                row.slogan,
                row.localizacao,
                row.valor,
                row.tipo,
                row.metragem,
                row.fotos,
                row.vagas,
                row.descricao,
                row.tamanhoAreaConst,
                row.qtdQuartos,
                row.qtdBanheiros,
                row.fotoCapa,
                row.url,
                row.destaque,
                row.eDisponivel
            );
            
            console.log(imovel, "1");
            return imovel;
        });

        console.log(imoveis, "2");


        return imoveis;

    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        throw error;
    };
}

//Gera um arquivo JSON com todos os imóveis da base de dados.
async function queries() {
    try {
        const imoveisPlanta = await getAllImoveis('planta');
        const imoveisTerceiros = await getAllImoveis('terceiros');

        console.log("Imóveis na planta:", imoveisPlanta);
        console.log("Imóveis de terceiros:", imoveisTerceiros);

        imoveisPlanta.forEach(imovel => {
            console.log(`ID: ${imovel.id}, Categoria: ${imovel.categoria}, Titulo: ${imovel.titulo}, Slogan: ${imovel.slogan}, Localizacao: ${imovel.localizacao}, fotos: ${imovel.fotos}, fotoCapa: ${imovel.fotoCapa}, url: ${imovel.url}, destaque:${imovel.destaque}, eDisponivel: ${imovel.eDisponivel}`); 
        });


        imoveisTerceiros.forEach(imovel => {
            console.log(`ID: ${imovel.id}, Categoria: ${imovel.categoria}, Titulo: ${imovel.titulo}, Localizacao: ${imovel.localizacao}, Valor: ${imovel.valor}, Tipo ${imovel.tipo}, Metragem: ${imovel.metragem}, fotos: ${imovel.fotos}, qtdBanheiros: ${imovel.qtdBanheiros}, qtdQuartos: ${imovel.qtdQuartos}, vagas: ${imovel.vagas}, fotoCapa: ${imovel.fotoCapa}, url: ${imovel.url}, destaque:${imovel.destaque}, eDisponivel: ${imovel.eDisponivel}`);
        });

        const allImoveis = [...imoveisPlanta, ...imoveisTerceiros];


        ///Escreve o json
        try {
            
            await fs.writeFile('allImoveis.json', JSON.stringify(allImoveis, null, 2));

        } catch(err) {
            console.error('Erro ao escrever no arquivo:', err);
        };
    } catch(error) {
        console.error("Erro na função queries:", error)
    };
};

//Cria um diretório para cada imóvel com cujo nome é seu ID
async function criarPastaImovel(imovelId) {
    const pastaImovel = path.join(__dirname, '/src/assets/uploads', imovelId);
    try {
        await fs.promises.mkdir(pastaImovel, {recursive: true});
        console.log(`Pastapara o imóvel ${imovelId}criada ou já existente. `); 
    } catch (erro) {
        console.error(`Erro ao criar pasta para o imóvel ${imovelId}:`, erro);

    }
}

//Pega todos os imóveis do arquivo allImoveis.json
async function getAllImoveisFromJson() {
    try {
        const data = await fs.readFile(jsonFilePath, 'utf-8');
        const imoveis = JSON.parse(data);

        // Executa a função para criar a pasta para cada imóvel
        for (const imovel of imoveis) {
            await criarPastaImovel(imovel.id);
        }

        return imoveis;
        
    } catch (error) {
        console.error('Erro ao ler allImoveis.json: ', error);
        
        if (error.code === 'ENOENT') {
            console.log('Arquivo allImoveis.json não encontrado.Gerando um novo...');

            await queries();
            return getAllImoveisFromJson();
        };

        return [];
    }
}

///Insere imóveis ao banco de dados
async function insertImoveis(imoveis) {
    try {
        if (!imoveis || imoveis.length === 0) {
            console.log('Nenhum imóvel para inserir.');
            return;
        }
        for (const imovel of imoveis) {
            //Query com a função INSERT INTO do mysql
            const query = `
                INSERT INTO imoveis (categoria, titulo, slogan, localizacao, valor, tipo, metragem, fotos, vagas, descricao, tamanhoAreaConst, qtdQuartos,  qtdBanheiros,  fotoCapa, url, destaque, eDisponivel)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

                ON DUPLICATE KEY UPDATE
                    categoria = VALUES(categoria),
                    titulo = VALUES(titulo),
                    slogan = VALUES(slogan),
                    localizacao = VALUES(localizacao),
                    valor = VALUES(valor),
                    tipo = VALUES(tipo),
                    metragem = VALUES(metragem),
                    fotos = VALUES(fotos),
                    vagas = VALUES(vagas),
                    descricao = VALUES(descricao),                    
                    tamanhoAreaConst = VALUES(tamanhoAreaConst),
                    qtdQuartos = VALUES(qtdQuartos),
                    qtdBanheiros = VALUES(qtdBanheiros),
                    fotoCapa = VALUES(fotoCapa),
                    url = VALUES(url),
                    destaque = VALUES(destaque),
                    eDisponivel = VALUES(eDisponivel);
            `;

            const values = [
                imovel.categoria, imovel.titulo, imovel.slogan, imovel.localizacao, imovel.valor, imovel.tipo, imovel.metragem, imovel.fotos, imovel.vagas, imovel.descricao, imovel.tamanhoAreaConst, imovel.qtdQuartos,  imovel.qtdBanheiros,  imovel.fotoCapa, imovel.url, imovel.destaque, imovel.eDisponivel];
            try {
                await pool.execute(query, values);
                console.log('Imóvel inserido com sucesso: ', imovel.titulo)

            } catch (error) {
                console.error("Erro ao inserir imovel: ", imovel, error);
            };
        }

        console.log('Inserção de imóveis concluída');

    } catch (error) {
        console.error('Erro geral na inserção de imóveis: ', error);
        throw error;
    };
}


async function queryDatabase() {
    try {
        const [rows, fields] = await pool.execute('SELECT * FROM imoveis');
        console.log("Dados da tabela:", rows);
        return rows
    } catch (error) {
        console.error("Erro ao executar query:", error);
        return null
    }
}

queryDatabase();
queries();

module.exports = { getAllImoveis, insertImoveis, queryDatabase, getAllImoveisFromJson, queries };