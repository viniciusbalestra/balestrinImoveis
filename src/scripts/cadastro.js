import { insertImoveis } from './queries.js'; // Importa a função insertImoveis do módulo queries.js

const formulario = document.getElementById('cadastro-imovel'); // Obtém o elemento do formulário pelo ID
const inputFotos = formulario.querySelector('[name="fotos"]'); // Obtém o campo de input de fotos
const selectFotoCapa = formulario.querySelector('[name="fotoCapa"]'); // Obtém o select de seleção da foto de capa

// Obtém os campos do formulário
const tipo = document.getElementById("tipo");
const titulo = document.getElementById("titulo");
const rua = document.getElementById("rua");
const numero = document.getElementById("numero");
const cidade = document.getElementById("cidade");
const estado = document.getElementById("estado");
const slogan = document.getElementById("slogan");
const valor = document.getElementById("valor");
const descricao = document.getElementById("descricao");
const metragem = document.getElementById("metragem");
const qtdQuartos = document.getElementById("qtdQuartos");
const vagas = document.getElementById("vagas");
const qtdBanheiros = document.getElementById("qtdBanheiros");
const url = document.getElementById("url");
const fotos = document.getElementById("fotos");
const fotoCapa = document.getElementById("fotoCapa");
let disponibilidade = false; // Inicializa a variável de disponibilidade

const iconeDisponibilidade = document.getElementById('icone-disponibilidade'); // Obtém o ícone de disponibilidade
const botaoDisponibilidade = document.getElementById("verificar-disponibilidade"); // Obtém o botão de verificar disponibilidade

// Adiciona um listener para o evento de clique do botão de disponibilidade
botaoDisponibilidade.addEventListener('click', () => {
    disponibilidade = !disponibilidade; // Alterna o valor da disponibilidade

    // Alterna a exibição do ícone de disponibilidade
    iconeDisponibilidade.style.display = disponibilidade ? 'inline' : 'none';
});

console.log(disponibilidade); // Exibe o valor inicial da disponibilidade no console (remova em produção)

// Adiciona um listener para o evento de change do campo de fotos
fotos.addEventListener('change', () => {
    fotoCapa.innerHTML = '<option value="">Selecione a foto de capa</option>'; // Limpa o select de foto de capa
    const files = fotos.files; // Obtém os arquivos selecionados
    const preview = document.getElementById('preview-fotos'); // Obtém o elemento de pré-visualização
    preview.innerHTML = ''; // Limpa a pré-visualização

    // Itera sobre os arquivos selecionados
    for (const file of files) {
        const reader = new FileReader(); // Cria um novo FileReader para cada arquivo

        reader.onload = (event) => {
            const img = document.createElement('img'); // Cria um elemento img
            img.src = event.target.result; // Define o src da imagem com os dados da imagem
            img.classList.add('miniatura-foto'); // Adiciona a classe 'miniatura-foto' para estilização
            preview.appendChild(img); // Adiciona a imagem à pré-visualização

            const option = document.createElement('option'); // Cria um elemento option para o select
            option.value = file.name; // Define o valor da opção com o nome do arquivo
            option.text = file.name; // Define o texto da opção com o nome do arquivo
            fotoCapa.appendChild(option); // Adiciona a opção ao select de foto de capa
        };
        reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
    }
});

/**
 * Envia os dados do formulário para o backend.
 * @param {Event} event O evento de submit do formulário.
 */
async function receberValores(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)

    const formData = new FormData(formulario); // Cria um objeto FormData com os dados do formulário
    //adicionado tratamento para o caso de não haver fotos
    if(fotos.files.length > 0){
      formData.append('fotos', fotos.files);
    }
    formData.append('disponibilidade', disponibilidade);

    try {
        // Envia os dados para o servidor usando fetch
        const response = await fetch('/upload', { //rota para o upload de arquivos
            method: 'POST', // Método HTTP POST
            body: formData, // Corpo da requisição com os dados do formulário
        });

        // Verifica se a requisição foi bem-sucedida
        if (response.ok) {
            console.log('Dados do imóvel enviados com sucesso!');
            formulario.reset(); // Limpa o formulário
            // Limpa a preview
            const preview = document.getElementById('preview-fotos');
            preview.innerHTML = '';
            //reseta o select
            fotoCapa.innerHTML = '<option value="">Selecione a foto de capa</option>';
        } else {
            // Se a requisição falhar, exibe o erro
            const error = await response.text();
            console.error('Erro ao enviar dados do imóvel:', error);
            alert(`Erro ao cadastrar imóvel: ${error}`); // Exibe um alerta com a mensagem de erro
        }
    } catch (error) {
        // Captura erros na requisição fetch
        console.error('Erro ao enviar dados do imóvel:', error);
        alert('Erro ao cadastrar imóvel.'); // Exibe um alerta de erro genérico
    }
}

// Adiciona um listener para o evento de submit do formulário
formulario.addEventListener('submit', receberValores);
