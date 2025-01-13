///Executa as consultas no banco de dados
const { connect, pool } = require('./connection');
const fs = require('fs/promises');

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
        const imoveisTerceiros = await getAllImoveis('terceiro');

        console.log("Imóveis na planta:", imoveisPlanta);
        console.log("Imóveis de terceiros:", imoveisTerceiros);

        imoveisPlanta.forEach(imovel => {
            console.log(`ID: ${imovel.id}, Categoria: ${imovel.categoria}, Titulo: ${imovel.titulo}, Slogan: ${imovel.slogan}, Localizacao: ${imovel.localizacao}`);
        });


        imoveisTerceiros.forEach(imovel => {
            console.log(`ID: ${imovel.id}, Categoria: ${imovel.categoria}, Titulo: ${imovel.titulo}, Localizacao: ${imovel.localizacao}, Valor: ${imovel.valor}, Tipo ${imovel.tipo}, Metragem: ${imovel.metragem}`);
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
                    metragem = VALUES(metragem);
                `;
            
            const values = [
                imovel.id, imovel.categoria, imovel.titulo, imovel.slogan, imovel.localizacao, imovel.valor, imovel.tipo, imovel.metragem
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

module.exports = { getAllImoveis, insertImoveis, queryDatabase};

main();
