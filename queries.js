///Executa as consultas no banco de dados
const { connect, pool } = require('./connection');
const fs = require('fs/promises');
const path = require('path');

const jsonFilePath = path.join(__dirname, 'allImoveis.json');

///consulta os imoveis no banco de dados (separa por categoria)
async function getAllImoveis(categoria) {
    try {
        const [rows] = await pool.execute('SELECT * FROM imoveis WHERE categoria = ?', [categoria]);
        
        return rows;

    } catch(error) {
        console.error('Erro ao executar a consulta:',error);

        throw error;
    };
}

///Pega cada imóvel e separa por chave/valor e os coloca em um arquivo json nessas configurações
async function main() {
    try {
        const imoveisPlanta = await getAllImoveis('planta');
        const imoveisTerceiros = await getAllImoveis('terceiros');

        console.log("Imóveis na planta:", imoveisPlanta);
        console.log("Imóveis de terceiros:", imoveisTerceiros);

        imoveisPlanta.forEach(imovel => {
            console.log(`ID: ${imovel.id}, Categoria: ${imovel.categoria}, Titulo: ${imovel.titulo}, Slogan: ${imovel.slogan}, Localizacao: ${imovel.localizacao}, fotos: ${imovel.fotos}`);
        });


        imoveisTerceiros.forEach(imovel => {
            console.log(`ID: ${imovel.id}, Categoria: ${imovel.categoria}, Titulo: ${imovel.titulo}, Localizacao: ${imovel.localizacao}, Valor: ${imovel.valor}, Tipo ${imovel.tipo}, Metragem: ${imovel.metragem}, fotos: ${imovel.fotos}`);
        });

        const allImoveis = [...imoveisPlanta, ...imoveisTerceiros];

        ///Escreve o json
        try {
            
            await fs.writeFile('allImoveis.json', JSON.stringify(allImoveis, null, 2));

        } catch(err) {
            console.error('Erro ao escrever no arquivo:', err);
        };
    } catch(error) {
        console.error("Erro na função main:", error)
    };
};

async function getAllImoveisFromJson() {
    try {
        const data = await fs.readFile(jsonFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler allImoveis.json: ', error);
        
        if (error.code === 'ENOENT') {
            console.log('Arquivo allImoveis.json não encontrado.Gerando um novo...');

            await main();
            return getAllImoveisFromJson();
        };

        return [];
    }
}

///Insere imóveis ao banco de dados
async function insertImoveis(imoveis) {
    try {
        if(!imoveis || imoveis.lenght === 0) {
            console.log('Nenhum imóvel para inserir.');
            return;
        };

        for (const imovel of imoveis) {
            const query = `
                INSERT INTO imoveis (ID, categoria, titulo, slogan, localizacao, valor, tipo, metragem)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    categoria = VALUES(categoria),
                    titulo = VALUES(titulo),
                    slogan = VALUES(slogan),
                    localizacao = VALUES(localizacao),
                    valor = VALUES(valor),
                    tipo = VALUES(tipo),
                    metragem = VALUES(metragem),
                    fotos = VALUES(fotos);
                `;
            
            const values = [
                imovel.id, imovel.categoria, imovel.titulo, imovel.slogan, imovel.localizacao, imovel.valor, imovel.tipo, imovel.metragem, imovel.fotos
            ];

        try{
            await pool.execute(query, values);
            console.log('Imóvel inserido com sucesso: ',imovel.titulo)
        
        } catch (error) {
            console.error("Erro ao inserir imovel: ", imovel, error);
        };
    }
    console.log('Inserção de imóveis concluída');
    
    } catch(error) {
        console.error('Erro geral na inserção de imóveis: ',error);
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

module.exports = {getAllImoveis, insertImoveis, queryDatabase, getAllImoveisFromJson};

main();
