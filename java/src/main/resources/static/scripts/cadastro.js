const formulario = document.getElementById('cadastro-imovel');
const BASE_URL_BACKEND = 'http://localhost:8080'

//Função que recebe os valores do formulário
async function coletarDadosDoFormulario() {

    const formData = new FormData(formulario);
    let dadosDoImovel = {};

    // Atributos de String diretos:
    dadosDoImovel.titulo = formData.get('titulo');
    dadosDoImovel.slogan = formData.get('slogan') || null;
    dadosDoImovel.descricao = formData.get('descricao') || null;
    dadosDoImovel.url = formData.get('url') || null;

    // Atributos numéricos:
    dadosDoImovel.valor = parseFloat(formData.get('valor')) || null;
    dadosDoImovel.metragem = parseInt(formData.get('metragem')) || null;
    dadosDoImovel.vagas = parseInt(formData.get('vagas')) || null;
    dadosDoImovel.quartos = parseInt(formData.get('quartos')) || null;
    dadosDoImovel.banheiros = parseInt(formData.get('banheiros')) || null;

    // Atributos de Enum:
    dadosDoImovel.categoria = formData.get('categoriaImovel') ? formData.get('categoriaImovel').toUpperCase() : null;
    dadosDoImovel.tipo = formData.get('tipo') ? formData.get('tipo').toUpperCase() : null;

    // Objeto Endereco:
    dadosDoImovel.endereco = {
        logradouro: formData.get('logradouro') || null,
        numero: formData.get('numero') || null,
        cidade: formData.get('cidade') || null,
        uf: formData.get('uf') || null,
        bairro: formData.get('bairro') || null,
    };

    // Atributos Booleanos: 
    dadosDoImovel.destaque = formData.get('destaque') === 'on';
    dadosDoImovel.disponivel = formData.get('disponivel') === 'on';

    // Atributos para fotos:
    dadosDoImovel.fotos = null;
    dadosDoImovel.capa = null;

    return dadosDoImovel;
}

//Função genérica que chama o método post
async function chamarMetodoHTML(pagina, metodo, dados) {
    let options = {
        method: metodo,
    };

    if (dados instanceof FormData) {
        options.body = dados;
    } else {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(dados);
    }

    try {
        const resposta = await fetch(`${BASE_URL_BACKEND}/api/${pagina}`, options);

        if (!resposta.ok) {
            console.error('Erro ao enviar dados:', resposta.status);
            alert('Erro ao enviar os dados.');
        }

        let resultado = null;
        try {
            resultado = await resposta.json();
        } catch (jsonError) {
            // Se a resposta não for JSON (ex: 204 No Content), resultado será null
            console.warn(`Resposta de /api/${pagina} não é JSON. Status: ${resposta.status}`);
        }

        console.log('Sucesso: ', resultado);
        alert('Dados enviados com sucesso!');

        return resultado;

    } catch (erro) {
        console.error('Erro de rede:', erro);
        alert('Erro de rede ao tentar enviar os dados.');
    }
}

// Função para fazer o upload das fotos para o S3 via backend
async function uploadFotosParaS3(imovelId, files) {
    // Não há fotos para subir
    if (files.length === 0) {
        return [];
    }

    const fotosFormData = new FormData();
    for (let i = 0; i < files.length; i++) {
        fotosFormData.append('fotos', files[i]);
    }

    try {
        const uploadResponse = await chamarMetodoHTML(`${BASE_URL_BACKEND}/api/fotos/upload/${imovelId}`, 'POST', fotosFormData);

        if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(`Erro ${uploadResponse.status} ao fazer upload das fotos: ${errorData.message || 'Verifique o console.'}`);
        }

        const chavesS3 = await uploadResponse.json();
        console.log('Chaves S3 das fotos salvas:', chavesS3);

        return chavesS3; // Retorna o array de chaves S3

    } catch (error) {
        console.error('Erro na função uploadFotosParaS3:', error);
        alert(`Falha no upload das fotos: ${error.message}. O imóvel foi cadastrado, mas as fotos podem não ter sido enviadas.`);
        return []; // Retorna array vazio para que o processo possa continuar
    }
}

// Função auxiliar para popular o select da capa dinamicamente
function popularSelectCapa(chavesS3) {

    const fotoCapaSelect = document.getElementById('fotoCapa');
    fotoCapaSelect.innerHTML = '<option value="">Selecione a foto de capa</option>';

    chavesS3.forEach(chaveS3 => {
        const option = document.createElement('option');
        option.value = chaveS3;
        const fileName = chaveS3.substring(chaveS3.lastIndexOf('/') + 1);
        option.textContent = fileName;
        fotoCapaSelect.appendChild(option);
    });
}

// Função para resetar o formulário e o select da capa
function resetarFormulario() {
    const formulario = document.getElementById('cadastro-imovel');
    formulario.reset();
    document.getElementById('fotoCapa').innerHTML = '<option value="">Selecione a foto de capa</option>';
}

// Recebe os dados do imóvel, envia para o backend, recebe de volta com o id
// e atualiza dessa vez com as fotos
async function receberValores(event) {
    if(event) {
        event.preventDefault();
    }
    
    let imovelCadastrado = null;
    let chavesS3DasFotos = [];

    const dadosDoImovel = coletarDadosDoFormulario();
    console.log('Dados do imóvel para o cadastro inicial:', dadosDoImovel);

    try {

        imovelCadastrado = await chamarMetodoHTML('cadastro', 'POST', dadosDoImovel);
    } catch (error) {
        return; 
    }

    const imovelId = imovelCadastrado.id;
    const inputFotos = document.getElementById('fotos');
    const files = inputFotos.files;

    if (files.length > 0) {
        chavesS3DasFotos = await uploadFotosParaS3(imovelId, files);
        popularSelectCapa(chavesS3DasFotos);
    }

    const inputFotoCapaSelect = document.getElementById('fotoCapa');
    let chaveS3Capa = inputFotoCapaSelect.value || null;

    // Se nenhuma capa foi explicitamente selecionada, mas há fotos, use a primeira
    if (!chaveS3Capa && chavesS3DasFotos.length > 0) {
        chaveS3Capa = chavesS3DasFotos[0];
    }

    const dadosParaAtualizarFotos = {
        fotos: JSON.stringify(chavesS3DasFotos),
        capa: chaveS3Capa
    };

    try {
        await chamarMetodoHTML(`imoveis/${imovelId}/fotos`, 'PATCH', dadosParaAtualizarFotos);

        alert('Imóvel cadastrado e fotos salvas com sucesso!');
        resetarFormulario();

    } catch (error) {
        console.error('Falha crítica no processo de cadastro do imóvel:', error);
        alert('Ocorreu um erro ao finalizar o cadastro. O imóvel pode ter sido salvo, mas as fotos ou a capa podem não estar vinculadas.');
    }
}

// Adiciona um listener para o evento de submit do formulário
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('cadastro-imovel');
    if (formulario) {
        formulario.addEventListener('submit', receberValores);
    }
});
