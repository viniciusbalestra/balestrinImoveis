const investimentos = document.getElementById('investimentos');
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

function imoveisToHtml(imovel) {
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

///Alimenta a pagina com a array imoveisDestaqueArray
async function pushImoveisDestaque() {
    try {
        const response = await fetch('/allImoveis.json');
        console.log(response);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`)
        }

        const imoveisDestaque = await response.json();
        console.log(imoveisDestaque);//imoveis destaque em json (4 primeiros)

        if (!imoveisDestaque || imoveisDestaque.length === 0) {
            console.log('Nenhum imóvel em destaque para exibir.');

            if (investimentos) {
                investimentos.innerHTML = "<p>Nenhum imóvel em destaque encontrado.</p>";
            };
            
            return;
        };

        for (let i = 0; i < 4; i++) {
            const iImoveis = imoveisDestaque[i];

            imoveisDestaqueSelecionados.push(iImoveis);
        };

        const imoveisHtml = imoveisDestaqueSelecionados.map(imoveisToHtml).join('');
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


pushImoveisDestaque();