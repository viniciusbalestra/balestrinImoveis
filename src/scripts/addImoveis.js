const form = document.getElementById('cadastro-imovel');
const inputFotos = form.querySelector('[name="fotos"]');
const selectFotoCapa = form.querySelector('[name="fotoCapa"]');
const preVisualizacao = document.getElementById('pre-visualizacao'); // Obtém o elemento de pré-visualização

// Função para exibir mensagens de erro/sucesso
function mostrarMensagem(mensagem, tipo = 'erro') {
    const mensagemElemento = document.createElement('div');
    mensagemElemento.textContent = mensagem;
    mensagemElemento.classList.add('mensagem'); // Classe para estilo geral
    mensagemElemento.classList.add(tipo); // Classe específica para tipo (erro ou sucesso)

    // Remove mensagens anteriores
    const mensagensAnteriores = document.querySelectorAll('.mensagem');
    mensagensAnteriores.forEach(m => m.remove());

    // Adiciona a mensagem ao formulário
    form.insertBefore(mensagemElemento, form.firstChild);
}

// Envia os dados do cadastro para o backend
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            mostrarMensagem('Imóvel cadastrado com sucesso!', 'sucesso');
            form.reset();
            preVisualizacao.innerHTML = ''; // Limpa a pré-visualização
            selectFotoCapa.innerHTML = '<option value="">Selecione a foto de capa</option>'; // Reseta o select
        } else {
            const error = await response.text();
            mostrarMensagem(`Erro ao cadastrar imóvel: ${error}`);
        }
    } catch (err) {
        console.error(err);
        mostrarMensagem('Erro ao cadastrar imóvel.');
    }
});

// Pré-visualização das fotos e seleção da capa
inputFotos.addEventListener('change', () => {
    const files = inputFotos.files;
    selectFotoCapa.innerHTML = '<option value="">Selecione a foto de capa</option>';
    preVisualizacao.innerHTML = ''; // Limpa a pré-visualização

    if (files.length > 5) {
        mostrarMensagem('Máximo de 5 fotos permitidas.', 'erro');
        inputFotos.value = ''; // Limpa o campo de arquivo
        return;
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        // Verifica se o arquivo é uma imagem
        if (!file.type.startsWith('image/')) {
            mostrarMensagem(`O arquivo "${file.name}" não é uma imagem.`, 'erro');
            continue; // Pula para o próximo arquivo
        }

        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = file.name;
            img.classList.add('imagem-preview'); // Adiciona uma classe para estilização

            preVisualizacao.appendChild(img); // Adiciona a imagem à pré-visualização

            const option = document.createElement('option');
            option.value = file.name;
            option.text = file.name;
            selectFotoCapa.appendChild(option);
        };

        reader.onerror = () => {
            mostrarMensagem(`Erro ao ler o arquivo "${file.name}".`, 'erro');
        };

        reader.readAsDataURL(file);
    }
});
