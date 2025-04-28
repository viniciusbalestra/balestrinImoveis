/// Executa as consultas na base de dados
const { connect, pool } = require('./connection');
const fs = require('fs/promises');
const path = require('path');
const Imovel = require('./src/scripts/classeImovel');

const jsonFilePath = path.join(__dirname, 'allImoveis.json');

/**
 * Busca imóveis da base de dados, opcionalmente por categoria.
 * @param {string} [categoria] - A categoria dos imóveis a serem buscados. Se omitido, busca todos.
 * @returns {Promise<Imovel[]>} Um array de objetos Imovel.
 * @throws {Error} Se ocorrer um erro na consulta.
 */
async function buscarImoveis(categoria) {
    try {
        let query = 'SELECT * FROM imoveis';
        const params = [];

        if (categoria) {
            query += ' WHERE categoria = ?';
            params.push(categoria);
        }

        const [rows] = await pool.execute(query, params);

        const imoveis = rows.map(row => new Imovel(
            row.id,
            row.categoria,
            row.titulo,
            row.slogan,
            row.localizacao,
            row.valor,
            row.tipo,
            row.descricao,
            row.metragem,
            row.tamanhoAreaConst,
            row.qtdQuartos,
            row.vagas,
            row.qtdBanheiros,
            row.fotos,
            row.fotoCapa,
            row.url
        ));
        
        return imoveis;

    } catch (error) {
        console.error(`Erro ao buscar imóveis (categoria: ${categoria || 'todos'}):`, error);
        throw error;
    }
}

/**
 * Gera um arquivo JSON com todos os imóveis da base de dados.
 * @returns {Promise<void>}
 * @throws {Error} Se ocorrer um erro ao buscar os imóveis ou escrever o arquivo.
 */
async function gerarArquivoImoveis() {
    try {
        const imoveisPlanta = await buscarImoveis('planta');
        const imoveisTerceiros = await buscarImoveis('terceiros');
        const todosImoveis = [...imoveisPlanta, ...imoveisTerceiros];

        await fs.writeFile(jsonFilePath, JSON.stringify(todosImoveis, null, 2));
        console.log(`Arquivo ${jsonFilePath} gerado com sucesso.`);

    } catch (error) {
        console.error('Erro ao gerar arquivo de imóveis:', error);
        throw error; // Importante: Propagar o erro para quem chama a função
    }
}

/**
 * Cria o diretório para um imóvel, se necessário.
 * @param {string} imovelId - O ID do imóvel.
 * @returns {Promise<void>}
 * @throws {Error} Se ocorrer um erro ao criar o diretório.
 */
async function criarDiretorioImovel(imovelId) {
    const diretorioImovel = path.join(__dirname, '/src/assets/uploads', imovelId);
    try {
        await fs.promises.mkdir(diretorioImovel, { recursive: true });
        console.log(`Diretório para o imóvel ${imovelId} criado ou já existente.`);
    } catch (error) {
        console.error(`Erro ao criar diretório para o imóvel ${imovelId}:`, error);
        throw error; // Propaga o erro
    }
}

/**
 * Obtém todos os imóveis do arquivo JSON. Se o arquivo não existir, gera-o a partir do banco de dados.
 * @returns {Promise<Imovel[]>} Um array de objetos Imovel.
 * @throws {Error} Se ocorrer um erro ao ler ou gerar o arquivo JSON.
 */
async function obterImoveisDoArquivo() {
    try {
        const dados = await fs.readFile(jsonFilePath, 'utf-8');
        const imoveis = JSON.parse(dados);

        for (const imovel of imoveis) {
            await criarDiretorioImovel(imovel.id);
        }
        return imoveis;

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('Arquivo allImoveis.json não encontrado. Gerando um novo...');
            await gerarArquivoImoveis();
            // Tenta ler o arquivo novamente após a geração
            return obterImoveisDoArquivo();
        }
        console.error('Erro ao obter imóveis do arquivo:', error);
        throw error; // Propaga o erro para o chamador
    }
}

/**
 * Insere ou atualiza imóveis no banco de dados.
 * @param {Imovel[]} imoveis - Um array de objetos Imovel para inserir ou atualizar.
 * @returns {Promise<void>}
 * @throws {Error} Se ocorrer um erro durante a inserção ou atualização.
 */
async function inserirOuAtualizarImoveis(imoveis) {
    if (!imoveis || imoveis.length === 0) {
        console.log('Nenhum imóvel para inserir ou atualizar.');
        return;
    }

    try {
        for (const imovel of imoveis) {
            const query = `
                INSERT INTO imoveis (id, categoria, titulo, slogan, localizacao, valor, tipo, metragem, tamanhoAreaConst, 
                                    qtdQuartos, vagas, qtdBanheiros, fotos, fotoCapa, url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    categoria = VALUES(categoria), titulo = VALUES(titulo), slogan = VALUES(slogan), 
                    localizacao = VALUES(localizacao), valor = VALUES(valor), tipo = VALUES(tipo), 
                    metragem = VALUES(metragem), tamanhoAreaConst = VALUES(tamanhoAreaConst), 
                    qtdQuartos = VALUES(qtdQuartos), vagas = VALUES(vagas), 
                    qtdBanheiros = VALUES(qtdBanheiros), fotos = VALUES(fotos), 
                    fotoCapa = VALUES(fotoCapa), url = VALUES(url);
            `;
            const values = [
                imovel.id, imovel.categoria, imovel.titulo, imovel.slogan, imovel.localizacao, 
                imovel.valor, imovel.tipo, imovel.metragem, imovel.tamanhoAreaConst, 
                imovel.qtdQuartos, imovel.vagas, imovel.qtdBanheiros, imovel.fotos, 
                imovel.fotoCapa, imovel.url
            ];
            await pool.execute(query, values);
            console.log(`Imóvel ${imovel.titulo} inserido ou atualizado com sucesso.`);
        }
        console.log('Inserção ou atualização de imóveis concluída.');

    } catch (error) {
        console.error('Erro ao inserir ou atualizar imóveis:', error);
        throw error;
    }
}

/**
 * Executa uma consulta ao banco de dados para selecionar todos os imóveis.
 * @returns {Promise<any[]>} Um array com os resultados da consulta.
 * @throws {Error} Se ocorrer um erro ao executar a consulta.
 */
async function consultarBancoDeDados() {
    try {
        const [rows] = await pool.execute('SELECT * FROM imoveis');
        console.log("Dados da tabela:", rows);
        return rows;
    } catch (error) {
        console.error("Erro ao consultar banco de dados:", error);
        throw error;
    }
}

// Chamadas das funções (mantenha fora do escopo global)
(async () => {
    try {
        await consultarBancoDeDados();
        await gerarArquivoImoveis();
    } catch (error) {
        // Já tratamos o erro dentro das funções, mas você pode adicionar um tratamento extra aqui se necessário
        console.error("Erro no fluxo principal:", error);
    }
})();

// Exporta as funções para serem utilizadas em outros módulos
module.exports = { 
    buscarImoveis, 
    inserirOuAtualizarImoveis, 
    consultarBancoDeDados, 
    obterImoveisDoArquivo, 
    gerarArquivoImoveis
};
