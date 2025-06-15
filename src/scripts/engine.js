// Seleciona elementos HTML importantes do DOM (Document Object Model) pelos seus IDs.
const imoveisPlantaId = document.getElementById('investimentos'); // Container para imóveis na planta (página inicial)
const imoveisTerceirosId = document.getElementById('imoveis-terceiros'); // Container para imóveis de terceiros (página inicial)
const paginaInvestimentosId = document.getElementById('pagina-investimentos'); // Container para todos os imóveis (página de investimentos)

// Função assíncrona para buscar os dados dos imóveis de um arquivo JSON.
async function requisitarImoveis() {
    try {
        const response = await fetch('/allImoveis.json'); // Faz uma requisição GET para o arquivo JSON
        console.log(response); // Exibe a resposta da requisição no console (útil para debugging)

        // Verifica se a resposta da requisição não foi bem-sucedida (status HTTP diferente de 2xx).
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`); // Lança um erro com o status e o texto da resposta
        };

        const imoveis = await response.json(); // Converte o corpo da resposta para um objeto JavaScript (array de imóveis)
        console.log(imoveis); // Exibe os dados dos imóveis no console
        return imoveis;
    } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
        throw error; // Propaga o erro para ser tratado na função que chama
    }
}

// Função para filtrar um array de imóveis por sua categoria.
function filtrarImoveis(dados, categoria) {
    return dados.filter(imovel => imovel.categoria === categoria); // Retorna um novo array contendo apenas os imóveis da categoria especificada
}

// Função para gerar o HTML de um imóvel
function gerarHtmlImovel(imovel) {
    const divClass = window.location.pathname === '/pages/investimentos.html' ? 'pagina-investimento' : 'investimento';
    const fotoCapaUrl = `/src/assets/uploads/${imovel.id}/${imovel.fotoCapa}`;
    let detalhesExtras = '';

    if (imovel.categoria === 'terceiros') {
        const pluralQuartos = imovel.qtdQuartos <= 1 ? "" : "s";
        const pluralVagas = imovel.vagas <= 1 ? "" : "s";
        detalhesExtras = `
            <div id="investimento-descricoes">
                <div class="${divClass}-descricao-container">
                    <img src="/src/assets/interativo/icons8-cama-24.png" alt="Icone de quartos">
                    <p class="${divClass}-descricao">${imovel.qtdQuartos} quarto${pluralQuartos}</p>
                </div>
                <div class="${divClass}-descricao-container">
                    <img src="/src/assets/interativo/icons8-ruler-24.png" alt="Icone de régua">
                    <p class="${divClass}-descricao">${imovel.metragem}m²</p>
                </div>
                <div class="${divClass}-descricao-container">
                    <img src="/src/assets/interativo/icons8-garagem-24.png" alt="Icone de garagem">
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
                            <img src="/src/assets/interativo/icons8-localização-24.png" alt="icone-mapa">
                            <p>R. ${imovel.localizacao}</p>
                        </div>
                    </div>
                    <h3 class="${divClass}-titulo">${imovel.titulo}</h3>
                    ${detalhesExtras}
                </div>
            </a>
        </div>
    `;
}

async function exibirImoveisDestaque(categoria, elementoId) {
    const container = document.getElementById(elementoId);
    if (container) {
        container.innerHTML = "<p>Carregando imóveis...</p>";
        try {
            const imoveis = await requisitarImoveis();
            const imoveisFiltrados = filtrarImoveis(imoveis, categoria);

            if (imoveisFiltrados.length > 0) {
                // Função para embaralhar o array 
                function shuffleArray(array) {
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                    }
                    return array;
                }
                
                //Chama a função shuffleArray e retira 4 itens dela
                const imoveisAleatorios = shuffleArray(imoveisFiltrados).slice(0, 4);

                if (imoveisAleatorios.length > 0) {
                    const imoveisHtml = imoveisAleatorios.map(gerarHtmlImovel).join('');
                    container.innerHTML = imoveisHtml;
                } else {
                    container.innerHTML = `<p>Nenhum imóvel do tipo "${categoria}" encontrado.</p>`;
                    console.log(`Nenhum imóvel do tipo "${categoria}" encontrado.`);
                }
            } else {
                container.innerHTML = `<p>Nenhum imóvel do tipo "${categoria}" encontrado.</p>`;
                console.log(`Nenhum imóvel do tipo "${categoria}" encontrado.`);
            }
        } catch (error) {
            console.error(`Erro ao processar imóveis em destaque (${categoria}):`, error);
            container.innerHTML = "<p>Ocorreu um erro ao carregar os imóveis.</p>";
        }
    } else {
        console.error(`Elemento ID "${elementoId}" não encontrado.`);
    }
}

// Função assíncrona para buscar e exibir todos os imóveis na página de investimentos.
async function exibirTodosImoveis() {
    if (paginaInvestimentosId) {
        paginaInvestimentosId.innerHTML = "<p>Carregando imóveis...</p>";
        try {
            const imoveis = await requisitarImoveis();
            if (imoveis && imoveis.length > 0) {
                const imoveisHtml = imoveis.map(gerarHtmlImovel).join('');
                paginaInvestimentosId.innerHTML = imoveisHtml;
            } else {
                paginaInvestimentosId.innerHTML = "<p>Nenhum imóvel encontrado.</p>";
                console.log("Nenhum imóvel encontrado.");
            }
        } catch (error) {
            console.error('Erro ao carregar todos os imóveis:', error);
            paginaInvestimentosId.innerHTML = "<p>Ocorreu um erro ao carregar os imóveis.</p>";
        }
    } else {
        console.error('Elemento ID "pagina-investimentos" não encontrado.');
    }
}

// Função principal que chama as outras funções para exibir os imóveis.
function main() {
    exibirImoveisDestaque('planta', 'investimentos');
    exibirImoveisDestaque('terceiros', 'imoveis-terceiros');
    exibirTodosImoveis();
};

// Chama a função principal quando o script é executado.
main();