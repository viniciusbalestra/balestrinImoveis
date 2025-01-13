const { getAllImoveis, insertImoveis, queryDatabase} = require('./queries'); // Importa as funções do seu queries.js
const { pool } = require('./connection');

describe('Testes das funções de queries', () => {
    let testData;

    beforeAll(async () => {
        // Insere dados de teste ANTES de todos os testes
        testData = [
            { id: 1111, categoria: 'planta', titulo: 'Imóvel de Teste 1', tipo: 'teste', localizacao: 'Local Teste', valor: 100000, slogan: "teste", metragem: 100 },
            { id: 2222, categoria: 'terceiro', titulo: 'Imóvel de Teste 2', tipo: 'teste', localizacao: 'Local Teste 2', valor: 200000, slogan: "", metragem: 200 },
            { id: 3333, categoria: 'planta', titulo: 'Imóvel de Teste 3', tipo: 'teste', localizacao: 'Local Teste 3', valor: 0, slogan: "teste 3", metragem: 300 }
        ];
        await insertImoveis(testData);
    });

    afterAll(async () => {
        // Limpa os dados de teste DEPOIS de todos os testes
        await pool.execute('DELETE FROM imoveis WHERE tipo = ?', ['Teste']);
    });

    it('Deve retornar imóveis da categoria "planta"', async () => {
        const imoveisPlanta = await getAllImoveis('planta');
        const imoveisConvertidos = imoveisPlanta.map(imovel => ({
            ...imovel,
            valor: Number(imovel.valor),
        }));

        
        expect(imoveisConvertidos).toEqual(expect.arrayContaining([
            expect.objectContaining(testData.find(item => item.categoria === 'planta'))
        ]));
        expect(imoveisConvertidos.length).toBe(2)
    });

    it('Deve retornar imóveis da categoria "terceiro"', async () => {
        const imoveisTerceiros = await getAllImoveis('terceiro');
        const imoveisConvertidos = imoveisTerceiros.map(imovel => ({
            ...imovel,
            valor: Number(imovel.valor),
        }));

        expect(imoveisConvertidos).toEqual(expect.arrayContaining([
            expect.objectContaining(testData.find(item => item.categoria === 'terceiro'))
        ]));
        expect(imoveisConvertidos.length).toBe(1)
    });

    it('Deve retornar todos os imóveis', async () => {
        const imoveis = await queryDatabase();
        const imoveisConvertidos = imoveis.map(imovel => ({
            ...imovel,
            valor: Number(imovel.valor),
        }));

        expect(imoveisConvertidos).toEqual(expect.arrayContaining(testData));
        expect(imoveisConvertidos.length).toBe(testData.length)
    })

    it('Deve lidar com tipo inexistente', async () => {
        const imoveis = await getAllImoveis('tipo_inexistente');
        expect(imoveis).toEqual([]); // Espera um array vazio
    });

    it('Não deve inserir nada caso o array esteja vazio', async () => {
        await insertImoveis([]);
        const imoveis = await queryDatabase();
        expect(imoveis.length).toBe(testData.length)
    })
});