const imoveisPlantaId = document.getElementById('investimentos');
const imoveisTerceirosId = document.getElementById('imoveis-terceiros')
const paginaInvestimentosId = document.getElementById('pagina-investimentos')
const imoveisPlantaArray = [];
const imoveisTerceirosArray = [];

/*
Features:
    1. Sistema de login/senha
    2. Sistema de cadastro de imóveis (um a um / em lote)
        a. Interface para administrador
        b. Alimentar o site com informações
    3. Banco de dados com info dos imóveis
    4. Programa para apresentar imóveis dinamicamente (critérios?)
        a. Homepage e aba "investimentos"
*/

///Validação de usuário e senha (função admin)
/*
function validarLogin(inputLogin, inputSenha) {
    
    const inputLogin = document.getElementById("login").value;
    const inputSenha = document.getElementById("senha").value;

    ///não manter assim pois não é seguro, arrumar para que a senha seja validada no servidor
    const loginCorreto = "admin";
    const senhaCorreto = "admin123";

    if (inputLogin === "" || inputSenha === "") {

    } else if (loginCorreto === inputLogin && senhaCorreto === inputSenha) {

        ///libera acesso à interface de admin
    };
};
*/

//Retorna a variável imoveis em formato json
async function requisiçãoImoveis() {
    const response = await fetch('/allImoveis.json');
    console.log(response);

    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`)
    };

    const imoveis = await response.json();
    console.log(imoveis);//imoveis destaque em json

    if (!imoveis || imoveis.length === 0) {
        console.log('Nenhum imóvel em destaque para exibir.');

        if (imoveisPlantaId) {
            imoveisPlantaId.innerHTML = "<p>Nenhum imóvel em destaque encontrado.</p>";
        };
            
        return;
    };

    return imoveis;
}

async function filtragemDeImoveis (dados, categoria) {
    return dados.filter(imovel => imovel.categoria === categoria);
}

function imoveisDestaqueToHtml(imovel) {
    return `
        <div class="investimento">
            <div class="investimento-info">
                <span id="investimento-photo">
                    <img src="/src/assets/background/olympus.png" alt="foto do investimento">
                </span>
                <div class="investimento-info">
                    <div>
                        <div class="detail detail-1">
                            <img src="/src/assets/interativo/icons8-localização-24.png" alt="icone-mapa">
                            <p>${imovel.localizacao}</p>
                        </div>
                    </div>
                    <h3 class="investimento-titulo">${imovel.titulo}</h3>
                    <div class="investimento-descricao-container">
                        <p class="investimento-descricao">"${imovel.slogan}"</p>
                    </div>
                </div>
            </div>
        </div>
    `;
};

function imoveisTerceirosToHtml(imovel) {
    return `
        <div class="investimento">
            <div class="investimento-info">
                <span id="investimento-photo">
                    <img src="/src/assets/background/olympus.png" alt="foto do investimento">
                </span>
                <div class="investimento-info">
                    <div>
                        <div class="detail detail-1">
                            <img src="/src/assets/interativo/icons8-localização-24.png" alt="icone-mapa">
                            <p>${imovel.localizacao}</p>
                        </div>
                    </div>
                    <h3 class="investimento-titulo">${imovel.titulo}</h3>
                    <div id="investimento-descricoes">
                        <div class="investimento-descricao-container">
                            <img src="/src/assets/interativo/icons8-cama-24.png" alt="Icone de quartos">
                            <p class="investimento-descricao">4 quartos</p>
                        </div>
                        <div class="investimento-descricao-container">
                            <img src="/src/assets/interativo/icons8-ruler-24.png" alt="Icone de régua">
                            <p class="investimento-descricao">85m²</p>
                        </div>
                        <div class="investimento-descricao-container">
                            <img src="/src/assets/interativo/icons8-garagem-24.png" alt="Icone de garagem">
                            <p class="investimento-descricao">2 vagas</p>
                        </div>            
                    </div>    
                </div>
            </div>
        </div>
    `;
}

function allImoveisToHtml(imovel) {
   return `
        <div class="pagina-investimento">
            <div class="investimento-info">
                <span id="pagina-investimento-photo">
                    <img src="/src/assets/background/olympus.png" alt="foto do investimento">
                </span>
                <div class="investimento-info">
                    <div>
                        <div class="detail detail-1">
                            <img src="/src/assets/interativo/icons8-localização-24.png" alt="icone-mapa">
                            <p>${imovel.localizacao}</p>
                        </div>
                    </div>
                    <h3 class="investimento-titulo">${imovel.titulo}</h3>
                    <p class="investimento-descricao">${imovel.slogan}</p>
                </div>
            </div>
        </div>
        `
}

//Exibe os imóveis em destaque na planta na página inicial
async function pushImoveisDestaquePlanta() {
    try {
        // Exibe mensagem de carregamento
        imoveisPlantaId.innerHTML = "<p>Carregando imóveis...</p>";

        const imoveis = await requisiçãoImoveis();
 
        // Verifica se a requisição foi bem-sucedida
        if (!imoveis) {
            throw new Error("Erro na requisição de imóveis.");
        }
        
        const imoveisPlanta = await filtragemDeImoveis(imoveis, 'planta');
        console.log(imoveisPlanta);

        if (imoveisPlanta && imoveisPlanta.length > 0) {
            // Iterar sobre imoveisPlanta
            if (imoveisPlanta.length >= 4) {
                for (let i = 0; i < 4; i++) {
                    const iImoveis = imoveisPlanta[i];
                    imoveisPlantaArray.push(iImoveis);
                    console.log(imoveisPlantaArray);
                };
            } else {
                console.log("Não há imóveis necessários");
            };
        } else {
            console.log("Nenhum imóvel do tipo planta encontrado.");
            
        };

        const imoveisHtml = imoveisPlantaArray.map(imoveisDestaqueToHtml).join('');
        console.log(imoveisHtml); //concatenação dos imoveis destaque em html

        if (imoveisPlantaId) {
            imoveisPlantaId.innerHTML = imoveisHtml;
        } else {
            console.error('Elemento ID "investimentos" não encontrado.')
        };
    } catch (error) {
        console.error("Erro ao processar imóveis em destaque:", error);
        if (imoveisPlantaId) {
            imoveisPlantaId.innerHTML = "<p>Ocorreu um erro ao carregar os imóveis.</p>";
        };
    };
}

async function pushImoveisDestaqueTerceiros() {
    try {
        // Exibe mensagem de carregamento
        imoveisTerceirosId.innerHTML = "<p>Carregando imóveis...</p>";

        const imoveis = await requisiçãoImoveis();
  
        // Verifica se a requisição foi bem-sucedida
        if (!imoveis) {
            throw new Error("Erro na requisição de imóveis.");
        }
        
        const imoveisTerceiros = await filtragemDeImoveis(imoveis, 'terceiros');
        console.log(imoveisTerceiros);

        if (imoveisTerceiros && imoveisTerceiros.length > 0) {
            // Iterar sobre imoveisTerceiros
            if (imoveisTerceiros.length >= 4) {
                for (let i = 0; i < 4; i++) {
                    const iImoveisTerceiros = imoveisTerceiros[i];
                    imoveisTerceirosArray.push(iImoveisTerceiros);
                    console.log(imoveisTerceirosArray);
                };

                console.log(imoveisTerceirosArray);
            } else {
                console.log("Não há imóveis necessários");
            };
        } else {
            console.log("Nenhum imóvel do tipo planta encontrado.");
            
        };

        const imoveisHtml = imoveisTerceirosArray.map(imoveisTerceirosToHtml).join('');
        console.log(imoveisHtml); //concatenação dos imoveis destaque em html

        if (imoveisTerceirosId) {
            imoveisTerceirosId.innerHTML = imoveisHtml;
        } else {
            console.error('Elemento ID "investimentos" não encontrado.')
        };
    } catch (error) {
        console.error("Erro ao processar imóveis em destaque:", error);
        if (imoveisTerceirosId) {
            imoveisTerceirosId.innerHTML = "<p>Ocorreu um erro ao carregar os imóveis.</p>";
        };
    };
}

//Exibe todos os imóveis na página de investimentos
async function pushAllImoveis() {
    try { 
        // Exibe mensagem de carregamento
        paginaInvestimentosId.innerHTML = "<p>Carregando imóveis...</p>";

        const imoveis = await requisiçãoImoveis();
        console.log(imoveis);
 
        // Verifica se a requisição foi bem-sucedida
        if (!imoveis) {
            throw new Error("Erro na requisição de imóveis.");
        }
        
        if (!imoveis || imoveis.length === 0) {
            console.log("Nenhum imóvel encontrado.");

            if (paginaInvestimentosId) {
                paginaInvestimentosId.innerHTML = "<p>Nenhum imóvel encontrado.<p>";
            }

            return;

        }
            
        let imoveisHtml = imoveis.map(allImoveisToHtml).join('');
        console.log(imoveisHtml); //concatenação dos imoveis destaque em html
            
        if (paginaInvestimentosId) {
            paginaInvestimentosId.innerHTML = imoveisHtml;
        } else {
            console.error('Elemento ID "pagina-investimentos" não encontrado.')
        };

    } catch (error) {
        console.error('Erro ao carregar imóveis:', error);
        if (paginaInvestimentosId) {
            paginaInvestimentosId.innerHTML = "<p>Ocorreu um erro ao carregar os imóveis.</p>";
        };
    };
}

pushImoveisDestaquePlanta();
pushImoveisDestaqueTerceiros();
pushAllImoveis();
