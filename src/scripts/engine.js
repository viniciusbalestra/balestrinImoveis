const investimentos = document.getElementById('investimentos');
const paginaInvestimentos = document.getElementById('pagina-investimentos')
const imoveisDestaqueSelecionados = [];

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

        if (investimentos) {
            investimentos.innerHTML = "<p>Nenhum imóvel em destaque encontrado.</p>";
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
                            <img src="/src/assets/interativo/icons8-mapa-24.png" alt="icone-mapa">
                            <p>${imovel.localizacao}</p>
                        </div>
                    </div>
                    <h3 class="investimento-titulo">${imovel.titulo}</h3>
                    <p class="investimento-descricao">${imovel.slogan}</p>
                </div>
            </div>
        </div>
    `;
};

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
                            <img src="/src/assets/interativo/icons8-mapa-24.png" alt="icone-mapa">
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

///Alimenta a pagina com a array imoveisDestaqueArray
async function pushImoveisDestaque() {
    try {
        const imoveis = await requisiçãoImoveis();
        
        const imoveisDestaquePlanta = await filtragemDeImoveis(imoveis, 'planta');
        console.log(imoveisDestaquePlanta);

        if (imoveisDestaquePlanta && imoveisDestaquePlanta.length > 0) {
            // Iterar sobre imoveisDestaquePlanta
            if (imoveisDestaquePlanta.length >= 4) {
                for (let i = 0; i < 4; i++) {
                    const iImoveis = imoveisDestaquePlanta[i];
                    imoveisDestaqueSelecionados.push(iImoveis);
                    console.log(imoveisDestaqueSelecionados);
                };
            } else {
                console.log("Não há imóveis necessários");
            };
        } else {
            console.log("Nenhum imóvel do tipo planta encontrado.");
            
        };

        const imoveisHtml = imoveisDestaqueSelecionados.map(imoveisDestaqueToHtml).join('');
        console.log(imoveisHtml); //concatenação dos imoveis destaque em html

        if (investimentos) {
            investimentos.innerHTML = imoveisHtml;
        } else {
            console.error('Elemento ID "investimentos" não encontrado.')
        };
    } catch (error) {
        console.error("Erro ao processar imóveis em destaque:", error);
        if (investimentos) {
            investimentos.innerHTML = "<p>Ocorreu um erro ao carregar os imóveis.</p>";
        };
    };
}

async function pushAllImoveis() {
    try {
        const imoveis = await requisiçãoImoveis();
        console.log(imoveis);

        if (!imoveis || imoveis.length === 0) {
            console.log("Nenhum imóvel encontrado.");

            if (paginaInvestimentos) {
                paginaInvestimentos.innerHTML = "<p>Nenhum imóvel encontrado.<p>";
            }

            return;

        }
            
        let imoveisHtml = imoveis.map(allImoveisToHtml).join('');
        console.log(imoveisHtml); //concatenação dos imoveis destaque em html
            
        if (paginaInvestimentos) {
            paginaInvestimentos.innerHTML = imoveisHtml;
        } else {
            console.error('Elemento ID "investimentos" não encontrado.')
        };

    } catch (error) {
        console.error('Erro ao carregar imóveis:', error);
        if (paginaInvestimentos) {
            paginaInvestimentos.innerHTML = "<p>Ocorreu um erro ao carregar os imóveis.</p>";
        };
    };
}

pushAllImoveis();
pushImoveisDestaque();