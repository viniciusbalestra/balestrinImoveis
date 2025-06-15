
///Executa as consultas no banco de dados
const { connect, pool } = require('./connection');
const fs = require('fs/promises');
const path = require('path');
const Imovel = require('./src/scripts/classeImovel');

const jsonFilePath = path.join(__dirname, 'allImoveis.json');

///consulta os imoveis no banco de dados (separa por categoria)
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
                row.url
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

///Pega cada imóvel e separa por chave/valor e os coloca em um arquivo json nessas configurações
async function queries() {
    try {
        const imoveisPlanta = await getAllImoveis('planta');
        const imoveisTerceiros = await getAllImoveis('terceiros');


        console.log("Imóveis na planta:", imoveisPlanta);
        console.log("Imóveis de terceiros:", imoveisTerceiros);

        imoveisPlanta.forEach(imovel => {
            console.log(`ID: ${imovel.id}, Categoria: ${imovel.categoria}, Titulo: ${imovel.titulo}, Slogan: ${imovel.slogan}, Localizacao: ${imovel.localizacao}, fotos: ${imovel.fotos}, fotoCapa: ${imovel.fotoCapa}, url: ${imovel.url}`);
        });


        imoveisTerceiros.forEach(imovel => {
            console.log(`ID: ${imovel.id}, Categoria: ${imovel.categoria}, Titulo: ${imovel.titulo}, Localizacao: ${imovel.localizacao}, Valor: ${imovel.valor}, Tipo ${imovel.tipo}, Metragem: ${imovel.metragem}, fotos: ${imovel.fotos}, qtdBanheiros: ${imovel.qtdBanheiros}, qtdQuartos: ${imovel.qtdQuartos}, vagas: ${imovel.vagas}, fotoCapa: ${imovel.fotoCapa}, url: ${imovel.url}`);
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

async function criarPastaImovel(imovelId) {
    const pastaImovel = path.join(__dirname, '/src/assets/uploads', imovelId);
    try {
        await fs.promises.mkdir(pastaImovel, {recursive: true});
        console.log(`Pastapara o imóvel ${imovelId}criada ou já existente. `); 
    } catch (erro) {
        console.error(`Erro ao criar pasta para o imóvel ${imovelId}:`, erro);

    }
}

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
            const query = `
                INSERT INTO imoveis (categoria, titulo, slogan, localizacao, valor, tipo, metragem, tamanhoAreaConst, qtdQuartos, vagas, qtdBanheiros, fotos, fotoCapa, url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

                ON DUPLICATE KEY UPDATE
                    categoria = VALUES(categoria),
                    titulo = VALUES(titulo),
                    slogan = VALUES(slogan),
                    localizacao = VALUES(localizacao),
                    valor = VALUES(valor),
                    tipo = VALUES(tipo),
                    metragem = VALUES(metragem),
                    tamanhoAreaConst = VALUES(tamanhoAreaConst),
                    qtdQuartos = VALUES(qtdQuartos),
                    vagas = VALUES(vagas),
                    qtdBanheiros = VALUES(qtdBanheiros),
                    fotos = VALUES(fotos),
                    fotoCapa = VALUES(fotoCapa),
                    url = VALUES(url);
            `;

            const values = [
                imovel.categoria, imovel.titulo, imovel.slogan, imovel.localizacao, imovel.valor, imovel.tipo, imovel.metragem, imovel.tamanhoAreaConst, imovel.qtdQuartos, imovel.vagas, imovel.qtdBanheiros, imovel.fotos, imovel.fotoCapa, imovel.url
            ];
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