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

///Alimenta a pagina com infos do banco de dados
function outputImoveis () {

    const investimentoPhoto = document.getElementById("investimento-photo");
    const investimentoPhotoImg = document.createElement("img");

    ///caminho para a foto
    investimentoPhoto.src = "";
    ///descricao da foto
    investimentoPhoto.alt = "capa do anuncio";

    investimentoPhoto.appendChild(investimentoPhotoImg);
};

///Alimenta a aba de imóveis em destaque na home
function imoveisDestaque () {
    
  
};

///Alimenta a página de investimentos
function imoveisInvestimentos () {

};

validarLogin(inputLogin, inputSenha);