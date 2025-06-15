const formulario = document.getElementById('cadastro-imovel'); // Obtém o elemento do 

// Obtém os campos do formulário
/*
const categoria = document.getElementById("fieldset-categoria-imovel").value;
console.log(categoria);
const titulo = document.getElementById("titulo").value;
const slogan = document.getElementById("slogan").value;
const rua = document.getElementById("rua").value;
const numero = document.getElementById("numero").value;
const cidade = document.getElementById("cidade").value;
const estado = document.getElementById("estado").value;
const valor = document.getElementById("valor").value;
const tipo = document.getElementById("tipo").value;
const metragem = document.getElementById("metragem").value;
const fotos = formulario.querySelector('[name="fotos"]');
const vagas = document.getElementById("vagas").value;
const descricao = document.getElementById("descricao").value;
const tamanhoAreaConst = '';
const qtdQuartos = document.getElementById("qtdQuartos").value;
const qtdBanheiros = document.getElementById("qtdBanheiros").value;
const fotoCapa = formulario.querySelector('[name="fotoCapa"]');
const url = document.getElementById("url").value;
let destaque = false;
let eDisponivel = false;
let imoveis = [];
const localizacao = rua + ", " + numero + "|" + cidade + "/" + estado;
*/

const iconeDisponibilidade = document.getElementById('icone-disponibilidade'); // Obtém o ícone de disponibilidade
const botaoDisponibilidade = document.getElementById("verificar-disponibilidade"); // Obtém o botão de verificar disponibilidade

/*
// Adiciona um listener para o evento de clique do botão de disponibilidade
botaoDisponibilidade.addEventListener('click', () => {
    eDisponivel = !eDisponivel;

    // Alterna a exibição do ícone de disponibilidade
    iconeDisponibilidade.style.display = eDisponivel ? 'inline' : 'none';
});
*/

//console.log(eDisponivel); // Exibe o valor inicial da disponibilidade no console (remova em produção)

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

async function receberValores() {
    const formData = new FormData(document.getElementById('cadastro-imovel'));
    let dadosDoImovel = {};

    formData.forEach((valor, chave) => {
        dadosDoImovel[chave] = valor;
    });

    console.log(dadosDoImovel);

    try {
        const resposta = await fetch('/api/cadastrar-imovel', {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosDoImovel),
        });

        if(!resposta.ok) {
            console.error('Erro ao enviar dados:', resposta.status);
            alert('Erro ao enviar os dados.');
        }

        const resultado = await resposta.json();
        console.log('Sucesso: ', resultado);
        alert('Dados enviados com sucesso!');

    } catch (erro) {
        console.error('Erro de rede:', erro);
        alert('Erro de rede ao tentar enviar os dados.');
    }
}

/*
async function receberValores(event) {
    try {
        const imoveis = [categoria, titulo, slogan, localizacao, valor, tipo, metragem, fotos, vagas, descricao, tamanhoAreaConst, qtdQuartos, qtdBanheiros, fotoCapa, url, destaque, eDisponivel];

        console.log(imoveis);
        return imoveis;

    } catch (error) {
        console.error('Erro ao cadastrar imóvel:', error);
        alert('Erro ao cadastrar imóvel.'); 
    }
}
*/

// Adiciona um listener para o evento de submit do formulário
formulario.addEventListener('submit', receberValores);
