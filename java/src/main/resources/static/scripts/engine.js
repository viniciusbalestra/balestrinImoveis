const paginaInvestimentosId = document.getElementById('pagina-investimentos'); // Container para todos os imóveis (página de investimentos)

// Função assíncrona para buscar os dados dos imóveis do banco de dados.
async function requisitarImoveis(pagina) {
    try {
        const response = await fetch(`http://localhost:8080/api/${pagina}`);
        console.log(response);


        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        };

        const imoveis = await response.json();
        console.log(imoveis);
        return imoveis.content;

    } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
        throw error;
    }
}

// Função para filtrar um array de imóveis por sua categoria.
function filtrarImoveis(dados, categoria) {
    return dados.filter(imovel => imovel.categoria === categoria);
}

// Função para gerar o HTML de um imóvel
function gerarHtmlImovel(imovel) {
    const divClass = window.location.pathname === '/java/src/main/resources/static/pages/investimentos.html' ? 'pagina-investimento' : 'investimento';
    const fotoCapaUrl = `/java/src/main/resources/static/assets/uploads/${imovel.id}/${imovel.capa}`;
    console.log(imovel.id + " " + imovel.capa);
    let detalhesExtras = '';

    if (imovel.categoria === 'TERCEIROS') {
        const pluralQuartos = imovel.quartos <= 1 ? "" : "s";
        const pluralVagas = imovel.vagas <= 1 ? "" : "s";
        detalhesExtras = `
            <div id="investimento-descricoes">
                <div class="${divClass}-descricao-container">
                    <img src="/java/src/main/resources/static/assets/interativo/icons8-cama-24.png" alt="Icone de quartos">
                    <p class="${divClass}-descricao">${imovel.quartos} quarto${pluralQuartos}</p>
                </div>
                <div class="${divClass}-descricao-container">
                    <img src="/java/src/main/resources/static/assets/interativo/icons8-ruler-24.png" alt="Icone de régua">
                    <p class="${divClass}-descricao">${imovel.metragem}m²</p>
                </div>
                <div class="${divClass}-descricao-container">
                    <img src="/java/src/main/resources/static/assets/interativo/icons8-garagem-24.png" alt="Icone de garagem">
                    <p class="${divClass}-descricao">${imovel.vagas} vaga${pluralVagas}</p>
                </div>
            </div>
        `;
    } else {
        detalhesExtras = `
            <div class="${divClass}-descricao-container">
                <p class="${divClass}-descricao">"${imovel.slogan}"</p>
            </div>
        `;
    }

    return `
        <div class="${divClass}">
            <a href="${imovel.url}">
                <span id="${divClass}-photo">
                    <img src="${fotoCapaUrl}" alt="foto do investimento">
                </span>
                <div class="${divClass}-info">
                    <div>
                        <div class="detail detail-1">
                            <img src="/java/src/main/resources/static/assets/interativo/icons8-localização-24.png" alt="icone-mapa">
                            <p>${imovel.endereco.logradouro}</p>
                        </div>
                    </div>
                    <h3 class="${divClass}-titulo">${imovel.titulo}</h3>
                    ${detalhesExtras}
                </div>
            </a>
        </div>
    `;
}

//Função para pegar exibir imóveis da seção destaque na home
async function exibirImoveisDestaque(categoria, elementoId) {

    const container = document.getElementById(elementoId);

    if (!container) {
        console.error(`Elemento ID "${elementoId}" não encontrado.`);
    }

    container.innerHTML = "<p>Carregando imóveis...</p>";

    try {
        const imoveis = await requisitarImoveis('home');
        console.log(imoveis);
        const imoveisFiltrados = filtrarImoveis(imoveis, categoria);
        console.log(imoveisFiltrados);

        if (imoveisFiltrados.length == 0) {
            container.innerHTML = `<p>Nenhum imóvel do tipo "${categoria}" encontrado.</p>`;
            console.log(`Nenhum imóvel do tipo "${categoria}" encontrado.`);
        }

        const imoveisHtml = imoveisFiltrados.map(gerarHtmlImovel).join('');
        container.innerHTML = imoveisHtml;


    } catch (error) {
        console.error(`Erro ao processar imóveis em destaque (${categoria}):`, error);
        container.innerHTML = "<p>Ocorreu um erro ao carregar os imóveis.</p>";
    }

}

// Função assíncrona para buscar e exibir os imóveis.
async function exibirImoveis(pagina) {

    console.log(paginaInvestimentosId)
    if (!paginaInvestimentosId) {
        console.error('Elemento ID "pagina-investimentos" não encontrado.');
    }

    paginaInvestimentosId.innerHTML = "<p>Carregando imóveis...</p>";

    try {
        const imoveis = await requisitarImoveis(pagina);

        if (!imoveis && imoveis.length == 0) {
            paginaInvestimentosId.innerHTML = "<p>Nenhum imóvel encontrado.</p>";
            console.log("Nenhum imóvel encontrado.");
        }

        const imoveisHtml = imoveis.map(gerarHtmlImovel).join('');
        paginaInvestimentosId.innerHTML = imoveisHtml;

    } catch (error) {
        console.error('Erro ao carregar todos os imóveis:', error);
        paginaInvestimentosId.innerHTML = "<p>Ocorreu um erro ao carregar os imóveis.</p>";
    }
}

function main() {
    exibirImoveisDestaque('PLANTA', 'investimentos');
    exibirImoveisDestaque('TERCEIROS', 'imoveis-terceiros');
    exibirImoveis('investimentos');
};


main();